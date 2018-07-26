// @ts-check
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const project = require('./project.config');
const debug = require('debug')('app:config:webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OfflinePlugin = require('offline-plugin');

const __DEV__ = project.globals.__DEV__;
const __PROD__ = project.globals.__PROD__;
const __TEST__ = project.globals.__TEST__;

debug('Creating configuration.');
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [project.paths.client(), path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {},
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.js');

webpackConfig.entry = {
  app: __DEV__
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor: project.compiler_vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: 'js/[name]-[hash].js',
  path: project.paths.dist(),
  publicPath: project.compiler_public_path,
  chunkFilename: 'js/[name]/[hash].js',
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new ExtractTextPlugin('[name].css'),
  new HtmlWebpackPlugin({
    template: project.paths.client('index.html'),
    hash: false,
    favicon: project.paths.public('favicon.svg'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true,
    },
  }),
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        );
      }
    });
  });
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    })
  );
}

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.devServer = {
    contentBase: project.paths.dist(),
    historyApiFallback: true,
    port: project.server_port,
    hot: true,
    stats: {
      warnings: false,
    },
  };
} else if (__PROD__ || __TEST__) {
  debug('Enabling plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.devtool = 'none';
  webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
  webpackConfig.optimization.minimize = false;
  webpackConfig.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  webpackConfig.plugins.push(new webpack.HashedModuleIdsPlugin({
    hashFunction: 'sha256',
    hashDigest: 'hex',
    hashDigestLength: 7,
  }));
  webpackConfig.plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/));
  webpackConfig.plugins.push(new OfflinePlugin({
    externals: ['https://fonts.gstatic.com/s/materialicons/v22/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2'],
    autoUpdate: true,
    cacheMaps: [
      {
        match: /\/(login|create|budget(s)?(\/*)?)/gi,
        to: '/',
        requestTypes: ['navigate'],
      },
    ],
  }));
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'eslint-loader',
      options: {
        fix: true,
      },
    },
    {
      loader: 'babel-loader',
    },
  ],
}, {
  test: /\.json$/,
  use: [{
    loader: 'json-loader',
  }],
}];

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css-loader?sourceMap&-minimize';

webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: BASE_CSS_LOADER,
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader?sourceMap',
        options: {
          includePaths: [project.paths.client('styles')],
        },
      },
    ],
  }),
});
webpackConfig.module.rules.push({
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: BASE_CSS_LOADER,
      },
      {
        loader: 'postcss-loader',
      },
    ],
  }),
});

// File loaders
/* eslint-disable */
  webpackConfig.module.rules.push({ test: /\.woff(\?.*)?$/,  use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'}] });
  webpackConfig.module.rules.push({ test: /\.woff2(\?.*)?$/, use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'}] });
  webpackConfig.module.rules.push({ test: /\.otf(\?.*)?$/,   use: [{ loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'}] });
  webpackConfig.module.rules.push({ test: /\.ttf(\?.*)?$/,   use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'}] });
  webpackConfig.module.rules.push({ test: /\.eot(\?.*)?$/,   use: [{ loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'}] });
  webpackConfig.module.rules.push({ test: /\.svg(\?.*)?$/,   use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'}] });
  webpackConfig.module.rules.push({ test: /\.(png|jpg)$/,    use: [{ loader: 'url-loader?limit=8192'}] });
/* eslint-enable */

module.exports = webpackConfig;

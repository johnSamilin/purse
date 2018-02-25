const argv = require('yargs').argv;
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
    hash: true,
    favicon: project.paths.public('favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true,
    },
  }),
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
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
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
} else if (__PROD__ || __TEST__) {
  debug('Enabling plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
      mangle: {
        except: ['RxSchema', 'RxDatabase', 'autoMigrate'],
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'commons',
      minChunks(module, count) {
        return count >= 2;
      },
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 7,
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/),
    new OfflinePlugin({
      externals: ['https://fonts.gstatic.com/s/materialicons/v22/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2'],
    }),
  );
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
          includePaths: project.paths.client('styles'),
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
webpackConfig.module.rules.push(
  { test: /\.woff(\?.*)?$/,  use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'}] },
  { test: /\.woff2(\?.*)?$/, use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'}] },
  { test: /\.otf(\?.*)?$/,   use: [{ loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'}] },
  { test: /\.ttf(\?.*)?$/,   use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'}] },
  { test: /\.eot(\?.*)?$/,   use: [{ loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'}] },
  { test: /\.svg(\?.*)?$/,   use: [{ loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'}] },
  { test: /\.(png|jpg)$/,    use: [{ loader: 'url-loader?limit=8192'}] },
)
/* eslint-enable */

module.exports = webpackConfig;

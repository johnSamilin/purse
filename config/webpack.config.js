const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // TODO: prod - https://github.com/webpack-contrib/mini-css-extract-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { argv: { mode } } = require('yargs');
const devMode = mode !== 'production';

module.exports = {
    mode,
    devtool: devMode ? 'source-map' : 'none',
    entry: './src/index.js',

    output: {
        path: path.resolve('dist'),
        filename: 'purse.js',
        jsonpScriptType: 'module',
    },

    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: mode,
                    },
                },
                'css-loader',
                'postcss-loader',
                'sass-loader',
            ],
        },
        /*{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'config/tsconfig.json',
                    },
                },
            ],
        },*/
        ]
    },

    resolve: {
        extensions: [/*'.tsx', '.ts', */'.js', '.jsx']
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            template: 'src/index.html',
        }),
    ],
};

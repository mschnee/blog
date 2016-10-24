import * as webpack from 'webpack';
import * as path from 'path';

import { Configuration } from 'webpack';

//let CopyWebpackPlugin  = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig: Configuration = {
    devtool: 'hidden-source-map',
    context: path.join(process.cwd(), 'client'),
    entry: {
        app: './app.ts',
        vendor: ['react', 'react-dom', 'redux', 'immutable', 'react-router', 'protobufjs/dist/protobuf-light']
    },
    output: {
        path: path.join(process.cwd(), 'dist', 'client'),
        filename: 'assets/app.[chunkhash].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'assets/vendor.[chunkhash].js'
        }),
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'client', 'index.html'),
            inject: 'body'
        }),
        new ExtractTextPlugin('assets/[name].[chunkhash].css')
    ],
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader'},
            //{ test: /\.html$/, loader: 'file' },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({fallbackLoader: 'style', loader: 'css!resolve-url!sass?sourceMap'})},
            { test: /\.jpe?g|\.png$$/, loader: 'file?name=assets/[path][hash].[ext]' },
            { test: /\.proto$/, loader: 'proto-loader' }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss']
    }
};

export default webpackConfig;

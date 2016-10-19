import * as webpack from 'webpack';
import * as path from 'path';
import { NoErrorsPlugin } from 'webpack';

import webpackConfig from './webpack.prod';

let HtmlWebpackPlugin = require('html-webpack-plugin');

webpackConfig.devtool = 'source-map';
webpackConfig.output = {
    path: path.join(process.cwd(), 'dist'),
    filename: "assets/app.[chunkhash].js",
};

webpackConfig.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'assets/vendor.[chunkhash].js'
    }),
    new HtmlWebpackPlugin({
        template: path.join(process.cwd(), 'client', 'index.html'),
        inject: 'body'
    }),
    new NoErrorsPlugin()
];

webpackConfig.module.loaders = [
    { test: /\.tsx?$/, loader: 'ts-loader'},
    { test: /\.png$/, loader: 'file?name=assets/images/[hash].[ext]' },
    { test: /\.jpg$/, loader: 'file?name=assets/images/[hash].[ext]' },
    { test: /\.jpeg$/, loader: 'file?name=assets/images/[hash].[ext]' },
    { test: /\.scss$/, loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap']},
];

export default webpackConfig;

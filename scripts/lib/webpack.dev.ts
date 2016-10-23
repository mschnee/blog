import * as webpack from 'webpack';
import * as path from 'path';
import { NoErrorsPlugin } from 'webpack';

import webpackConfig from './webpack.prod';

let HtmlWebpackPlugin = require('html-webpack-plugin');

webpackConfig.devtool = 'source-map';
webpackConfig.output = {
    path: path.join(process.cwd(), 'dist', 'client'),
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
    { test: /\.jpe?g|\.png$$/, loader: 'file?name=assets/[path][hash].[ext]' },
    { test: /\.scss$/, loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap']},
];

export default webpackConfig;

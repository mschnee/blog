import * as webpack from 'webpack';
import * as path from 'path';
import { NoErrorsPlugin } from 'webpack';

import webpackConfig from './webpack.prod';

let HtmlWebpackPlugin = require('html-webpack-plugin');

webpackConfig.devtool = 'source-map';
webpackConfig.output = {
    path: path.join(process.cwd(), 'dist', 'client'),
    filename: "assets/app.[hash].js",
};

webpackConfig.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'assets/vendor.[hash].js'
    }),
    new HtmlWebpackPlugin({
        template: path.join(process.cwd(), 'client', 'index.html'),
        inject: 'body'
    }),
    new NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin,
];

webpackConfig.entry = {
    app: ['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server', './app.ts'],
    vendor: ['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server', 'react', 'react-dom', 'redux', 'immutable', 'react-router', 'protobufjs/dist/protobuf-light']
};

webpackConfig.devServer = {
    inline: true
};

webpackConfig.module.loaders = [
    { test: /\.tsx?$/, loaders: ['react-hot-loader/webpack', 'ts-loader']},
    { test: /\.jpe?g|\.png$$/, loader: 'file?name=assets/[path][hash].[ext]' },
    { test: /\.scss$/, loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap']},
    { test: /\.proto$/, loader: 'proto-loader' }
];

export default webpackConfig;

import * as webpack from 'webpack';
import * as path from 'path';
let CopyWebpackPlugin  = require('copy-webpack-plugin');

const webpackConfig = {
    devtool: 'hidden-source-map',
    context: path.join(process.cwd(), 'client'),
    entry: {
        app: './app.ts',
        vendor: ['react', 'react-dom', 'redux', 'immutable']
    },
    output: {
        path: path.join(process.cwd(), 'dist')
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new CopyWebpackPlugin([
            { from: './index.html' }
        ])
    ],
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader'},
            { test: /\.html$/, loader: 'file' },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass']}
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
};

export default webpackConfig;
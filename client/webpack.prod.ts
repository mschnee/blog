import { Configuration, optimize } from 'webpack';
import * as path from 'path';

const webpackConfig: Configuration = {
    devtool: 'hidden-source-map',
    context: path.join(__dirname, './client'),
    entry: {
        app: './app.ts',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: './dist',
        filename: 'app.js'
    },
    plugins: [
        new optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        })
    ],
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.html$/, loader: 'file' }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
}

export default webpackConfig;
import * as webpack from 'webpack';
import * as path from 'path';

const webpackConfig = {
    devtool: 'hidden-source-map',
    context: path.join(__dirname),
    entry: {
        app: './app.ts',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.join(__dirname, './dist')
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
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
};

export default webpackConfig;
import { NoErrorsPlugin } from 'webpack';
import webpackConfig from './webpack.prod';
import * as path from 'path';

webpackConfig.devtool = 'source-map';
webpackConfig.output = {
    path: path.join(process.cwd(), 'dist')
};

webpackConfig.plugins.push(new NoErrorsPlugin());

export default webpackConfig;

import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import task from './lib/task';

const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

export default async () => {
  var server = new WebpackDevServer(compiler, webpackConfig.devServer);
  server.listen(8080, 'localhost', () => {});
};
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('../../webpack.config.js')

export default function makeWebpackMiddleware() {
  const compiler = webpack(webpackConfig)
  return webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
}

import http from 'http'
import { promisify } from 'util'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import makeExpressApp from './makeExpressApp'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('../../webpack.config.js')

async function main() {
  const app = makeExpressApp()

  const compiler = webpack(webpackConfig)
  app.use(
    webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  )
  app.use(express.static(__dirname + '/../../public'))

  const server = http.createServer(app)
  const listen = promisify(server.listen.bind(server))
  await listen(3000)
  console.log('TODO app ready on http://localhost:3000')
}

main().catch(err => console.error(err))

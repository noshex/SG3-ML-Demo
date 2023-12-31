const Hapi = require('@hapi/hapi')
const { routers } = require('./routers')

async function init () {
  const myServer = Hapi.server({
    port: 5003,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  myServer.route(routers)
  await myServer.start()
  console.log(`Server is listening at ${myServer.info.uri}`)
}

init()

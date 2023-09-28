const { predict } = require('./methods')

const routers = [
  {
    method: 'POST',
    path: '/predict',
    handler: predict.Predict,
    options: {
      payload: {
        output: 'data',
        parse: true,
        multipart: true
      }
    }
  }
]

module.exports = { routers }

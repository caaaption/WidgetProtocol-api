import express = require('express')
import * as functions from 'firebase-functions'

const app: express.Express = express()

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello World!',
  })
})

exports.api = functions.region('asia-northeast1').https.onRequest(app)

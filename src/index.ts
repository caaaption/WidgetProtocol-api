import express, { Application, Request, Response } from 'express'

const app: Application = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Hello World!',
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

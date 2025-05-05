import express from 'express'
import userRouter from './routes/users.routes.js'
import dbService from './services/database.service.js'
import { defaultErrorHandle } from './middlewares/errors.middlewares.js'
const app = express()
const PORT = 3000
app.use(express.json())

app.post('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', userRouter)

app.use(defaultErrorHandle)

dbService.connect()
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})

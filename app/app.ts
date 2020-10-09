require('dotenv').config()

import cors from 'cors'
import mongoose from 'mongoose'
import routes from './routes'
import compression from 'compression'
import database from '../config/database'
import HttpException from './utils/httpException'
import express, { Application, Request, Response, NextFunction } from 'express'

const app: Application = express()

app.use(cors())
app.use(compression())

/* Health check */
app.get('/', (req, res) => res.status(200).json({
  status: 'OK',
  version: `v${process.env.API_VERSION}`
}))

/* Routes */
app.use(`/api/v${process.env.API_VERSION}`, routes)

/* Handle 404 error */
app.use((req, res) => res.status(404).json({ status: 'NOT_FOUND' }))

/* Handle rest of errors  */
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  return res.status(err.status || 500).json({
    status: 'INTERNAL_SERVER_ERROR'
  })
})

mongoose
  .connect(database.connect, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to db'))
  .catch((err) => console.error(err));

export default app;

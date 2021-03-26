import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, CurrentUser} from '@158fighterss/common'

import { newTicketRouter } from './routes/new-ticket'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)

app.use(CurrentUser)
app.use(newTicketRouter) 

app.all('*', async () => {
    throw new NotFoundError() 
 })

app.use(errorHandler)

export { app }
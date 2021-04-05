import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, CurrentUser} from '@158fighterss/common'

import { showOrdersRouter } from './routes/show-orders'
import { newOrderRouter } from './routes/new-order'
import { deleteOrderRouter } from './routes/delete-order'

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
app.use(showOrdersRouter) 
app.use(newOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
    throw new NotFoundError() 
 })

app.use(errorHandler)

export { app }
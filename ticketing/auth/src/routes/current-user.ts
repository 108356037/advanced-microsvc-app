import express from 'express'
import jwt from 'jsonwebtoken'

import { CurrentUser } from '../middlewares/current-user'
const router = express.Router()

router.get('/api/users/currentuser', CurrentUser, async (req, res) => {
    res.send({currentUser: req.currentUser || null})
})

export { router as currentUserRouter }
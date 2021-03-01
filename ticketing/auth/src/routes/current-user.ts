import express from 'express'
import { CurrentUser } from '../middlewares/current-user'

const router = express.Router()

var cors = require('cors')
router.all('*', cors());

router.get('/api/users/currentuser', CurrentUser, async (req, res) => {
    res.send({currentUser: req.currentUser || null})
})

export { router as currentUserRouter }
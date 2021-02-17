import express from 'express'

const router = express.Router()

router.post('/api/users/signout', async (req, res) => {
    res.send('Hi Seafood~')
})

export { router as signoutRouter }
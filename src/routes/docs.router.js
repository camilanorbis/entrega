import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../docs/swagger.js'

const router = express.Router()

router.get('/json', (req,res) => {
    return res.status(200).json(swaggerSpec)
})

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default router;
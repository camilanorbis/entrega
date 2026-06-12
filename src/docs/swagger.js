import swaggerJSDoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Entrega',
            version: '1.0.0',
            description: 'Documentacion de API de la entrega'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],

        components: {

        }
    },

    apis: ['./src/routes/*.js']
})
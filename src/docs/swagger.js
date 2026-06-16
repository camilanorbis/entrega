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
                url: 'http://localhost:8080',
                description: 'Servidor local'
            }
        ],

        components: {

            schemas: {
                
                Product: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '65sd4f65sdf4sdf'
                        },
                        title: {
                            type: 'string',
                            example: 'Shampoo'
                        },
                        description: {
                            type: 'string',
                            example: 'Shampoo con acido hialuronico'
                        },
                        code: {
                            type: 'string',
                            example: 'SH159'
                        },
                        price: {
                            type: 'number',
                            example: 430
                        },
                        status: {
                            type: 'boolean',
                            example: true
                        },
                        stock: {
                            type: 'number',
                            example: 10
                        },
                        category: {
                            type: 'string',
                            example: 'Cuidado personal'
                        },
                        thumbnails: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },

                ProductInput: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Crema de enjuague amenixil'
                        },
                        description: {
                            type: 'string',
                            example: 'Shampoo con acido hialuronico'
                        },
                        code: {
                            type: 'string',
                            example: 'SH159'
                        },
                        price: {
                            type: 'number',
                            example: 430
                        },
                        status: {
                            type: 'boolean',
                            example: true
                        },
                        stock: {
                            type: 'number',
                            example: 10
                        },
                        category: {
                            type: 'string',
                            example: 'Cuidado personal'
                        },
                        thumbnails: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    },
                    required: ['title','description','code','price','status','stock','category','thumbnails']
                },

                ProductUpdateInput: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Crema de enjuague amenixil'
                        },
                        description: {
                            type: 'string',
                            example: 'Shampoo con acido hialuronico'
                        },
                        code: {
                            type: 'string',
                            example: 'SH159'
                        },
                        price: {
                            type: 'number',
                            example: 430
                        },
                        status: {
                            type: 'boolean',
                            example: true
                        },
                        stock: {
                            type: 'number',
                            example: 10
                        },
                        category: {
                            type: 'string',
                            example: 'Cuidado personal'
                        },
                        thumbnails: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    },
                },

                ProductResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Product found'
                        },
                        payload: {
                            $ref: '#/components/schemas/Product'
                        }
                    }
                },

                ProductsResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Products list'
                        },
                        payload: {
                            type: 'object',
                            properties: {
                                productsList: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Product'
                                    }
                                },
                                totalPages: {
                                    type: 'number',
                                    example: 3
                                },
                                prevPage: {
                                    type: 'number',
                                    example: 2
                                },
                                nextPage: {
                                    type: 'number',
                                    example: null
                                },
                                page: {
                                    type: 'number',
                                    example: 3
                                },
                                hasPrevPage: {
                                    type: 'boolean',
                                    example: true
                                },
                                hasNextPage: {
                                    type: 'boolean',
                                    example: false
                                },
                                prevLink: {
                                    type: 'string',
                                    example: 'http://localhost:8080/api/products?limit=5&page=2&sort=1'
                                },
                                nextLink: {
                                    type: 'string',
                                    example: null
                                }
                            }
                        }
                    }
                },

                UpdateResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Product updated successfully'
                        },
                        payload: {
                            type: 'object',
                            properties: {
                                productsMatch: {
                                    type: 'number',
                                    example: 1
                                },
                                productsModified: {
                                    type: 'number',
                                    example: 1
                                }
                            }
                        }
                    }
                },

                DeleteResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Product deleted successfully'
                        },
                        payload: {
                            type: 'object',
                            properties: {
                                productsDeleted: {
                                    type: 'number',
                                    example: 1
                                }
                            }
                        }
                    }
                },

                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Internal server error'
                        }
                    }
                },

                CartProduct: {
                    type: 'object',
                    properties: {
                        productId: {
                            type: 'string',
                            example: '6978fd7feee4a42b1e58c950'
                        },
                        quantity: {
                            type: 'number',
                            example: 1
                        },
                        _id: {
                            type: 'string',
                            example: '6a2c608c40375d49ccdf88c8'
                        }
                    }
                },

                Cart: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '697a2df7d13c0fb7a7fed23b'
                        },
                        products: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/CartProduct'
                            }
                        }
                    }
                },

                UpdateProductsCartInput: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            productId: {
                                type: 'string',
                                example: '6999f47bf9fa39539f6790c2'
                            },
                            quantity: {
                                type: 'number',
                                example: 11
                            }
                        },
                        required: ['productId','quantity']
                    } 
                },
                
                UpdateProductCartInput: {
                    type: 'object',
                    properties: {
                        quantity: {
                            type: 'number',
                            example: 11
                        }    
                    },
                    required: ['quantity']
                },

                CartResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Product added successfully to cart'
                        },
                        payload: {
                            $ref: '#/components/schemas/Cart'
                        }
                    }
                },

                CartProductsPopulated: {
                    type: 'object',
                    properties: {
                        productId: {
                            $ref: '#/components/schemas/Product'
                        },
                        quantity: {
                            type: 'number',
                            example: 3
                        },
                        id: {
                            type: 'string',
                            example: '54s65df4s65df4s5d4f'
                        }
                    }
                },

                CartProductsPopulatedResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Cart products obtained successfully'
                        },
                        payload: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/CartProductsPopulated'
                            }
                        }
                    }
                },

                Ticket: {
                    type: 'object',
                    properties: {
                        ticketNumber: {
                            type: 'string',
                            example: 'WYP9YYO6'
                        },
                        products: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        example: 'Crema de enjuague amenixil'
                                    },
                                    quantity: {
                                        type: 'number',
                                        example: 3
                                    }
                                }
                            }
                        },
                        user: {
                            type: 'object',
                            properties: {
                                first_name: {
                                    type: 'string',
                                    example: 'Lucia'
                                },
                                last_name: {
                                    type: 'string',
                                    example: 'Perez'
                                }
                            }
                        },
                        date: {
                            type: 'string',
                            example: 'Martes, 16 de junio de 2026'
                        },
                        totalAmount: {
                            type: 'number',
                            example: 650
                        }
                    }
                },

                TicketResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Purchase ticket generated successfully'
                        },
                        payload: {
                            $ref: '#/components/schemas/Ticket'
                        }
                    }
                }

            }

        }
    },

    apis: ['./src/routes/*.js']
})
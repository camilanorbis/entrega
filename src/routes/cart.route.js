import express from "express"
import { addProductToCart, createCart, getCartProducts, deleteProductFromCart, updateCartProducts, updateProductQuantity, deleteProductsFromCart, generatePurchaseTicket } from "../controllers/cart.controller.js";
import { passportCurrent, authorizeCartOwner } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/carts:
 *  post:
 *      summary: Create new cart
 *      description: Creates a new empty cart
 *      tags:
 *          - Carts
 *      responses:
 *          201:
 *              description: Cart created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartResponse'
 *          500:
 *              description: Error creating cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.post("/", createCart)


/**
 * @swagger
 * /api/carts/{cid}:
 *  get:
 *      summary: Get one cart's products
 *      description: Returns a cart and all of its products
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *      responses:
 *          200:
 *              description: Cart's products retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartProductsPopulatedResponse'
 *          404:
 *              description: Cart not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Error getting cart's products
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.get("/:cid", getCartProducts)

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *  post:
 *      summary: Add a product to cart
 *      description: Adds a product corresponding to id in path to the cart also corresponding to id in path
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *          - in: path
 *            name: pid
 *            required: true
 *            description: product Id
 *            schema:
 *              type: string
 *            example: 6999f47bf9fa39539f6790c2
 *      responses:
 *          200:
 *              description: Product added to cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartResponse'
 *          400:
 *              description: Error adding product to cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.post("/:cid/product/:pid", passportCurrent, authorizeCartOwner, addProductToCart)

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *  delete:
 *      summary: Delete one product from cart
 *      description: Deletes product corresponding to id in path from its cart also corresponding to id in path
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *          - in: path
 *            name: pid
 *            required: true
 *            description: product Id
 *            schema:
 *              type: string
 *            example: 6999f47bf9fa39539f6790c2
 *      responses:
 *          200:
 *              description: Product deleted from cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartResponse'
 *          400:
 *              description: Error deleting product from cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.delete("/:cid/product/:pid", deleteProductFromCart)

/**
 * @swagger
 * /api/carts/{cid}:
 *  put:
 *      summary: Updates quantity for products in cart
 *      description: Updates quantity for products indicated in body
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#/components/schemas/UpdateProductsCartInput'
 *      responses:
 *          200:
 *              description: Cart products updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartResponse'
 *          400:
 *              description: Error updating products from cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.put("/:cid", updateCartProducts) //puse mal lo que hace. recibe lista de productos y reemplaza todo lo que estaba en el cart.

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *  put:
 *      summary: Update a product quantity in cart
 *      description: Updates one product's quantity in the corresponding cart
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *          - in: path
 *            name: pid
 *            required: true
 *            description: product Id
 *            schema:
 *              type: string
 *            example: 6999f47bf9fa39539f6790c2
 *      requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/UpdateProductCartInput'
 *      responses:
 *          200:
 *              description: Product updated in cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartResponse'
 *          400:
 *              description: Error updating product in cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.put("/:cid/product/:pid", updateProductQuantity)

/**
 * @swagger
 * /api/carts/{cid}:
 *  delete:
 *      summary: Deletes all products from cart
 *      description: Deletes all products in the corresponding cart
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *      responses:
 *          200:
 *              description: Products deleted from cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CartResponse'
 *          400:
 *              description: Error deleting products from cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.delete("/:cid", deleteProductsFromCart)

/**
 * @swagger
 * /api/carts/{cid}/buy:
 *  post:
 *      summary: Generates purchase ticket
 *      description: Generates purchase ticket for the corresponding cart
 *      tags:
 *          - Carts
 *      parameters:
 *          - in: path
 *            name: cid
 *            required: true
 *            description: cart Id
 *            schema:
 *              type: string
 *            example: 697a2df7d13c0fb7a7fed23b
 *      responses:
 *          200:
 *              description: Purchase ticket generated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TicketResponse'
 *          400:
 *              description: Error generating ticket
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.post("/:cid/buy", passportCurrent, authorizeCartOwner, generatePurchaseTicket)

export default router
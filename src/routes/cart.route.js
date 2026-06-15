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

router.post("/:cid/product/:pid", passportCurrent, authorizeCartOwner, addProductToCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", updateCartProducts)

router.put("/:cid/product/:pid", updateProductQuantity)

router.delete("/:cid", deleteProductsFromCart)

router.post("/:cid/buy", passportCurrent, authorizeCartOwner, generatePurchaseTicket)

export default router
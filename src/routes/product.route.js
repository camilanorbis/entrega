import express from "express"
import { getProducts, getProductById, createProduct, modifyProduct, deleteProduct } from "../controllers/product.controller.js";
import { passportCurrent, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get all products
 *      description: Returns a list of all available products
 *      tags:
 *          - Products
 *      responses:
 *          200:
 *            description: List of products retrieved successfully
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/ProductsResponse'
 *          500:
 *            description: Error getting products
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.get("/", getProducts)

/**
 * @swagger
 * /api/products/{pid}:
 *  get:
 *      summary: Get one product
 *      description: Returns a product by its id
 *      tags:
 *          - Products
 *      parameters:
 *          - in: path
 *            name: pid
 *            required: true
 *            description: product Id
 *            schema:
 *              type: string
 *            example: 6978fd7feee4a42b1e58c950
 *      responses:
 *          200:
 *              description: Product retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          404:
 *              description: Error getting product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Error getting product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.get("/:pid", getProductById)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Create new product
 *      description: Creates a new product with data recieved in body
 *      tags:
 *          - Products
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ProductInput'
 *      responses:
 *          201:
 *              description: Product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          400:
 *              description: Missing fields
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Error creating products
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.post("/", passportCurrent, authorizeRole("admin"), createProduct)

/**
 * @swagger
 * /api/products/{pid}:
 *  put:
 *      summary: Modify a product
 *      description: Updates a product with data recieved in body
 *      tags:
 *          - Products
 *      parameters:
 *          - in: path
 *            name: pid
 *            required: true
 *            description: product Id
 *            schema:
 *              type: string
 *            example: 6978fd7feee4a42b1e58c950
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/ProductUpdateInput'
 *      responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateResponse'
 *          400:
 *              description: Error updating product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          404:
 *              description: Product not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Error updating products
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.put("/:pid", passportCurrent, authorizeRole("admin"), modifyProduct)

/**
 * @swagger
 * /api/products/{pid}:
 *  delete:
 *      summary: Delete a product
 *      description: Deletes a product with data recieved in body
 *      tags:
 *          - Products
 *      parameters:
 *          - in: path
 *            name: pid
 *            required: true
 *            description: product Id
 *            schema:
 *              type: string
 *            example: 6978fd7feee4a42b1e58c950
 *      responses:
 *          200:
 *              description: Product deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteResponse'
 *          400:
 *              description: Error deleting product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          404:
 *              description: Product not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Error updating products
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  
*/
router.delete("/:pid", passportCurrent, authorizeRole("admin"), deleteProduct)

export default router
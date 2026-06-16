import { cartService } from "../service/index.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createCart = async (req,res,next) => {
    try {
        const response = await cartService.createCart()        
        return successResponse(res, {statusCode: 201, message: 'Cart created successfully', payload: response})
    } catch (error) {
        next(error)
    }
}

export const getCartProducts = async (req,res,next) => {
    try {
        const { cid } = req.params
        const cart = await cartService.getCartWithProducts(cid)
        const response = cart.products;
        return successResponse(res, {statusCode: 200, message: 'Cart products obtained successfully', payload: response})
    } catch (error) {
        next(error)
    }
}

export const addProductToCart = async (req,res,next) => {
    try {
        const { pid } = req.params
        const { cid } = req.params 
        const response = await cartService.addProduct(cid,pid)        
        return successResponse(res, {statusCode: 200, message: 'Product added successfully to cart', payload: response})
    } catch (error) {
        next(error)
    }
}

export const deleteProductFromCart = async (req,res,next) => {
    try {
        const { cid, pid } = req.params 
        const response = await cartService.deleteProduct(cid,pid)
        return successResponse(res, {statusCode: 200, message: 'Product deleted successfully from cart', payload: response})
    } catch (error) {
        next(error)
    }
}

export const updateCartProducts = async (req,res,next) => {
    try {
        const { cid } = req.params;
        const newProducts = req.body; 
        const response = await cartService.updateAllProducts(cid, newProducts)
        return successResponse(res, {statusCode: 200, message: 'Cart products updated successfully', payload: response})
    } catch (error) {
        next(error)
    }
}

export const updateProductQuantity = async (req,res,next) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        const response = await cartService.updateProductOnCart(cid,pid,quantity)
        return successResponse(res, {statusCode: 200, message: 'Product quantity updated successfully', payload: response})
    } catch (error) {
        next(error)
    }

}

export const deleteProductsFromCart = async (req,res,next) => {
    try {
        const { cid } = req.params
        const response = await cartService.deleteAllProducts(cid)
        return successResponse(res, {statusCode: 200, message: 'Products deleted successfully from cart', payload: response})
    } catch (error) {
        next(error)
    }
}

export const generatePurchaseTicket = async (req,res,next) => {
    try {
        const { cid } = req.params
        const user = req.user
        const response = await cartService.generatePurchase(cid,user)
        return successResponse(res, {statusCode: 200, message: 'Purchase ticket generated successfully', payload: response})
    } catch (error) {
        next(error)
    }
}
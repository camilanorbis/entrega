import { cartService } from "../service/index.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createCart = async (req,res,next) => {
    try {
        const response = await cartService.createCart()

        if (!response) {
            return errorResponse(res, {statusCode: 400, message: 'Error creating cart'})
        }
        
        return successResponse(res, {statusCode: 201, message: 'Cart created successfully', payload: response})
    } catch (error) {
        next(error)
    }
}

export const getCartProducts = async (req,res,next) => {
    try {
        const { cid } = req.params
        
        const cart = await cartService.getCartWithProducts(cid)
        if (!cart)
            return errorResponse(res, {statusCode: 404, message: 'Cart not found'})

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

        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error adding product to cart'})

        if (response.error)
            return errorResponse(res, {statusCode: 400, message: response.error})
        
        return successResponse(res, {statusCode: 200, message: 'Product added successfully to cart', payload: response})
    } catch (error) {
        next(error)
    }
}

export const deleteProductFromCart = async (req,res,next) => {
    try {
        const { cid, pid } = req.params 
        const response = await cartService.deleteProduct(cid,pid)
        console.log(response)

        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error deleting product from cart'})
        
        if (response.error)
            return errorResponse(res, {statusCode: 400, message: response.error})

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
        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error updating cart'})
        
        if (response.error)
            return errorResponse(res, {statusCode: 404, message: response.error})

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
        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error updating cart'})

        if (response.error)
            return errorResponse(res, {statusCode: 404, message: response.error})

        return successResponse(res, {statusCode: 200, message: 'Product quantity updated successfully', payload: response})
    } catch (error) {
        next(error)
    }

}

export const deleteProductsFromCart = async (req,res,next) => {
    try {
        const { cid } = req.params
        const response = await cartService.deleteAllProducts(cid)

        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error deleting products from cart'})

        if (response.error)
            return errorResponse(res, {statusCode: 404, message: response.error})

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
        
        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error generating purchase ticket'})
        
        if (response.error)
            return errorResponse(res, {statusCode: 404, message: response.error})

        return successResponse(res, {statusCode: 200, message: 'Purchase ticket generated successfully', payload: response})
    } catch (error) {
        next(error)
    }
}
import ProductDAO from "../dao/ProductDAO.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const productDao = new ProductDAO();


export const createProduct = async (req,res,next) => {
    try {
        const product = req.body;
        if (!validateProduct(product)){
            return errorResponse(res, {statusCode: 400, message: 'Missing or invalid fields'})
        }
        const response = await productDao.createProduct(product)

        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Missing or invalid fields'})
        
        return successResponse(res, {statusCode: 201, message: 'Product created successfully', payload: response})
    } catch (error) {
        if (error.name === "ValidationError") {
            const mensajes = Object.values(error.errors).map(err => err.message);
            return errorResponse(res, {statusCode: 400, message: mensajes.join(', ')})
        }
        next(error)
    }
}

export const getProducts = async (req,res,next) => {
    try {
        let { limit = 10, page = 1, query, sort } = req.query
        let filter = {}
        
        limit = Number(limit)
        page = Number(page)
        const skip = limit * (page - 1)
        if (query) {
            const [key, value] = query.split(":");
            filter[key] = value; 
        }   

        const totalPages = await getTotalPages(filter,limit)
        const hasPrevPage = page > 1
        const  hasNextPage = page < totalPages

        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

        const prevLink = hasPrevPage
            ? `${baseUrl}?limit=${limit}&page=${page - 1}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
            : null;

        const nextLink = hasNextPage
            ? `${baseUrl}?limit=${limit}&page=${page + 1}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
            : null;

        const response = await productDao.getProducts(filter,limit,skip,sort);
        return successResponse(res, {statusCode: 200, message: 'List of products successfully obtained', payload: {
            productsList: response,
            totalPages: totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page, 
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        }})
    } catch (error){
        next(error)
    }
}

export const getProductById = async (req,res,next) => {
    try {
        const { pid } = req.params
        const response = await productDao.getProductByFilter({ _id: pid })
        
        if (!response)
            return errorResponse(res, {statusCode: 404, message: 'Product not found'})

        return successResponse(res, {statusCode: 200, message: 'Product found', payload: response})
    } catch (error) {
        next(error)
    }
}

export const modifyProduct = async (req,res,next) => {
    try {
        const { pid } = req.params
        const product = req.body

        const originalProduct = await productDao.getProductByFilter({ _id: pid })

        if (!originalProduct)
            return errorResponse(res, {statusCode: 404, message: 'Product not found'})

        const response = await productDao.modifyProduct(pid,{ $set: product })
        if (!response)
            return errorResponse(res, {statusCode: 400, message: 'Error updating product'})

        return successResponse(res, {statusCode: 200, message: 'Product updated successfully', payload: response})
    } catch (error) {
        if (error.name === "ValidationError") {
            const mensajes = Object.values(error.errors).map(err => err.message);
            return errorResponse(res, {statusCode: 400, message: mensajes.join(', ')})
        }
        next(error)
    }
}

export const deleteProduct = async (req,res,next) => {
    try {
        const { pid } = req.params
        const product = await productDao.getProductByFilter({ _id: pid })

        if (!product)
            return errorResponse(res, {statusCode: 404, message: 'Product not found'})

        const response = await productDao.deleteProduct(pid)
        if (!response.acknowledged)
            return errorResponse(res, {statusCode: 400, message: 'Could not delete product'})

        return successResponse(res, {statusCode: 200, message: 'Product deleted successfully', payload: response})
    } catch (error) {
        next(error)
    }
}

export const getTotalPages = async (filter,limit) => {
    let totalDocs
    if (filter) {
        totalDocs = await productDao.countDocuments(filter)
    } else {
        totalDocs = await productDao.countDocuments(null)
    }
    return Math.ceil(totalDocs / limit)
}

const validateProduct = (product) => {
    const { title, description, code, price, status, stock, category, thumbnails } = product;

    if (!title || !description || !code || price == null || stock == null || !category || !thumbnails) {
        return false;
    }

    if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof code !== 'string' ||
        typeof price !== 'number' ||
        typeof stock !== 'number' ||
        typeof status !== 'boolean' ||
        typeof category !== 'string' ||
        !Array.isArray(thumbnails) ||
        !thumbnails.every(t => typeof t === 'string')
    ) {
        return false;
    }
    return true;
}
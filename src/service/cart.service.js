import { Types } from "mongoose";
import { nanoid } from "nanoid";
import TicketDTO from "../DTO/TicketDTO.js";

export default class CartService {

    constructor (cartDao,productDao,ticketDao) {
        this.cartDao = cartDao
        this.productDao = productDao
        this.ticketDao = ticketDao
    }

    async createCart () {
        const result = await this.cartDao.createCart()
        if (!result)
            throw new Error('Unable to create cart')        
        return result
    }

    async getCartWithProducts (cid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart)
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)
        return cart.populate("products.productId")
    }

    async addProduct (cid, pid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        const product = await this.productDao.getProductByFilter({ _id: pid })
        if(!cart) {
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)
        }     
        if(!product) {
            throw new NotFoundError(`Product with id ${pid} doesn't exist`)
        }

        const objectPid = new Types.ObjectId(String(pid))
        const result = await this.cartDao.updateCart(
            { _id: cid, "products.productId": objectPid },
            { $inc: { "products.$.quantity": 1 } }
        )
        
        if (result.modifiedCount === 0) {
            const sndResult = await this.cartDao.updateCart(
                { _id: cid },
                { $push: { products: { productId: objectPid, quantity: 1 }}}
            )
            if (sndResult.modifiedCount === 0) 
                throw new Error('Product was not added to cart')
        }

        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async deleteProduct (cid, pid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        const product = await this.productDao.getProductByFilter({ _id: pid })
        
        if (!cart) {
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)
        }
        if(!product) {
            throw new NotFoundError(`Product with id ${pid} doesn't exist`)
        }
        
        const objectPid = new Types.ObjectId(String(pid))
        const objectCid = new Types.ObjectId(String(cid))
        const result = await this.cartDao.updateCart(
            { _id: objectCid }, 
            { $pull: { products: { productId: objectPid }}}
        )

        if (result.modifiedCount === 0) {
            throw new Error('Product was not removed from cart')
        }
        
        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async updateProductOnCart (cid, pid, quantity) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) 
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)
                
        const objectCid = new Types.ObjectId(String(cid))
        const objectPid = new Types.ObjectId(String(pid))
        const result = await this.cartDao.updateCart({ _id: objectCid, "products.productId": objectPid }, { $set: { "products.$.quantity": quantity }})
                        
        if (result.modifiedCount === 0) 
            throw new Error(`Product with id ${pid} is not in cart`)

        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async updateAllProducts (cid, newProducts) {
        if (!Array.isArray(newProducts)) 
            throw new BadRequestError('Request body must be an array of products.')          

        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) 
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)

        const result = await this.cartDao.updateCart({ _id: cid }, { $set: { products: newProducts }})
        if (result.modifiedCount === 0)
            throw new Error('Cart not updated')

        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async deleteAllProducts (cid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) 
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)

        const result = await this.cartDao.updateCart({ _id: cid }, { $set: { products: [] }})
        if (result.modifiedCount === 0)
            throw new Error('Cart not updated')

        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async generatePurchase (cid,user) {
        //obtengo carrito
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        await cart.populate("products.productId")
        if (!cart) 
            throw new NotFoundError(`Cart with id ${cid} doesn't exist`)

        //chequeo que cada producto tenga el stock necesario, si no lo tiene lo saco del carrito
        for (const item of cart.products) {
            const product = item.productId
            
            if (product.stock < item.quantity) {
                cart.products = cart.products.filter(p => p !== item)
            }
        }
        
        if (cart.products.length === 0) {
            throw new Error('Cart is empty')
        }

        //resto el stock de los productos del carrito
        for (const item of cart.products) {
            await this.productDao.modifyProduct(item.productId._id, { $inc: { stock: -item.quantity }})
        }

        //calculo precio total del ticket
        let totalAmount = 0
        for (const item of cart.products) {
            totalAmount += item.productId.price * item.quantity
        }

        //genero el ticket 
        const newTicket = await this.ticketDao.createTicket ({
            ticketNumber: nanoid(8),
            products: cart.products.map(p => ({
                productId: p.productId._id,
                quantity: p.quantity
            })),
            userId: user._id,
            date: new Date(),
            totalAmount
        })

        // populo el usuario y productos para poder obtener el ticket final para el dto. 
        const ticketDoc = await this.ticketDao.getTicketByFilter(
                                                        { _id: newTicket._id },
                                                        true,
                                                        [
                                                            { path: "products.productId", select: "title" },
                                                            { path: "userId", select: "first_name last_name" }
                                                        ]
                                                    )

        if (!ticketDoc || !newTicket)
            throw new Error('Error generating ticket')

        //vaciar carrito
        await this.cartDao.updateCart({ _id: cid }, { $set: { products: [] }})

        return new TicketDTO(ticketDoc)
    }

}
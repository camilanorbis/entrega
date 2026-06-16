import jwt from "jsonwebtoken"
import UserDTO from "../DTO/UserDTO.js"
import { config } from "../config/config.js"
import { nanoid } from "nanoid"
import { sessionService } from "../service/index.js"
import { errorResponse, successResponse } from "../utils/apiResponse.js"

export const createUser = async (req,res) => {
    return successResponse(res, { statusCode: 201, message: 'User created successfully', payload: req.user })
}

export const getErrorRegister = async (req,res) => {
    res.setHeader('Content-Type','application/json')
    return errorResponse(res, { statusCode: 400, message: 'Couldn´t create user, missing information or user already exists' })
}

export const getErrorLogin = async (req,res) => {
    res.setHeader('Content-Type','application/json')
    return errorResponse(res, { statusCode: 401, message: 'Invalid credentials' })
}

export const login = async (req,res) => {
    const user = req.user
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" })

    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 });
    res.setHeader('Content-Type','application/json')
    return successResponse(res, { statusCode: 200, message: 'Login successful', payload: req.user })
}

export const getCurrentUser = async (req,res) => {
    try {
        const userDto = new UserDTO(req.user)
        res.setHeader('Content-Type','application/json')
        if (!userDto)
            return errorResponse(res, {statusCode: 404, message: 'User not found' })
        
        return successResponse(res, {statusCode: 200, message: 'User found', payload: userDto })
    } catch (error) {
        next(error)
    }
}

export const forgotPassword = async (req,res) => {
    try {
        const { email } = req.body

        const user = await sessionService.getUserByFilter({ email })
        if (!user) return res.status(404).json({ status:'error', payload: "Usuario no existe" })

        const token = nanoid(10)
        await sessionService.saveResetToken(user._id, token)
        const resetLink = `http://localhost:${config.PORT}/api/sessions/reset-password/${token}`
        await sessionService.sendRecoveryEmail(user.email, resetLink)

        return (res, { statusCode: 200, message: 'Email sent', payload: { 'Reset Link': resetLink } })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body
        const response = await sessionService.updateUserPassword(token, password, confirmPassword)
        return successResponse(res, { statusCode: 200, message: 'Password updated successfully', payload: response })
    } catch (error) {
        next(error)
    }
}

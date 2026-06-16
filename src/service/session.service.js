import { transport } from "../config/email.config.js"
import { createHash, validaPass } from "../utils/user.utils.js"

export default class SessionService {

    constructor (sessionDao) {
        this.sessionDao = sessionDao
    }

    async getUserByFilter (filter) {
        return this.sessionDao.getUserByFilter(filter)
    }

    async updateUserPassword (token, password, confirmPassword) {
        if (password !== confirmPassword) 
            throw new Error("Passwords don't match")
        
        const user = await this.sessionDao.getUserByFilter({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        })
        
        if (!user) 
            throw new Error('Invalid or expired token')

        const oldPassword = user.password
        if (validaPass(password,oldPassword))
            throw new Error('New password can not be same as old one')

        const hashedPassword = createHash(password)
        const result =  await this.sessionDao.updateUser(
            { _id: user._id },
            { 
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpires: "" }
            }
        )

        if (result.modifiedCount === 0)
            throw new Error('Error updating password')

        return result
    }

    async saveResetToken (userId, token) {
        const expiration = new Date(Date.now() + 60 * 60 * 1000)

        const result = await this.sessionDao.updateUser (
            { _id: userId },
            {
            $set: {
                resetToken: token,
                resetTokenExpires: expiration
            }
            }
        )

        if (result.modifiedCount === 0)
            throw new Error('Error setting reset token')

        return result
    }  

    async sendRecoveryEmail (userEmail, resetLink) {
        return await transport.sendMail({
            from: "Camila Norbis <camilanorbis@gmail.com>",
            to: userEmail,
            subject: "Recuperar contraseña",
            html: `
            <h2>Recuperación de contraseña</h2>
            <p>Click en el siguiente enlace:</p>
            <a href="${resetLink}">Cambiar contraseña</a>
            `
        })
    }


}
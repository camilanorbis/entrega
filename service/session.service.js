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
        if (password !== confirmPassword) {
            return ({ 'error': "Las contraseñas no coinciden" })
        }
        
        const user = await this.sessionDao.getUserByFilter({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        })
        
        if (!user) {
            return ({ 'error': "Token inválido o expirado" })
        }

        const oldPassword = user.password
        if (validaPass(password,oldPassword)){
            return ({'error': 'La contraseña nueva no puede ser igual a la anterior'})
        }

        const hashedPassword = createHash(password)
        return await this.sessionDao.updateUser(
            { _id: user._id },
            { 
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpires: "" }
            }
        )
    }

    async saveResetToken (userId, token) {
        const expiration = new Date(Date.now() + 60 * 60 * 1000)

        return await this.sessionDao.updateUser (
            { _id: userId },
            {
            $set: {
                resetToken: token,
                resetTokenExpires: expiration
            }
            }
        )
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
import express from "express"
import { createUser, login, getCurrentUser, getErrorRegister, getErrorLogin, forgotPassword, resetPassword } from "../controllers/session.controller.js"
import passport from 'passport';
import { passportCurrent } from "../middleware/auth.js";

const router = express.Router()

/**
 * @swagger
 * /api/sessions:
 *  post:
 *      summary: Create new user
 *      description: Creates a new user with data recieved in body
 *      tags:
 *          - Users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UseInput'
 *      responses:
 *          201:
 *              description: User created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserResponse'
 *  
*/
router.post("/register", passport.authenticate("registro", {session: false, failureRedirect: "/api/sessions/error_register"}), createUser)

router.get("/error_register", getErrorRegister)

router.get("/error_login", getErrorLogin)

router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "/api/sessions/error_login"}), login)

router.get("/current", passportCurrent, getCurrentUser)

router.post("/forgot_password", forgotPassword)

router.get("/reset-password/:token", (req, res) => {
    const { token } = req.params
    res.render("resetPassword", { token })
})

router.post("/reset-password", resetPassword)


export default router 
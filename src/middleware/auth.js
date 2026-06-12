import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import passport from "passport";
import { errorResponse } from "../utils/apiResponse.js";

//deprecated
export const authJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return errorResponse(res, {statusCode: 401, message: 'No user authenticated'})
    }

    try {
        const jwtContent = jwt.verify(token, config.JWT_SECRET);
        req.user = jwtContent;
        next();
    } catch (error) {
        return errorResponse(res, {statusCode: 401, message: 'Invalid token'})
    }
};

export const passportCurrent = (req, res, next) => {
  passport.authenticate("current", { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return errorResponse(res, {statusCode: 401, message: 'Invalid or missing token'})
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeRole = (...allowedRoles) => {
  return (req,res,next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, {statusCode: 402, message: 'Unauthorized user'})
    }
    next()
  }
}

export const authorizeCartOwner = (req,res,next) => {
  const { cid } = req.params

  if (!req.user) {
    return errorResponse(res, {statusCode: 401, message: 'No user authenticated'})
  }

  if (req.user.cart.toString() !== cid) {
    return errorResponse(res, {statusCode: 403, message: 'User unauthorized to edit this cart'})
  }

  next()

}
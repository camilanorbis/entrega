import jwt from "jsonwebtoken";

export const authJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status:'error', payload:'No hay usuario autenticado' });
    }

    try {
        const jwtContent = jwt.verify(token, process.env.JWT_SECRET);
        req.user = jwtContent;
        next();
    } catch (error) {
        return res.status(401).json({ status:'error', payload:'Token inválido' });
    }
};

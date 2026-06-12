import express from "express"
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/cart.route.js"
import rootRouter from "./routes/root.route.js"
import sessionRouter from "./routes/session.route.js"
import docsRouter from './routes/docs.router.js'
import { Server } from "socket.io"
import http from "http"
import handlebars from "express-handlebars"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser";
import passport from "passport";
import { passportInit } from "./config/config.passport.js";
import { config } from "./config/config.js"
import { requestId } from "./middleware/requestId.js"
import { requestLogger } from "./middleware/requestLogger.js"
import { errorHandler } from "./middleware/errorHandler.js"

const basePathProducts = "/api/products"
const basePathCarts = "/api/carts"
const basePathSessions = "/api/sessions"
const basePathDocs = 'api/docs'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
passportInit();
app.use(passport.initialize());
app.use(requestId);
app.use(requestLogger);

app.use("/",rootRouter)
app.use(basePathProducts,productRouter)
app.use(basePathCarts,cartRouter)
app.use(basePathSessions,sessionRouter)
app.use(basePathDocs, docsRouter)

app.use(errorHandler)

export default app;


/* WEB SOCKETS & HANDLEBARS - NOT USING IT RIGHT NOW */
 
/* 
const servidor = http.createServer(app);

Servidor websockets -> responde solicitudes que vengan de ws://localhost:8080
const servidorWS = new Server(servidor);
servidorWS.on("connection", (socket) => {
    console.log("nuevo cliente conectado")

    socket.emit("respuesta", "Hola desde el servidor")
})


app.engine('handlebars',handlebars.engine())
app.set('view engine','handlebars')
app.use(express.static("public"))

 app.locals.servidorWS = servidorWS;


 
 */
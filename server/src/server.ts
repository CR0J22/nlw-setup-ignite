import Fastify from "fastify";
import cors from '@fastify/cors'
import { appRoutes } from "./routes";

/* Cria o app */
const app = Fastify();

/* Controle de ascesso */
app.register(cors)

/* Rotas */
app.register(appRoutes)

/* Iniciar o servidor na porta 3333 */
app.listen({
    port: 3333,
}).then(()=>{
    console.log('HTTP server Running')
})
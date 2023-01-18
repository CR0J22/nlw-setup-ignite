import Fastify from "fastify";
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

/* Cria o app */
const app = Fastify();

/* Ascessa o db */
const prisma = new PrismaClient();

/* Controle de ascesso */
app.register(cors)

/* Rotas */
app.get('/hello', async () =>{

    const habits = await prisma.habit.findMany()

    return habits
})

/* Iniciar o servidor na porta 3333 */
app.listen({
    port: 3333,
}).then(()=>{
    console.log('HTTP server Running')
})
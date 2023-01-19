import { PrismaClient } from '@prisma/client'

/* Ascessa o db */
export const prisma = new PrismaClient({
    log:['query']
});
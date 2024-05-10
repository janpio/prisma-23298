const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
})

prisma.$on('query', (e) => {
    console.log(e.query, e.params)
})

async function main() {

    const res = await prisma.user.update({
        where: { id: 'user' },
        data: {
            outfit: {
                update: {
                    toConnect1: { connect: { id: 'toConnect1' } },
                    toConnect2: { connect: { id: 'toConnect2' } },
                    toDisconnect1: { disconnect: true },
                    toDisconnect2: { disconnect: true },
                    toDisconnect3: { disconnect: true },
                },
            },
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
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
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
})

async function main() {

    // cleanup
    await prisma.user.deleteMany()
    await prisma.userOutfit.deleteMany()
    await prisma.outfitPart.deleteMany()

    // create initial state
    await prisma.outfitPart.create({
        data: {
            id: 'originallyConnected'
        }
    })

    await prisma.userOutfit.create({
        data: {
            id: "userOutFit",
            toConnect1: { connect: { id: "originallyConnected" } },
            toConnect2: { connect: { id: "originallyConnected" } },
            toDisconnect1: { connect: { id: "originallyConnected" } },
            toDisconnect2: { connect: { id: "originallyConnected" } },
            toDisconnect3: { connect: { id: "originallyConnected" } },
        }
    })

    await prisma.user.create({
        data: {
            id: 'user',
            outfit: { connect: { id: "userOutFit" } }
        }
    })

    // create additional
    await prisma.outfitPart.create({
        data: {
            id: 'toConnect1'
        }
    })
    await prisma.outfitPart.create({
        data: {
            id: 'toConnect2'
        }
    })
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
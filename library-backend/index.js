const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { startStandaloneServer } = require('@apollo/server/standalone') // remove

const express = require('express')
const cors = require('cors')
const http = require('http')

const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const { MONGODB_URI, PORT } = process.env

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const User = require('./models/User')

mongoose.set('strictQuery', false)

console.log('connecting to MongoDB database...')

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB database!')
  })
  .catch(() => {
    console.log('could not connect to MongoDB database!')
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({ 
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    pugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    }),
  )

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
  })
}

start()


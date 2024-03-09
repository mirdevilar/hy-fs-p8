const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const { MONGODB_URI } = process.env

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

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  cors: true,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


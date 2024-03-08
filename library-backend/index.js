const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')

require('dotenv').config()
const { MONGODB_URI } = process.env

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


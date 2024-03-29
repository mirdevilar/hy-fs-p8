const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')

const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

const pubsub = new PubSub()

module.exports = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const by = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return null
        }
        by.author = author.id
      }
      if (args.genre) {
        by.genres = [args.genre]
      }

      return await Book.find(by).populate('author')
    },
    allAuthors: async () => Author.find({}),

    me: (root, args, context) => context.currentUser,
  },

  Author: {
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }

      let author = await Author.findOne({ name: args.author })
      if (author) {
        // author = { ...author, bookCount: author.bookCount + 1 }
        author.bookCount++
        await author.save()
      } else {
        author = await new Author({ name: args.author, bookCount: 1 })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Given author does not exist and could not be created with given name', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
 
      const newBook = new Book({ ...args, author })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Book could not be created', { extensions: {
          code: 'BAD_USER_INPUT',
          error
        } })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook
    },
    editAuthor: async (root, { name, setBornTo: born }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }

      const author = await Author.findOne({ name })

      if (!author) {
        return null
      }

      author.born = born

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Author could not be updated', { extensions: {
          code: 'BAD_USER_INPUT',
          error
        } })
      }

      return author
    },

    createUser: async (root, args) => {
      const user = new User(args)

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('User could not be created', { extensions: {
          code: 'BAD_USER_INPUT',
          error
        } })
      }

      return user
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })

      if (!user || password !== 'hirvenliha') {
        throw new GraphQLError('wrong credentials', { extension: {
          code: 'BAD_USER_INPUT',
        } })
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}


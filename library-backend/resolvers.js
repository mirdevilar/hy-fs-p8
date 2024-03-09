const { GraphQLError } = require('graphql')

const Author = require('./models/Author')
const Book = require('./models/Book')

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
  },

  Author: {
    bookCount: (root) => books.filter(b => b.author === root.name).length,
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = await new Author({ name: args.author })
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

      return newBook
    },
    editAuthor: async (root, { name, setBornTo: born }) => {
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
    }
  }
}


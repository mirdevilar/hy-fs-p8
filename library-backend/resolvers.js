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
        await author.save()
      }
 
      const newBook = new Book({ ...args, author })
      return await newBook.save()
    },
    editAuthor: async (root, { name, setBornTo: born }) => {
      const updatedAuthor = await Author.findOneAndUpdate({ name }, { $set: { born } })

      return updatedAuthor
    }
  }
}


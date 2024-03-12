import { gql } from '@apollo/client'

export const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  author {
    name
    born
  }
  published
  genres
}
`

export const ALL_BOOKS = gql`
  query (
    $author: String,
    $genre: String,
  ) {
    allBooks(genre: $genre, author: $author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ALL_GENRES_IN_BOOKS = gql`
  query {
    allBooks {
      genres
    }
  }
`


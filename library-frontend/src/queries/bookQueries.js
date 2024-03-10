import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query (
    $author: String,
    $genre: String,
  ) {
    allBooks(genre: $genre, author: $author) {
      id
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const ALL_GENRES_IN_BOOKS = gql`
  query {
    allBooks {
      genres
    }
  }
`

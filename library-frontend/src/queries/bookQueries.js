import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query {
  allBooks {
    id
    title
    author {
      name
      born
    }
    published
  }
}
`


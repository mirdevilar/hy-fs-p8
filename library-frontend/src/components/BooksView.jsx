import { useEffect, useState } from 'react'
import { useQuery, refetchQueries } from '@apollo/client'

import BookRow from './BookRow'

import { ALL_BOOKS, ALL_GENRES_IN_BOOKS } from '../queries/bookQueries'

const BooksView = () => {
  const genresInBooksQuery = useQuery(ALL_GENRES_IN_BOOKS)
  const booksQuery = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)

  useEffect(() => {
    if (!genre) {
      delete booksQuery.variables.genre
    } else {
      booksQuery.variables.genre = genre
    }
    booksQuery.refetch()
  }, [genre])
  
  if (booksQuery.loading || genresInBooksQuery.loading) {
    return <p>loading...</p>
  }

  const books = booksQuery.data.allBooks
  const genresInBooks = genresInBooksQuery.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <div>
        <button onClick={() => setGenre(null)} >all genres</button>
        {
          genresInBooks
            .reduce((genres, b) => {
              const newGenres = b.genres.filter(g => !genres.includes(g))
              return genres.concat(newGenres)
            }, [])
            .map((g) => <button onClick={() => setGenre(g)} key={g}>{g}</button>)
        }
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            books
              // .filter(b => !genre || b.genres.includes(genre))
              .map((b) => <BookRow book={b} key={b.title}/>)
          }
        </tbody>
      </table>
    </div>
  )
}

export default BooksView

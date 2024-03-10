import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries/bookQueries'

const BookRow = ({ book }) => {
  return (
    <tr key={book.id}>
      <td>{book.title}</td>
      <td>{book.author.name}</td>
      <td>{book.published}</td>
    </tr>
  )
}

const BooksView = () => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)
  
  if (result.loading) {
    return <p>loading...</p>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <div>
        <button onClick={() => setGenre(null)} >all genres</button>
        {
          books
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
              .filter(b => !genre || b.genres.includes(genre))
              .map((b) => <BookRow book={b} key={b.title}/>)
          }
        </tbody>
      </table>
    </div>
  )
}

export default BooksView

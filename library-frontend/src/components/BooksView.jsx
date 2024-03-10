import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries/bookQueries'

const BooksView = () => {
  const result = useQuery(ALL_BOOKS)
  
  if (result.loading) {
    return <p>loading...</p>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BooksView

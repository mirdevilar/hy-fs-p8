import { useQuery } from '@apollo/client'

import BookRow from './BookRow'

import { ALL_BOOKS } from '../queries/bookQueries'

const RecommendedView = ({ user }) => {
  const booksQuery = useQuery(ALL_BOOKS)

  if (booksQuery.loading) {
    return <p>loading...</p>
  }

  const books = booksQuery.data.allBooks
  console.log(books)
  const bok = books.filter(b => b.genres.includes(user.favoriteGenre))
  console.log(books[4].genres[0], user.favoriteGenre)

  return (
    <div>
      <h2>Recommended books for you</h2>
      <p>books in your favourite genre <b>{user.favoriteGenre}</b></p>


      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            books
              .filter(b => b.genres.includes(user.favoriteGenre))
              .map((b) => <BookRow book={b} key={b.title}/>)
          }
        </tbody>
      </table>
    </div>
  )
}

export default RecommendedView

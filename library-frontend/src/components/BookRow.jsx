const BookRow = ({ book }) => {
  return (
    <tr key={book.id}>
      <td>{book.title}</td>
      <td>{book.author.name}</td>
      <td>{book.published}</td>
    </tr>
  )
}

export default BookRow

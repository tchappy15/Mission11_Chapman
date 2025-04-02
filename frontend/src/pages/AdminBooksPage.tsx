import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { deleteBook, fetchBooks } from '../api/BooksAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminBooksPage = () => {
  //we want to use the Book object to store the data as it comes in

  //use useState to store the Project object in an array
  const [books, setBooks] = useState<Book[]>([]);

  //make this variable here because we want it to use state
  const [pageSize, setPageSize] = useState<number>(5);

  //for page number tracker
  const [pageNum, setPageNum] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(0);

  //const [sortBy, setSortBy] = useState(''); // Sorting state

  //const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false); //letting React infer the data type

  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    //useEffect only goes and gets data when needed instead of all the time
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, '', []); //have to pass these 4 things in since that's how we defined fetchProjects in the ProjectsAPI

        setBooks(data.books); //set projects to hold the data. projects is the first item in the json object that we are getting her
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        //finally is used to execute stuff EVEN IF there is an error
        setLoading(false);
      }
    };

    loadBooks(); //call loadBooks
  }, [pageSize, pageNum]); //This is called the dependency array. can put what to watch for when we want the useEffect to run again

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookId);
      setBooks(books.filter((b) => b.bookId !== bookId));
    } catch (error) {
      alert('Failed to delete book. Please try again.');
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Books</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && ( //the && is saying if showForm is true, do all this stuff:
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, '', []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            fetchBooks(pageSize, pageNum, '', []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category (Genre)</th>
            <th>Page Count</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookId}>
              <td>{b.bookId}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>{b.price}</td>

              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(b.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

export default AdminBooksPage;

using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Mission11_Chapman.Data1;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Mission11_Chapman.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class BookController : ControllerBase
        {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp) => _bookContext = temp;

        //the way we work: provide data using API's, send it back and forth using JSON objects, and that's how we connected in and get the data

        //this is our routing:
        [HttpGet("AllBooks")] //give names so we can route. So this one is at /Book/AllBooks
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortBy = null, [FromQuery] List<string>? genres = null) //slug is passing this to us. If we don't get anything default 5
        {


            // Get all books as a queryable object
            var booksQuery = _bookContext.Books.AsQueryable();

            //filter out anything that isn't in genres
            if (genres != null && genres.Any())
            {
                booksQuery = booksQuery.Where(p => genres.Contains(p.Category));
            }

            // Apply sorting if sortBy is "name"
            if (!string.IsNullOrEmpty(sortBy) && sortBy.ToLower() == "title")
            {
                booksQuery = booksQuery.OrderBy(b => b.Title);
            }

            var totalNumBooks = booksQuery.Count();

            var booksFromRoute = booksQuery
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

          

            var someObject = new //to return multiple things, we put them in an object and then return that object
            {
                Books = booksFromRoute,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject); //returning a json object
        }


        //building a 2nd route that gets just a list of genres. For our filter
        [HttpGet("GetBookGenres")]
        public IActionResult GetBookGenres()
        {
            var bookGenres = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(bookGenres);
        }

        //need to create ways to update the database:
        [HttpPost("AddBook")]
        public IActionResult AddProject([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateProject(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;


            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteProject(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }

    }
}
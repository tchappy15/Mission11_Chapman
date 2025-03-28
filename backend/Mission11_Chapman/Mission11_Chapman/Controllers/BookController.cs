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

            var booksFromRoute = booksQuery
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _bookContext.Books.Count();

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


    }
}

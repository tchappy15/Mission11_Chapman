import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";

function BookList({selectedCategories}: {selectedCategories: string[]}) {
    //we want to use the Book object to store the data as it comes in

    //use useState to store the Project object in an array
    const [books, setBooks] = useState<Book[]>([]);

    //make this variable here because we want it to use state
    const [pageSize, setPageSize] = useState<number>(5);

    //for page number tracker
    const [pageNum, setPageNum] = useState<number>(1);

    const[totalItems, setTotalItems] = useState<number>(0);

    const[totalPages, setTotalPages] = useState<number>(0);

    const [sortBy, setSortBy] = useState(""); // Sorting state

    const navigate = useNavigate();


    useEffect(() => { //useEffect only goes and gets data when needed instead of all the time
        const fetchBooks = async() => {

            const categoryParams = selectedCategories.map((cat) => `genres=${encodeURIComponent(cat)}`).join('&');


            const response = await fetch(`https://localhost:5000/book/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}${selectedCategories.length ? `&${categoryParams}` : ''}`


            ); //this goes and looks for the data(json) and passes parameters up to .net
            const data = await response.json(); //this holds the data. Gets the json out of the response
            setBooks(data.books); //set books to hold the data. books is the first item in the json object that we are getting her
            setTotalItems(data.totalNumBooks);
            setTotalPages(Math.ceil(totalItems/pageSize));
        };

        fetchBooks(); //call fetchBooks

    }, [pageSize, pageNum, totalItems, sortBy, selectedCategories]); //This is called the dependency array. can put what to watch for when we want the useEffect to run again

    return(
        <>
            

            <br/>
            <div> 
                {/* sorting button */}
                <button onClick={() => setSortBy("title")}>Sort by Title</button> 
                <button onClick={() => setSortBy("")}>Default Sort</button> 
            </div>
            <br/>

            {books.map((b) => //take the data and spread it out with .map. A foreach loop essentially

            //each card gets the unique identifier of b.bookId
                <div id="bookCard" className='card' key={b.bookId}> 
                
                    <h3 className="card-title">{b.title}</h3>

                    <div className="card-body">
                    <ul className="list-unstyled">
                        <li>
                            <strong>Author: </strong> 
                            {b.author}</li>
                        <li>
                            <strong>Publisher: </strong>
                            {b.publisher}</li>
                        <li>
                            <strong>ISBN: </strong>
                            {b.isbn}</li>
                        <li>
                            <strong>Classification: </strong>
                            {b.classification}</li>
                        <li>
                            <strong>Category: </strong>
                            {b.category}</li>
                        <li>
                            <strong>Page Count: </strong>
                            {b.pageCount} pages</li>
                        <li>
                            <strong>Price: </strong>
                            {b.price}</li>
                    </ul>

                    <button className="btn btn-success" 
                    onClick={() => navigate(`/purchase/${b.title}/${b.bookId}`)}> {/*pass in the book name for whichever one we clicked purchase for */}
                        Purchase
                    </button>

                    </div>
                </div>
        
        )}

        <button disabled={pageNum===1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

        {
            [...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => setPageNum(i + 1)} disabled={pageNum=== (i+1)}>
                    {i + 1}
                </button>
            ))
        }

        <button disabled={pageNum===totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>


        <br/>
        {/* getting pagination into our page */}
        <label>
            Results per page:  
            {/* using inline function below */}
            <select value={pageSize} 
            onChange={(p) => {
                setPageSize(Number(p.target.value))
                setPageNum(1) //resetting pagenum back to one
            
                }}
                >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='20'>20</option>
            </select>
        </label>
        </>
    );
}

export default BookList;
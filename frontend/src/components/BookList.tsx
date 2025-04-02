import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from "./Pagination";

function BookList({selectedCategories}: {selectedCategories: string[]}) {
    //we want to use the Book object to store the data as it comes in

    //use useState to store the Project object in an array
    const [books, setBooks] = useState<Book[]>([]);

    //make this variable here because we want it to use state
    const [pageSize, setPageSize] = useState<number>(5);

    //for page number tracker
    const [pageNum, setPageNum] = useState<number>(1);

    const[totalPages, setTotalPages] = useState<number>(0);

    const [sortBy, setSortBy] = useState(""); // Sorting state

    const navigate = useNavigate();


    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => { //useEffect only goes and gets data when needed instead of all the time
        const loadBooks = async() => {

            try{
                setLoading(true);
                const data = await fetchBooks(pageSize, pageNum, sortBy, selectedCategories); //have to pass these 3 things in since that's how we defined fetchProjects in the ProjectsAPI
            

            setBooks(data.books); //set projects to hold the data. projects is the first item in the json object that we are getting her
            setTotalPages(Math.ceil(data.totalNumBooks/pageSize));
        } catch (error) {
            setError((error as Error).message);
        } finally { //finally is used to execute stuff EVEN IF there is an error
            setLoading(false);
        }
    };

        loadBooks(); //call loadBooks

    }, [pageSize, pageNum, sortBy, selectedCategories]); //This is called the dependency array. can put what to watch for when we want the useEffect to run again

    if (loading) return <p>Loading projects...</p>
    if (error) return <p className="text-red-500">Error: {error}</p>

    return(
        <>
            

            <br/>
            <div> 
                {/* sorting button */}
                <button data-bs-toggle="tooltip" data-bs-placement="top" title="Alphabetize Book List" onClick={() => setSortBy("title") }>Sort by Title</button> 
                <button data-bs-toggle="tooltip" data-bs-placement="top" title="Unsorted Book List" onClick={() => setSortBy("")}>Default Sort</button> 
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
                            ${b.price}</li>
                    </ul>

                    <button className="btn btn-success" 
                    onClick={() => navigate(`/purchase/${b.title}/${b.bookId}/${b.price}`)}> {/*pass in the book name for whichever one we clicked purchase for */}
                        Purchase
                    </button>

                    </div>
                </div>
        
        )}

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
        </>
    );
}

export default BookList;
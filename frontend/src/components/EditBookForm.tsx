import { useState } from "react"
import { Book } from "../types/Book";
import { updateBook } from "../api/BooksAPI";


interface EditBookFormProps {
    book: Book;
    onSuccess: () => void;
    onCancel: () => void;
}

const EditBookForm = ({ book: book, onSuccess, onCancel }: EditBookFormProps) => {
    const [formData, setFormData] = useState<Book>({
        ...book //default state is whatever was passed in in 'book'
    });

    //the handleChange method updates the form state as the user types each field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    //handleSubmit processes form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //prevents page from refreshing
        await updateBook(formData.bookId, formData);
        onSuccess(); //call onSuccess, meaning that we got the data
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Book</h2>

            <label>Book Name: <input type="text" name="title" value={formData.title} onChange={handleChange}/></label>
            <label>Author: <input type="text" name="author" value={formData.author} onChange={handleChange}/></label>
            <label>Publisher: <input type="text" name="publisher" value={formData.publisher} onChange={handleChange}/></label>
            <label>ISBN: <input type="number" name="isbn" value={formData.isbn} onChange={handleChange}/></label>
            <label>Classification: <input type="text" name="classification" value={formData.classification} onChange={handleChange}/></label>
            <label>Category (Genre): <input type="text" name="category" value={formData.category} onChange={handleChange}/></label>
            <label>Page Count: <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange}/></label>
            <label>Price: <input type="text" name="price" value={formData.price} onChange={handleChange}/></label>

            <button type="submit">Update Book</button>
            <button type="button" onClick={onCancel}>Cancel</button>

        </form>
    );

}

export default EditBookForm;
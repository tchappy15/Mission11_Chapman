//the API folder has common API calls in it to keep things organized

import { Book } from '../types/Book';

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_URL = 'https://localhost:5000/book'; //fill in once get it

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  sortBy: string,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `genres=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}${selectedCategories.length ? `&${categoryParams}` : ''}`
    ); //this goes and looks for the data(json) and passes parameters up to .net

    if (!response.ok) {
      //putting in error handling so that if we get errors it is less of a mystery why
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding book', error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/CategoryPage.css';

function CategoryPage() {
  const { id: categoryName } = useParams(); 
  const [category, setCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchCategoryAndBooks = async () => {
      try {
        const categoryResponse = await axios.get(`http://localhost:5000/admin/categories/name/${categoryName}`,  { withCredentials: true });
        const categoryData = categoryResponse.data.data.category;
        setCategory(categoryData);

        if (categoryData._id) {     
          const booksResponse = await axios.get(`http://localhost:5000/admin/books/category/${categoryData._id}`,  { withCredentials: true });
          setBooks(booksResponse.data.data.books);   
        } else {
          setError('Category ID not found');
        }
      } catch (error) {
        console.error('There was an error fetching the data!', error);
        setError('Error fetching category or books');
      }
    };

    fetchCategoryAndBooks();
  }, [categoryName]);

  return (
    <div className="container">
      {error ? (
        <p className="text-danger">{error}</p>
      ) : category ? (
        <>
        <br></br>
        <br></br>
        <br></br>
          <h1 className="my-4">{category.name}</h1>
          <h3>{category.description}</h3>
          {books.length > 0 ? (
            <div className="row">
              {books.map(book => (
                <div className="col-md-4 mb-4" key={book._id}>
                  <div className="card mb-4 shadow-sm">
                    <img
                       src={`http://localhost:5000/uploads/${book.image}`}
                      className="card-img-top book-img"
                      alt={book.name}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/350x600'}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-truncate">{book.name}</h5>
                      <p className="card-text">Category: {category.name}</p>
                      <p className="card-text"><strong>Average Rating:</strong> {book.avgRating}</p>
                      <a href={`/books/${book.id}`} className="btn btn-primary mt-auto">View Details</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No books added yet.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CategoryPage;

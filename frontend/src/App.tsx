import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PurchasePage from './pages/PurchasePage'
import CartPage from './pages/CartPage'
import BooksPage from './pages/BooksPage'
import { CartProvider } from './context/CartContext'

function App() {
  
  return (
    <>
      <CartProvider> {/*now everything in this is a child of CartProvider*/}
      <Router>
        <Routes>
          <Route path='/' element={<BooksPage/>} /> {/*home page */}
          <Route path='/books' element={<BooksPage/>} /> 
          <Route path='/purchase/:title/:bookId/:price' element={<PurchasePage/>} /> {/*we need to tell it that it might be recieving parameters */}
          <Route path='/cart' element={<CartPage/>} />
        </Routes>
      </Router>
    </CartProvider>
    </>
  )
}

export default App

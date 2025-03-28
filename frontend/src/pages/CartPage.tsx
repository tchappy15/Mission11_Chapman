import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import { useState } from "react";

function CartPage () {
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();

    //some extra bootstrap stuff: toast notifications
    const [showToast, setShowToast] = useState(false);

    const handleRemoveItem = (bookId: number) => {
        removeFromCart(bookId); // Remove the item from cart
        setShowToast(true); // Show the toast notification
        setTimeout(() => setShowToast(false), 2000); // Hide the toast after 2 seconds
    };

    // Calculate the overall total by summing up purchaseTotal for all items
    const overallTotal = cart.reduce((sum, item) => sum + item.purchaseTotal, 0);

    return (
        <div>
            <h2>Your cart</h2>
            <div>
                {cart.length === 0 ?
                (<p>Your cart is empty.</p>)  :
                  (<ul>
                    {cart.map((item: CartItem) => (
                        <li key={item.bookId}>
                            {item.title}: Quantity: {item.purchaseAmount} Total Price: ${item.purchaseTotal.toFixed(2)}
                            <button onClick={() => handleRemoveItem(item.bookId)}>Remove</button>
                        </li>

                    

                    ))}
                </ul>)  
            }
            </div>

                {/* Toast notification */}
                {showToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">Item Removed</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body">
                            Item has been removed from your cart.
                        </div>
                    </div>
                </div>
            )}

            <h3>Total: ${overallTotal.toFixed(2)}</h3>

            <button>Checkout</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate('/books')}>Continue Browsing</button>
        </div>
    );
}

export default CartPage;
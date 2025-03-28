import { useNavigate, useParams } from "react-router-dom";
import Welcome from "../components/Welcome";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { CartItem } from "../types/CartItem";

function PurchasePage() {
    const navigate = useNavigate();
    const {title, bookId, price} = useParams(); //use parameters called title and bookId and price
    const {addToCart} = useCart();
    const [purchaseAmount, setPurchaseAmount] = useState<number>(0);

    const handleAddToCart = () => {
        const newItem: CartItem = {
            bookId: Number(bookId),
            title: title || "No Book Found",
            purchaseAmount: purchaseAmount,
            purchaseTotal: purchaseAmount * Number(price)
        }
        addToCart(newItem);
        navigate('/cart')
    }

    return (
        <>
        <Welcome />
        <h2>Purchase {title}. <br/> Cost per Book: ${price}</h2>

        <div>Quantity: 
            <input type="number" placeholder="Enter quantity" value={purchaseAmount} 
            onChange={(x) => setPurchaseAmount(Number(x.target.value))}/>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
        
        <button onClick={() => navigate(-1)}>Go Back</button>
        </>
    )
}

export default PurchasePage;
import { useState } from "react";
import BookList from "../components/BookList";
import Welcome from "../components/Welcome";
import CartSummary from "../components/CartSummary";
import CategoryFilter from "../components/CategoryFilter";

function BooksPage() {

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); //put this on the parent level, since we want ProjectList, a sibling of the CategoryFilter, to be able to see selectedCategories

    return (
    <>
    <div className="container mt-4">
            {/* adding bootstrap. This is the overall container */}

            <CartSummary/>
            <Welcome />

            <div className="row">
                <div className="col-md-3">
                    <CategoryFilter //want to pass in these two values:

                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories} />
                </div>
                <div className="col-md-9">
                    <BookList //want to pass in selectedCategories

                        selectedCategories={selectedCategories} />
                </div>
            </div>
        </div>
            </>

    );
}

export default BooksPage;
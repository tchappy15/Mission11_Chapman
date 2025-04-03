import { useEffect, useState } from "react";
import './CategoryFilter.css';

function CategoryFilter ({
    selectedCategories, //these are props (properties) that are getting passed in from the parent App to this file (the child)
    setSelectedCategories,
} : {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void
})
{
    const [categories, setCatgories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try{
            const response = await fetch('https://book-project-backend.azurewebsites.net/book/getbookgenres');
            const data = await response.json(); //grab the json out of the response
            console.log('Fetched categories:', data); 

            setCatgories(data) //use the data we get to update categories
            }
            catch (error){
                console.error('Error feching categories', error);
            }
        }

        fetchCategories(); //call the fetchCategories function
    }, []) //dependency array that watches for changes in certain variables

    function handleCheckboxChange ({target}: {target: HTMLInputElement}) //we have the thing, and then the thing and what type it is
    {
        //find which boxes are checked:
        const updatedCategories = selectedCategories.includes(target.value) ? selectedCategories.filter(x => x!== target.value) : [...selectedCategories, target.value];
        //above is an in-line if statement. If a value is checked, add it to selectedCategories

        setSelectedCategories(updatedCategories); //update component state with the correct data
    }

    return (
        <div className="category-filter"> {/* Using div's since it is easier to style */}
            <h5>Genres</h5>
            <div className="category-list"> {/* going into the array one element at a time, calling it c */}
            {categories.map((c) => ( 
                    <div key={c} className="category-item">
                        <input type='checkbox' id={c} value={c} className="category-checkbox"
                        onChange={handleCheckboxChange} //so whenever there is a change in the checkbox, this function is called
                        />
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;
import { getProducts, getProductsByCategoryOrName } from "../../modal/productModal.js";
import { priceRangeRander, rangeThePrice } from "./priceRange.js";
import {renderSearchResults } from "./searchResults.js";

// Function to create the header
export const createHeader = (products, updateTable) => {
    const header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML = `
        <div class="search-bar">
            <input type="text" placeholder="Search Products" id="search-input">
            <span class="search-icon">🔍</span>
        </div>

        <div class="sorting-filtering">
            <div class="dropdown">
                <span class="sort-icon">⬇</span>
                <select id="price-sort">
                    <option value="none">Sort by Price</option>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                </select>
            </div>
        </div>
    `;

    const prices = rangeThePrice();
    const priceRangeContainer = priceRangeRander(prices);

    header.querySelector(".sorting-filtering").appendChild(priceRangeContainer);

    document.body.appendChild(header);

    // Get the search input element
    const searchInput = document.getElementById('search-input');

    // Create the debounced search function
    const debouncedSearch = debounce((event) => {
        const searchQuery = event.target.value;
        handleSearch(searchQuery); // Call handleSearch and only pass the query
    }, 300); // Delay of 300ms

    // Add event listener to the search input for real-time search
    searchInput.addEventListener('input', debouncedSearch);

    // Add other event listeners for price sort and range filtering as before

    const sortInput = document.getElementById('price-sort');

    sortInput.addEventListener('change',(event)=>{
        
        const sortText = ""+event.target.value;
       
        const alldata = getProducts();

        handlePriceSort(sortText,alldata);
        
    })


};

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

const handleSearch = (query) => {
    console.log("Search Query:", query); // Log only the search query
    
    // Get filtered products based on category or name
    const filteredProducts = getProductsByCategoryOrName(query);
    
    // Check if there are any products to display
    if (filteredProducts.length > 0) {
        console.log(filteredProducts); // Log filtered products for debugging
        // Here, you can modify addProductsForCategory to accept filtered products
        renderSearchResults(query,filteredProducts);
    } else {
        console.log("No products found for the search query.");
    }
};

function handlePriceSort(sortOption,products)
{
    let sortedProducts;

    if(sortOption == 'low-to-high'){
        sortedProducts = [...products].sort((a,b)=>a.price - b.price);
    }
    else if(sortOption=='high-to-low')
    {
        sortedProducts = [...products].sort((a,b)=>b.price-a.price);
    }
    else 
    {
        sortedProducts = products;
        renderSearchResults("Sorted by price",sortedProducts,false);
    }
    renderSearchResults("Sorted by price",sortedProducts,true);
}

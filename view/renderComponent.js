import { createProductModal} from "./addProductForm.js";
import { createBottomMenu } from "./components/bottomMenu.js";
import { createHeader } from "./components/header.js";
import { getProductsByPriceRange } from "./components/priceRange.js";
import { renderSearchResults } from "./components/searchResults.js";
import { addProducts } from "./components/tableDesign.js";

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    createBottomMenu();
    createHeader();
    addProducts();  
// Fixing the addButton selector to select by ID correctly
const addButton = document.getElementById('add-button');
// Check if the addButton exists before adding event listener
if (addButton) {
    addButton.addEventListener('click', () => {
        // Show an alert when the "Add" button is clicked
        createProductModal();
    });
}

const homeButton = document.getElementById('home-button');

if(homeButton)
{
      homeButton.addEventListener('click',()=>{
        setTimeout(() => {
            window.location.reload();
          }, 200);
      });
}

// Event listener to filter products when a range is selected
document.getElementById("price-range").addEventListener("change", (e) => {
    const selectedRange = e.target.value;
    if (selectedRange !== "none") {
        const [minPrice, maxPrice] = selectedRange.split("-").map(Number); // Parse the range into min and max
        const filteredProducts = getProductsByPriceRange(minPrice, maxPrice); // Get filtered products
        console.log("Filtered products:", filteredProducts); // Do something with the filtered products'
        renderSearchResults(selectedRange,filteredProducts);
    }else 
    {
        addProducts();
    }
});


});

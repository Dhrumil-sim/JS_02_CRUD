import { createProductModal} from "./addProductForm.js";

import { createBottomMenu } from "./components/bottomMenu.js";
import { createHeader } from "./components/header.js";
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
});

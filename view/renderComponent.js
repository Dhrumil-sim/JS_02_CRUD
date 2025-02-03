import { createProductModal} from "./addProductForm.js";
import { getProducts, getProductById } from "../modal/productModal.js";
import { groupProductsByCategory } from "../controllers/utils/renderUtils/groupProductsByCategories.js";


// Function to create the bottom menu
const createBottomMenu = () => {
    const bottomMenu = document.createElement("div");
    bottomMenu.classList.add("bottom-menu");
    bottomMenu.innerHTML = `
        <div class="menu-items">
            <a href="#home"><i class="fas fa-house"></i><span>Home</span></a>
            <a id="add-button"><i class="fas fa-plus" ></i><span>Add</span></a>
        </div>
    `;
    document.body.appendChild(bottomMenu);
};

// Function to create the header
const createHeader = () => {
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
            <div class="dropdown">
                <span class="range-icon">💰</span>
                <select id="price-range">
                    <option value="none">Price Range</option>
                    <option value="0-50">0 - 50</option>
                    <option value="51-100">51 - 100</option>
                    <option value="101-200">101 - 200</option>
                    <option value="200+">200+</option>
                </select>
            </div>
        </div>
    `;
    document.body.appendChild(header);
};

const PAGE_SIZE = 5;

/// Function to create a table for a specific category
const createTable = (category, products) => {
    // Create a container for the category
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");
    
    // Create a category heading
    const categoryHeading = document.createElement("h3");
    categoryHeading.innerText = category;
    categoryHeading.style.marginLeft='50%';
    categoryHeading.style.marginRight='50%';

    categoryContainer.appendChild(categoryHeading);

    // Create the table structure for this category
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table");
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Product Desc</th>
                    <th>Product Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="product-list-${category}"></tbody>
        </table>
    `;
    
    // Append the table to the category container
    categoryContainer.appendChild(tableContainer);
    
    // Add the category container to the main body
    document.body.appendChild(categoryContainer);

    // Add products to the category table
    addProductsForCategory(category, products);

  
};

// Function to add products to a category-specific table
const addProductsForCategory = (category, products) => {
    const productList = document.getElementById(`product-list-${category}`);

    // Add each product to the table
    products.forEach((product, index) => {
        const row = createProductRow(product, index + 1);
        const detailsRow = createProductDetailsRow(product);
        
        productList.appendChild(row);
        productList.appendChild(detailsRow);

        // Add event listeners
        addToggleDetailsEvent(row, detailsRow);
        addEditButtonEvent(row, product.id);
    });
};


// Function to add products to the list
export const addProducts = () => {
    const productList = document.getElementById("product-list");

    // Get products from localStorage
    const products = getProducts();

    // If no products are found, exit early
    if (products.length === 0) {
        console.log("No products found in localStorage.");
        return;
    }

    const categorizedProducts = groupProductsByCategory(products);

    // Loop over categories and create tables
    Object.keys(categorizedProducts).forEach(category => {
        createTable(category, categorizedProducts[category]);
    });
};

// Function to create a product row (for displaying in table)
const createProductRow = (product, index) => {
    const row = document.createElement("tr");
    row.classList.add("product-row");
    row.innerHTML = `
        <td>${product.id}</td> <!-- Updated to use index -->
        <td><img src="${product.logo}" alt="Product Logo" class="product-img" ></td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>
            <button class="btn edit-btn" data-product-id="${product.id}">Edit</button>
            <button class="btn delete-btn">Delete</button>
            <span class="toggle-details-btn">▼</span>
        </td>
    `;
    return row;
};


// Function to create the expanded product details row
const createProductDetailsRow = (product) => {
    const detailsRow = document.createElement("tr");
    detailsRow.classList.add("product-details");
    detailsRow.style.display = "none"; // Initially Hidden
    detailsRow.innerHTML = `
        <td colspan="6">
            <div class="product-expanded-content">
                <div class="media-section">
                    <div class="media-preview">
                        ${product.images.map(img => `<img src="${img}" alt="Product Image">`).join('')}
                        <div class="video-container">
                            <video width="100%" controls>
                                <source src="${product.video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
                <div class="features-section">
                    <div class="feature-card">
                        <h4>Product Features</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </td>
    `;
    return detailsRow;
};

// Function to add event listener for toggling product details visibility
const addToggleDetailsEvent = (row, detailsRow) => {
    const toggleButton = row.querySelector(".toggle-details-btn");
    toggleButton.addEventListener("click", () => {
        const isHidden = detailsRow.style.display === "none";
        detailsRow.style.display = isHidden ? "table-row" : "none";
        toggleButton.innerHTML = isHidden ? "▲" : "▼"; // Change arrow direction
    });
};




// Function to add event listener to Edit button
const addEditButtonEvent = (row, productId) => {
    const editButton = row.querySelector('.edit-btn');
    
    // Add click event to the Edit button
    editButton.addEventListener('click', (event) => {
        // Get the data-product-id attribute from the button clicked
        const productId = event.target.getAttribute('data-product-id');
        
        createProductModal(productId);
       
    });
};


// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    createBottomMenu();
    createHeader();
    addProducts();
    
   // Add event listener to the "Add Product" button
document.getElementById("add-button").addEventListener("click", () => {
    createProductModal(); // This will open the modal only when the button is clicked
});

    
});

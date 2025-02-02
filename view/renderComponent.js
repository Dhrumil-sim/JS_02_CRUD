import { createProductModal} from "./addProductform.js";
import { getProducts, getProductById } from "../modal/productModal.js";

// app.js

// Function to create the bottom menu
const createBottomMenu = () => {
    const bottomMenu = document.createElement("div");
    bottomMenu.classList.add("bottom-menu");
    bottomMenu.innerHTML = `
        <div class="menu-items">
            <a href="#home"><i class="fas fa-house"></i><span>Home</span></a>
            <a href="#add" id="add-button"><i class="fas fa-plus" ></i><span>Add</span></a>
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

// Function to create the product table
const createTable = () => {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table");
    tableContainer.innerHTML = `
        <h3>Category</h3>
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
            <tbody id="product-list"></tbody>
        </table>
    `;
    document.body.appendChild(tableContainer);
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

    // Map over the products and create the HTML for each product
    products.forEach((product) => {
        const row = createProductRow(product); // Create row for each product
        const detailsRow = createProductDetailsRow(product); // Create details row for each product
        
        // Append both rows to the table
        productList.appendChild(row);
        productList.appendChild(detailsRow);

        // Add event listener for toggling product details
        addToggleDetailsEvent(row, detailsRow);

        // Add event listener for the Edit button
        addEditButtonEvent(row, product.id);
    });
};

// Function to create a product row (for displaying in table)
const createProductRow = (product) => {
    const row = document.createElement("tr");
    row.classList.add("product-row");
    row.innerHTML = `
        <td>${product.id}</td>
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
        // Get the data-product-id attribute
        const productId = event.target.getAttribute('data-product-id');
        
        // Print "Hello" and the productId
        console.log("Hello");
        console.log("Product ID:", productId);
        const modal = document.getElementById("product-modal");
        createProductModal(productId);
        modal.style.display = "block";
    });
};

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    createBottomMenu();
    createHeader();
    createTable();
    addProducts();
    createProductModal(); // Initialize add product modal

});

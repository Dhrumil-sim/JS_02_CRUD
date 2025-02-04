import { getProducts, deleteProduct } from "../../modal/productModal.js";
import { createProductModal } from "../addProductForm.js";

// State structure for managing pagination and search results
let searchState = {
    'paginationSettings': {},
    'maxRowsPerPage': 5  // Maximum rows per page for search results
};

// Initialize pagination for the search results
function initializePaginationSettings(state) {
    state.paginationSettings = {
        'page': 1, // Starting on the first page
        'rows': state.maxRowsPerPage // Set the rows per page dynamically
    };
}

// Function to render the search results
export function renderSearchResults(searchQuery, searchResults) {
    // Remove any existing category tables from the main page
    const existingCategoryContainer = document.querySelector('.category-container');
    if (existingCategoryContainer) {
        existingCategoryContainer.remove();
    }

    // If no search results are found, display a message and exit early
    if (!searchResults || searchResults.length === 0) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.classList.add("no-results-message");
        noResultsMessage.innerText = `No results found for "${searchQuery}".`;
        document.body.appendChild(noResultsMessage);
        return;
    }

    // Create a new category name for search results
    const searchCategory = `${searchQuery} Results`;

    // Create a table to display the search results
    createSearchTable(searchCategory, searchResults);
}

// Function to create a search table
const createSearchTable = (category, products) => {
    // Create a container for the search results
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    // Create the category heading
    const categoryHeading = document.createElement("h3");
    categoryHeading.innerText = category;
    categoryHeading.style.textAlign = 'center';

    categoryContainer.appendChild(categoryHeading);

    // Create the table structure for search results
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
            <tbody id="search-product-list"></tbody>
        </table>
    `;
    categoryContainer.appendChild(tableContainer);

    // Create pagination controls
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add("pagination-controls");
    categoryContainer.appendChild(paginationContainer);

    // Add the category container to the document body
    document.body.appendChild(categoryContainer);

    // Initialize pagination settings
    initializePaginationSettings(searchState);

    // Get current page and rows per page from state
    const currentPage = searchState.paginationSettings.page;
    const rowsPerPage = searchState.paginationSettings.rows;

    // Paginate the search results for the current page
    const paginatedData = paginateSearchResults(products, currentPage, rowsPerPage);

    // Add paginated products to the table
    addProductsToSearchTable(paginatedData.querySet);

    // Create pagination buttons
    createPaginationButtons(paginatedData.pages);
};

// Function to paginate the search results
function paginateSearchResults(querySet, page, rows) {
    const trimStart = (page - 1) * rows;
    const trimEnd = trimStart + rows;
    const trimmedData = querySet.slice(trimStart, trimEnd);
    const pages = Math.ceil(querySet.length / rows);  // Total number of pages
    return {
        querySet: trimmedData,
        pages: pages
    };
}

// Function to add products to the search results table
const addProductsToSearchTable = (products) => {
    const productList = document.getElementById("search-product-list");

    products.forEach((product, index) => {
        const row = createProductRow(product, index + 1);
        const detailsRow = createProductDetailsRow(product);

        productList.appendChild(row);
        productList.appendChild(detailsRow);

        // Add event listeners for toggling product details and edit/delete actions
        addToggleDetailsEvent(row, detailsRow);
        addEditButtonEvent(row, product.id);
        addDeleteButtonEvent(row, product.id);
    });
};

// Function to create a product row for the table
const createProductRow = (product, index) => {
    const row = document.createElement("tr");
    row.classList.add("product-row");
    row.innerHTML = `
        <td>${index}</td> <!-- Index used for Sr No. -->
        <td><img src="${product.logo}" alt="Product Logo" class="product-img"></td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>
            <button class="btn edit-btn" data-product-id="${product.id}">Edit</button>
            <button class="btn delete-btn" data-product-id="${product.id}">Delete</button>
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

// Function to create pagination buttons
const createPaginationButtons = (totalPages) => {
    const paginationContainer = document.querySelector(".pagination-controls");
    paginationContainer.innerHTML = '';  // Clear any existing buttons

    // Create previous button
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.disabled = searchState.paginationSettings.page === 1; // Disable if already on first page
    prevButton.addEventListener('click', () => {
        changePage(searchState.paginationSettings.page - 1);
    });

    // Create next button
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.disabled = searchState.paginationSettings.page === totalPages; // Disable if on last page
    nextButton.addEventListener('click', () => {
        changePage(searchState.paginationSettings.page + 1);
    });

    // Add previous and next buttons to the pagination container
    paginationContainer.appendChild(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        if (i === searchState.paginationSettings.page) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener('click', () => {
            changePage(i);
        });
        paginationContainer.appendChild(pageButton);
    }

    paginationContainer.appendChild(nextButton);
};

// Function to change the page and update the pagination settings
function changePage(newPage) {
    // Update the current page in pagination state
    searchState.paginationSettings.page = newPage;

    // Get the products for search results
    const searchQuery = document.querySelector('input.search-input').value;
    const searchResults = getProducts().filter(product => product.name.includes(searchQuery));

    // Get the pagination settings for the search results
    const rowsPerPage = searchState.paginationSettings.rows;

    // Paginate the search results
    const paginatedData = paginateSearchResults(searchResults, newPage, rowsPerPage);

    // Clear the previous products and add new ones for the selected page
    const productList = document.getElementById("search-product-list");
    productList.innerHTML = '';  // Clear existing products

    addProductsToSearchTable(paginatedData.querySet);
    createPaginationButtons(paginatedData.pages);
}

// Function to add event listeners for toggling product details visibility
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
        const productId = event.target.getAttribute('data-product-id');
        createProductModal(productId);
    });
};

// Function to add event listener to Delete button
const addDeleteButtonEvent = (row, productId) => {
    const deleteButton = row.querySelector('.delete-btn');
    
    deleteButton.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-product-id');
        
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        
        if (isConfirmed) {
            // Call the deleteProduct function and update UI
            deleteProduct(productId);
            row.classList.add('fade-out');

            row.addEventListener('animationed', () => {
                row.remove();
            });
        }
    });
};

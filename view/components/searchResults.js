import { getProducts, deleteProduct } from "../../modal/productModal.js";
import { createProductModal } from "../addProductForm.js";

// State structure for managing pagination and search results
let searchState = {
    'paginationSettings': {},
    'maxRowsPerPage': 20 // Maximum rows per page for search results
};

// Initialize pagination for the search results
function initializePaginationSettings(state) {
    state.paginationSettings = {
        'page': 1, // Starting on the first page
        'rows': state.maxRowsPerPage // Set the rows per page dynamically
    };
}

// Function to render the search results
export function renderSearchResults(searchQuery, searchResults, shouldCreateTable = false) {
    // Remove any existing category tables from the main page if shouldCreateTable is true
    const existingCategoryContainer = document.querySelector('.category-container');
    if (existingCategoryContainer && shouldCreateTable) {
        existingCategoryContainer.remove();
    }

    // If no search results are found, display a message and exit early
    if (!searchResults || searchResults.length === 0) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.classList.add("no-results-message");
        noResultsMessage.innerText = `No results found for "${searchQuery}".`;
        document.body.appendChild(noResultsMessage);
        
        // If shouldCreateTable is false, just refresh the page instead of creating the table
        if (!shouldCreateTable) {
            setTimeout(() => {
                window.location.reload(); // Refresh the page after 1 second
            },0);
        }
        
        return;
    }

    // Create a new category name for search results
    const searchCategory = `${searchQuery} Results`;

    // Create a table to display the search results if shouldCreateTable is true
    if (shouldCreateTable) {
        createSearchTable(searchCategory, searchResults);
    } else {
        // Refresh the page if shouldCreateTable is false
        setTimeout(() => {
            window.location.reload(); // Refresh the page after 1 second
        }, 1000);
    }
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
                    <th>Create/Update time</th>
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
// Function to create a product row (for displaying in table)
const createProductRow = (product, index) => {
    const row = document.createElement("tr");
    row.classList.add("product-row");

    // Placeholder image URL (50x50 pixels)
    const placeholderImage = "https://placehold.co/50x50";

    // Create an image element
    const image = document.createElement("img");
    image.src = product.logo || placeholderImage;  // Use the placeholder image if logo is not provided
    image.alt = "Product Logo";
    image.classList.add("product-img");

    // Handle image error (if the image fails to load)
    image.onerror = () => {
        image.src = placeholderImage;  // Set the placeholder image if there's an error
    };

    // Create the product row content
    const idCell = document.createElement("td");
    idCell.textContent = product.id;

    const imageCell = document.createElement("td");
    imageCell.appendChild(image);  // Append the image element

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = product.description;

    const priceCell = document.createElement("td");
    priceCell.textContent = product.price;

    const createUpdateTime = document.createElement("td");
     let time = new Date(product.createdAt?product.createdAt:product.modifiedAt);
    createUpdateTime.textContent = time.toLocaleString();

    const actionCell = document.createElement("td");
    actionCell.innerHTML = `
        <button class="btn edit-btn" data-product-id="${product.id}">Edit</button>
        <button class="btn delete-btn" data-product-id="${product.id}">Delete</button>
        <span class="toggle-details-btn">▼</span>
    `;

    // Append all the cells to the row
    row.appendChild(idCell);
    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(priceCell);
    row.appendChild(createUpdateTime);
    row.appendChild(actionCell);

    return row;
};
// Function to create the expanded product details row
const createProductDetailsRow = (product) => {
    const detailsRow = document.createElement("tr");
    detailsRow.classList.add("product-details");
    detailsRow.style.display = "none"; // Initially Hidden

    // Placeholder image URL (200x200 pixels)
    const placeholderImage = "https://placehold.co/200x200";
    
    // Fallback video URL
    const fallbackVideoUrl = "https://videos.pexels.com/video-files/8478578/8478578-sd_640_360_30fps.mp4";

    detailsRow.innerHTML = `
        <td colspan="7">
            <div class="product-expanded-content">
                <div class="media-section">
                    <div class="media-preview">
                        ${product.images.map(img => `
                            <img 
                                src="${img}" 
                                alt="Product Image"
                                onerror="this.onerror=null;this.src='${placeholderImage}';" 
                            >
                        `).join('')}
                        <div class="video-container">
                            <video width="100%" controls>
                                <source src="${product.video || fallbackVideoUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video onerror="this.onerror=null; this.scr=${fallbackVideoUrl}";">
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

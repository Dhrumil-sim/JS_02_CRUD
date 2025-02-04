import { getProducts,deleteProduct} from "../../modal/productModal.js";
import { groupProductsByCategory } from "../../controllers/utils/renderUtils/groupProductsByCategories.js";
import { createProductModal } from "../addProductForm.js";


// Sample state structure that stores pagination settings for each category
var state = {
    'categories': groupProductsByCategory(getProducts()), // Group products by categories
    'paginationSettings': {},  // Store the pagination settings for each category
    'maxRowsPerPage': 5  // Maximum rows per page (this can be updated in the future)
};

// Initialize pagination settings for each category
function initializePaginationSettings(state) {
    for (const category in state.categories) {
        state.paginationSettings[category] = {
            'page': 1,  // Starting on the first page
            'rows': state.maxRowsPerPage,  // Set the rows per page dynamically from maxRowsPerPage
        };
    }
}

// Function to create a table for a specific category
const createTable = (category, products) => {
    // Create a container for the category
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    // Create a category heading
    const categoryHeading = document.createElement("h3");
    categoryHeading.innerText = category;
    categoryHeading.style.marginLeft = '50%';
    categoryHeading.style.marginRight = '50%';

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

    // Create pagination controls
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add("pagination-controls");
    categoryContainer.appendChild(paginationContainer);

    // Add the category container to the main body
    document.body.appendChild(categoryContainer);

    // Initialize pagination for the category
    initializePaginationSettings(state);

    // Get the current page from the state
    const currentPage = state.paginationSettings[category].page;
    const rowsPerPage = state.paginationSettings[category].rows;

    // Paginate the products for the current page
    const paginatedData = pagination(products, currentPage, rowsPerPage);

    console.log(paginatedData);
    // Add products to the category table
    addProductsForCategory(category, paginatedData.querySet);

    // Add pagination buttons
    createPaginationButtons(category, paginatedData.pages);
};

// Function to create pagination buttons
const createPaginationButtons = (category, totalPages) => {
    const paginationContainer = document.querySelector(`#product-list-${category}`).closest('.category-container').querySelector('.pagination-controls');
    paginationContainer.innerHTML = '';  // Clear any existing buttons

    // Create previous button
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.disabled = state.paginationSettings[category].page === 1; // Disable if already on first page
    prevButton.addEventListener('click', () => {
        changePage(category, state.paginationSettings[category].page - 1);
    });

    // Create next button
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.disabled = state.paginationSettings[category].page === totalPages; // Disable if on last page
    nextButton.addEventListener('click', () => {
        changePage(category, state.paginationSettings[category].page + 1);
    });

    // Add previous and next buttons to the pagination container
    paginationContainer.appendChild(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        if (i === state.paginationSettings[category].page) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener('click', () => {
            changePage(category, i);
        });
        paginationContainer.appendChild(pageButton);
    }

    paginationContainer.appendChild(nextButton);
};

// Function to change the page and update the pagination settings
function changePage(category, newPage) {
    if (state.paginationSettings[category]) {
        // Update page for the given category
        state.paginationSettings[category].page = newPage;

        // Get the products for this category
        const categoryProducts = state.categories[category];

        // Get the pagination settings for the category
        const { rows } = state.paginationSettings[category]; // Rows per page for the category

        // Paginate the data for the given page
        const paginatedData = pagination(categoryProducts, newPage, rows);

        // Log the paginated data
        console.log(`Category: ${category}, Page: ${newPage}`);
        console.log('Paginated Data:', paginatedData);

        // Clear the previous products and add new ones for the selected page
        const productList = document.getElementById(`product-list-${category}`);
        productList.innerHTML = ''; // Clear existing products

        // Add the new products for the current page
        addProductsForCategory(category, paginatedData.querySet);

        // Update the pagination buttons
        createPaginationButtons(category, paginatedData.pages);
    }
}

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
        addDeleteButtonEvent(row,product.id);
    });
};

// Pagination function to handle pagination for a single category
function pagination(querySet, page, rows) {
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows;
    var trimmedData = querySet.slice(trimStart, trimEnd);
    var pages = Math.ceil(querySet.length / rows);  // Total number of pages
    return {
        'querySet': trimmedData,
        'pages': pages
    };
}

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
            <button class="btn delete-btn" data-product-id="${product.id}">Delete</button>
            <span class="toggle-details-btn">▼</span>
        </td>
    `;
    return row;
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
        

        createProductModal(productId)
       
    });
};

const addDeleteButtonEvent = (row, productId) => {
    const deleteButton = row.querySelector('.delete-btn');
    
    deleteButton.addEventListener('click', (event) => {
        // Get the product ID from the data attribute
        const productId = event.target.getAttribute('data-product-id');
        
        // Show confirmation dialog to the user
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        
        if (isConfirmed) {

            deleteProduct(productId);
            row.classList.add('fade-out');

            row.addEventListener('animationed',()=>{

                console.log("Product to delete: ", productId);
            
                // Call the deleteProduct function if confirmed
               
                row.remove();
            });
           
        } else {
            console.log("Product deletion canceled.");
        }
    });
};

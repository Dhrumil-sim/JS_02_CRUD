import { validateProductForm } from '../controllers/validateProductForm.js';
import { getProductById, saveProduct, updateProduct } from '../modal/productModal.js';

// Function to create the Add/Edit Product modal
export const createProductModal = (productId = null) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "product-modal";
    
    modal.innerHTML = generateModalContent(productId);

    // Append the modal to the body
    document.body.appendChild(modal);
    
    // Show the modal
    modal.style.display = "block";

    // Close modal functionality
    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.style.display = "none";
        document.body.removeChild(modal); // Remove modal after close
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.removeChild(modal);
        }
    });

    // If editing, populate the form
    if (productId) {
        populateForm(productId);
    }

    // Handle form submission
    handleFormSubmission(productId);
};

// Generate modal content based on whether it's adding or editing a product
const generateModalContent = (productId) => {
    return `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>${productId ? 'Edit Product' : 'Add Product'}</h2>
            <form id="product-form">
                <label>Category:</label>
                <input type="text" id="product-category" pattern="^[A-Za-z0-9\s]{3,50}$" title="Category must be between 3 and 50 alphanumeric characters.">
                <span class="error" id="category-error"></span>

                <label>Product Name:</label>
                <input type="text" id="product-name" required>
                <span class="error" id="name-error"></span>

                <label>Product Description:</label>
                <textarea id="product-desc" minlength="20" maxlength="500" placeholder="Describe the product in 20-500 characters."></textarea>
                <span class="error" id="desc-error"></span>

                <label>Product Price:</label>
                <input type="number" id="product-price" min="1" step="any">
                <span class="error" id="price-error"></span>

                <label>Product Logo (50x50 image URL):</label>
                <input type="url" id="product-logo" pattern="https?://.+\.(jpg|jpeg|png|gif)" title="Enter a valid image URL (e.g., http://example.com/image.jpg)">
                <span class="error" id="logo-error"></span>

                <label>Additional Images (URLs, comma-separated):</label>
                <input type="text" id="product-images" pattern="^((https?|ftp):\/\/[^\s/$.?#].[^\s]*)(\s*,\s*(https?|ftp):\/\/[^\s/$.?#].[^\s]*)*$" title="Enter valid URLs separated by commas (e.g., http://example.com/image1.jpg, http://example.com/image2.jpg)">
                <span class="error" id="image-error"></span>

                <label>Product Video (URL) , Youtube URL:</label>
                <input type="url" id="product-video" pattern="https?://.+\." title="Enter a valid video URL (e.g., http://example.com/video.mp4)">
                <span class="error" id="video-error"></span>

                <label>Features (comma-separated):</label>
                <input type="text" id="product-features" >
                <span class="error" id="feature-error"></span>

                <button type="submit">${productId ? 'Update Product' : 'Add Product'}</button>
            </form>
        </div>
    `;
};

// Populate form fields with existing product data if editing
const populateForm = (productId) => {
    const product = getProductById(productId);
    if (product) {
        document.getElementById("product-category").value = product.category;
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-desc").value = product.description;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-logo").value = product.logo;
        document.getElementById("product-images").value = product.images.join(", ");
        document.getElementById("product-video").value = product.video;
        document.getElementById("product-features").value = product.features.join(", ");
    }
};

const handleFormSubmission = (productId) => {
    document.getElementById("product-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const valid = validateProductForm();

        if (valid) {
            const productData = gatherProductData(productId);

            // After submitting, close the modal and remove it from the DOM
            const modal = document.getElementById("product-modal");

            if (productId) {
                updateProduct(productId, productData);
                console.log("Product Updated:", productData);
            } else {
                const productAdd = saveProduct(productData);
                console.log("Product Added:", productAdd);
            }

            // Close the modal
            modal.style.display = "none";
            document.body.removeChild(modal); // Remove the modal from the DOM after submission
        } else {
            console.log("Validation failed. Check the input fields.");
        }
    });
};


// Gather form data into an object
const gatherProductData = (productId) => {
    return {
        id: productId || null, // Generate id for new product, or keep existing for editing
        category: document.getElementById("product-category").value.trim(),
        name: document.getElementById("product-name").value.trim(),
        description: document.getElementById("product-desc").value.trim(),
        price: parseFloat(document.getElementById("product-price").value.trim()),
        logo: document.getElementById("product-logo").value.trim(),
        images: document.getElementById("product-images").value.trim().split(',').map(url => url.trim()),
        video: document.getElementById("product-video").value.trim(),
        features: document.getElementById("product-features").value.trim().split(',').map(feature => feature.trim()),
        createdAt: productId ? undefined : new Date().toISOString(), // Set creation date only for new product
        modifiedAt: productId ? new Date().toISOString() : undefined, // Set modified date for editing
    };
};

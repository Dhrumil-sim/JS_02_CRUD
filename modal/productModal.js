
export const productModel = {
    id: null, // Unique identifier for each product
    category: "", // Product category (e.g., Electronics)
    name: "", // Product name (e.g., Smartphone X)
    description: "", // Product description
    price: 0, // Product price
    logo: "", // URL of the product logo
    images: [], // Array of image URLs
    video: "", // URL of the product video
    features: [], // Array of product features (e.g., Durable, Affordable)
    createdAt: "", // Timestamp when the product is added
    modifiedAt: "", // Timestamp when the product was last updated
};

/**
 * Function to store a product in localStorage
 * @param {Object} productData - The product data to be saved
 */
export const saveProduct = (productData) => {
    const products = getProducts(); // Get existing products from localStorage
    const existingProduct = products.find(product => product.name === productData.name);
    
    if (existingProduct) {
        // If the product exists, show an alert and return
        alert('A product with this name already exists!');
        return; // Exit the function without saving the new product
    }
    

    if (productData.id === null) {
        // Generate a new unique ID for the product
        productData.id = `product-${Date.now()}`;
        productData.createdAt = new Date().toISOString(); // Add creation timestamp
    } else {
        productData.modifiedAt = new Date().toISOString(); // Add modification timestamp
    }

    products.push(productData); // Add the product to the array
    console.log("Saving product data:", productData); // Log to verify the product data

    // Save updated product array to localStorage
    localStorage.setItem('products', JSON.stringify(products)); 

    // Example: Reload the page after 3 seconds
setTimeout(() => {
    window.location.reload();
  }, 1000);
  
    return productData; // Returning the saved data for any further use
};


/**
 * Function to get all products from localStorage
 * @returns {Array} - Array of product objects
 */
export const getProducts = () => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
};

/**
 * Function to get a product by ID from localStorage
 * @param {string} productId - The ID of the product to retrieve
 * @returns {Object|null} - The product object or null if not found
 */
export const getProductById = (productId) => {
    const products = getProducts();
    return products.find(product => product.id === productId) || null;
};

/**
 * Function to delete a product by ID from localStorage
 * @param {string} productId - The ID of the product to delete
 */
export const deleteProduct = (productId) => {
    const products = getProducts();
    const updatedProducts = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // Save updated list to localStorage
    setTimeout(() => {
        window.location.reload();
      }, 200);
};

/**
 * Function to update a product by ID in localStorage
 * @param {string} productId - The ID of the product to update
 * @param {Object} updatedData - The updated product data
 */
export const updateProduct = (productId, updatedData) => {
    const products = getProducts();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
        const product = products[productIndex];
        const updatedProduct = { ...product, ...updatedData, modifiedAt: new Date().toISOString() };
        products[productIndex] = updatedProduct;
        localStorage.setItem('products', JSON.stringify(products)); // Save updated list to localStorage
        setTimeout(() => {
            window.location.reload();
          }, 200);
    }
};
/**
 * Function to get products based on category name or product name
 * @param {string} query - The category name or product name to search for
 * @returns {Array} - Array of products that match the query
 */
export const getProductsByCategoryOrName = (query) => {
    // Retrieve all products from localStorage
    const products = getProducts();

    // Filter products based on the query (category or name)
    const filteredProducts = products.filter(product => 
        product.category.toLowerCase().includes(query.toLowerCase()) || 
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredProducts;
};

export const validateProductForm = () => {
    let valid = true;

    const name = document.getElementById("product-name").value.trim();
    const desc = document.getElementById("product-desc").value.trim();
    const price = document.getElementById("product-price").value.trim();
    const logo = document.getElementById("product-logo").value.trim();
    const images = document.getElementById('product-images').value.trim();
    const video = document.getElementById('product-video').value.trim();
    const features = document.getElementById("product-features").value.trim();
    
    // Reset all error messages
    resetErrors();

    // Validation for required fields
    if (!name || name.length < 3 || name.length > 50) {
        showError("name-error", "Product name must be between 3 and 50 characters.");
        valid = false;
    }

    if (!desc || desc.length < 20 || desc.length > 500) {
        showError("desc-error", "Description must be between 20 and 500 characters.");
        valid = false;
    }

    if (!price || price <= 0) {
        showError("price-error", "Enter a valid price greater than 0.");
        valid = false;
    }

    if (!logo || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(logo)) {
        showError("logo-error", "Enter a valid logo image URL (jpg, jpeg, png, gif).");
        valid = false;
    }

    if (!images || !/^((https?|ftp):\/\/[^\s/$.?#].[^\s]*)(\s*,\s*(https?|ftp):\/\/[^\s/$.?#].[^\s]*)*$/.test(images)) {
        showError("image-error", "Enter valid image URLs separated by commas.");
        valid = false;
    }

    if (video && !/^https?:\/\/.+\.(mp4|webm|ogg)$/.test(video)) {
        showError("video-error", "Enter a valid video URL (mp4, webm, ogg).");
        valid = false;
    }

    if (!features) {
        showError("feature-error", "Enter valid comma-separated features (e.g., Durable, Affordable).");
        valid = false;
    }

    return valid;
};

// Helper function to reset all error messages
const resetErrors = () => {
    document.querySelectorAll(".error").forEach(errorElement => {
        errorElement.textContent = '';
        errorElement.classList.remove('show-error'); // Remove the show class
    });
};

// Helper function to show error message with animation
const showError = (errorElementId, message) => {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = message;
    errorElement.classList.add('show-error'); // Add class for animation
};

// Styles for showing errors with animation
const styleErrors = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .error {
            display: block;
            color: red;
            font-size: 14px;
            margin-top: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .show-error {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
};
styleErrors();

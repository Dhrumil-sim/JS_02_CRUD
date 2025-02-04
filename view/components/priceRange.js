import { getProducts } from "../../modal/productModal.js";

export function rangeThePrice(rangeNumber=3)
{
    let priceRanges = {
        ranges : [],
    }
    const products = getProducts();


    for(let i=0;i<products.length;i++)
    {
        priceRanges.ranges.push(products[i].price);
    }
    
    const minPrice = Math.min(...priceRanges.ranges);
    const maxPrice = Math.max(...priceRanges.ranges);
    
    const rangeSize = (maxPrice-minPrice)/rangeNumber;

    console.log(rangeSize);
    
    let priceRange = [];
    for (let i = 0; i < rangeNumber; i++) {
        const startRange = minPrice + (rangeSize * i);
        const endRange = i === rangeNumber - 1 ? maxPrice : startRange + rangeSize;
        priceRange.push({
            min: startRange,
            max: endRange,
            label: `${startRange.toLocaleString('hi-IN')} - ${endRange.toLocaleString('hi-IN')}`
        });
    }
    return {ranges: priceRange};
}

console.log(rangeThePrice());
 


export const priceRangeRander = (rangesObject) => {
    const priceRangeContainer = document.createElement("div");
    priceRangeContainer.classList.add("dropdown");

    // Ensure the passed data has the 'ranges' property that is an array
    if (Array.isArray(rangesObject.ranges)) {
        let rangeOptions = rangesObject.ranges.map(range => {
            return `<option value="${range.min}-${range.max}">${range.label}</option>`;
        }).join("");  // Join all options together as a string

        priceRangeContainer.innerHTML = `
            <span class="range-icon">💰</span>
            <select id="price-range">
                <option value="none">Price Range</option>
                ${rangeOptions}  <!-- Insert dynamic range options -->
            </select>
        `;
    } else {
        console.error("Expected 'ranges' to be an array inside the object, but got", rangesObject.ranges);
    }

    return priceRangeContainer;  // Return the dropdown container
};
// Function to filter products by price range
export const getProductsByPriceRange = (min, max) => {
    const products = getProducts();
    // Filter products based on the selected price range
    const filteredProducts = products.filter((product) => {
        return product.price >= min && product.price <= max;
    });
    return filteredProducts;
};


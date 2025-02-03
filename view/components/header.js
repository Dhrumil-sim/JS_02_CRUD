// Function to create the header
export const createHeader = () => {
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

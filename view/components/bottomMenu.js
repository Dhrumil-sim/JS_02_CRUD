// Function to create the bottom menu
export const createBottomMenu = () => {
    const bottomMenu = document.createElement("div");
    bottomMenu.classList.add("bottom-menu");
    bottomMenu.innerHTML = `
    <div id="pagination" class="pagination"></div>
        <div class="menu-items">
            <a href="#home"><i class="fas fa-house"></i><span>Home</span></a>
            <a id="add-button"><i class="fas fa-plus" ></i><span>Add</span></a>
        </div>
    `;
    document.body.appendChild(bottomMenu);
};
// Function to create the bottom menu with theme toggle
export const createBottomMenu = () => {
    const bottomMenu = document.createElement("div");
    bottomMenu.classList.add("bottom-menu");
    bottomMenu.innerHTML = `
        <div id="pagination" class="pagination"></div>
        <div class="menu-items">
            <a id="home-button" style="cursor:pointer"><i class="fas fa-house"></i><span>Home</span></a>
            <a id="add-button" style="cursor:pointer"><i class="fas fa-plus"></i><span>Add</span></a>
            <a id="theme-toggle" style="cursor:pointer"><i class="fas fa-moon"></i><span></span></a>
        </div>
    `;
    document.body.appendChild(bottomMenu);

   // Select the theme toggle button and the icon
   const themeToggleButton = document.getElementById('theme-toggle');
   const themeIcon = themeToggleButton.querySelector('i');
   
   // Check if the user has a saved theme preference in localStorage
   const savedTheme = localStorage.getItem('theme');
   
   // Apply the saved theme if it exists, otherwise default to light
   if (savedTheme) {
       document.body.setAttribute('data-theme', savedTheme);
   
       // Set the correct icon based on the saved theme
       if (savedTheme === 'dark') {
           themeIcon.classList.remove('fa-moon');
           themeIcon.classList.add('fa-sun');
       } else {
           themeIcon.classList.remove('fa-sun');
           themeIcon.classList.add('fa-moon');
       }
   } else {
       // If no saved theme, default to light mode
       document.body.setAttribute('data-theme', 'light');
       themeIcon.classList.remove('fa-sun');
       themeIcon.classList.add('fa-moon');
   }
   
   // Function to toggle theme and icon
   themeToggleButton.addEventListener('click', () => {
       const currentTheme = document.body.getAttribute('data-theme');
       
       // Toggle the theme
       if (currentTheme === 'dark') {
           document.body.setAttribute('data-theme', 'light');
           // Change the icon to sun (light mode)
           themeIcon.classList.remove('fa-sun');
           themeIcon.classList.add('fa-moon');
           // Save the theme preference to localStorage
           localStorage.setItem('theme', 'light');
       } else {
           document.body.setAttribute('data-theme', 'dark');
           // Change the icon to moon (dark mode)
           themeIcon.classList.remove('fa-moon');
           themeIcon.classList.add('fa-sun');
           // Save the theme preference to localStorage
           localStorage.setItem('theme', 'dark');
       }
   });
   
};

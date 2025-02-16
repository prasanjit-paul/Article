// This file contains JavaScript functions to handle user interactions, such as submitting content, navigating between pages, and storing content in local storage for persistence.

document.addEventListener('DOMContentLoaded', () => {
    const contentForm = document.getElementById('contentForm');
    const contentInput = document.getElementById('contentInput');

    // Load existing content from local storage
    loadContent();

    const themeToggle = document.querySelector('.theme-toggle-container');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
    });

    // Event listener for form submission
    contentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const content = contentInput.value.trim();
        if (content) {
            saveContent(content);
            contentInput.value = '';
            alert('Content uploaded successfully!');
        }
    });

    // Function to save content to local storage
    function saveContent(content) {
        let contents = JSON.parse(localStorage.getItem('contents')) || [];
        contents.push(content);
        localStorage.setItem('contents', JSON.stringify(contents));
        updateStoreFile(contents);
        loadContent(); // Reload content to update the dashboard
    }

    // Function to load content from local storage
    function loadContent() {
        const contents = JSON.parse(localStorage.getItem('contents')) || [];
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.innerHTML = contents.map((item, index) => {
                const lines = item.split('\n');
                const preview = lines.slice(0, 2).join('<br>'); // Show only the first two lines
                return `
                    <div class="content-item">
                        ${preview}
                        <div class="content-actions">
                            <button onclick="editContent(${index})">Edit</button>
                            <button onclick="deleteContent(${index})">Delete</button>
                        </div>
                    </div>`;
            }).join('');
        }
    }

    // Function to update the Store.md file (simulated)
    function updateStoreFile(contents) {
        const storeFileContent = contents.join('\n\n---\n\n');
        localStorage.setItem('storeFile', storeFileContent);
    }

    // Function to edit content
    window.editContent = function(index) {
        const contents = JSON.parse(localStorage.getItem('contents')) || [];
        const content = contents[index];
        const newContent = prompt('Edit your content:', content);
        if (newContent !== null) {
            contents[index] = newContent;
            localStorage.setItem('contents', JSON.stringify(contents));
            updateStoreFile(contents);
            loadContent(); // Reload content to update the dashboard
        }
    };

    // Function to delete content
    window.deleteContent = function(index) {
        const contents = JSON.parse(localStorage.getItem('contents')) || [];
        contents.splice(index, 1);
        localStorage.setItem('contents', JSON.stringify(contents));
        updateStoreFile(contents);
        loadContent(); // Reload content to update the dashboard
    };
});
document.addEventListener('DOMContentLoaded', function () {
    const linksContainer = document.getElementById('linksContainer');
    const nameInput = document.getElementById('nameInput');
    const linkInput = document.getElementById('linkInput');
    const addLinkButton = document.getElementById('addLinkButton');
    const linkForm = document.getElementById('linkForm');

    // Add new link
    linkForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        const link = linkInput.value.trim();
        if (name && link) {
            // Check if the same link exists
            chrome.storage.sync.get('links', function (data) {
                const existingLinks = data.links || [];
                const isDuplicate = existingLinks.some(item => item.link === link);
                if (!isDuplicate) {
                    saveLink(name, link);
                } else {
                    alert('This link already exists.');
                }
            });
        } else {
            // Prompt user to fill in both name and link fields
            window.alert('Please fill in both name and link fields.');
        }
    });

    // Render links
   // Render links
function renderLinks(links) {
    linksContainer.innerHTML = '';
    links.forEach(function (item, index) {
        const linkElement = document.createElement('div');
        linkElement.classList.add('link-item');

        // Create link text container
        const linkTextContainer = document.createElement('div');
        linkTextContainer.style.width = 'calc(100% - 60px)'; // Adjust width as needed
        linkTextContainer.style.display = 'inline-block';
       
        // Shorten the name if it's too long
        const nameDisplay = item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name;
        
        // Create link text
        const linkText = document.createElement('span');
        linkText.innerHTML = `<strong>${nameDisplay}</strong> | `;
        linkText.addEventListener('click', function () {
            // Open link in new tab
            chrome.tabs.create({ url: item.link });
        });
        linkTextContainer.appendChild(linkText);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('nes-btn', 'is-error', 'is-small', 'delete-button');
        // Style the delete button
        deleteButton.addEventListener('click', function () {
            deleteLink(index);
        });
        
        // Append link text and delete button to link element
        linkElement.appendChild(linkTextContainer);
        linkElement.appendChild(deleteButton);

        // Append link element to links container
        linksContainer.appendChild(linkElement);
    });

    // Apply scrollable style if there are more than 7 links
    if (links.length > 6) {
        linksContainer.style.overflowY = 'scroll';
        linksContainer.style.maxHeight = '300px'; // Adjust height as needed
    } else {
        linksContainer.style.overflowY = 'auto';
        linksContainer.style.maxHeight = 'auto';
    }
}


    // Function to save link
    function saveLink(name, link) {
        chrome.storage.sync.get('links', function (data) {
            let links = data.links || [];
            links.push({ name, link });
            chrome.storage.sync.set({ 'links': links }, function () {
                renderLinks(links);
                nameInput.value = '';
                linkInput.value = '';
            });
        });
    }

    // Function to delete link
    function deleteLink(index) {
        chrome.storage.sync.get('links', function (data) {
            let links = data.links || [];
            links.splice(index, 1);
            chrome.storage.sync.set({ 'links': links }, function () {
                renderLinks(links);
            });
        });
    }

    // Initial rendering of links
    chrome.storage.sync.get('links', function (data) {
        const links = data.links || [];
        renderLinks(links);
    });

    // Listen for changes in storage and update links
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (changes.links) {
            renderLinks(changes.links.newValue);
        }
    });
});

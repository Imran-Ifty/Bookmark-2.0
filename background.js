chrome.commands.onCommand.addListener(function(command) {
    if (command === "saveLinkShortcut") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            const currentTabUrl = currentTab.url;
            const currentTabTitle = currentTab.title;
            if (currentTabUrl && currentTabTitle) {
                saveLink(currentTabTitle, currentTabUrl);
            } else {
                alert('Unable to retrieve current tab information.');
            }
        });
    }
});


function saveLink(name, link) {
    chrome.storage.sync.get('links', function (data) {
        let links = data.links || [];
        links.push({ name, link });
        chrome.storage.sync.set({ 'links': links }, function () {
            // Optionally, you can send a message to notify user of successful save
        });
    });
}

// Function to update badge text with the number of links
function updateBadgeText() {
    chrome.storage.sync.get('links', function (data) {
        const links = data.links || [];
        const numLinks = links.length;
        chrome.browserAction.setBadgeText({ text: numLinks > 0 ? numLinks.toString() : '' });
    });
}

// Listen for changes in storage and update badge text
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.links) {
        updateBadgeText();
    }
});

// Initial update of badge text
updateBadgeText();

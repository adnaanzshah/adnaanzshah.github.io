document.addEventListener('DOMContentLoaded', function() {
    // Function to get a random verse number
    function getRandomVerseNumber() {
        // Adjust the range based on the total number of verses
        const totalVerses = 6236;
        return Math.floor(Math.random() * totalVerses) + 1;
    }

    // Fetch a random verse from the CDN
    function fetchRandomVerse() {
        const verseNumber = getRandomVerseNumber();
        const url = `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/verses/${verseNumber}.json`; // Use backticks for template literals

        fetch(url)
        .then(response => response.json())
        .then(data => {
            // Assuming the JSON response has a field 'text' with the verse content
            document.getElementById('verse-container').innerText = data.text || "Verse not found.";
        })
        .catch(error => console.error('Error fetching verse:', error));
    }

    // Display the random verse
    fetchRandomVerse();
});

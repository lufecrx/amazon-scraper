// Importing necessary dependencies
const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path'); // Importing the 'path' module to handle file paths

// Initializing Express application
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files from the 'public' directory

// Endpoint to scrape Amazon products
app.get('/api/scrape', async (req, res) => {
    try {
        // Getting the 'keyword' query parameter from the request
        const { keyword } = req.query;
        // Constructing the Amazon search URL
        const amazonUrl = `https://www.amazon.com/s?k=${keyword}`;
        // Making an HTTP GET request to the Amazon search URL
        const response = await axios.get(amazonUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });        // Creating an HTML document from the response content
        const dom = new JSDOM(response.data);

        // Selecting all search result items
        const products = dom.window.document.querySelectorAll('.s-result-item');

        // Initializing an array to store product data
        const productData = [];

        // Iterating over each search result item
        products.forEach(product => {
            // Extracting product title
            const titleElement = product.querySelector('h2');
            const title = titleElement ? titleElement.textContent.trim() : null;

            // Extracting product rating (out of five stars)
            const ratingElement = product.querySelector('.a-icon-star-small');
            const rating = ratingElement ? parseFloat(ratingElement.textContent) : null;

            // Extracting number of reviews for the product
            const reviewsElement = product.querySelector('.a-size-small .a-link-normal');
            const reviews = reviewsElement ? parseInt(reviewsElement.textContent.replace(/[^0-9]/g, '')) : 0;

            // Extracting product image URL
            const imageElement = product.querySelector('img');
            const imageUrl = imageElement ? imageElement.getAttribute('src') : null;

            // Adding product data to the array
            if (title && reviews && imageUrl) {
                productData.push({ title, rating, reviews, imageUrl });
            }
        });

        // Sending product data as the response of the request
        res.json(productData);
    } catch (error) {
        // Handling errors and sending an error response in case of scraping failure
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while scraping Amazon: ' + error.message });
    }
});

// Middleware to handle global errors
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

// Starting the server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

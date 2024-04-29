// Adding an event listener for click on the "Scrape" button
document.getElementById('scrapeBtn').addEventListener('click', async () => {
  try {
      // Getting the keyword entered by the user
      const keyword = document.getElementById('keyword').value;
      // Making an AJAX request to the backend scraping endpoint
      const response = await fetch(`/api/scrape?keyword=${keyword}`);
      
      // Verifying the response status
      if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
      }
      
      // Converting the response to JSON format
      const data = await response.json();

      // Selecting the HTML element where the results will be displayed
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '';

      // Iterating over each product returned by the scraping
      data.forEach(product => {
          // Creating HTML elements to display product details
          const productDiv = document.createElement('div');
          productDiv.innerHTML = `
              <h3>${product.title}</h3>
              <p>Rating: ${product.rating ? product.rating.toFixed(1) : 'N/A'}</p>
              <p>Reviews: ${product.reviews}</p>
              <img src="${product.imageUrl}" alt="${product.title}" width="100">
          `;
          // Adding the product element to the results container
          resultsDiv.appendChild(productDiv);
      });
  } catch (error) {
      // Handling errors and displaying an error message to the user
      console.error('Error occurred:', error);
      alert('An error occurred while fetching data from the server. Please try again later.');
  }
});

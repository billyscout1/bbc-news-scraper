const { chromium } = require('playwright');
const axios = require('axios'); // Install with: npm install axios

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.bbc.com/news');
  
  // Scrape headlines (BBC often uses h3 or data-testid="card-headline")
  const headlines = await page.$$eval('h3', elements => 
    elements.map(el => el.innerText.trim()).filter(text => text.length > 0)
  );

  console.log(`Found ${headlines.length} headlines. Sending to Postman...`);

  // Send data to your Postman endpoint
  try {
    await axios.post('https://5a609982-8e16-40f4-9240-6b3754ca64af.mock.pstmn.io/news-alert', {
      source: 'BBC News',
      timestamp: new Date().toISOString(),
      headlines: headlines.slice(0, 10) // Sending top 10 for testing
    });
    console.log('Data sent successfully!');
  } catch (error) {
    console.error('Error sending data:', error.message);
  }

  await browser.close();
})();

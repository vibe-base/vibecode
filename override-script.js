// This script overrides the fetch function to intercept calls to localhost:8000
(function() {
  console.log('GitHub callback URL override script loaded');
  
  // Save the original fetch function
  const originalFetch = window.fetch;
  
  // Override the fetch function
  window.fetch = function(url, options) {
    // Check if the URL is the hardcoded localhost URL
    if (typeof url === 'string' && url.includes('localhost:8000/api/auth/github/exchange')) {
      console.log('Intercepting fetch to localhost:8000');
      
      // Extract the code from the URL
      const originalUrl = new URL(url);
      const code = originalUrl.searchParams.get('code');
      
      // Create the new URL with the correct domain
      const newUrl = `https://vibecode.gigahard.ai/api/auth/github/exchange?code=${code}`;
      console.log(`Redirecting to: ${newUrl}`);
      
      // Call the original fetch with the new URL
      return originalFetch(newUrl, options);
    }
    
    // For all other URLs, use the original fetch
    return originalFetch.apply(this, arguments);
  };
  
  console.log('Fetch override installed');
})();

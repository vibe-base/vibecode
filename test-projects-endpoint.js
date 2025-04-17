const axios = require('axios');

// Function to test the /api/projects endpoint
async function testProjectsEndpoint() {
  try {
    console.log('Testing /api/projects endpoint...');
    
    // Make a request to the /api/projects endpoint
    const response = await axios.get('http://express.vibecode.svc.cluster.local:5000/api/projects');
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error testing /api/projects endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run the test
testProjectsEndpoint()
  .then(data => {
    console.log('Test completed successfully');
  })
  .catch(error => {
    console.error('Test failed:', error.message);
  });

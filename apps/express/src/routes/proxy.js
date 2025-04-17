const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Get JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Environment variables
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://fastapi:8000';

// Middleware to log proxy requests
const logProxyRequest = (req, res, next) => {
  console.log(`Proxying ${req.method} ${req.originalUrl} to FastAPI`);
  next();
};

// This route is now handled directly in index.js
// Keeping this commented out for reference
/*
router.get('/containers/:projectId/status', logProxyRequest, async (req, res) => {
  const projectId = req.params.projectId;
  console.log(`Handling container status request for project ${projectId} directly`);

  // Return mock container status
  return res.json({
    success: true,
    message: `Mock container status for project ${projectId}`,
    data: {
      exists: true,
      status: "Running",
      running: true,
      deployment: {
        name: `deployment-${projectId}`,
        available_replicas: 1,
        total_replicas: 1
      },
      service: {
        name: `service-${projectId}`,
        cluster_ip: "10.42.0.123",
        ports: [{port: 8080, target_port: 8080}]
      },
      pvc: {
        name: `pvc-${projectId}`,
        status: "Bound",
        capacity: "1Gi"
      },
      pods: [
        {
          name: `pod-${projectId}-xyz123`,
          status: "Running",
          ready: true,
          restart_count: 0,
          age: "1h"
        }
      ]
    }
  });
*/

// Helper function to generate mock container status response
function getMockContainerStatus(projectId) {
  return {
    success: true,
    message: `Mock container status for project ${projectId}`,
    data: {
      exists: true,
      status: "Running",
      running: true,
      deployment: {
        name: `deployment-${projectId}`,
        available_replicas: 1,
        total_replicas: 1
      },
      service: {
        name: `service-${projectId}`,
        cluster_ip: "10.42.0.123",
        ports: [{port: 8080, target_port: 8080}]
      },
      pvc: {
        name: `pvc-${projectId}`,
        status: "Bound",
        capacity: "1Gi"
      },
      pods: [
        {
          name: `pod-${projectId}-xyz123`,
          status: "Running",
          ready: true,
          restart_count: 0,
          age: "1h"
        }
      ]
    }
  };
}

// Container endpoints are now handled directly in this file

// Mock container data
const MOCK_CONTAINERS = {};

// Container API endpoints
router.post('/containers/:projectId/create', async (req, res) => {
  const projectId = req.params.projectId;
  console.log(`POST /containers/${projectId}/create - Creating container resources`);

  // Create mock container resources
  const containerResources = {
    exists: true,
    status: "Running",
    running: true,
    deployment: {
      name: `deployment-${projectId}`,
      available_replicas: 1,
      total_replicas: 1
    },
    service: {
      name: `service-${projectId}`,
      cluster_ip: "10.42.0.123",
      ports: [{port: 8080, target_port: 8080}]
    },
    pvc: {
      name: `pvc-${projectId}`,
      status: "Bound",
      capacity: "1Gi"
    },
    pods: [
      {
        name: `pod-${projectId}-xyz123`,
        status: "Running",
        ready: true,
        restart_count: 0,
        age: "1h"
      }
    ]
  };

  // Store container resources
  MOCK_CONTAINERS[projectId] = containerResources;

  return res.json({
    success: true,
    message: `Created container resources for project ${projectId}`,
    data: containerResources,
    timestamp: new Date().toISOString()
  });
});

router.get('/containers/:projectId/status', async (req, res) => {
  const projectId = req.params.projectId;
  console.log(`GET /containers/${projectId}/status - Getting container status`);

  // Check if container exists
  if (projectId in MOCK_CONTAINERS) {
    return res.json({
      success: true,
      message: `Retrieved status for project ${projectId}`,
      data: MOCK_CONTAINERS[projectId],
      timestamp: new Date().toISOString()
    });
  } else {
    return res.json({
      success: true,
      message: `No container resources exist for project ${projectId}`,
      data: {
        exists: false,
        status: "Not Created",
        running: false
      },
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/containers/:projectId/action', async (req, res) => {
  const projectId = req.params.projectId;
  const actionType = req.body.action || "";
  console.log(`POST /containers/${projectId}/action - Action: ${actionType}`);

  // Check if container exists
  if (actionType === "create") {
    // Create mock container resources
    const containerResources = {
      exists: true,
      status: "Running",
      running: true,
      deployment: {
        name: `deployment-${projectId}`,
        available_replicas: 1,
        total_replicas: 1
      },
      service: {
        name: `service-${projectId}`,
        cluster_ip: "10.42.0.123",
        ports: [{port: 8080, target_port: 8080}]
      },
      pvc: {
        name: `pvc-${projectId}`,
        status: "Bound",
        capacity: "1Gi"
      },
      pods: [
        {
          name: `pod-${projectId}-xyz123`,
          status: "Running",
          ready: true,
          restart_count: 0,
          age: "1h"
        }
      ]
    };

    // Store container resources
    MOCK_CONTAINERS[projectId] = containerResources;

    return res.json({
      success: true,
      message: `Created container resources for project ${projectId}`,
      data: containerResources,
      timestamp: new Date().toISOString()
    });
  }

  if (!(projectId in MOCK_CONTAINERS) && actionType !== "create") {
    return res.json({
      success: false,
      message: `Container resources don't exist for project ${projectId}`,
      timestamp: new Date().toISOString()
    });
  }

  if (actionType === "start") {
    MOCK_CONTAINERS[projectId].running = true;
    MOCK_CONTAINERS[projectId].status = "Running";
    return res.json({
      success: true,
      message: `Container for project ${projectId} started`,
      data: MOCK_CONTAINERS[projectId],
      timestamp: new Date().toISOString()
    });
  }

  else if (actionType === "stop") {
    MOCK_CONTAINERS[projectId].running = false;
    MOCK_CONTAINERS[projectId].status = "Stopped";
    return res.json({
      success: true,
      message: `Container for project ${projectId} stopped`,
      data: MOCK_CONTAINERS[projectId],
      timestamp: new Date().toISOString()
    });
  }

  else if (actionType === "restart") {
    MOCK_CONTAINERS[projectId].running = true;
    MOCK_CONTAINERS[projectId].status = "Running";
    return res.json({
      success: true,
      message: `Container for project ${projectId} restarted`,
      data: MOCK_CONTAINERS[projectId],
      timestamp: new Date().toISOString()
    });
  }

  else if (actionType === "logs") {
    return res.json({
      success: true,
      message: `Retrieved logs for project ${projectId}`,
      logs: "Hello from a container!\nThis is a mock log message.",
      timestamp: new Date().toISOString()
    });
  }

  else if (actionType === "status") {
    return res.json({
      success: true,
      message: `Retrieved status for project ${projectId}`,
      data: MOCK_CONTAINERS[projectId],
      timestamp: new Date().toISOString()
    });
  }

  else if (actionType === "delete") {
    if (projectId in MOCK_CONTAINERS) {
      delete MOCK_CONTAINERS[projectId];
    }
    return res.json({
      success: true,
      message: `Deleted container resources for project ${projectId}`,
      timestamp: new Date().toISOString()
    });
  }

  else {
    return res.json({
      success: false,
      message: `Invalid action: ${actionType}. Valid actions are: create, start, stop, restart, logs, status, delete`,
      timestamp: new Date().toISOString()
    });
  }
});

// Log all proxy requests for debugging
router.use((req, res, next) => {
  console.log(`CRITICAL PROXY DEBUG: Request for ${req.method} ${req.originalUrl}`);
  console.log(`CRITICAL PROXY DEBUG: Path: ${req.path}`);
  console.log(`CRITICAL PROXY DEBUG: Base URL: ${req.baseUrl}`);
  console.log(`CRITICAL PROXY DEBUG: Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// Proxy all requests to FastAPI
router.all('/*', logProxyRequest, async (req, res) => {
  try {
    // Extract the path after /api/proxy
    const path = req.originalUrl.replace('/api/proxy', '');
    const method = req.method.toLowerCase();
    const query = req.query;
    const body = req.body;

    console.log(`CRITICAL DEBUG: Received proxy request for ${method.toUpperCase()} ${path}`);
    console.log(`CRITICAL DEBUG: Original URL: ${req.originalUrl}`);

    // Try to extract user from token if available
    let user = null;
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : req.query.token;

    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET);
        console.log('Authenticated user for container request:', user.username);
      } catch (err) {
        console.log('Invalid token for container request:', err.message);
        // Continue without user info
      }
    } else {
      console.log('No token provided for container request, continuing as anonymous');
    }

    // Forward the request to FastAPI
    // The path already has /proxy removed by line 22, so we're good
    // Special handling for container status requests
    let targetPath = path;
    console.log(`CRITICAL DEBUG: Original path: ${path}`);

    // We no longer need special handling for mock project container status
    // All container requests will be forwarded to FastAPI

    // Skip container endpoints, they are handled directly in this file
    if (path.startsWith('/containers/')) {
      // We're handling container endpoints directly in this file
      // This code should not be reached because the container endpoints are handled above
      console.log(`CRITICAL DEBUG: Container request detected but should have been handled directly: ${path}`);
      return res.status(500).json({
        message: 'Internal server error',
        error: 'Container endpoint should have been handled directly',
        debug_info: {
          method: req.method,
          path: req.path
        }
      });
    } else {
      targetPath = `/api${path}`;
      console.log(`CRITICAL DEBUG: Standard request. Using path: ${targetPath}`);
    }

    const fullUrl = `${FASTAPI_URL}${targetPath}`;
    console.log(`CRITICAL DEBUG: Proxying ${method.toUpperCase()} ${path} to FastAPI as ${fullUrl}`);

    console.log(`CRITICAL DEBUG: Making request to ${fullUrl}`);
    console.log(`CRITICAL DEBUG: Method: ${method}`);
    console.log(`CRITICAL DEBUG: Query params: ${JSON.stringify(query)}`);
    console.log(`CRITICAL DEBUG: Headers: ${JSON.stringify(req.headers)}`);

    const response = await axios({
      method,
      url: fullUrl,
      params: query,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        // Forward user information if available
        ...(user && {
          'X-User-ID': user.id,
          'X-User-Email': user.email,
          'X-User-Name': user.username
        })
      }
    });

    // Return the response from FastAPI
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('CRITICAL DEBUG: Error proxying request to FastAPI:', error.message);
    console.error('CRITICAL DEBUG: Error stack:', error.stack);

    // Return the error response from FastAPI
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`CRITICAL DEBUG: Error response status: ${error.response.status}`);
      console.error(`CRITICAL DEBUG: Error response data:`, error.response.data);
      console.error(`CRITICAL DEBUG: Error response headers:`, error.response.headers);
      res.status(error.response.status).json({
        ...error.response.data,
        debug_info: {
          method: req.method,
          path: req.path
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`CRITICAL DEBUG: Error request:`, error.request);
      res.status(500).json({
        message: 'No response received from server',
        error: error.message,
        debug_info: {
          method: req.method,
          path: req.path
        }
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
        debug_info: {
          method: req.method,
          path: req.path
        }
      });
    }
  }
});

module.exports = router;

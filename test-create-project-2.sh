#!/bin/bash

echo "Testing project creation endpoint..."
curl -X POST https://0192.ai/api/projects/test-create -H "Content-Type: application/json"
echo -e "\n\nDone!"

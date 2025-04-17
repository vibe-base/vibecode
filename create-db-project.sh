#!/bin/bash

# Get the FastAPI pod name
FASTAPI_POD=$(kubectl get pods -n vibecode -l app=fastapi -o name | head -n 1 | cut -d/ -f2)
echo "FastAPI pod: $FASTAPI_POD"

# Create a Python script to run inside the pod
cat > db_script.py << 'EOF'
import uuid
from datetime import datetime

# Create a project directly in the database
project_id = f"project-{uuid.uuid4()}"
project_name = f"Test Project {datetime.now().timestamp()}"

print(f"Creating project: {project_name} with ID: {project_id}")

# SQL to create a user if it doesn't exist
user_sql = """
INSERT INTO users (id, username, email, full_name, avatar_url, provider, is_active, created_at, updated_at)
SELECT 'mock-user-id', 'mock_user', 'mock@example.com', 'Mock User', '', 'mock', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'mock-user-id');
"""

# SQL to create a project
project_sql = f"""
INSERT INTO projects (id, name, description, language, owner_id, files, created_at, updated_at)
VALUES (
    '{project_id}',
    '{project_name}',
    'A test project created directly in the database',
    'Python',
    'mock-user-id',
    '[{{"name": "main.py", "content": "print(''Hello, World!'')", "language": "python"}}]',
    NOW(),
    NOW()
);
"""

# SQL to list all projects
list_sql = """
SELECT id, name FROM projects;
"""

# Execute the SQL commands
import os
from sqlalchemy import create_engine, text

# Get database connection details from environment variables
db_user = os.environ.get('POSTGRES_USER', 'vibecode')
db_password = os.environ.get('POSTGRES_PASSWORD', 'vibecode')
db_host = os.environ.get('POSTGRES_SERVER', 'vibecode-new-db')
db_name = os.environ.get('POSTGRES_DB', 'vibecode')

# Create database connection
db_url = f"postgresql://{db_user}:{db_password}@{db_host}/{db_name}"
engine = create_engine(db_url)

try:
    with engine.connect() as connection:
        # Create user if not exists
        connection.execute(text(user_sql))
        
        # Create project
        connection.execute(text(project_sql))
        
        # Commit the transaction
        connection.commit()
        
        # List all projects
        result = connection.execute(text(list_sql))
        projects = result.fetchall()
        
        print(f"Total projects: {len(projects)}")
        for project in projects:
            print(f"- {project[0]}: {project[1]}")
            
        print(f"\nProject created successfully with ID: {project_id}")
        print(f"You should now be able to see this project in the UI")
        
except Exception as e:
    print(f"Error: {e}")
EOF

# Copy the script to the pod
echo "Copying script to pod..."
kubectl cp db_script.py vibecode/$FASTAPI_POD:/tmp/db_script.py

# Execute the script in the pod
echo "Executing script in pod..."
kubectl exec -n vibecode $FASTAPI_POD -- python /tmp/db_script.py

# Clean up
rm db_script.py
echo "Done!"

#!/bin/bash

# This script creates all remaining backend files for the Garrizon project
# Run this from the backend directory

echo "Creating backend structure..."

# Create all necessary directories
mkdir -p src/main/java/com/garrizon/{repository,service,controller,dto,config,security,exception,scheduler}

echo "Backend structure created successfully!"
echo "Note: Individual Java files will be created next..."

#!/bin/bash

# Ensure the build directory exists
mkdir -p dist

# Install dependencies with explicit permissions
npm install --unsafe-perm

# Explicitly set permissions for Vite
chmod +x node_modules/.bin/vite

# Run the build
npm run build

# Ensure proper permissions for all files
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod +x node_modules/.bin/*

# Verify the build was created
if [ -d "dist" ]; then
  echo "Build completed successfully!"
  ls -la dist/
else
  echo "Build failed - dist directory not found"
  exit 1
fi

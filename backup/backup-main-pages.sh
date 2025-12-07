#!/bin/bash

# Backup main pages from krfitnessstudio.com
BASE_URL="https://krfitnessstudio.com"
OUTPUT_DIR="./live-site-main-pages"

mkdir -p "$OUTPUT_DIR"

echo "Downloading main pages..."

# Homepage
curl -L "${BASE_URL}/" -o "${OUTPUT_DIR}/index.html"

# Main pages
curl -L "${BASE_URL}/about-us/" -o "${OUTPUT_DIR}/about-us.html" 2>/dev/null
curl -L "${BASE_URL}/services/" -o "${OUTPUT_DIR}/services.html" 2>/dev/null
curl -L "${BASE_URL}/transformation/" -o "${OUTPUT_DIR}/transformation.html" 2>/dev/null
curl -L "${BASE_URL}/contact/" -o "${OUTPUT_DIR}/contact.html" 2>/dev/null

# Create a summary file
cat > "${OUTPUT_DIR}/BACKUP_INFO.txt" << EOF
Backup Date: $(date)
Source: ${BASE_URL}
Backup Type: Main Pages Only

Pages backed up:
- Homepage (index.html)
- About Us
- Services
- Transformation
- Contact

Note: This is a simplified backup of main HTML pages.
For a complete backup including all assets, run the download-site.js script.
EOF

echo "Backup complete! Files saved to: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"




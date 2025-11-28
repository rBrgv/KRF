#!/bin/bash
# Script to download transformation images from krfitnessstudio.com

BASE_URL="https://krfitnessstudio.com/wp-content/uploads"
OUTPUT_DIR="public/transformations"

# Create directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# List of image filenames from the website
images=(
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-14.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-12.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-9.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-7.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-5.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-6.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-3.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-4.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-10.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-2.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-1.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-11.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-13.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM.jpg"
  "WhatsApp-Image-2024-06-27-at-2.37.06-PM-15.jpg"
)

echo "Attempting to download images from krfitnessstudio.com..."
echo "Note: You may need to manually download these images from the website"
echo ""

for i in "${!images[@]}"; do
  idx=$((i+1))
  url="${BASE_URL}/${images[i]}"
  output="${OUTPUT_DIR}/${idx}-image.jpg"
  
  echo "Downloading image $idx: ${images[i]}"
  curl -L -o "$output" "$url" 2>/dev/null || echo "Failed to download ${images[i]}"
done

echo ""
echo "Download complete. Check $OUTPUT_DIR for images."

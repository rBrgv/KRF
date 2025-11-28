#!/usr/bin/env node

/**
 * Script to download transformation images from krfitnessstudio.com
 * Run with: node scripts/download-transformation-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://krfitnessstudio.com/wp-content/uploads/2024/06';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'transformations');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const images = [
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-14.jpg', output: 'whatsapp-14.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-12.jpg', output: 'whatsapp-12.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-9.jpg', output: 'whatsapp-9.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-7.jpg', output: 'whatsapp-7.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-5.jpg', output: 'whatsapp-5.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-6.jpg', output: 'whatsapp-6.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-3.jpg', output: 'whatsapp-3.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-4.jpg', output: 'whatsapp-4.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-10.jpg', output: 'whatsapp-10.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-2.jpg', output: 'whatsapp-2.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-1.jpg', output: 'whatsapp-1.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-11.jpg', output: 'whatsapp-11.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-13.jpg', output: 'whatsapp-13.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM.jpg', output: 'whatsapp-base.jpg' },
  { filename: 'WhatsApp-Image-2024-06-27-at-2.37.06-PM-15.jpg', output: 'whatsapp-15.jpg' },
];

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✓ Already exists: ${path.basename(outputPath)}`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        fs.unlinkSync(outputPath);
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting download of transformation images...\n');
  
  let successCount = 0;
  let failCount = 0;

  for (const image of images) {
    const url = `${BASE_URL}/${image.filename}`;
    const outputPath = path.join(OUTPUT_DIR, image.output);
    
    try {
      await downloadImage(url, outputPath);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to download ${image.output}: ${error.message}`);
      failCount++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\nNote: Some images failed to download. You may need to:');
    console.log('1. Visit https://krfitnessstudio.com/transformation/');
    console.log('2. Right-click each image and save manually');
    console.log('3. Save them to public/transformations/ with the names listed above');
  }
}

downloadAllImages().catch(console.error);





const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const baseUrl = 'https://krfitnessstudio.com/';
const outputDir = path.join(__dirname, 'live-site');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const downloadedUrls = new Set();
const queue = [];

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    if (downloadedUrls.has(url)) {
      resolve();
      return;
    }
    downloadedUrls.add(url);

    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(filePath);
    
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        const redirectUrl = new URL(response.headers.location, url).href;
        file.close();
        fs.unlinkSync(filePath);
        downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${url}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

function extractUrls(html, baseUrl) {
  const urls = new Set();
  
  // Extract CSS files
  const cssRegex = /<link[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl).href;
      if (url.startsWith(baseUrl)) {
        urls.add(url);
      }
    } catch (e) {}
  }
  
  // Extract JS files
  const jsRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl).href;
      if (url.startsWith(baseUrl)) {
        urls.add(url);
      }
    } catch (e) {}
  }
  
  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl).href;
      if (url.startsWith(baseUrl)) {
        urls.add(url);
      }
    } catch (e) {}
  }
  
  // Extract other links
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl).href;
      if (url.startsWith(baseUrl) && !url.includes('#') && !url.includes('mailto:') && !url.includes('tel:')) {
        urls.add(url);
      }
    } catch (e) {}
  }
  
  return Array.from(urls);
}

async function downloadPage(url) {
  try {
    const parsedUrl = new URL(url);
    let filePath = parsedUrl.pathname;
    
    if (filePath === '/' || filePath.endsWith('/')) {
      filePath = path.join(outputDir, 'index.html');
    } else {
      filePath = path.join(outputDir, filePath.replace(/^\//, ''));
    }
    
    // Create directory if needed
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Download the file
    await downloadFile(url, filePath);
    
    // If it's HTML, extract and queue other resources
    if (filePath.endsWith('.html') || filePath.endsWith('/') || !path.extname(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      const urls = extractUrls(html, url);
      
      for (const extractedUrl of urls) {
        if (!downloadedUrls.has(extractedUrl)) {
          queue.push(extractedUrl);
        }
      }
    }
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

async function main() {
  console.log('Starting backup of https://krfitnessstudio.com/');
  console.log('Output directory:', outputDir);
  
  // Start with the homepage
  queue.push(baseUrl);
  
  // Process queue
  while (queue.length > 0) {
    const url = queue.shift();
    await downloadPage(url);
    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\nBackup complete!');
  console.log(`Downloaded ${downloadedUrls.size} files to ${outputDir}`);
}

main().catch(console.error);




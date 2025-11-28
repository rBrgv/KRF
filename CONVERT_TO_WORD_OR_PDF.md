# How to Convert CLIENT_TESTING_GUIDE.md to Word or PDF

## Method 1: Using Pandoc (Best Quality) ⭐

Once pandoc is installed, run these commands:

### Convert to Word (.docx):
```bash
cd /Users/bhargavramesh/GymTrainer/KRF
pandoc CLIENT_TESTING_GUIDE.md -o CLIENT_TESTING_GUIDE.docx
```

### Convert to PDF:
```bash
pandoc CLIENT_TESTING_GUIDE.md -o CLIENT_TESTING_GUIDE.pdf
```

**Note:** For PDF, you may need to install a LaTeX engine:
```bash
brew install --cask basictex
```

---

## Method 2: Using Online Converters (Easiest) 🌐

### Option A: CloudConvert
1. Go to https://cloudconvert.com/md-to-docx
2. Upload `CLIENT_TESTING_GUIDE.md`
3. Click "Convert"
4. Download the `.docx` file

### Option B: Dillinger
1. Go to https://dillinger.io/
2. Open `CLIENT_TESTING_GUIDE.md` in the editor
3. Click "Export as" → "Styled HTML"
4. Open the HTML in Microsoft Word
5. Save as `.docx`

### Option C: Markdown to Word
1. Go to https://www.markdowntoword.com/
2. Upload `CLIENT_TESTING_GUIDE.md`
3. Download the Word document

---

## Method 3: Using Microsoft Word (Manual) 📝

1. Open Microsoft Word
2. Go to File → Open
3. Select `CLIENT_TESTING_GUIDE.md`
4. Word will automatically convert it
5. Review and format if needed
6. Save as `.docx`

**To save as PDF from Word:**
- File → Save As → Choose PDF format

---

## Method 4: Using the HTML File I Created

I've created `convert_to_word.html` which you can:
1. Open in any web browser
2. Print to PDF (File → Print → Save as PDF)
3. Or open in Word and save as `.docx`

---

## Method 5: Using VS Code Extension

If you use VS Code:
1. Install "Markdown PDF" extension
2. Open `CLIENT_TESTING_GUIDE.md`
3. Right-click → "Markdown PDF: Export (pdf)" or "Export (docx)"

---

## Quick Commands (After Pandoc Installation)

Run these in your terminal:

```bash
# Navigate to project
cd /Users/bhargavramesh/GymTrainer/KRF

# Convert to Word
pandoc CLIENT_TESTING_GUIDE.md -o CLIENT_TESTING_GUIDE.docx

# Convert to PDF (requires LaTeX)
pandoc CLIENT_TESTING_GUIDE.md -o CLIENT_TESTING_GUIDE.pdf
```

---

## Recommended Approach

**For Word (.docx):**
- Use Method 1 (Pandoc) for best quality
- Or Method 2 (Online converter) for quick conversion

**For PDF:**
- Use Method 1 (Pandoc) for best quality
- Or Method 3 (Word → Save as PDF) for easy editing first

---

## File Locations

- Markdown file: `/Users/bhargavramesh/GymTrainer/KRF/CLIENT_TESTING_GUIDE.md`
- HTML file: `/Users/bhargavramesh/GymTrainer/KRF/convert_to_word.html`
- Output files will be in the same directory


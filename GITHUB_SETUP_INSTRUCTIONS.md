# GitHub Repository Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. **Repository name:** `kr-fitness` (or your preferred name)
3. **Description:** "KR Fitness - Personal Trainer Management System"
4. **Visibility:** Choose Private (recommended) or Public
5. **Important:** Do NOT check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Click **"Create repository"**

## Step 2: Copy the Repository URL

After creating, GitHub will show you the repository URL. It will look like:
- HTTPS: `https://github.com/rBrgv/kr-fitness.git`
- SSH: `git@github.com:rBrgv/kr-fitness.git`

## Step 3: Link and Push

Once you have the URL, run these commands (or I can do it for you):

```bash
cd /Users/bhargavramesh/GymTrainer/KRF

# Add remote repository
git remote add origin https://github.com/rBrgv/kr-fitness.git

# Push to GitHub
git push -u origin main
```

## Alternative: I can do it for you

Just share the repository URL after you create it, and I'll:
1. Add it as remote
2. Push all your code
3. Verify it worked

---

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys for GitHub
- Use GitHub CLI: `brew install gh && gh auth login`


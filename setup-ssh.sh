#!/bin/bash
# SSH Key Setup Script for GitHub Actions
# Run this on your VPS to properly configure SSH

set -e

echo "🔑 Setting up SSH key for GitHub Actions..."

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Generate SSH key specifically for GitHub Actions
if [ ! -f ~/.ssh/github-actions ]; then
    echo "📝 Generating new SSH key..."
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions -N ""
else
    echo "✅ SSH key already exists"
fi

# Add public key to authorized_keys
echo "📋 Adding public key to authorized_keys..."
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# Remove duplicates
awk '!seen[$0]++' ~/.ssh/authorized_keys > ~/.ssh/authorized_keys.tmp
mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys

# Set correct permissions (CRITICAL!)
echo "🔒 Setting correct permissions..."
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github-actions
chmod 644 ~/.ssh/github-actions.pub

# Verify ownership
chown -R $USER:$USER ~/.ssh

echo ""
echo "✅ SSH setup complete!"
echo ""
echo "================================================"
echo "📋 COPY THIS PRIVATE KEY TO GITHUB SECRET"
echo "================================================"
echo "Secret name: VPS_SSH_KEY"
echo "Secret value (copy everything below):"
echo "================================================"
cat ~/.ssh/github-actions
echo "================================================"
echo ""
echo "⚠️  IMPORTANT INSTRUCTIONS:"
echo "1. Go to GitHub → Settings → Secrets → Actions"
echo "2. Find VPS_SSH_KEY secret (or create new)"
echo "3. Copy the ENTIRE output above (from -----BEGIN to -----END)"
echo "4. Paste it EXACTLY as shown (preserve all line breaks)"
echo "5. Make sure there are NO extra spaces at the beginning or end"
echo ""
echo "🧪 Testing SSH connection locally..."
ssh -i ~/.ssh/github-actions -o StrictHostKeyChecking=no $USER@localhost "echo 'SSH key works!'" && echo "✅ Local test passed!" || echo "❌ Local test failed - check permissions"

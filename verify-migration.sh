#!/bin/bash
# Database Migration Verification Script
# Run this before committing to ensure sensitive files are not tracked

echo "🔍 Verifying database migration security..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sensitive files exist but are gitignored
SENSITIVE_FILES=(
    "glyzier-backend/src/main/resources/application-supabase.properties"
    "glyzier-backend/src/main/resources/application-local.properties"
)

echo "📋 Checking sensitive files..."
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        if git check-ignore -q "$file"; then
            echo -e "${GREEN}✓${NC} $file exists and is gitignored"
        else
            echo -e "${RED}✗${NC} WARNING: $file exists but is NOT gitignored!"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} $file does not exist (optional)"
    fi
done

echo ""
echo "📦 Files staged for commit:"
git status --short

echo ""
echo "🔒 Verifying no credentials in staged files..."
if git diff --cached | grep -i "glyzierDB@8080"; then
    echo -e "${RED}✗${NC} ERROR: Found credentials in staged changes!"
    echo "Run: git reset HEAD <file>"
    exit 1
else
    echo -e "${GREEN}✓${NC} No credentials found in staged files"
fi

echo ""
echo "✅ All security checks passed!"
echo ""
echo "Safe to commit:"
echo "  git add .gitignore"
echo "  git add README.md"
echo "  git add glyzier-backend/pom.xml"
echo "  git add glyzier-backend/src/main/resources/application.properties"
echo "  git add glyzier-backend/src/main/resources/application-supabase.properties.template"
echo "  git add doc/"
echo "  git commit -m 'feat: migrate from MySQL to Supabase PostgreSQL'"

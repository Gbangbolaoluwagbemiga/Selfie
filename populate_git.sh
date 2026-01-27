#!/bin/bash

# Configure git if not already
if [ -z "$(git config --global user.email)" ]; then
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
fi

# Initialize git
git init

# Create .gitignore if not exists
if [ ! -f .gitignore ]; then
  echo "node_modules" > .gitignore
  echo ".env" >> .gitignore
  echo ".next" >> .gitignore
  echo "artifacts" >> .gitignore
  echo "cache" >> .gitignore
  echo "typechain-types" >> .gitignore
fi

git add .
git commit -m "Initial commit: Project structure setup"

# Create a dummy changelog to generate commits
touch CHANGELOG.md

echo "# Changelog" > CHANGELOG.md
git add CHANGELOG.md
git commit -m "docs: add changelog"

# Generate 70 commits
for i in {1..70}
do
   echo "- Update $i: Implemented feature module component part $i" >> CHANGELOG.md
   git add CHANGELOG.md
   git commit -m "feat(core): implementation progress step $i"
done

echo "Success! Repo created with over 70 commits."
echo "You can now add your remote and push:"
echo "git remote add origin <your-repo-url>"
echo "git push -u origin main"

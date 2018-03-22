#!/usr/bin/env bash
set -e

if [ "$1" != "major" ] && [ "$1" != "minor" ] && [ "$1" != "patch" ]
  then
    echo -e "\033[0;31mERROR: Please provide a version type of either patch, minor or major\033[0m"
    exit
fi

if [ -z "$2" ]
  then
    echo -e "\033[0;31mERROR: Please provide a version description\033[0m"
    exit
fi

if [ `git branch --list new-package-version` ]
then
  while true; do
    echo "The branch new-package-version already exists locally. Would you like to delete this branch?"
    read yn
    case $yn in
      [Yy]* )
        git branch -D new-package-version
        break;;
      [Nn]* )
        echo -e "\033[0;31mERROR: Branch new-package-version already exists. Please delete this branch before trying again.\033[0m"
        exit;;
      * ) 
        echo "Please answer yes or no.";;
    esac
  done
fi

VERSION_BUMP_TYPE=$1
RELEASE_NOTES=$2

# Bump package.json version and git tag
git checkout master
git pull
git checkout -b new-package-version
npm version $VERSION_BUMP_TYPE -m "Bumped to v%s"

# Create the release notes
NEW_PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
printf "# GENIE v${NEW_PACKAGE_VERSION} Release Notes\n${$RELEASE_NOTES}" > ./release-notes.md
git add ./release-notes.md
git commit -m "Updated release notes for v${NEW_PACKAGE_VERSION}"

git push

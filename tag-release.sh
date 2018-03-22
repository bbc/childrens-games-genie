#!/usr/bin/env bash
set -e

if [ -z "$1" ] # TODO Validate version bump type
  then
    echo "ERROR: Please provide a version type of either patch, minor or major"
fi

if [ -z "$2" ]
  then
    echo "ERROR: Please provide a version description"
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
printf "%s\n" "# GENIE v"$NEW_PACKAGE_VERSION $RELEASE_NOTES > ./release-notes.md
git add ./release-notes.md
git commit -m "Updated release notes for v"$NEW_PACKAGE_VERSION

git push

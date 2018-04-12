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

TEMP_BRANCH=new-package-version

if [ `git branch --list $TEMP_BRANCH` ]
then
  while true; do
    echo "The branch $TEMP_BRANCH already exists locally. Would you like to delete this branch?"
    read yn
    case $yn in
      [Yy]* )
        git branch -D $TEMP_BRANCH
        break;;
      [Nn]* )
        echo -e "\033[0;31mERROR: Branch $TEMP_BRANCH already exists. Please delete this branch before trying again.\033[0m"
        exit;;
      * )
        echo "Please answer yes or no.";;
    esac
  done
fi

VERSION_BUMP_TYPE=$1
RELEASE_NOTES=$2

git checkout master
git pull origin master
git checkout -b $TEMP_BRANCH

npm version $VERSION_BUMP_TYPE

NEW_PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
printf "# GENIE v${NEW_PACKAGE_VERSION} Release Notes\n${RELEASE_NOTES}" > ./release-notes.md

git add ./release-notes.md ./package.json ./package-lock.json
git commit -m "Bumped to v${NEW_PACKAGE_VERSION}"
git tag "v${NEW_PACKAGE_VERSION}"
git push origin $TEMP_BRANCH

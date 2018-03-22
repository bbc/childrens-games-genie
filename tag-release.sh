#!/usr/bin/env bash
set -e

VERSION_BUMP_TYPE=$1
git checkout master
git fetch
git pull
git reset --hard
git checkout -b new-package-version
npm version $VERSION_BUMP_TYPE -m "Bumped to version %s"
git push

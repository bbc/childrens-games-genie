#!/usr/bin/env bash
set -e

VERSION_BUMP_TYPE=$1
git checkout master; git fetch; git pull; git reset --hard
npm version $VERSION_BUMP_TYPE -m "Bumped to version $s"
git push
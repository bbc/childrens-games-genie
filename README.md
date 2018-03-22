# Children's BBC - Genie

A modular framework to simplify the construction of children's games.

## To build:

`npm run build` runs `webpack --config build-scripts/webpack.config.js`

`npm run build-watch` runs the compiler and creates a bundle. This means you can view index.html in a browser without having to run a webserver.

## To view:

`npm start` then navigate to http://localhost:8080/

Alternatively load http://localhost:8080/index.html as a file URL (requires `--allow-file-access-from-files` in Chrome.)

## To test:

`npm test` will run tests using karma.

`npm run test-watch` will run tests using karma in watch mode.

`npm run test:coverage` and `npm run test-watch:coverage` will calculate test coverage. This runs more **slowly** than running the tests normally.

## Code linting:

`npm run eslint` runs [ESLint](https://eslint.org/).

## Auto documentation:

`npm run docs` opens the documentation.

`npm run gendocs` generates documentation using [JSDoc](https://usejsdoc.org/) and outputs to `docs/api/index.html`.

## QA Mode:

To access QA mode, add the `qaMode=true` query string to the URL: http://localhost:8080/?qaMode=true

This will output game loading progress and asset keylookups to the console. Pressing "q" will show the layout overlay, to show the game bounds.

## To tag a new release on GitHub

Run `./tag-release.sh $VERSION_BUMP_TYPE $RELEASE_NOTES` where `$VERSION_BUMP_TYPE` is either patch, minor or major and `$RELEASE_NOTES` are the release notes you want to be committed with the version bump. For example, to create a new minor version of GENIE you might do something like:

```
./tag-release.sh minor "Did some work on something, including:
- Adding that great new feature
- Changing that other thing
"
```

After running this script successfully, the version number in `package.json` and `package-lock.json` will be incremented and new release notes will be added to `release-notes.md`. These files will then be committed to a new branch called `new-package-version` and this latest commit will then be tagged as a release. This new branch and tag will automatically be pushed to GitHub. Open a PR for this branch and merge this branch as soon as it has finished building. Ensure you delete the `new-package-version` once it has been merged.

## Documentation:

*   [Notes on Genie Core](https://github.com/bbc/childrens-games-genie/blob/master/docs/notes-on-genie-core.md)
*   [Coding Guidelines](https://github.com/bbc/childrens-games-genie/blob/master/docs/coding-guidelines.md)

# Coding Guidelines

## Code Format

### Basics (line lengths, spaces vs tabs, semi-colons etc)

These are enforced via [prettier](https://github.com/prettier/prettier) and [eslint](https://eslint.org/).

Prettier and EsLint plugins are available for most IDEs, or can be run from the command line.
Code checked into source control should be run though Prettier first to prevent extraneous diff lines.

Check the **/.prettierrc** and **/eslintrc.json** files for rule specifics.

### Doc Comments

Doc comments should be added where they will be helpful to explain the API. Docs are generated using [ESDoc](https://esdoc.org/) and placed in the `docs/api` folder.

#### ESDoc Example

```JAVASCRIPT
/**
 * this is MyClass.
 */
export default class MyClass {
  /**
   * @param {number} a - this is a value.
   * @param {number} b - this is a value.
   * @return {number} result of the sum value.
   */
  sum(a, b){
    return a + b;
  }
}
```

### Tests

* Avoid using beforeEach / afterEach unless they actually reduce duplication and simplify the code.
 (In general they make the code more complicated and less cohesive).

## Branching Strategy

All code should be created in feature branches.
*Is this enough or are we likely to need a work branch between feature and master?*

### Exceptions:

*Documentation? Could possibly just be checked into master assuming it sits in the docs folder?*

### How to merge

* Merge the main branch into your feature branch (to ensure there are no conflicts).
* Push your feature branch to Github.
* Create a pull request.
* Inform your team there is a pull request (PR) ready for review.
* Implement/discuss any requested changes from the review. 
* Once the PR has been approved, it will need to go through the post-amigo process. Inform a BA and QA team member to start this process.
* Either the dev or QA will merge the branch when the QA process has passed.

## Deployment Strategy

*stub*
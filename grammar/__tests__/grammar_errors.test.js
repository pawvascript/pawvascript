/*
 * Grammar Error Tests
 *
 * These tests check that the PawvaScript grammar will reject programs with various
 * syntax errors.
 */

const syntaxCheck = require('../syntax-checker');

const errors = [
  ['does not say incorrect string literals', 'say "Hello, World!;', 'Statement']
  // TODO: We need dozens more here....
];

const non_comments = [
  ['no ending tag','!!! This is not a comment'],
  ['ending tag in middle of comment', '!!! This is also !!! not quite a comment'],
  ['no starting tag', "You know what I'm not !!!"],
  ['just characters without tags', 'hello I am the comment your mom told you to avoid']
];

describe('The syntax checker', () => {
  errors.forEach(([scenario, program, startPoint]) => {
    test(`detects the error ${scenario}`, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(false);
      done();
    });
  });
});

describe('reject comments', () => {
  errors.forEach(([scenario, program]) => {
    test(`${scenario}`, (done) => {
      expect(syntaxCheck(program, 'comment')).toBe(false);
      done();
    });
  });
});
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

describe('The syntax checker', () => {
  errors.forEach(([scenario, program, startPoint]) => {
    test(`detects the error ${scenario}`, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(false);
      done();
    });
  });
});
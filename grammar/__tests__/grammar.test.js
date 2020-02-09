/*
 * Grammar Success Test
 *
 * These tests check that the PawvaScript grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require('../syntax-checker');

const examplePrograms = [
  ['Statement', 'hello world', 'say "Hello, World!";']
];

describe('The syntax checker matches', () => {
  examplePrograms.forEach( ([startPoint, scenario, program]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(true);
      done();
    });
  })
});
/*
 * Grammar Success Test
 *
 * These tests check that the PawvaScript grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require('../syntax-checker');

const examplePrograms = [
  ['Statement', 'hello world', 'say "Hello, World!";'],
  ['Declaration', 'declare strings', 'bark string dogName is "Cece";'],
  ['Declaration', 'declare numbers', 'bark number dogAge is 12;'],
  ['Declaration', 'declare booleans', 'bark boolean isCute is true;']
];

describe('Programs can', () => {
  examplePrograms.forEach( ([startPoint, scenario, program]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(true);
      done();
    });
  });
});
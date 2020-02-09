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
  ['Declaration', 'declare booleans', 'bark boolean isCute is true;'],
  ['Declaration', 'declare lists', 'bark list dogNames[string] is ["Cece", "Fluffy"];'],
  ['Declaration', 'declare maps', 'bark map dogAges[string:number] is ["Cece": 1, "Fluffy": 2];'],
  ['Declaration', 'declare uninitialized variables', 'bark number cuteness;'],
  ['Assignment', 'assign uninitialized variables', 'cuteness is 100'],
  ['EqualityExp', 'check equality', 'x equals y'],
  ['EqualityExp', 'check inequaltiy', 'x not equals y'],
  ['EqualityExp', 'check greater than', 'x is greater than y'],
  ['EqualityExp', 'check less than', 'x is less than y'],
  ['EqualityExp', 'check greater or equals', 'x is at least y'],
  ['EqualityExp', 'check less or equals', 'x is at most y'],
];

describe('Programs can', () => {
  examplePrograms.forEach( ([startPoint, scenario, program]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(true);
      done();
    });
  });
});
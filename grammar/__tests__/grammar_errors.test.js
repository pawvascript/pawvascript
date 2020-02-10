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

const non_ids = [
  ['keyword', 'is'],
  ['starts with number', '23jordan'],
  ['no letters', '___888'],
];

const non_Primaries = [
  ['empty parens', '()'],
  ['list with no closing ]', `["CeCe", "Fluffy", "Mr. Dog"`],
  ['map with no closing ]', `["CeCe": "cutest", "Marcy": "cute", "Marvin": "barely passing"`],
  ['map with nothing on right', '["MyDog":]'],
  ['map with nothing on left', '[:"MyDog"]']
]

const non_Terms = [
  ['factorial with ! before number', '!23'],
  ['binary operator before terms', '+ 8 9'],
  ['two operators together', '8 + mod 9']
]

describe('The syntax checker', () => {
  errors.forEach(([scenario, program, startPoint]) => {
    test(`detects the error ${scenario}`, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(false);
      done();
    });
  });
});

describe('reject comments', () => {
  non_comments.forEach(([scenario, program]) => {
    test(`${scenario}`, (done) => {
      expect(syntaxCheck(program, 'comment')).toBe(false);
      done();
    });
  });
});

describe('reject Primary', () => {
  non_Primaries.forEach(([scenario, program]) => {
    test(`${scenario}`, (done) => {
      expect(syntaxCheck(program, 'Primary')).toBe(false);
      done();
    });
  });
});
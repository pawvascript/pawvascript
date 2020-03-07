/*
 * Grammar Error Tests
 *
 * These tests check that the PawvaScript grammar will reject programs with various
 * syntax errors.
 */

const syntaxCheck = require("../syntax-checker");

const miscellaneous_errors = [
  [
    "does not woof incorrect string literals",
    'woof "Hello, World!;',
    "Statement"
  ],
  [
    "does not woof incorrect string no escape char before doublequote",
    'woof "Hello, "";',
    "Statement"
  ],
  ["unknown operator", "x := 2 ** 5", "Statement"],
  ["chained relational operators", "1 isLessThan 3 isLessThan 5", "Statement"],
  ["mismatched parentheses", "1 + (2 +3))", "Statement"],
  [
    "variable declaration inside a variable declaration",
    `leash dogeName is leash pupperName is "CeCe"`,
    "Statement"
  ],
  [
    "variable declaration inside another statement",
    `if leash dogeName is "CeCe" equals "CeCe" then: woof "yay!"; tail`,
    "Statement"
  ]
];

const non_comments = [
  ["no ending tag", "!!! This is not a comment"],
  [
    "ending tag in middle of comment",
    "!!! This is also !!! not quite a comment"
  ],
  ["no starting tag", "You know what I'm not !!!"],
  [
    "just characters without tags",
    "hello I am the comment your mom told you to avoid"
  ]
];

const non_ids = [
  ["keyword", "is"],
  ["starts with number", "23jordan"],
  ["bad character", "$potato"]
];

const non_Primaries = [
  ["empty parens", "()"],
  ["pack with no closing ]", `["CeCe", "Fluffy", "Mr. Dog"`],
  [
    "pack with bad peanutButter syntax (missing Pack Expression)",
    `[peanutButter, "Fluffy", "Mr. Dog"]`
  ],
  [
    "pack with bad peanutButter syntax (too many peanutButters)",
    `[peanutButter peanutButter sm0lDogs, "Fluffy", "Mr. Dog"]`
  ],
  [
    "kennel with no closing ]",
    `["CeCe": "cutest", "Marcy": "cute", "Marvin": "barely passing"`
  ],
  ["kennel with nothing on right", '["MyDog":]'],
  ["kennel with nothing on left", '[:"MyDog"]']
];

const non_Terms = [
  ["factorial with ! before number", "!23"],
  ["binary operator before terms", "+ 8 9"],
  ["unary operator treated as a binary operator", "6 ! 3"],
  ["two operators together", "8 + mod 9"]
];

describe("The syntax checker", () => {
  miscellaneous_errors.forEach(([scenario, program, startPoint]) => {
    test(`detects the error ${scenario}`, done => {
      expect(syntaxCheck(program, startPoint)).toBe(false);
      done();
    });
  });
});

describe("reject bad comments", () => {
  non_comments.forEach(([scenario, program]) => {
    test(`${scenario}`, done => {
      expect(syntaxCheck(program, "comment")).toBe(false);
      done();
    });
  });
});

describe("reject bad ids", () => {
  non_ids.forEach(([scenario, program]) => {
    test(`${scenario}`, done => {
      expect(syntaxCheck(program, "id")).toBe(false);
      done();
    });
  });
});

describe("reject bad Primary", () => {
  non_Primaries.forEach(([scenario, program]) => {
    test(`${scenario}`, done => {
      expect(syntaxCheck(program, "Primary")).toBe(false);
      done();
    });
  });
});

describe("reject bad Terms", () => {
  non_Terms.forEach(([scenario, program]) => {
    test(`${scenario}`, done => {
      expect(syntaxCheck(program, "Term")).toBe(false);
      done();
    });
  });
});

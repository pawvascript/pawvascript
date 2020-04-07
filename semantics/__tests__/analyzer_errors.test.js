/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  // format: [name, String.raw`source`]
  ["use of undeclared varaible", String.raw`dogName = "Mr. Fluffington";`],
  [
    "mismatch types for number declaration",
    String.raw`toeBeans CeCeAge; CeCeAge is "12";`,
  ],
  [
    "mismatch types for boolean declaration",
    String.raw`goodBoy isNice is "true";`,
  ],
  ["mismatch types for string declration", String.raw`leash name is good;`],
  [
    "mismatch types for list declaration",
    String.raw`pack[leash] dogs is [good, good, bad];`,
  ],
  [
    "mismatch types in list elements",
    String.raw`pack[leash] dogs is ["CeCe", "Fluffy", 2, "Mr. Fluffy"];`,
  ],
  [
    "mismatch value types in dictionary declaration",
    String.raw`kennel[leash:toeBeans] dogs is ["Cece": "2"];`,
  ],
  [
    "mismatch key types in dictionary elements",
    String.raw`kennel[leash:toeBeans] dogs is [good: 2, ];`,
  ],
  [
    "mismatch types in pack spread",
    String.raw`pack[leash] allDogs is ["Bear", "Bermuda", peanutButter ["CeCe", "Buster", Dumpling]];`,
  ],
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});

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
  /* Declarations */
  ["use of undeclared variable", String.raw`dogName is "Mr. Fluffington";`],
  [
    "redeclaration of a variable",
    String.raw`leash dogName is "Mr. Fluffington";
  leash dogName is "Dr. Fluffington";`,
  ],
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
    String.raw`kennel[leash:toeBeans] dogs is [good: 2];`,
  ],
  [
    "mismatch types in pack spread",
    String.raw`pack[leash] allDogs is ["Bear", "Bermuda", peanutButter ["CeCe", "Buster", Dumpling]];`,
  ],
  [
    "function with incorrect return type",
    String.raw`
    trick returnALeash fetches leash:
      give 8;
    tail
  `,
  ],
  [
    "type declarations with two constructors",
    String.raw`breed Owner is:   
    leash dogName; 
    toeBeans age;
    trick Owner chews[leash:dogName] fetches Owner;
    trick Owner chews[toeBeans:age] fetches Owner;
  tail`,
  ],
  /* Spreads */
  [
    "spread with undeclared variable",
    String.raw`pack[leash] allDogs is ["Bear", "Bermuda", peanutButter dogs];`,
  ],
  [
    "spread with incompatible types",
    String.raw`
  pack[leash] dogNames is ["CeCe", "Fluffy", "Mike"];
  pack[toeBeans] dogAges is [1, 2, 3];
  pack[leash] dogInfo is [dogNames, peanutButter dogAges];`,
  ],
  [
    "spread with non-spreadable data types",
    String.raw`toeBeans dogAge is 7; pack[toeBeans] dogAges is [9, peanutButter dogAge];`,
  ],
  /* Conditionals */
  [
    "condition is not a boolean",
    String.raw`
    if "CeCe" then: 
        woof "It's CeCe";
    tail
  `,
  ],
  [
    "condition uses undeclared variable",
    String.raw`if isCute then:
  woof "Good boy";
  tail`,
  ],
  /* Loops */
  [
    "loop variable is not a number",
    String.raw`chase "5" times:
      woof "Stay.";
    tail`,
  ],
  [
    "for each loop with non-list",
    String.raw`
  leash dogs is "CeCe Fluffy Mr. Fluffy"; 
  chase element through dogs:   
  woof element; 
tail`,
  ],
  [
    "undeclared variable in loop body",
    String.raw`
  pack[toeBeans] myPack is [1,2,3,4];
  chase element through myPack:   
    woof elementInAnotherPack; 
  tail
  `,
  ],
  [
    "try to change loop variable in loop body",
    String.raw`
    pack[toeBeans] myPack is [1,2,3,4];
    chase element through myPack:   
      element is 7;
      woof elementInAnotherPack; 
    tail`,
  ],
  [
    "while loop condition is not a boolean",
    String.raw`
  chase while 7:
    woof 7;
  tail`,
  ],
  /* Function Call */
  ["called nonexistent function", String.raw`getDogs();`],
  [
    "called function with illegal arguments",
    String.raw`
  trick getDogs:
    woof "John let the dogs out";
  tail

  getDogs("Marlene");
  `,
  ],
  [
    "missing function arguments in call",
    String.raw`
    trick getDogs chews[toeBeans: ages]:
      woof ages;
    tail
    
    getDogs();`,
  ],
  /* Break, Continue */
  ["break used outside of loop", String.raw`poop;`],
  ["continue used outside of loop", String.raw`walkies;`],
  /* Unary Expressions */
  ["using not before a non-number", String.raw`goodBoy isCute is "7"!;`],
  [
    "using minus before a non-number",
    String.raw`toeBeans negativeEight is -"eight";`,
  ],
  ["using not before a non-boolean", String.raw`goodBoy isTall is not 8;`],
  /* Binary Expressions */
  ["right side of + is not a number", String.raw`toeBeans age is 7 + "8";`],
  ["left side of - is not a number", String.raw`toeBeans age is "8";`],
  [
    "right side of | is not a boolean",
    String.raw`goodBoy isBig is good | "bad";`,
  ],
  [
    "left side of & is not a boolean",
    String.raw`goodBoy isCute is "hello" & good;`,
  ],
  [
    "used isGreaterThan with mismatch types",
    String.raw`goodBoy isTrue is "hello" isGreaterThan 8;`,
  ],
  [
    "use without on non-list",
    String.raw`
    toeBeans CeCeAge is 7;
    toeBeans babyCeCeAge is 2;
    toeBeans teenCeCeAge is CeCeAge without babyCeCeAge;
  `,
  ],
  [
    "try to index with non-number",
    String.raw`pack[toeBeans] nums is [1,2,3,4];
  toeBeans myNum is nums at "2";`,
  ],
  [
    "try to index dictionary with at",
    String.raw`
  kennel[leash: toeBeans] stringsToNums is ["one": 1, "two": 2];
  toeBeans myNum is stringsToNums at 8;`,
  ],
  [
    "use of on a non-dictionary",
    String.raw`pack[toeBeans] nums is [1,2,3];
  toeBeans myNum is nums of 1;`,
  ],
  [
    "access nonexistent field",
    String.raw`
  breed DogHotel is:
      leash name;
      trick DogHotel chews[leash: name] fetches DogHotel;
      trick greet:
        woof "Welcome to our Dog Hotel";
      tail
    tail
    DogHotel myDogHotel is DogHotel("CeCe's Castle");
    myDogHotel's hello();`,
  ],
  [
    "access field of nonexistent breedType",
    String.raw`
  breed DogHotel is:
      leash name;
      trick DogHotel chews[leash: name] fetches DogHotel;
      trick greet:
        woof "Welcome to our Dog Hotel";
      tail
    tail
    DogHotel myDogHotel is DogHotel("CeCe's Castle");
    myDogMotel's greet();`,
  ],
];

describe("The semantic error analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});

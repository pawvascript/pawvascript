/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  /* Conditional */
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
    "for loop variable is not a number",
    String.raw`chase "5" times:
      woof "Stay.";
    tail`,
  ],
  [
    "for loop expression is not a number",
    String.raw`chase toeBeans i is 0 by i isAtMost 2 while i isLessThan 10:
        woof i; 
    tail `
  ],
  [
    "for loop condition is not a boolean",
    String.raw`chase toeBeans i is 0 by i*2 while i+10:
        woof i; 
    tail `
  ],
  [
    "through loop group is not a list",
    String.raw` kennel[leash:toeBeans] myKennel is ["one": 1, "two": 2];
    chase element through myKennel:
      woof element;
    tail`
  ],
  [
    "through loop variable gets changed in loop body",
    String.raw`
    pack[toeBeans] numbers is [1,2,3];

    chase element through numbers:
      element is 5;
    tail`
  ],
  [
    "while loop condition is not a boolean",
    String.raw`
    chase while 7:
      woof 7;
    tail`,
  ],
  [
    "fixed loop expression is not a number",
    String.raw`leash myString is "5";
    chase myString times:
      woof "Stay";
    tail`
  ],
  /* Declarations */
  [
    "target and source have mismatch types",
    String.raw`leash myString is 7;`
  ],
  [
    "function declared in a loop",
    String.raw`chase 5 times:
      trick sayHi:
        woof "Hi";
      tail
    tail
    `
  ],
  [
    "type declared in a loop",
    String.raw`chase 5 times:
      breed Owner is:   
        leash dogName; 
        trick Owner chews [leash:dogName] fetches Owner;
      tail
    tail`
  ],
  [
    "constructor name does not match breed ID",
    String.raw`
    breed Owner is:   
      leash dogName; 
      trick DogOwner chews [leash:dogName] fetches Owner;
    tail`
  ],
  /* Functions */
  [
    "function with return type has no give statement",
    String.raw`trick sayHi fetches toeBeans:
      woof "1";
    tail`
  ],
  [
    "try to call id that is not a function or breed",
    String.raw`leash myString is "hello";
    myString();`
  ],
  [
    "function called with too many arguments",
    String.raw`trick sayHi chews[leash:name]:
      woof "Hi " with name;
    tail
    
    sayHi("Cece", "Lucille", "Jeremy");`
  ],
  [
    "function called with too few arguments",
    String.raw`trick sayHi chews[leash:name]:
      woof "Hi " with name;
    tail
    
    sayHi();`
  ],
  [
    "function called with arguments of incorrect type",
    String.raw`toeBeans age is 7;
    trick sayAge chews[leash:age]:
      woof age with " years old.";
    tail
    
    sayAge(age);`
  ],
  /* Types */
  [
    "field id already used",
    String.raw`breed Owner is:
      leash age;
      toeBeans age;
      trick Owner chews [leash:name] fetches Owner;
    tail`
  ],
  [
    "method id already used",
    String.raw`
    breed Owner is:
      leash dogName;
      trick name:
        woof "Name";
      tail

      trick dogName:
        woof "Dog name";
      tail

      trick Owner fetches Owner;
    tail`
  ],
  [
    "type has more than one constructor",
    String.raw`
    breed Owner is:
      leash dogName;

      trick Owner fetches Owner;
      trick Owner chews[leash: dogName] fetches Owner;
    tail`
  ],
  [
    "constructor parameters are not fields",
    String.raw`
    breed Owner is:
      leash dogName;

      trick Owner chews[leash: name] fetches Owner;
    tail`
  ],
  [
    "constructor does not return the breed it is a part of",
    String.raw`
    breed Owner is:
      leash dogName;

      trick Owner chews[leash: name] fetches DogcOwner;
    tail`
  ],
  /* Give, Break, Continue*/
  [
    "give statement outside of function",
    String.raw`leash name is "Moriah";
    give name;`
  ],
  [
    "give has incorrect return type",
    String.raw`trick getAge fetches leash:
      give 7;
    tail`
  ],
  [
    "break used outside of loop",
    String.raw`
    leash name is "Jeremy";
    poop;
    `
  ],
  [
    "continue used outside of loop",
    String.raw`
    leash name is "Josh";
    walkies;`
  ],
  /* Lists */
  /* Assignment */
//   ["use of undeclared variable", String.raw`dogName is "Mr. Fluffington";`],
//   [
//     "redeclaration of a variable",
//     String.raw`leash dogName is "Mr. Fluffington";
//   leash dogName is "Dr. Fluffington";`,
//   ],
//   [
//     "mismatch types for number declaration",
//     String.raw`toeBeans CeCeAge; CeCeAge is "12";`,
//   ],
//   [
//     "mismatch types for boolean declaration",
//     String.raw`goodBoy isNice is "true";`,
//   ],
//   ["mismatch types for string declration", String.raw`leash name is good;`],
//   [
//     "mismatch types for list declaration",
//     String.raw`pack[leash] dogs is [good, good, bad];`,
//   ],
//   [
//     "mismatch types in list elements",
//     String.raw`pack[leash] dogs is ["CeCe", "Fluffy", 2, "Mr. Fluffy"];`,
//   ],
//   [
//     "mismatch value types in dictionary declaration",
//     String.raw`kennel[leash:toeBeans] dogs is ["Cece": "2"];`,
//   ],
//   [
//     "mismatch key types in dictionary elements",
//     String.raw`kennel[leash:toeBeans] dogs is [good: 2];`,
//   ],
//   [
//     "mismatch types in pack spread",
//     String.raw`pack[leash] allDogs is ["Bear", "Bermuda", peanutButter ["CeCe", "Buster", Dumpling]];`,
//   ],
//   [
//     "function with incorrect return type",
//     String.raw`
//     trick returnALeash fetches leash:
//       give 8;
//     tail
//   `,
//   ],
//   [
//     "type declarations with two constructors",
//     String.raw`breed Owner is:   
//     leash dogName; 
//     toeBeans age;
//     trick Owner chews[leash:dogName] fetches Owner;
//     trick Owner chews[toeBeans:age] fetches Owner;
//   tail`,
//   ],
//   /* Spreads */
//   [
//     "spread with undeclared variable",
//     String.raw`pack[leash] allDogs is ["Bear", "Bermuda", peanutButter dogs];`,
//   ],
//   [
//     "spread with incompatible types",
//     String.raw`
//   pack[leash] dogNames is ["CeCe", "Fluffy", "Mike"];
//   pack[toeBeans] dogAges is [1, 2, 3];
//   pack[leash] dogInfo is [dogNames, peanutButter dogAges];`,
//   ],
//   [
//     "spread with non-spreadable data types",
//     String.raw`toeBeans dogAge is 7; pack[toeBeans] dogAges is [9, peanutButter dogAge];`,
//   ],
//   /* Loops */
//   [
//     "undeclared variable in loop body",
//     String.raw`
//   pack[toeBeans] myPack is [1,2,3,4];
//   chase element through myPack:   
//     woof elementInAnotherPack; 
//   tail
//   `,
//   ],
//   [
//     "try to change loop variable in loop body",
//     String.raw`
//     pack[toeBeans] myPack is [1,2,3,4];
//     chase element through myPack:   
//       element is 7;
//       woof elementInAnotherPack; 
//     tail`,
//   ],
//   [
//     "while loop condition is not a boolean",
//     String.raw`
//   chase while 7:
//     woof 7;
//   tail`,
//   ],
//   /* Function Call */
//   ["called nonexistent function", String.raw`getDogs();`],
//   [
//     "called function with illegal arguments",
//     String.raw`
//   trick getDogs:
//     woof "John let the dogs out";
//   tail

//   getDogs("Marlene");
//   `,
//   ],
//   [
//     "missing function arguments in call",
//     String.raw`
//     trick getDogs chews[toeBeans: ages]:
//       woof ages;
//     tail
    
//     getDogs();`,
//   ],
//   /* Break, Continue */
//   ["break used outside of loop", String.raw`poop;`],
//   ["continue used outside of loop", String.raw`walkies;`],
//   /* Unary Expressions */
//   ["using not before a non-number", String.raw`goodBoy isCute is "7"!;`],
//   [
//     "using minus before a non-number",
//     String.raw`toeBeans negativeEight is -"eight";`,
//   ],
//   ["using not before a non-boolean", String.raw`goodBoy isTall is not 8;`],
//   /* Binary Expressions */
//   ["right side of + is not a number", String.raw`toeBeans age is 7 + "8";`],
//   ["left side of - is not a number", String.raw`toeBeans age is "8";`],
//   [
//     "right side of | is not a boolean",
//     String.raw`goodBoy isBig is good | "bad";`,
//   ],
//   [
//     "left side of & is not a boolean",
//     String.raw`goodBoy isCute is "hello" & good;`,
//   ],
//   [
//     "used isGreaterThan with mismatch types",
//     String.raw`goodBoy isTrue is "hello" isGreaterThan 8;`,
//   ],
//   [
//     "use without on non-list",
//     String.raw`
//     toeBeans CeCeAge is 7;
//     toeBeans babyCeCeAge is 2;
//     toeBeans teenCeCeAge is CeCeAge without babyCeCeAge;
//   `,
//   ],
//   [
//     "try to use at with non-number for index",
//     String.raw`pack[toeBeans] nums is [1,2,3,4];
//   toeBeans myNum is nums at "2";`,
//   ],
//   [
//     "try to index dictionary with at",
//     String.raw`
//   kennel[leash: toeBeans] stringsToNums is ["one": 1, "two": 2];
//   toeBeans myNum is stringsToNums at 8;`,
//   ],
//   [
//     "use of on a non-dictionary",
//     String.raw`pack[toeBeans] nums is [1,2,3];
//     toeBeans myNum is nums of 1;`,
//   ],
//   [
//     "right term for of is not a key",
//     String.raw`kennel[leash:toeBeans] nums is ["CeCe": 1, "Fluffy": 2,  "Charles": 3];
//   toeBeans myNum is nums of 1;`,
//   ],
//   [
//     "access nonexistent field",
//     String.raw`
//   breed DogHotel is:
//       leash name;
//       trick DogHotel chews[leash: name] fetches DogHotel;
//       trick greet:
//         woof "Welcome to our Dog Hotel";
//       tail
//     tail
//     DogHotel myDogHotel is DogHotel("CeCe's Castle");
//     myDogHotel's hello();`,
//   ],
//   [
//     "access field of nonexistent breedType",
//     String.raw`
//   breed DogHotel is:
//       leash name;
//       trick DogHotel chews[leash: name] fetches DogHotel;
//       trick greet:
//         woof "Welcome to our Dog Hotel";
//       tail
//     tail
//     DogHotel myDogHotel is DogHotel("CeCe's Castle");
//     myDogMotel's greet();`,
//   ],
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

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
    String.raw`if "CeCe" then: 
        woof "It's CeCe";
    tail
  `
  ],
  [
    "condition uses undeclared variable",
    String.raw`if isCute then:
        woof "Good boy";
    tail`
  ],
  /* Loops */
  [
    "for loop variable is not a number",
    String.raw`chase "5" times:
        woof "Stay.";
    tail`
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
    tail`
  ],
  [
    "fixed loop expression is not a number",
    String.raw`leash myString is "5";
    chase myString times:
        woof "Stay";
    tail`
  ],
  /* Declarations */
  ["target and source have mismatch types", String.raw`leash myString is 7;`],
  [
    "function declared in a loop",
    String.raw`
    chase 5 times:
        trick sayHi:
            woof "Hi";
        tail
    tail
    `
  ],
  [
    "type declared in a loop",
    String.raw`
    chase 5 times:
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
  ["use of undeclared variable", String.raw`dogName is "Mr. Fluffington";`],
  [
    "redeclaration of a variable",
    String.raw`leash dogName is "Mr. Fluffington";
    leash dogName is "Dr. Fluffington";`
  ],
  [
    "mismatch types for number declaration",
    String.raw`toeBeans CeCeAge; CeCeAge is "12";`
  ],
  [
    "mismatch types for boolean declaration",
    String.raw`goodBoy isNice is "true";`
  ],
  ["mismatch types for string declration", String.raw`leash name is good;`],
  [
    "mismatch types for list declaration",
    String.raw`pack[leash] dogs is [good, good, bad];`
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
  ["called nonexistent function", String.raw`getDogs();`],
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
  [
    "uses spread with non-list type",
    String.raw`pack[leash] names is ["Joe", "John", "Jerry"];
    names is [peanutButter "Kim", names];`
  ],
  ["list literal with mismatch types", String.raw`woof ["string", 1, good];`],
  [
    "spread with undeclared variable",
    String.raw`pack[leash] allDogs is ["Bear", "Bermuda", peanutButter dogs];`
  ],
  [
    "spread with incompatible types",
    String.raw`
    pack[leash] dogNames is ["CeCe", "Fluffy", "Mike"];
    pack[toeBeans] dogAges is [1, 2, 3];
    pack[leash] dogInfo is [dogNames, peanutButter dogAges];`
  ],
  [
    "spread with non-spreadable data types",
    String.raw`toeBeans dogAge is 7; pack[toeBeans] dogAges is [9, peanutButter dogAge];`
  ],
  /* Kennels */
  ["dictionary keys with mismatch types", String.raw`woof ["leash": 1, 2: 3];`],
  [
    "dictionary values with mismatch types",
    String.raw`woof ["leash": 1, "another leash": "yo"];`
  ],
  /* Unary Expressions */
  ["'-' used with non-numbers", String.raw`woof -"8";`],
  ["'!' used with non-numbers", String.raw`woof good!;`],
  ["'not' used with non-boolean", String.raw`woof not "good";`],
  /* Binary Expressions */
  ["'-' used with non-number on left", String.raw`woof "8" - 8;`],
  ["'-' used with non-number on right", String.raw`woof 8 - "8";`],
  ["'+' used with non-number on left", String.raw`woof "8" + 8;`],
  ["'+' used with non-number on right", String.raw`woof 8 + "8";`],
  ["'*' used with non-number on left", String.raw`woof "8" * 8;`],
  ["'*' used with non-number on right", String.raw`woof 8 * "8";`],
  ["'/' used with non-number on left", String.raw`woof "8" / 8;`],
  ["'/' used with non-number on right", String.raw`woof 8 / "8";`],
  ["'&' used with non-boolean on left", String.raw`woof "good" & good;`],
  ["'&' used with non-boolean on right", String.raw`woof good & "good";`],
  ["'|' used with non-boolean on left", String.raw`woof "good" | good;`],
  ["'|' used with non-boolean on right", String.raw`woof good | "good";`],
  [
    "'isGreaterThan' used on two different types",
    String.raw`woof 8 isGreaterThan "8";`
  ],
  [
    "'isAtMost' used on type that is not number or string",
    String.raw`woof ["CeCe"] isAtMost ["Fluffy"];`
  ],
  [
    "'with' used on lists of different types",
    String.raw`woof ["CeCe"] with [1];`
  ],
  [
    "'without' used on type that is not list or string",
    String.raw`woof ["name": "CeCe"] with ["age": "2"];`
  ],
  [
    "right of 'at' is not a number",
    String.raw`pack[leash] names is ["CeCe"];
    woof names at "0";`
  ],
  [
    "left of 'at' is not a list",
    String.raw`kennel[leash:toeBeans] names is ["CeCe":2];
    woof names at 0;`
  ],
  [
    "key type used with 'of' does not match key type in dictionary",
    String.raw`kennel[leash:toeBeans] names is [2: "CeCe"];
    woof names of "2";`
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
    myDogHotel's hello();`
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
    myDogMotel's greet();`
  ]
];

describe("The semantic error analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, done => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});

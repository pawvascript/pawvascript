/*
 * Grammar Success Test
 *
 * These tests that the PawvaScript grammar accepts a program that features all
 * syntactic forms of the language.
 */

const syntaxCheck = require("../syntax-checker");

const readmeExamples = [
  ["hello world", 'woof "Hello, World\\!";', "Statement"],
  ["HELLO WORLD", 'bark "Hello, World\\!";', "Statement"],
  ["howl errors", 'howl "Error Message";', "Statement"],
  ["leash declarations", 'leash dogName is "CeCe";', "Declaration"],
  [
    "leash with escapes",
    'leash sentence is "CeCe is the best and I \\n love her\\!";',
    "Declaration"
  ],
  [
    "leash declarations with exclamation points",
    'leash dogName is "CeCe\\!\\!\\!\\!\\!\\!\\!\\!\\!\\!\\!";',
    "Declaration"
  ],
  ["leash concatenation", 'leash dogName is "Ce" with "Ce";', "Statement"],
  [
    "leash interpolation",
    'leash sentence is "![x] is a good girl";',
    "Statement"
  ],
  ["toeBeans declarations", "toeBeans dogAge is 12;", "Declaration"],
  ["goodBoy declarations", "goodBoy isCute is good;", "Declaration"],
  [
    "pack declarations",
    'pack[leash] dogNames is ["CeCe", "Fluffy"];',
    "Declaration"
  ],
  [
    "pack using without keyword",
    'pack[leash] dogNames is ["CeCe", "Fluffy"] without "CeCe";',
    "Declaration"
  ],
  [
    "pack using peanutButter keyword",
    'pack[leash] allTheDogs is [peanutButter sm0lDogs, "Fluffy"];',
    "Declaration"
  ],
  [
    "kennel declarations",
    'kennel[leash:toeBeans] dogAges is ["CeCe": 1, "Fluffy": 2];',
    "Declaration"
  ],
  [
    "variable declaration with null/cat value",
    "leash theBestDog is cat;",
    "Declaration"
  ],
  ["uninitialized variable declarations", "toeBeans cuteness;", "Declaration"],
  ["assigning uninitialized variables", "cuteness is 100;", "Assignment"],
  ["equality comparators", "x equals y", "RelopExp"],
  ["inequality comparators", "x notEquals y", "RelopExp"],
  ["greater than comparators", "x isGreaterThan y", "RelopExp"],
  ["less than comparators", "x isLessThan y", "RelopExp"],
  ["greater than or equal to comparators", "x isAtLeast y", "RelopExp"],
  ["less than or equal to comparators", "x isAtMost y", "RelopExp"],
  ["logical negation", "x equals not y", "RelopExp"],
  ["addition", "x + y", "Term"],
  ["subtraction", "x - y", "Term"],
  ["negation", "-x", "Term"],
  ["multiplication", "x * y", "Term"],
  ["division", "x / y", "Term"],
  ["modulo operator", "x mod y", "Term"],
  ["factorial", "x!", "Term"],
  [
    "if-else statements",
    `if x isAtLeast y then:
        leash dogName is "CeCe";
    else:
        leash dogName is "Fluffy";
        leash dogAge is 12;
    tail`,
    "Statement"
  ],
  [
    "if-else if statements",
    `if x notEquals y then:
        woof "CeCe is kinda cute";
    else if x isGreaterThan y then:
        woof "CeCe is pretty cute";
    else if x isLessThan y then:
        woof "Okay, CeCe is really cute";
    else:
        woof "CeCe is the cutest of the cutest";
    tail`,
    "Statement"
  ],
  ["one line comments", `!!! I'm a one line comment !!!`, "comment"],
  ["multiline comments", `!!! I'm a \n multiline \n comment !!!`, "comment"],
  [
    "forever loops",
    `chase:
        woof "I run forever\\!";
    tail`
  ],
  [
    "fixed loops",
    `chase 5 times:
        woof "Stay.";
    tail`
  ],
  [
    "while loops",
    `chase while x isAtMost 5:
        woof x;
    tail`,
    "Statement"
  ],
  [
    "for loops",
    `chase toeBeans i is 0 by i*2 while i isLessThan 10:
        woof i;
    tail`,
    "Statement"
  ],
  [
    "for each loops",
    `chase element through mypack:
        woof element;
    tail`,
    "Statement"
  ],
  [
    "loops with a break/poop statement",
    `chase:
        woof "I run forever\\!";
        poop;
    tail`
  ],
  [
    "loops with a continue/walkies statement",
    `chase toeBeans i is 0 by i*2 while i isLessThan 10:
        if i mod 2 equals 0 then:
            walkies;
        tail
        woof i;
    tail`
  ],
  [
    "function declaration",
    `trick gcd chews[toeBeans:num1, toeBeans:num2] fetches toeBeans:
        toeBeans remainder;
        chase while (a mod b) isGreaterThan 0:
            remainder is (a mod b);
            a is b;
            b is remainder;
        tail
        give a;
    tail`,
    "Declaration"
  ],
  [
    "breed declaration and instantiation",
    `breed Owner is:
        leash dogName;
        trick Owner chews[leash:dogName] fetches Owner;
        trick introduceDog:
            woof "My dog's name is " with Owner's dogName;
        tail
        trick command fetches leash:
            give Owner's dogName with ", stay.";
        tail
    tail
    Owner lucille is Owner("Cece");
    (lucille's introduceDog)();  !!! output: "My dog's name is Cece" !!! 
    woof lucille's command(); !!! output: "Cece, stay." !!!
   `
  ],
  [
    "functions/constructors that take in packs and/or kennels",
    `breed Professor is:
        leash name;
        pack[Student] students;
        kennel[Student:toeBeans] grades;
        trick Professor chews[leash:name, pack[Student]:students, kennel[Student:toeBeans]:grades] fetches Professor;
    tail
    `
  ]
  //   [
  //     "nested objects",
  //     `breed Professor is:
  //           leash name;
  //           pack students[Student];
  //           trick Professor chews[leash:name, pack[Student]:students] fetches Professor;
  //       tail
  //       breed Student is:
  //           leash name;
  //           Dog dogger;
  //           trick Student chews[leash:name, Dog:dogger] fetches Student;
  //       tail
  //       breed Dog is:
  //           leash name;
  //           trick Dog chews[leash:name] fetches Dog;
  //           trick bark:
  //               woof "I am a dog and my name is " with Dog's name;
  //           tail
  //       tail
  //      `
  //   ]
  //   [
  //     "qualified id's with nested objects",
  //     `Dog cc is Dog("CeCe");
  //     Student lucille is Student("Lucille", cc);
  //     Professor rToal is Professor("Dr. Toal", [lucille]);

  //     !!! These should all do the same thing. !!!
  //     cc's bark();
  //     lucille's dogger's bark();
  //     rtoal's students's 0's dogger's bark();
  //    `
  //   ]
];

const objects = [
  [
    "object declaration",
    `breed Owner is:
        leash dogName;
    tail`,
    "Declaration"
  ],
  [
    "object constructor declaration",
    `breed Owner is:
        leash dogName;
        trick Owner chews[leash:dogName] fetches Owner;
    tail`,
    "Declaration"
  ],
  [
    "object with methods",
    `breed Owner is:
        leash dogName;
        trick Owner chews[leash:dogName] fetches Owner;
        trick introduceDog:
            woof "My dog's name is " with Owner's dogName;
        tail
        trick command fetches leash:
            give Owner's dogName with ", stay.";
        tail
    tail`
  ]
];

const comments = [
  ["exclamation mark in comment", "!!! I should be a comment! !!!"],
  ["tags on different lines", `!!!\nComment under tags\nlike so\n!!!`],
  ["all kinds of characters", "!!! @#$@#%^&{123456;}!!!"]
];

const ids = [
  ["start with an underscore", "_hello"],
  ["end with an underscore", "hello_"],
  ["underscores all over the place", "_oh_hey_there_"],
  ["has numbers", "not100"],
  ["start with keyword", "withoutDogs"],
  ["contains keyword", "living_with_dogs"],
  ["end with keyword", "never_barks"],
  ["starts with type", "numberOne"],
  ["one letter", "m"]
];

const Primaries = [
  ["parenthesized expression", "(2 * id)"],
  ["apostrophe operator", "toal's hat"],
  ["pack", `["CeCe", "Fluffy", "Mr. Dog"]`],
  ["one element pack", `["CeCe"]`],
  ["pack within a pack", `[["CeCe", "Fluffy"], ["Marvin"]]`],
  ["empty pack", `[]`],
  ["kennel", `["CeCe": "cutest", "Marcy": "cute", "Marvin": "barely passing"]`],
  ["one element kennel", `["CeCe": "too cute"]`],
  ["kennel within a kennel", `["Cece": ["cuteness": 100]]`],
  ["pack within a kennel", `["Marvin": ["bleh": "meh"]]`]
];

const Terms = [
  ["negated", "-9"],
  ["factorial", "10!"],
  ["operation before negation", "10 mod -88"]
];

const interpolations = [
  ["single", `"Hello, my name is ![name]"`],
  ["mulitple", `"The time is ![hours] : ![minutes] : ![seconds]"`]
];

describe("The syntax can match", () => {
  readmeExamples.forEach(([scenario, program, startPoint]) => {
    test(scenario, done => {
      expect(syntaxCheck(program, startPoint)).toBe(true);
      done();
    });
  });
});

describe("Declarations can be", () => {
  objects.forEach(([scenario, snippet, startPoint]) => {
    test(scenario, done => {
      expect(syntaxCheck(snippet, startPoint)).toBe(true);
      done();
    });
  });
});

describe("comments match", () => {
  comments.forEach(([scenario, snippet]) => {
    test(scenario, done => {
      expect(syntaxCheck(snippet, "comment")).toBe(true);
      done();
    });
  });
});

describe("ids match", () => {
  ids.forEach(([scenario, snippet]) => {
    test(scenario, done => {
      expect(syntaxCheck(snippet, "id")).toBe(true);
      done();
    });
  });
});

describe("Primary matches", () => {
  Primaries.forEach(([scenario, snippet]) => {
    test(scenario, done => {
      expect(syntaxCheck(snippet, "Primary")).toBe(true);
      done();
    });
  });
});

describe("Term matches", () => {
  Terms.forEach(([scenario, snippet]) => {
    test(scenario, done => {
      expect(syntaxCheck(snippet, "Term")).toBe(true);
      done();
    });
  });
});

describe("interpolation matches", () => {
  interpolations.forEach(([scenario, snippet]) => {
    test(scenario, done => {
      expect(syntaxCheck(snippet, "strlit")).toBe(true);
      done();
    });
  });
});

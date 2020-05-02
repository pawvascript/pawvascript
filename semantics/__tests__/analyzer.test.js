/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const { analyze } = require("../analyzer");

const fixture = {
  /* Basic Declarations */
  uninitializedVariableDeclaration: String.raw`
            leash dogName;
            toeBeans dogAge;
            goodBoy isGoodDog;
            pack[leash] dogNames;
            kennel[leash:toeBeans] dogAges;
          `,
  variableDeclarationInitializedToNull: String.raw`leash dogName is cat;`,
  numberVariableDeclaration: String.raw`toeBeans CeCeAge is 1;`,
  booleanVariableDeclaration: String.raw`goodBoy isGoodBoy is good;`,
  stringVariableDeclaration: String.raw`leash name is "CeCe";`,
  /* Lists and Dictionaries */
  emptyListVariableDeclaration: String.raw`pack[leash] dogs is [];`,
  emptyDictVariableDeclaration: String.raw`kennel[leash:toeBeans] dogs is [:];`,
  nonEmptyListVariableDeclaration: String.raw`pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];`,
  listVariableDeclarationWithSpreadOnPackLiteral: String.raw`
            pack[leash] allDogs is ["Bear", "Bermuda", peanutButter ["CeCe", "Buster", "Dumpling"]];
          `,
  listVariableDeclarationWithSpreadOnFirstElem: String.raw`
            pack[leash] allDogs is [peanutButter ["CeCe", "Buster", "Dumpling"], "Bear", "Bermuda"];
          `,
  listVariableDeclarationWithSpreadOnVarExp: String.raw`
            pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];
            pack[leash] allDogs is ["Bear", "Bermuda", peanutButter dogs];
          `,
  listVariableDeclarationUsingWithout: String.raw`
            pack[leash] fewerDogs is ["CeCe", "Buster", "Dumpling"] without "CeCe";
          `,
  nonEmptyDictVariableDeclaration: String.raw`
            kennel[leash:toeBeans] dogs is ["CeCe":1, "Buster":2, "Mo":3];
          `,
  listElementAccessOnVarExp: String.raw`
            pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];
            leash myDog is dogs at 0;
          `,
  listElementAccessOnListLiteral: String.raw`
            leash myDog is ["CeCe", "Buster", "Dumpling"] at 0;
          `,
  dictValueAccessOnVarExp: String.raw`
            kennel[leash:toeBeans] dogAges is ["CeCe":1, "Buster":2, "Mo":3];
            toeBeans myDogAge is dogAges of "CeCe";
          `,
  dictValueAccessOnDictLiteral: String.raw`
            toeBeans myDogAge is ["CeCe":1, "Buster":2, "Mo":3] of "CeCe";
          `,
  /* String Operations */
  leashConcatenation: String.raw`leash dogName is "Ce" with "Ce";`,
  stringInterpolation: String.raw`
            toeBeans x is 1;
            leash sentence is "![x] is a good girl";
          `,
  stringInterpolationInMiddleOfString: String.raw`
            leash name is "CeCe";
            leash phrase is "Come back here, ![name]. Good girl.";
          `,
  /* Assignment */
  variableAssignment: String.raw`
            toeBeans cuteness is 0;
            cuteness is 100;
          `,
  /* Relops */
  equalityOperators: String.raw`
            leash name is "CeCe";
            leash nickname is "CeCe";
            toeBeans age1 is 1;
            toeBeans age2 is 2;
            goodBoy testBool1 is "CeCe" equals "CeCe";
            goodBoy testBool2 is name equals "CeCe";
            goodBoy testBool3 is "CeCe" equals nickname;
            goodBoy testBool4 is name equals nickname;
            goodBoy testBool5 is age1 equals 1;
            goodBoy testBool6 is 2 equals age2;
            goodBoy testBool7 is age1 notEquals age2;
          `,
  greaterThanLessThanComparators: String.raw`
            toeBeans age1 is 1;
            toeBeans age2 is 2;
            goodBoy testBool1 is age1 isGreaterThan age2;
            goodBoy testBool2 is age1 isLessThan age2;
          `,
  greaterThanLessThanOrEqualToComparators: String.raw`
            toeBeans age1 is 1;
            toeBeans age2 is 2;
            goodBoy testBool1 is age1 isAtLeast age2;
            goodBoy testBool2 is age1 isAtMost age2;
          `,
  /* Logical Operators */
  logicalNegation: String.raw`
            goodBoy x is good;
            goodBoy y is bad;
            goodBoy z is not y;
          `,
  logicalAndOperator: String.raw`
            goodBoy x is good;
            goodBoy y is bad;
            goodBoy z is x & y;
          `,
  logicalOrOperator: String.raw`
            goodBoy x is good;
            goodBoy y is bad;
            goodBoy z is x | y;
          `,
  /* Arithmetic */
  arithmeticOperators: String.raw`
            toeBeans x is 100;
            toeBeans y is -50;
            toeBeans a is x + y;
            a is x - y;
            a is x * y;
            a is x / y;
            a is x mod y;
            a is x!;
            a is -x;
          `,
  /* Conditionals */
  ifStatement: String.raw`
            goodBoy x is good;
            if x then:
                x is bad;
            tail
          `,
  ifElseStatement: String.raw`
            toeBeans x is 1;
            toeBeans y is 1;
            if x isAtLeast y then:
                leash dogName is "CeCe";
            else:
                leash dogName is "Fluffy";
                toeBeans dogAge is 12;
            tail
          `,
  ifElseIfStatement: String.raw`
            toeBeans x is 1;
            toeBeans y is 1;
            if x notEquals y then:
                woof "CeCe is kinda cute";
            else if x isGreaterThan y then:
                woof "CeCe is pretty cute";
            else if x isLessThan y then:
                woof "Okay, CeCe is really cute";
            else:
                woof "CeCe is the cutest of the cutest";
            tail
          `,
  /* Comments */
  oneLineComment: String.raw`!!! I'm a one line comment !!!`,
  multiLineComment: String.raw`!!! I'm a \n multiline \n comment !!!`,
  /* Loops */
  infiniteLoop: String.raw`chase: woof "I run forever"; tail`,
  fixedLoop: String.raw`chase 5 times: woof "Stay"; tail`,
  whileLoop: String.raw`
            toeBeans x is 5;
            chase while x isAtMost 5:
                woof x;
            tail
          `,
  forLoop: String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10: woof i; tail`,
  forEachLoop: String.raw`
            pack[leash] myPack is ["CeCe", "Buster", "Dumpling"];
            chase element through myPack:
                woof element;
            tail
          `,
  loopWithPoopStatement: String.raw`
            chase:
                woof "I run forever\!";
                poop;
            tail
          `,
  loopWithWalkiesStatement: String.raw`
            chase toeBeans i is 0 by i*2 while i isLessThan 10:
                if i mod 2 equals 0 then:
                    walkies;
                tail
                woof i;
            tail
          `,
  /* Function Declarations */
  functionDeclaration: String.raw`
            trick gcd chews[toeBeans:a, toeBeans:b] fetches toeBeans:
                toeBeans remainder;
                chase while (a mod b) isGreaterThan 0:
                    remainder is (a mod b);
                    a is b;
                    b is remainder;
                tail
                give a;
            tail
            toeBeans greatestCommonDivisor is gcd(21, 49);
          `,
  functionDeclarationInFunction: String.raw`
            trick f fetches toeBeans:
                trick g fetches toeBeans:
                    give 2;
                tail
                give g();
            tail
            toeBeans result is f();
          `,
  functionsThatCallEachOther: String.raw`
            trick f fetches toeBeans:
                give 2 * g();
            tail
            trick g fetches toeBeans:
                give f() / 2;
            tail
            toeBeans result is f();
          `,
  /* Function Call */
  functionCallWithoutArgs: String.raw`
            trick f:
                give;
            tail
            f();
          `,
  functionCallWithArgs: String.raw`
            trick f chews[toeBeans:num1]:
                give;
            tail
            f(100);
          `,
  functionCallAsVarDecExp: String.raw`
            trick f chews[toeBeans:num1]:
                give num1;
            tail
            toeBeans result is f(100);
          `,
  functionCalledBeforeDeclaration: String.raw`
            toeBeans result is f(100);
            trick f chews[toeBeans:num1]:
                give num1;
            tail
          `,
  /* Breed Declarations */
  emptyBreedDeclaration: String.raw`
            breed Owner is:
            tail
          `,
  breedWithFields: String.raw`
            breed PetSitter is:
                leash name;
                toeBeans yearsOfExperience is 0;
            tail
          `,
  breedWithFieldAndMethods: String.raw`
            breed DogHotel is:
                leash name;
                trick greet:
                    woof "Welcome to our Dog Hotel";
                tail
            tail
          `,
  breedWithMethod: String.raw`
            breed DogLover is:
                trick barkAtDog:
                    bark "woof woof";
                tail
            tail
          `,
  breedWithConstructor: String.raw`
            breed DogLover is:
                trick DogLover fetches DogLover;
            tail
            DogLover lucille is DogLover();
          `,
  breedWithEverything: String.raw`
            breed DogHotel is:
                leash name;
                trick DogHotel chews[leash: name] fetches DogHotel;
                trick greet:
                    woof "Welcome to our Dog Hotel";
                tail
            tail
            DogHotel myDogHotel is DogHotel("CeCe's Castle");
            myDogHotel's greet();
          `,
  breedWithSomeUninitializedFields: String.raw`
            breed DogHotel is:
                leash name;
                toeBeans capacity;
                goodBoy open;
                trick DogHotel chews[leash: name] fetches DogHotel;
                trick greet:
                    woof "Welcome to our Dog Hotel";
                tail
            tail
            DogHotel myDogHotel is DogHotel("CeCe's Castle");
            myDogHotel's greet();
          `,
  breedsThatReferenceEachOther: String.raw`
            breed Dog is:
                leash name;
                Owner myHuman;
            tail
            breed Owner is:
                leash name;
                Dog myDog;
            tail
          `,
  breedInstantiationBeforeDeclaration: String.raw`
            DogHotel myDogHotel is DogHotel("CeCe's Castle");
            myDogHotel's greet();
            breed DogHotel is:
                leash name;
                trick DogHotel chews[leash: name] fetches DogHotel;
                trick greet:
                    woof "Welcome to our Dog Hotel";
                tail
            tail
          `,
  // Note: currently, the at operator only works with lists
  // Moving forward we can edit the analyzer to include strings
  // indexOfString: String.raw`leash s is "Hello";
  // woof s at 0;`,
};

describe("The semantic analyzer", () => {
  Object.entries(fixture).forEach(([name, source]) => {
    test(`correctly compiles for ${name}`, (done) => {
      const astRoot = parse(source);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      expect(astRoot).toBeTruthy();
      done();
    });
  });
});

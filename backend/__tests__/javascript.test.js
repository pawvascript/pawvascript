// /*
//  * JavaScript Code Generator Tests
//  *
//  * These tests check that the JavaScript generator produces the target
//  * JavaScript that we expect.
//  */

const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../javascript-generator");
const factorialFunctionRegex = `function __factorial\\(n\\) \\{\\s*return \\(n != 1\\) \\? n \\* factorial\\(n - 1\\) : 1;\\s*\\}\\s*`;

const fixture = {
  /* Declarations */
  uninitializedVariableDeclaration: [
    String.raw`
        breed Dog is:
        tail
        Dog myDog;`,
    /class Dog_\d+ {\s*constructor\(\) {\s*Object.assign\(this, {}\);\s*}\s*}\s*let myDog_\d+ = null;/s,
  ],
  numberVariableDeclaration: [
    String.raw`toeBeans CeCeAge is 1;`,
    /let CeCeAge_\d+ = 1;/,
  ],
  booleanVariableDeclaration: [
    String.raw`goodBoy isGoodBoy is good;`,
    /let isGoodBoy_\d+ = true;/,
  ],
  stringVariableDeclaration: [
    String.raw`leash name is "CeCe";`,
    /let name_\d+ = `CeCe`;/,
  ],
  stringVariableDeclarationWithEscape: [
    String.raw`leash name is "CeCe\!\n";`,
    /let name_\d+ = `CeCe!\\n`;/,
  ],
  stringTemplateVariableDeclaration: [
    String.raw`leash lastName is "Njoo"; leash name is "CeCe ![lastName] the dog";`,
    /let lastName_(\d+) = `Njoo`;\s*let name_\d+ = `CeCe \$\{lastName_\1\} the dog`;/,
  ],
  /* Binary Expressions */
  variableDeclarationWithAdditionExpression: [
    String.raw`toeBeans age is 10 + 34;`,
    /let age_(\d+) = \(10 \+ 34\);/,
  ],
  variableDeclarationWithModExpression: [
    String.raw`toeBeans age is 34 mod 10;`,
    /let age_(\d+) = \(34 % 10\);/,
  ],
  // TODO: add generator tests for the remaining binary operators.
  /* Assignment Statements */
  assignment: [
    String.raw`toeBeans age is 12; age is 13;`,
    /let age_(\d+) = 12;\s*age_(\1) = 13;/,
  ],
  /* Lists and Dictionaries */
  emptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is [];`,
    /let dogs_\d+ = \[\];/,
  ],
  emptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is [:];`,
    /let dogs_\d+ = {};/,
  ],
  nonEmptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];`,
    /let dogs_\d+ = \[`CeCe`, `Buster`, `Dumpling`\];/,
  ],
  listVariableDeclarationWithSpreadOnPackLiteral: [
    String.raw`
        pack[leash] allDogs is ["Bear", "Bermuda", peanutButter ["CeCe", "Buster", "Dumpling"]];
    `,
    /let allDogs_\d+ = \[`Bear`, `Bermuda`, ...\[`CeCe`, `Buster`, `Dumpling`\]\];/,
  ],
  nonEmptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is ["Sparky":12, "Buster":13];`,
    /let dogs_\d+ = \{\s*`Sparky`: 12,\s*`Buster`: 13\s*\};/,
  ],
  /* Print Statements */
  printStringLiteral: [
    String.raw`woof("Hello, world");`,
    `console.log(\`Hello, world\`);`,
  ],
  barkStringLiteral: [
    String.raw`bark("Hello, world");`,
    `console.log(\`Hello, world\`.toUpperCase());`,
  ],
  howlStringLiteral: [
    String.raw`howl("Hello, world");`,
    `console.error(\`Hello, world\`);`,
  ],
  printTemplateLiteral: [
    String.raw`leash place is "world"; woof("Hello, ![place]");`,
    /let place_(\d+) = `world`;\s*console.log\(`Hello, \${place_\1}`\);/,
  ],
  /* Conditional Statements */
  ifStatement: [
    String.raw`if (good) then: woof "Good boy"; tail`,
    /if \(true\) {\s*console.log\(`Good boy`\);\s*}/,
  ],
  ifElseStatement: [
    String.raw`if (good) then: woof "Yes"; else: woof "No"; tail`,
    /if \(true\) {\s*console.log\(`Yes`\);\s*} else {\s*console.log\(`No`\);\s*}/,
  ],
  ifElseIfElseStatement: [
    String.raw`if (good) then: woof "Yes"; else if (bad) then: woof "Maybe"; else: woof "No"; tail`,
    /if \(true\) {\s*console.log\(`Yes`\);\s*} else if \(false\) {\s*console.log\(`Maybe`\);\s*} else {\s*console.log\(`No`\);\s*}/,
  ],
  // TODO: add test for strings that escape !
  /* Loops */
  infiniteLoop: [
    String.raw`chase:
      woof "I run forever";
    tail`,
    /while \(true\) {\s*console.log\(`I run forever`\);\s*}/,
  ],
  infiniteLoopWithBreak: [
    String.raw`chase:
      woof "I run forever";
      poop;
    tail`,
    /while \(true\) {\s*console.log\(`I run forever`\);\s*break;\s*}/,
  ],
  infiniteLoopWithContinue: [
    String.raw`chase:
      woof "I run forever";
      walkies;
    tail`,
    /while \(true\) {\s*console.log\(`I run forever`\);\s*continue;\s*}/,
  ],
  forLoop: [
    String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
        woof i; 
    tail`,
    /for \(let i_(\d+) = 0;\s*\(i_\1 < 10\);\s*i_\1 = \(i_\1 \* 2\)\) {\s*console.log\(i_\1\);\s*}/,
  ],
  throughLoop: [
    String.raw`pack[toeBeans] myPack is [1,2,3];
    chase element through myPack:   
      woof element; 
    tail`,
    /let myPack_(\d+) = \[1, 2, 3\];\s*for \(let element_(\d+) of myPack_\1\) {\s*console.log\(element_\2\);\s*}/,
  ],
  whileLoop: [
    String.raw`toeBeans x is 0;
    chase while x isAtMost 5:
      woof x;
    tail`,
    /let x_(\d+) = 0;\s*while \(\(x_\1 <= 5\)\) {\s*console.log\(x_\1\);\s*}/,
  ],
  fixedLoop: [
    String.raw`chase 5 times:
      woof "Stay.";
    tail`,
    /for \(let i = 0; i < 5; i\+\+\) {\s*console.log\(`Stay.`\);\s*}/,
  ],
  /* Functions and Calls */
  functionDeclaration: [
    String.raw`trick greet chews[leash:name] fetches leash:
      give "Hello, ![name]";
    tail`,
    /function greet_(\d+)\(name_(\d+)\) {\s*return \(`Hello, \${name_\2}`\);\s*}/,
  ],
  funcCall: [
    String.raw`trick greet chews[leash:name] fetches leash:
      give "Hello, ![name]";
    tail
    greet("Puppy");`,
    /function greet_(\d+)\(name_(\d+)\) \{\s*return \(`Hello, \$\{name_\2\}`\);\s*\}\s*greet_\1\(`Puppy`\)/,
  ],
  /* Breeds */
  breedDeclarationWithConstructor: [
    String.raw`breed Owner is:
        leash name;
        goodBoy hasDog is good;
        
        trick Owner chews[leash:name] fetches Owner;
      tail`,
    /class Owner_\d+ {\s*constructor\(name_(\d+) = ``\) {\s*Object.assign\(this, {\s*name_\1\s*}\);\s*this.hasDog_\d+ = true;\s*}\s*}/,
  ],
  breedDeclarationWithMethods: [
    String.raw`breed DogLover is:
        trick barkAtDog:
            give;
        tail
      tail`,
    /class DogLover_\d+ {\s*constructor\(\) {\s*Object.assign\(this, {}\);\s*}\s*barkAtDog_\d+\(\) {\s*return;\s*}\s*}/,
  ],
  /* Builtins */
  sizeBuiltin: [String.raw`size("hello");`, /`hello`.length/],
  substringBuiltin: [
    String.raw`leash name is "CeCe";
      woof substring(name, 0, 2);`,
    /let name_(\d+) = `CeCe`;\s*console.log\(name_\1\.substr\(0, 2\)\);/,
  ],
  containsBuiltin: [
    String.raw`leash name is "CeCe";
      contains(name, "Ce");`,
    /let name_(\d+) = `CeCe`;\s*name_\1.includes\(`Ce`\)/,
  ],
  indexOfSubstringBuiltin: [
    String.raw`leash name is "CeCe";
      indexOfSubstring(name, "eC");`,
    /let name_(\d+) = `CeCe`;\s*name_\1.indexOf\(`eC`\)/,
  ],
  toeBeansToLeashBuiltin: [
    String.raw`leash age is toeBeansToLeash(12);`,
    /let age_(\d+) = \(12\).toString\(\);/,
  ],
  leashToToeBeansBuiltin: [
    String.raw`toeBeans age is leashToToeBeans("12");`,
    /let age_(\d+) = parseInt\(`12`\);/,
  ],
  goodBoyToToeBeansBuiltin: [
    String.raw`toeBeans number is goodBoyToToeBeans(good);`,
    /let number_(\d+) = \(true \+ 0\);/,
  ],
  toeBeansToGoodBoyBuiltin: [
    String.raw`goodBoy boolean is toeBeansToGoodBoy(23);`,
    /let boolean_(\d+) = \(23 !== 0\);/,
  ],
  leashToGoodBoyBuiltin: [
    String.raw`goodBoy boolean is leashToGoodBoy("23");`,
    /let boolean_(\d+) = \(`23` !== ''\);/,
  ],
  goodBoyToLeashBuiltin: [
    String.raw`leash string is goodBoyToLeash(bad);`,
    /let string_(\d+) = \(false\).toString\(\);/,
  ],
  /* Unary Operators */
  notOp: [
    String.raw`goodBoy isGood is not bad;`,
    /let isGood_(\d+) = \(!false\);/,
  ],
  factorialOp: [
    String.raw`toeBeans factorial is 5!;`,
    new RegExp(
      factorialFunctionRegex + `let factorial_\\d+ = \\(__factorial\\(5\\)\\);`
    ),
  ],
  negationOp: [
    String.raw`toeBeans negative is -321;`,
    /let negative_(\d+) = \(-321\);/,
  ],
};

// const fixture = {
//   hello: [String.raw`print("Hello, world\n")`, String.raw`console.log("Hello, world\n")`],

//   arithmetic: [String.raw`5 * -2 + 8`, String.raw`((5 * (-(2))) + 8)`],

//   letAndAssign: [String.raw`let var x := 3 in x := 2 end`, /let x_(\d+) = 3;\s+x_\1 = 2/],

//   call: [
//     String.raw`let function f(x: int, y: string) = () in f(1, "") end`,
//     /function f_(\d+)\(x_\d+, y_\d+\) \{\s*};\s*f_\1\(1, ""\)/,
//   ],

//   whileLoop: [String.raw`while 7 do break`, /while \(7\) \{\s*break\s*\}/],

forLoop: [
  String.raw`for i := 0 to 10 do ()`,
  /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2\+\+\) \{\s*\}/,
],
  //   ifThen: [String.raw`if 3 then 5`, '((3) ? (5) : (null))'],

  //   ifThenElse: [String.raw`if 3 then 5 else 8`, '((3) ? (5) : (8))'],

  //   member: [
  //     String.raw`let type r = {x:string} var p := r{x="@"} in print(p.x) end`,
  //     /let p_(\d+) = \{\s*x: "@"\s*\};\s*console.log\(p_\1\.x\)/,
  //   ],

  //   subscript: [
  //     String.raw`let type r = array of string var a := r[3] of "" in print(a[0]) end`,
  //     /let a_(\d+) = Array\(3\).fill\(""\);\s*console.log\(a_\1\[0\]\)/,
  //   ],

  //   letInFunction: [
  //     String.raw`let function f():int = let var x:= 1 in x end in () end`,
  //     /function f_(\d+)\(\) \{\s*let x_(\d+) = 1;\s*return x_\2\s*\};/,
  //   ],

  //   letAsValue: [
  //     String.raw`print(let var x := "dog" in concat(x, "s") end)`,
  //     /console.log\(\(\(\) => \{\s*let x_(\d+) = "dog";\s*return x_\1.concat\("s"\);\s*\}\)\(\)\)/,
  //   ],

  //   returnExpressionSequence: [
  //     String.raw`let function f():int = let var x:= 1 in (1;nil;3) end in () end`,
  //     /function f_(\d+)\(\) {\s*let x_(\d+) = 1;\s*1;\s*null;\s*return 3\s*\};/,
  //   ],

  //   moreBuiltIns: [
  //     String.raw`(ord("x"); chr(30); substring("abc", 0, 1))`,
  //     /\("x"\).charCodeAt\(0\);\s*String.fromCharCode\(30\);\s*"abc".substr\(0, 1\)/,
  //   ],

  //   evenMoreBuiltIns: [
  //     String.raw`(not(1) ; size(""); exit(3))`,
  //     /\(!\(1\)\);\s*"".length;\s*process\.exit\(3\)/,
  //   ],
  // };

  describe("The JavaScript generator", () => {
    Object.entries(fixture).forEach(([name, [source, expected]]) => {
      test(`produces the correct output for ${name}`, (done) => {
        const ast = parse(source);
        analyze(ast);
        expect(generate(ast)).toMatch(expected);
        done();
      });
    });
  });

const parse = require("../../ast/parser");
// eslint-disable-next-line no-unused-vars
const { analyze } = require("../../semantics/analyzer");
const generate = require("../../backend/javascript-generator");
// eslint-disable-next-line no-unused-vars
const optimize = require("../../semantics/optimizer");
const Context = require("../../semantics/context");

const factorialFunctionRegex = `function __factorial\\(n\\) \\{\\s*return \\(n !== 1\\) \\? n \\* __factorial\\(n - 1\\) : 1;\\s*\\}\\s*`;

const fixture = {
  firstIfIsTrue: [
    String.raw`if (good) then:
         woof "You're good";
    else:
        woof "You're bad";
    tail`,
    /console.log\(`You're good`\);/,
  ],
  firstIfIsFalseNoElse: [
    String.raw`if (bad) then:
           woof "You're bad";
      tail`,
    /\s*/,
  ],
  firstIfIsFalseWithElse: [
    String.raw`if (bad) then:
           woof "You're bad";
      else:
          woof "You're good";
      tail`,
    /console\.log\(`You're good`\);/,
  ],
  normalConditionalNoElse: [
    String.raw`goodBoy x is good;
    if x then:
        woof "You're bad";
    tail`,
    /let x_(\d+) = true;\s*if \(x_\1\) \{\s*console\.log\(`You're bad`\);\s*\}/,
  ],
  normalConditionalWithElse: [
    String.raw`goodBoy x is good;
    if x then:
        woof "You're bad";
    else:
        woof "You're good";
    tail`,
    /let x_(\d+) = true;\s*if \(x_\1\) \{\s*console\.log\(`You're bad`\);\s*\} else \{\s*console\.log\(`You're good`\);\s*\}/,
  ],
  infiniteLoop: [
    String.raw`chase: woof "FOREVER"; tail`,
    /while \(true\) \{\s*console\.log\(`FOREVER`\);\s*}/,
  ],
  forLoop: [
    String.raw`chase toeBeans i is 0 by i+1 while i isGreaterThan 2:
        woof "hi";
    tail`,
    "",
  ],
  forLoopFalseCondition: [
    String.raw`chase toeBeans i is 0 by i+1 while bad:
        woof "hi";
    tail`,
    "",
  ],
  throughLoop: [
    String.raw`pack[toeBeans] myPack is [1,2,3];
    chase element through myPack:   
      woof element; 
    tail`,
    /let myPack_(\d+) = \[1, 2, 3\];\s*for \(let element_(\d+) of myPack_\1\) {\s*console\.log\(element_\2\);\s*}/,
  ],
  whileLoop: [
    String.raw`chase while 0 equals 2:
          woof 1;
      tail`,
    "",
  ],
  fixedLoop: [
    String.raw`chase 0 times:
          woof 2;
      tail`,
    "",
  ],
  normalFixedLoop: [
    String.raw`chase 5 times:
    woof "Stay.";
    tail`,
    /for \(let i = 0; i < 5; i\+\+\) {\s*console\.log\(`Stay.`\);\s*}/,
  ],
  extraLinesAfterBreak: [
    String.raw`chase while good:
          woof 1;
          poop;
          woof 2;
      tail`,
    /while \(true\) \{\s*console\.log\(1\);\s*break;\s*\}/,
  ],
  extralinesAfterContinue: [
    String.raw`chase while good:
      woof 1;
      walkies;
      woof 2;
    tail`,
    /while \(true\) \{\s*console\.log\(1\);\s*continue;\s*\}/,
  ],
  uncalledFunctionDeclaration: [
    String.raw`trick greet chews[leash:name] fetches leash:
      give "Hello, ![name]";
        tail`,
    /\s*/,
  ],
  functionCallWithHellaParams: [
    String.raw`trick greet chews[leash:name, toeBeans: age, goodBoy: sure]:
        woof "Hello\! My name is ![name] and I am ![age] years old. This is a ![sure] statement";
      tail
      greet("Joe", 12, bad);`,
    /function greet_(\d+)\(name_(\d+), age_(\d+), sure_(\d+)\) {\s*console\.log\(`Hello! My name is \${name_\2} and I am \${age_\3} years old\. This is a \${sure_\4} statement`\);\s*}\s*greet_\1\(`Joe`, 12, false\)/,
  ],
  functionCall: [
    String.raw`trick greet chews[leash:name] fetches leash:
        give "Hello, ![name]";
      tail
      greet("Puppy");`,
    /function greet_(\d+)\(name_(\d+)\) \{\s*return \(`Hello, \$\{name_\2\}`\);\s*\}\s*greet_\1\(`Puppy`\)/,
  ],
  functionCallNoParams: [
    String.raw`trick greet fetches leash:
      give "Hello, CeCe";
    tail
    greet();`,
    /function greet_(\d+)\(\) {\s*return \(`Hello, CeCe`\);\s*}\s*greet_\1\(\)/,
  ],
  breedDeclarationWithConstructor: [
    String.raw`breed Owner is:
        leash name;        
        trick Owner chews[leash:name] fetches Owner;
      tail`,
    /class Owner_\d+ {\s*constructor\(name_(\d+) = ``\) {\s*Object.assign\(this, {\s*name_\1\s*}\);\s*}\s*}/,
  ],
  breedDeclarationWithFieldsMethods: [
    String.raw`breed DogLover is:
        goodBoy a is good & bad;
        toeBeans b is 1 + 3;
        trick DogLover fetches DogLover;
        trick barkAtDog:
            give;
            woof "this statement should go away";
            bark "and this should go away too";
        tail
      tail`,
    /class DogLover_\d+ {\s*constructor\(\) {\s*Object.assign\(this, {}\);\s*this\.a_\d+ = false;\s*this\.b_\d+ = 4;\s*}\s*barkAtDog_\d+\(\) {\s*return;\s*}\s*}/,
  ],
  assingmentFromSelf: [
    String.raw`toeBeans x is 12; x is x; x is 14;`,
    /let x_(\d+) = 12;\s*x_(\1) = 14;/,
  ],
  packLiteral: [
    String.raw`pack[toeBeans] x is [12, 12213, 8485];`,
    /let x_(\d+) = \[12, 12213, 8485\];/,
  ],
  emptyPackLiteral: [
    String.raw`pack[toeBeans] x is [];`,
    /let x_(\d+) = \[\];/,
  ],
  kennelLiteral: [
    String.raw`kennel[leash:toeBeans] x is ["first":12, "second":12213, "third":8485];`,
    /let x_(\d+) = \{\s*`first`: 12,\s*`second`: 12213,\s*`third`: 8485\s*\};/,
  ],
  variableExpression: [String.raw`toeBeans x is 5 +  10;`, /let x_(\d+) = 15;/],
  notLiteral: [String.raw`goodBoy x is not bad;`, /let x_(\d+) = true;/],
  negateLiteral: [String.raw`toeBeans x is - 12;`, /let x_(\d+) = -12;/],
  factorialLiteralSmall: [String.raw`toeBeans x is 6!;`, /let x_(\d+) = 720;/],
  factorialLiteralLarge: [
    String.raw`toeBeans x is 15!;`,
    /let x_(\d+) = 1307674368000;/,
  ],
  nonOptimizedUnary: [
    String.raw`toeBeans x is 5; toeBeans y is x!;`,
    new RegExp(
      factorialFunctionRegex +
        "let x_(\\d+) = 5;\\s*let y_(\\d+) = \\(__factorial\\(x_\\1\\)\\);"
    ),
  ],
  addZeroLeft: [String.raw`toeBeans x is 0 + 12;`, /let x_(\d+) = 12;/],
  addZeroRight: [String.raw`toeBeans x is 12 + 0;`, /let x_(\d+) = 12;/],
  subtractZeroRight: [String.raw`toeBeans x is 12 - 0;`, /let x_(\d+) = 12;/],
  subtractSameNumber: [String.raw`toeBeans x is 12 - 012;`, /let x_(\d+) = 0;/],
  multiplyZeroRight: [String.raw`toeBeans x is 12 * 0;`, /let x_(\d+) = 0;/],
  multiplyZeroLeft: [String.raw`toeBeans x is 0 * 12;`, /let x_(\d+) = 0;/],
  multiplyOneRight: [String.raw`toeBeans x is 12 * 1;`, /let x_(\d+) = 12;/],
  multiplyOneLeft: [String.raw`toeBeans x is 1 * 12;`, /let x_(\d+) = 12;/],
  divideSameNumber: [String.raw`toeBeans x is 12 / 12;`, /let x_(\d+) = 1;/],
  divideOne: [String.raw`toeBeans x is 12 / 1;`, /let x_(\d+) = 12;/],
  divideZero: [String.raw`toeBeans x is 0 / 12;`, /let x_(\d+) = 0;/],
  modZero: [String.raw`toeBeans x is 0 mod 12;`, /let x_(\d+) = 0;/],
  modOne: [String.raw`toeBeans x is 12 mod 1;`, /let x_(\d+) = 0;/],
  modSameNumber: [String.raw`toeBeans x is 12 mod 12;`, /let x_(\d+) = 0;/],
  greaterThanSameNumber: [
    String.raw`goodBoy x is 12 isGreaterThan 12;`,
    /let x_(\d+) = false;/,
  ],
  lessThanSameNumber: [
    String.raw`goodBoy x is 12 isLessThan 12;`,
    /let x_(\d+) = false;/,
  ],
  atLeastSameNumber: [
    String.raw`goodBoy x is 12 isAtLeast 12;`,
    /let x_(\d+) = true;/,
  ],
  atMostSameNumber: [
    String.raw`goodBoy x is 12 isAtMost 12;`,
    /let x_(\d+) = true;/,
  ],
  andFalseLeft: [String.raw`goodBoy x is bad & good;`, /let x_(\d+) = false;/],
  andFalseRight: [String.raw`goodBoy x is good & bad;`, /let x_(\d+) = false;/],
  orTrueLeft: [String.raw`goodBoy x is good | bad;`, /let x_(\d+) = true;/],
  orTrueRight: [String.raw`goodBoy x is bad | good;`, /let x_(\d+) = true;/],
  addLiterals: [String.raw`toeBeans x is 12 + 1;`, /let x_(\d+) = 13;/],
  subtractLiterals: [String.raw`toeBeans x is 12 - 1;`, /let x_(\d+) = 11;/],
  multiplyMultipleOf2Left: [
    String.raw`toeBeans x is 32 * 15;`,
    /let x_(\d+) = 480;/,
  ],
  multiplyMultipleOf2Right: [
    String.raw`toeBeans x is 51 * 8;`,
    /let x_(\d+) = 408;/,
  ],
  multiplyLiterals: [String.raw`toeBeans x is 12 * 5;`, /let x_(\d+) = 60;/],
  divideLiterals: [String.raw`toeBeans x is 12 / 3;`, /let x_(\d+) = 4;/],
  modLiterals: [String.raw`toeBeans x is 32 mod 21 ;`, /let x_(\d+) = 11;/],
  greaterThanLiterals: [
    String.raw`goodBoy x is 12 isGreaterThan 4;`,
    /let x_(\d+) = true;/,
  ],
  atLeastLiterals: [
    String.raw`goodBoy x is 12 isAtLeast 4;`,
    /let x_(\d+) = true;/,
  ],
  atMostLiterals: [
    String.raw`goodBoy x is 12 isAtMost 4;`,
    /let x_(\d+) = false;/,
  ],
  lessThanLiterals: [
    String.raw`goodBoy x is 12 isLessThan 4;`,
    /let x_(\d+) = false;/,
  ],
  equalsLiterals: [
    String.raw`goodBoy x is 12 equals 4;`,
    /let x_(\d+) = false;/,
  ],
  notEqualsLiterals: [
    String.raw`goodBoy x is 12 notEquals 4;`,
    /let x_(\d+) = true;/,
  ],
  withOperatorTemplateLiteralsWithRightInterpolation: [
    String.raw`leash name is "CeCe"; leash x is "Hello " with "![name]";`,
    /let name_(\d+) = `CeCe`;\s*let x_(\d+) = `Hello \$\{name_(\1)\}`;/,
  ],
  withOperatorTemplateLiteralsWithLeftInterpolation: [
    String.raw`leash name is "CeCe"; leash x is "![name] " with "says hello";`,
    /let name_(\d+) = `CeCe`;\s*let x_(\d+) = `\$\{name_\1\} says hello`;/,
  ],
  withOperatorTemplateLiteralsWithoutInterpolation: [
    String.raw`leash x is "CeCe " with "the dog";`,
    /let x_\d+ = `CeCe the dog`;\s*/,
  ],
  withoutOperatorTemplateLiterals: [
    String.raw`leash greeting is "Hello, " without "e";`,
    /let greeting_(\d+) = \(`Hello, `\.replace\(`e`, ''\)\);/,
  ],
  andLiterals: [String.raw`goodBoy x is good & good;`, /let x_(\d+) = true;/],
  orLiterals: [String.raw`goodBoy x is bad | bad;`, /let x_(\d+) = false;/],
};

describe("The optimized JavaScript generator", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      let ast = parse(source);
      ast.analyze(Context.INITIAL);
      ast = ast.optimize();
      // eslint-disable-next-line no-undef
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});

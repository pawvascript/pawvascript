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
  printStringLiteral: [
    String.raw`woof("Hello, world");`,
    `console.log(\`Hello, world\`);`,
  ],
  printTemplateLiteral: [
    String.raw`leash place is "world"; woof("Hello, ![place]");`,
    /let place_(\d+) = `world`;\s*console.log\(`Hello, \${place_\1}`\);/
  ],
  conditional: [
    String.raw`if (good) then: woof "Good boy"; tail`,
    /if \(true\) {\s*console.log\(`Good boy`\);\s*}/
  ],
  // TODO: add test for strings that escape !
  infiniteLoop: [
    String.raw`chase:
      woof "I run forever";
    tail`,
    /while \(true\) {\s*console.log\(`I run forever`\);\s*}/
  ],
  forLoop: [
    String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
        woof i; 
    tail`,
    /for \(let i_(\d+) = 0;\s*\(i_\1 < 10\);\s*i_\1 = \(i_\1 \* 2\)\) {\s*console.log\(i_\1\);\s*}/
  ],
  throughLoop: [
    String.raw`pack[toeBeans] myPack is [1,2,3];
    chase element through myPack:   
      woof element; 
    tail`,
    /let myPack_(\d+) = \[1, 2, 3\];\s*for \(let element_(\d+) of myPack_\1\) {\s*console.log\(element_\2\);\s*}/
  ],
  whileLoop: [
    String.raw`toeBeans x is 0;
    chase while x isAtMost 5:
      woof x;
    tail`,
    /let x_(\d+) = 0;\s*while \(\(x_\1 <= 5\)\) {\s*console.log\(x_\1\);\s*}/
  ],
  fixedLoop: [
    String.raw`chase 5 times:
      woof "Stay.";
    tail`,
    /for \(let i = 0; i < 5; i\+\+\) {\s*console.log\(`Stay.`\);\s*}/
  ],
  variableDeclaration: [
    String.raw`toeBeans age is 10 + 34;`,
    /let age_(\d+) = \(10 \+ 34\);/
  ],
  functionDeclaration: [
    String.raw`trick greet chews[leash:name] fetches leash:
      give "Hello, ![name]";
    tail`,
    /function greet_(\d+)\(name_(\d+)\) {\s*return \(`Hello, \${name_\2}`\)\s*}/
  ],
  factorial: [
    String.raw`toeBeans factorial is 5!;`,
    new RegExp(factorialFunctionRegex + `let factorial_\\d+ = \\(__factorial\\(5\\)\\);`)
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

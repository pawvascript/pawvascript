const parse = require("../../ast/parser");
const generate = require("../../backend/javascript-generator");
const optimize = require("../../semantics/optimizer");
const Context = require("../../semantics/context");

const fixture = {
  firstIfIsTrue: [
    String.raw`if (good) then:
         woof "You're good";
    else:
        woof "You're bad";
    tail`,
    /if \(true\) \{\s*console.log\(`You're good`\);\s*\}/,
  ],
  firstIfIsFalse: [
    String.raw`if (bad) then:
           woof "You're bad";
      else:
          woof "You're good";
      tail`,
    /if \(false\) {} else {\s*console.log\(`You're good`\);\s*}/,
  ],
  forLoop: [
    String.raw`chase toeBeans i is 0 by i+1 while i isGreaterThan 2:
          woof "hi";
      tail`,
    "",
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
  variableExpression: [String.raw`toeBeans x is 5 +  10;`, /let x_(\d+) = 15;/],
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

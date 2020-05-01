const parse = require("../ast/parser");
const generate = require("../backend/javascript-generator");
const Context = require("../semantics/context");

const fixture = {
  ifStatement: [
    String.raw`if (bad) then:
         give "You're bad";
        tail`,
    String.raw`if (bad) then: tail`,
  ],
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

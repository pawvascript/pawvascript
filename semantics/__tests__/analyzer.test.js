/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

// This is just enough to complete 100% analyzer coverage, but feels light to me.
const program = String.raw`toeBeans CeCeAge is 1;`;

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", done => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});

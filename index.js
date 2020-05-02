#!/usr/bin/env node

const { argv } = require("yargs")
  .usage("$0 [-a] [-o] [-i] filename")
  .boolean(["a", "o", "i"])
  .describe("a", "show abstract syntax tree after parsing then stop")
  .describe("o", "do optimizations")
  .describe("i", "generate and show the intermediate code then stop")
  .default({ target: "javascript" })
  .demand(1);

const fs = require("fs");
const util = require("util");
const parse = require("./ast/parser");
const { analyze } = require("./semantics/analyzer");
const optimize = require("./semantics/optimizer");
const generate = require(`./backend/${argv.target}-generator`);

fs.readFile(argv._[0], "utf-8", (error, text) => {
  if (error) {
    console.error(error);
    return;
  }
  let program = parse(text);
  if (argv.a) {
    console.log(util.inspect(program, { depth: null }));
    return;
  }
  analyze(program);
  if (argv.o) {
    optimize(program);
  }
  if (argv.i) {
    console.log(util.inspect(program, { depth: null }));
    return;
  }
  let generatedProgram = generate(program);
  console.log(generatedProgram);
});

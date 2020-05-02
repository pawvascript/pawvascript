/**
 * JavaScript Code Generator 

 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * Tiger expression, bundling the translation of the Tiger standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 * Usage:
 *   const generate = require('./backend/javascript-generator');
 *   generate(tigerExpression);
 */

const {
  Program,
  Block,
  ConditionalStatement,
  InfiniteLoopStatement,
  ForLoopStatement,
  ThroughLoopStatement,
  WhileLoopStatement,
  FixedLoopStatement,
  VariableDeclaration,
  Variable,
  TypeDeclaration,
  BreedType,
  Field,
  Method,
  FunctionDeclaration,
  Function,
  Parameters,
  ConstructorDeclaration,
  Constructor,
  AssignmentStatement,
  FunctionCall,
  PrintStatement,
  GiveStatement,
  BreakStatement,
  ContinueStatement,
  BooleanLiteral,
  NumberLiteral,
  StringLiteral,
  TemplateLiteral,
  PackLiteral,
  ListElement,
  KennelLiteral,
  KeyValuePair,
  VariableExpression,
  UnaryExpression,
  BinaryExpression,
} = require("../ast");

const check = require("../semantics/check.js");

const beautify = require("js-beautify");

const factorialFunction =
  "function __factorial(n) { return (n !== 1) ? n * __factorial(n - 1) : 1; }";
let containsFactorial = false;

function makeOp(op) {
  return (
    {
      equals: "===",
      notEquals: "!==",
      "&": "&&",
      "|": "||",
      isGreaterThan: ">",
      isAtLeast: ">=",
      isAtMost: "<=",
      isLessThan: "<",
      not: "!",
      "'s": ".",
      mod: "%",
    }[op] || op
  );
}

// MODIFIED: javaScriptId(e) takes any PawvaScript identifier name (a string),
// and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular PawvaScript id name.
const javaScriptId = (() => {
  let lastId = 0;
  const map = new Map();
  return (idName) => {
    if (!map.has(idName)) {
      map.set(idName, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${idName}_${map.get(idName)}`;
  };
})();

// Inline implementations of builtins
const builtin = {
  size(s) {
    return `${s}.length`;
  },
  substring([s, beginIndex, endIndex]) {
    return `${s}.substr(${beginIndex}, ${endIndex})`;
  },
  contains([s, substring]) {
    return `${s}.includes(${substring})`;
  },
  indexOfSubstring([s, substring]) {
    return `${s}.indexOf(${substring})`;
  },
  toeBeansToLeash([n]) {
    return `(${n}).toString()`;
  },
  leashToToeBeans([s]) {
    return `parseInt(${s})`;
  },
  goodBoyToToeBeans([b]) {
    return `(${b} + 0)`;
  },
  toeBeansToGoodBoy([n]) {
    return `(${n} !== 0)`;
  },
  leashToGoodBoy([s]) {
    return `(${s} !== '')`;
  },
  goodBoyToLeash([b]) {
    return `(${b}).toString()`;
  },
};

module.exports = function(exp) {
  return beautify(exp.gen(), {
    indent_size: 2,
  });
};

Program.prototype.gen = function() {
  containsFactorial = false;
  const mainCode = this.block.gen();
  return containsFactorial ? factorialFunction + mainCode : mainCode;
};

Block.prototype.gen = function() {
  let statementStrings = [];
  this.statements.forEach((statement) =>
    statementStrings.push(statement.gen())
  );
  return statementStrings.join("");
};

ConditionalStatement.prototype.gen = function() {
  const condition = this.condition.gen();
  const body = this.body.gen();
  let elseIfStrings = "";
  // If we have one or more "otherwise"'s inside of this.otherwise, that means the middle
  // otherwise's are also conditional statements, and we want to produce else-if's for
  // all of them except the last nested otherwise
  while (this.otherwise && this.otherwise.otherwise) {
    elseIfStrings += `else if (${this.otherwise.condition.gen()}) {${this.otherwise.body.gen()}}`;
    this.otherwise = this.otherwise.otherwise;
  }
  const elseString = this.otherwise ? `else { ${this.otherwise.gen()} }` : "";
  return `if (${condition}) {${body}} ${elseIfStrings} ${elseString}`;
};

InfiniteLoopStatement.prototype.gen = function() {
  return `while (true) { ${this.body.gen()} }`;
};

ForLoopStatement.prototype.gen = function() {
  const loopId = javaScriptId(this.localVarDec.id.name);
  return `for (${this.localVarDec.gen()} ${this.condition.gen()} ; ${loopId} = ${this.loopExp.gen()}) { ${this.body.gen()} }`;
};

ThroughLoopStatement.prototype.gen = function() {
  return `for (let ${javaScriptId(this.localVar.name)} of ${javaScriptId(
    this.group.name
  )}) {${this.body.gen()}}`;
};

WhileLoopStatement.prototype.gen = function() {
  return `while (${this.condition.gen()}) { ${this.body.gen()}}`;
};

FixedLoopStatement.prototype.gen = function() {
  return `for (let i = 0; i < ${parseInt(
    this.expression.gen()
  )}; i++) { ${this.body.gen()}}`;
};

VariableDeclaration.prototype.gen = function() {
  return `let ${javaScriptId(this.id.name)} = ${this.variable.gen()};`;
};

Variable.prototype.gen = function() {
  if (this.initializerExp != null) {
    return this.initializerExp.gen();
  } else {
    return `null`;
  }
};

FunctionDeclaration.prototype.gen = function() {
  const name = javaScriptId(this.id.name);
  return `function ${name} ${this.func.gen()}`;
};

Function.prototype.gen = function() {
  const body = this.body.gen();
  const params = this.parameters ? this.parameters.gen() : "";
  return `( ${params} ) {${body}}`;
};

TypeDeclaration.prototype.gen = function() {
  const name = javaScriptId(this.id.name);
  return `class ${name} ${this.breedType.gen()}`;
};

BreedType.prototype.gen = function() {
  const constructorString = this.constructors[0].gen(this.fields);
  const methodStrings = this.methods.map((method) => method.gen());
  return `{ ${constructorString} ${methodStrings.join("")} }`;
};

ConstructorDeclaration.prototype.gen = function(fields) {
  return this.constr.gen(fields);
};

const getFieldForCorrespondingParam = (fields, paramId) => {
  return fields.filter((field) => field.id.name === paramId.name)[0];
};

Constructor.prototype.gen = function(fields) {
  // Classes in JavaScript do not have fields outside of the constructor, so
  // we have to filter through the fields to find all fields that are parameters
  // of the constructor and those that are not

  const parameters = this.parameters ? this.parameters : new Parameters([], []);

  // Fields that are not constructor params each produce an individual statement inside the constructor
  const paramIds = parameters.ids.map((id) => id.name);
  const fieldsThatAreNotConstructorParams = fields.filter(
    (field) => !paramIds.includes(field.id.name)
  );
  const fieldStrings = fieldsThatAreNotConstructorParams
    .map((field) => field.gen())
    .join("");

  // We cannot just use the regular parameters.gen() here because PawvaScript breed fields
  // can have initializer expressions and are otherwise initialized to some default value
  // or null if no default value is applicable; thus, each constructor parameter in JavaScript
  // must have a default value.
  const paramsWithDefaultValues = parameters.ids.map((paramVarExp) => {
    const correspondingField = getFieldForCorrespondingParam(
      fields,
      paramVarExp
    );
    const javaScriptParamId = javaScriptId(paramVarExp.name);
    return `${javaScriptParamId} = ${correspondingField.variable.gen()}`;
  });
  const finalParamsString = paramsWithDefaultValues.join(",");

  const javaScriptParamIds = paramIds.map((pawvaScriptId) =>
    javaScriptId(pawvaScriptId)
  );
  return `constructor( ${finalParamsString} ) { 
    Object.assign(this, { ${javaScriptParamIds} }); 
    ${fieldStrings}
  }`;
};

Field.prototype.gen = function() {
  const fieldId = javaScriptId(this.id.name);
  return `this.${fieldId} = ${this.variable.gen()};`;
};

Method.prototype.gen = function() {
  const methodId = javaScriptId(this.id.name);
  return `${methodId} ${this.func.gen()}`;
};

AssignmentStatement.prototype.gen = function() {
  return `${this.target.gen()} = ${this.source.gen()};`;
};

FunctionCall.prototype.gen = function() {
  const argsArray = this.args.map((arg) => arg.gen());

  if (this.callee.ref.constructor === Constructor) {
    return `new ${javaScriptId(this.callee.name)}(${argsArray.join(",")})`;
  }

  if (builtin[this.callee.name]) {
    return builtin[this.callee.name](argsArray);
  }
  return `${javaScriptId(this.callee.name)}(${argsArray.join(",")})`;
};

PrintStatement.prototype.gen = function() {
  const printType = this.flavor;
  if (printType === "woof") {
    return `console.log(${this.expression.gen()});`;
  } else if (printType === "bark") {
    return `console.log(${this.expression.gen()}.toUpperCase());`;
  } else {
    return `console.error(${this.expression.gen()});`;
  }
};

GiveStatement.prototype.gen = function() {
  return this.expression ? `return (${this.expression.gen()});` : `return;`;
};

Parameters.prototype.gen = function() {
  const paramIds = this.ids.map((paramVarExp) =>
    javaScriptId(paramVarExp.name)
  );
  return paramIds.join(",");
};

BreakStatement.prototype.gen = function() {
  return `break;`;
};

ContinueStatement.prototype.gen = function() {
  return `continue;`;
};

BooleanLiteral.prototype.gen = function() {
  return `${this.value}`;
};

NumberLiteral.prototype.gen = function() {
  return `${this.value}`;
};

StringLiteral.prototype.gen = function() {
  // We need to iterate through all characters in this.value because
  // PawvaScript escapes are not the same as JavaScript escapes
  const characters = this.value
    .split("")
    .map((character, i) =>
      character === "\\" && this.value.charAt(i + 1) === "!" ? "" : character
    );
  return characters.join("");
};

TemplateLiteral.prototype.gen = function() {
  if (this.exps) {
    const expressionStrings = this.exps.map((exp) => `\${${exp.gen()}}`); // a VariableExpression's .gen() method handles the javaScriptId
    let templateString = "";

    this.quasis.map((quasi, i) => {
      templateString +=
        quasi.gen() +
        (expressionStrings.length > i ? expressionStrings[i] : "");
    });

    return `\`${templateString}\``;
  }

  return `\`${this.quasis[0].gen()}\``;
};

PackLiteral.prototype.gen = function() {
  let pack = this.elements.map((element) => element.gen());
  return `[${pack.join(",")}]`;
};

ListElement.prototype.gen = function() {
  return this.hasSpread ? `...${this.value.gen()}` : this.value.gen();
};

KennelLiteral.prototype.gen = function() {
  let keyValuePairs = [];
  this.keyValuePairs.forEach((keyValuePair) => {
    keyValuePairs.push(keyValuePair.gen());
  });
  return `{${keyValuePairs.toString()}}`;
};

KeyValuePair.prototype.gen = function() {
  return `${this.key.gen()}: ${this.value.gen()}`;
};

VariableExpression.prototype.gen = function() {
  return `${javaScriptId(this.name)}`;
};

UnaryExpression.prototype.gen = function() {
  if (this.op === "not") {
    return `(!${this.operand.gen()})`;
  } else if (this.op === "!") {
    containsFactorial = true;
    return `(__factorial(${this.operand.gen()}))`;
  } else {
    // this.op === '-'
    return `(-${this.operand.gen()})`;
  }
};

BinaryExpression.prototype.gen = function() {
  if (this.op === "with") {
    return `(${this.left.gen()}.concat(${this.right.gen()}))`;
  } else if (this.op === "without") {
    if (check.isListType(this.left.type)) {
      return `(${this.left.gen()}.filter(e => e !== ${this.right.gen()}))`;
    } else {
      return `(${this.left.gen()}.replace(${this.right.gen()}, ''))`;
    }
  } else if (this.op === "at" || this.op === "of") {
    return `(${this.left.gen()}[${this.right.gen()}])`;
    // Note: this code sort of works, but is buggy; remains a TODO to fix and add tests
    //   } else if (this.op === "'s") {
    //     return `(${this.left.gen()}.${this.right.gen()})`;
  }

  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

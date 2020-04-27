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
  ListType,
  DictType,
  IdType,
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

const { NumType, StringType, BoolType } = require("./builtins");
const beautify = require("js-beautify");

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
    }[op] || op
  );
}

// javaScriptId(e) takes any PawvaScript identifier name (a string),
// and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular PawvaScript id name.
const javaScriptId = (() => {
  let lastIdSuffix = 0;
  const map = new Map();
  return (psID) => {
    if (!map.has(psID)) {
      map.set(psID, ++lastIdSuffix); // eslint-disable-line no-plusplus
    }
    return `${psID}_${map.get(v)}`;
  };
})();

// // Let's inline the built-in functions, because we can!
// const builtin = {
//     size
//   print([s]) {
//     return `console.log(${s})`;
//   },
//   ord([s]) {
//     return `(${s}).charCodeAt(0)`;
//   },
//   chr([i]) {
//     return `String.fromCharCode(${i})`;
//   },
//   size([s]) {
//     return `${s}.length`;
//   },
//   substring([s, i, n]) {
//     return `${s}.substr(${i}, ${n})`;
//   },
//   concat([s, t]) {
//     return `${s}.concat(${t})`;
//   },
//   not(i) {
//     return `(!(${i}))`;
//   },
// };

module.exports = function(exp) {
  return beautify(exp.gen(), { indent_size: 2 });
};

Program.prototype.gen = function() {
  return this.block.gen();
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
  const elsePart = this.otherwise ? this.otherwise.gen() : "null";
  return `if ( ${condition} ) { ${body} } ${
    elsePart ? `else { ${elsePart} }` : ""
  }`;
};

InfiniteLoopStatement.prototype.gen = function() {
  return `while (true) { ${this.body.gen()} }`;
};

ForLoopStatement.prototype.gen = function() {
  const loopId = javaScriptId(this.localVarDec.id.name);
  return `for (${this.localVarDec.gen()} ; ${this.condition.gen()} ; ${loopId} = ${this.loopExp.gen()}) { ${this.body.gen()} }`;
};

ThroughLoopStatement.prototype.gen = function() {
  return `for (let ${javaScriptId(this.localVar.id)} of ${javaScriptId(
    this.group.id
  )} { ${this.body.gen()}})`;
};

WhileLoopStatement.prototype.gen = function() {
  return `while (${this.condition}) { ${this.body}}`;
};

FixedLoopStatement.prototype.gen = function() {
  return `for (let i = 0; i < ${parseInt(this.expression.gen())}; i++) { ${
    this.body
  }}`;
};

VariableDeclaration.prototype.gen = function() {
  return `let ${javaScriptId(this.id.name)} = ${this.variable.gen()}`;
};

Variable.prototype.gen = function() {
  if (this.initializerExp != null) {
    return this.initializerExp.gen();
  } else {
    return `null`;
  }
};
// TODO ask Toal

// PS: leash name = cat;
// JS: let name = null;

// PS: leash name; // value is null
// JS: let name; // value would be undefined

// PS: Owner lucille; // value is null
// JS: let lucille = null; // undefined

FunctionDeclaration.prototype.gen = function() {
  const name = javaScriptId(this.id);
  return `function ${name} ${this.func.gen()}`;
};

Function.prototype.gen = function() {
  const body = this.body.gen();
  return `( ${this.parameters.gen()} ) {${body}}`;
};

TypeDeclaration.prototype.gen = function() {
  const name = javaScriptId(this.id);
  return `class ${name} ${this.breedType.gen()}`;
};

BreedType.prototype.gen = function() {
  const constructorString = this.constructors[0].gen(fields);
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

  // Fields that are not constructor params each produce an individual statement inside the constructor
  const paramIds = this.parameters.gen().split(",");
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
  const paramsWithDefaultValues = this.parameters.ids.map((paramVarExp) => {
    const correspondingField = getFieldForCorrespondingParam(
      fields,
      paramVarExp
    );
    return `${paramVarExp.name} = ${correspondingField.variable.gen()}`;
  });
  const finalParamsString = paramsWithDefaultValues.join(",");

  return `constructor( ${finalParamsString} ) { 
    Object.assign(this, { ${paramIds} }); 
    ${fieldStrings}
  }`;
};

Field.prototype.gen = function() {
  const fieldId = javaScriptId(this.id.name);
  return `this.${javaScriptId} = ${this.variable.gen()};`;
};

Method.prototype.gen = function() {
  const methodId = javaScriptId(this.id.name);
  return `${methodId} ${this.func.gen()}`;
};

// TODO ask toal: do we need any gen methods for types since JS does not have types?

AssignmentStatement.prototype.gen = function() {
  return `${this.target.gen()} = ${this.source.gen()};`;
};

FunctionCall.prototype.gen = function() {
  return `${javaScriptId(this.callee.id)}(${this.args.gen()})`;
};

PrintStatement.prototype.gen = function() {
  const printType = this.flavor;
  if (printType === "woof") {
    return `console.log(${this.expression.gen()})`;
  } else if (printType === "bark") {
    return `console.log(${this.expression.gen()}.toUpperCase())`;
  } else {
    return `console.error(${this.expression.gen()})`;
  }
};

GiveStatement.prototype.gen = function() {
  return `return (${this.expression.gen()})`;
};

Parameters.prototype.gen = function() {
  const paramIds = this.ids.map((paramVarExp) => javaScriptId(varExp.name));
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
  return `"${this.value}"`;
};

// PS: "![dogName] is the ![rating] dog";
// JS: `${dogName} is the ${rating} dog`;
TemplateLiteral.prototype.gen = function() {
  const expressionStrings = this.exps.map((exp) => `\${${this.exp.gen()}}`);
  const templateString = "";

  this.quasis.map(
    (quasi,
    (index) => {
      templateString += quasi + expressionStrings[index];
    })
  );

  return templateString;
};

PackLiteral.prototype.gen = function() {
  return this.value.gen();
};

ListElement.prototype.gen = function() {
  return this.value.gen();
};

KennelLiteral.prototype.gen = function() {
  let keyValuePairs = [];
  this.keyValuePairs.forEach((keyValuePair) => {
    keyValuePairs.push(keyValuePair.gen());
  });
  return `{${keyValuePairs.toString()}}; `;
};

KeyValuePair.prototype.gen = function() {
  return `${this.key.gen()}: ${this.value.gen()}`;
};

VariableExpression.prototype.gen = function() {
  return this.ref.gen();
};

UnaryExpression.prototype.gen = function() {
  if (this.op.equals("not")) {
    return `(!${this.operand.gen()})`;
  } else if (this.op.equals("!")) {
    // TODO: ask Toal how to generate factorial
    let factorialString = [];
    let num;
    // this.operand is possible variable........ so a * a-1 * a-2 * ...
    if (this.operand.constructor === VariableExpression) {
      num = parseInt(this.operand.variable.ref.gen());
    } else {
      num = parseInt(this.operand.gen()); // (1+2)!  ?????? what do lmao
    }
    for (let i = num; i !== 0; i--) {
      factorialString.push(i);
    }
    return `(${factorialString.join(" * ")})`;
  } else {
    // this.operand == '-'
    return `-${this.operand.gen()}`;
  }
};

BinaryExpression.prototype.gen = function() {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

VariableExpression.prototype.gen = function() {
  return `${javaScriptId(this.name)}`;
};

// ArrayExp.prototype.gen = function() {
//   return `Array(${this.size.gen()}).fill(${this.fill.gen()})`;
// };

// Assignment.prototype.gen = function() {
//   return `${this.target.gen()} = ${this.source.gen()}`;
// };

// BinaryExp.prototype.gen = function() {
//   return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
// };

// Binding.prototype.gen = function() {
//   return `${this.id} : ${this.value.gen()}`;
// };

// Break.prototype.gen = function() {
//   return 'break';
// };

// Call.prototype.gen = function() {
//   const args = this.args.map(a => a.gen());
//   if (this.callee.builtin) {
//     return builtin[this.callee.id](args);
//   }
//   return `${javaScriptId(this.callee)}(${args.join(',')})`;
// };

// ExpSeq.prototype.gen = function() {
//   return this.exps.map(e => e.gen()).join(';');
// };

// ForExp.prototype.gen = function() {
//   const i = javaScriptId(this.index);
//   const low = this.low.gen();
//   const hi = javaScriptId(new Variable('hi'));
//   const preAssign = `let ${hi} = ${this.high.gen()};`;
//   const loopControl = `for (let ${i} = ${low}; ${i} <= ${hi}; ${i}++)`;
//   const body = this.body.gen();
//   return `${preAssign} ${loopControl} {${body}}`;
// };

// Func.prototype.gen = function() {
//   const name = javaScriptId(this);
//   const params = this.params.map(javaScriptId);
//   // "Void" functions do not have a JS return, others do
//   const body = this.body.type ? makeReturn(this.body) : this.body.gen();
//   return `function ${name} (${params.join(',')}) {${body}}`;
// };

// IdExp.prototype.gen = function() {
//   return javaScriptId(this.ref);
// };

// IfExp.prototype.gen = function() {
//   const thenPart = this.consequent.gen();
//   const elsePart = this.alternate ? this.alternate.gen() : 'null';
//   return `((${this.test.gen()}) ? (${thenPart}) : (${elsePart}))`;
// };

// LetExp.prototype.gen = function() {
//   if (this.type) {
//     // This looks insane, but let-expressions really are closures!
//     return `(() => {${makeReturn(this)} ; })()`;
//   }
//   const filteredDecs = this.decs.filter(d => d.constructor !== TypeDec);
//   return [...filteredDecs, ...this.body].map(e => e.gen()).join(';');
// };

// Literal.prototype.gen = function() {
//   return this.type === StringType ? `"${this.value}"` : this.value;
// };

// MemberExp.prototype.gen = function() {
//   return `${this.record.gen()}.${this.id}`;
// };

// SubscriptedExp.prototype.gen = function() {
//   return `${this.array.gen()}[${this.subscript.gen()}]`;
// };

// NegationExp.prototype.gen = function() {
//   return `(- (${this.operand.gen()}))`;
// };

// Nil.prototype.gen = function() {
//   return 'null';
// };

// RecordExp.prototype.gen = function() {
//   return `{${this.bindings.map(b => b.gen()).join(',')}}`;
// };

// Variable.prototype.gen = function() {
//   return `let ${javaScriptId(this)} = ${this.init.gen()}`;
// };

// WhileExp.prototype.gen = function() {
//   return `while (${this.test.gen()}) { ${this.body.gen()} }`;
// };

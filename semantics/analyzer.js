/*
 * The semantic analyzer
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
  Type,
  BreedType,
  Field,
  Method,
  PrimitiveType,
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
  Expression,
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
  BinaryExpression
} = require("../ast");

const {
  NumType,
  StringType,
  BoolType,
  standardFunctions
} = require("./builtins");
const check = require("./check");
const Context = require("./context");

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

Program.prototype.analyze = function(context) {
  this.block.analyze(context);
};

Block.prototype.analyze = function(context) {
  const newContext = context.createChildContextForBlock();
  this.statements.forEach(statement => {
    statement.analyze(newContext);
  });
};

ConditionalStatement.prototype.analyze = function(context) {
  this.condition.analyze(context);
  this.body.analyze(context);
  if (this.otherwise) {
    this.otherwise.analyze(context);
  }
};

InfiniteLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.body.analyze(bodyContext);
};

// ForExp.prototype.analyze = function(context) {
//   this.low.analyze(context);
//   check.isInteger(this.low, "Low bound in for");
//   this.high.analyze(context);
//   check.isInteger(this.high, "High bound in for");
//   const bodyContext = context.createChildContextForLoop();
//   this.index = new Variable(this.index, this.low.type);
//   this.index.readOnly = true;
//   bodyContext.add(this.index);
//   this.body.analyze(bodyContext);
// };

ForLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.localVarDec.analyze(bodyContext);
  check.isNumberType(this.localVarDec.variable.type);
  this.loopExp.analyze(context);
  check.isNumber(this.loopExp);
  this.condition.analyze(context);
  check.isBool(this.condition);
  this.body.analyze(bodyContext);
};

ThroughLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.localVar.analyze(bodyContext);
  //TODO Make localVar ReadOnly in context
  //this.localVar.isReadOnly = true;
  this.group.analyze(bodyContext);
  //TODO Are Lists the only thing ThroughLoop can iterate through?
  check.isListType(this.group.type);
  this.body.analyze(bodyContext);
};

//TODO FINISH THIS
WhileLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.condition.analyze(bodyContext);
  check.isBool(this.condition);
  this.body.analyze(bodyContext);
};

FixedLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.expression.analyze(bodyContext);
  check.isNumber(this.expression);
  this.body.analyze(bodyContext);
};

VariableDeclaration.prototype.analyze = function(context) {
  this.variable.analyze(context);
  context.add(this.id.name, this.variable);
};

Variable.prototype.analyze = function(context) {
  this.type.analyze(context);
  this.initializerExp.analyze(context);
  check.expressionsHaveTheSameType(this, this.initializerExp);
};

FunctionDeclaration.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForFunctionBody();
  this.func.analyze(bodyContext);
  context.add(this.id.name, this.func);
};

Function.prototype.analyze = function(context) {
  if (parameters) {
    this.parameters.analyze(context);
  }
  if (returnType) {
    this.returnType.analyze(context);
  }
  this.body.analyze(context);
};

TypeDeclaration.prototype.analyze = function(context) {
  const newContext = context.createChildContextForBlock();
  this.breedType.analyze(newContext);
  context.add(this.id.name, this.breedType);
};

BreedType.prototype.analyze = function(context) {
  this.constructors.forEach(constructor => {
    constructor.analyze(context);
  });
  this.fields.forEach(field => {
    field.analyze(context);
  });
  this.methods.forEach(method => {
    method.analyze(context);
  });
};

ConstructorDeclaration.prototype.analyze = function(context) {
  const newContext = context.createChildContextForFunctionBody();
  this.constr.analyze(newContext);
  context.add(this.id.name, this.constr);
};

Constructor.prototype.analyze = function(context) {
  if (parameters) {
    this.parameters.analyze(context);
  }
  if (returnType) {
    this.returnType.analyze(context);
  }
};

Field.prototype.analyze = function(context) {
  if (this.variable) {
    this.variable.analyze(context);
  }
  context.add(this.id.name, this.variable);
};

Method.prototype.analyze = function(context) {
  if (this.func) {
    const bodyContext = context.createChildContextForFunctionBody();
    this.func.analyze(bodyContext);
  }
  context.add(this.id.name, this.func);
};

//Question what to do here?
PrimitiveType.prototype.analyze = function(context) {
  //check that name is toeBeans, leash, or goodBoy?
  //change this.type?
  // currently, `this` is an object of type PrimitiveType whose `type` field is "goodBoy"
  // .......and `BoolType` is also an object of type PrimitiveType, whose `type` field is "goodBoy"
  // so they are structurally identical, but they point to two separate objects in memory
  // this is currently just changing the pointers so that they point to the same object in memory
  // i.e., there is only ONE BoolType object (like a singleton)
  // is this necessary???
  if (this.type === "goodBoy") {
    this.type = BoolType;
  } else if (this.type === "leash") {
    this.type = StringType;
  } else if (this.type === "toeBeans") {
    this.type = NumType;
  }
};

ListType.prototype.analyze = function(context) {
  this.memberType.analyze(context);
};

DictType.prototype.analyze = function(context) {
  this.keyType.analyze(context);
  this.valueType.analyze(context);
};

IdType.prototype.analyze = function(context) {
  const ref = context.lookup(this.name);
  this.ref = ref;
};

AssignmentStatement.prototype.analyze = function(context) {
  const targetVariable = context.lookup(this.target);
  this.source.analyze(context);
  // do we need this?
  this.target.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
  check.isNotReadOnly(this.target);
  // do we need to actually set the new value of the variable??
  // context.locals.set(this.target, this.source);
};

FunctionCall.prototype.analyze = function(context) {
  this.callee = context.lookup(this.callee);
  check.isFunction(this.callee);
  this.args.forEach(arg => arg.analyze(context));
  check.legalArguments(this.args, this.callee.parameters);
  this.type = this.callee.returnType;
};

BreakStatement.prototype.analyze = function(context) {
  check.inLoop(context, "poop");
};

ContinueStatement.prototype.analyze = function(context) {
  check.inLoop(context, "walkies");
};

BooleanLiteral.prototype.analyze = function() {
  this.type = BoolType;
};

NumberLiteral.prototype.analyze = function() {
  this.type = NumType;
};

StringLiteral.prototype.analyze = function() {
  this.type = StringType;
};

TemplateLiteral.prototype.analyze = function(context) {};

PackLiteral.prototype.analyze = function(context) {
  this.elements.forEach(element => {
    element.analyze(context);
  });
  this.type = ListType; // Not builtin?
};

ListElement.prototype.analyze = function(context) {
  this.value.analyze(context);
  check.validSpread(context, this.value);
};

KennelLiteral.prototype.analyze = function(context) {
  this.keyValuePairs.forEach(keyValuePair => {
    // Check each key type is the same and each value type is the same???
    keyValuePair.analyze(context);
  });
  this.type = DictType; // Not builtin?
};

KeyValuePair.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

VariableExpression.prototype.analyze = function(context) {
  this.ref = context.lookup(this.name); // returns the Variable object
};

UnaryExpression.prototype.analyze = function(context) {
  this.operand.analyze(context);
  if (/[-!]/.test(this.op)) {
    check.isNumber(this.operand);
    this.type = NumType;
  } else if (/[^not$]/.test(this.op)) {
    check.isBool(this.operand);
    this.type = BoolType;
  }
};

BinaryExpression.prototype.analyze = function(context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (/[-+*/]/.test(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = NumType;
  } else if (/[&|]/.test(this.op)) {
    check.isBool(this.left);
    check.isBool(this.right);
    this.type = BoolType;
  } else if (
    /isGreaterThan?|isAtLeast?|isAtMost?|isLessThan?|equals?|notEquals?/.test(
      this.op
    )
  ) {
    check.expressionsHaveTheSameType(this.left, this.right);
    check.isNumberOrString(this.left);
    check.isNumberOrString(this.right);
    this.type = BoolType;
  } else if (/^with/.test(this.op)) {
    //TODO add array concat and combo (at, of)
    check.isString(this.left);
    check.isString(this.right);
    this.type = StringType;
  } else {
    check.expressionsHaveTheSameType(this.left, this.right);
  }
  //Not sure about this
  //this.type = IntType;
};

// ArrayExp.prototype.analyze = function(context) {
//   this.type = context.lookup(this.type);
//   check.isArrayType(this.type);
//   this.size.analyze(context);
//   check.isInteger(this.size);
//   this.fill.analyze(context);
//   check.isAssignableTo(this.fill, this.type.memberType);
// };

// ArrayType.prototype.analyze = function(context) {
//   this.memberType = context.lookup(this.memberType);
// };

// Assignment.prototype.analyze = function(context) {
//   this.source.analyze(context);
//   this.target.analyze(context);
//   check.isAssignableTo(this.source, this.target.type);
//   check.isNotReadOnly(this.target);
// };

// Break.prototype.analyze = function(context) {
//   check.inLoop(context, "break");
// };

// BinaryExp.prototype.analyze = function(context) {
//   this.left.analyze(context);
//   this.right.analyze(context);
//   if (/[-+*/&|]/.test(this.op)) {
//     check.isInteger(this.left);
//     check.isInteger(this.right);
//   } else if (/<=?|>=?/.test(this.op)) {
//     check.expressionsHaveTheSameType(this.left, this.right);
//     check.isIntegerOrString(this.left);
//     check.isIntegerOrString(this.right);
//   } else {
//     check.expressionsHaveTheSameType(this.left, this.right);
//   }
//   this.type = IntType;
// };

// Binding.prototype.analyze = function(context) {
//   this.value.analyze(context);
// };

// Call.prototype.analyze = function(context) {
//   this.callee = context.lookup(this.callee);
//   check.isFunction(this.callee, "Attempt to call a non-function");
//   this.args.forEach(arg => arg.analyze(context));
//   check.legalArguments(this.args, this.callee.params);
//   this.type = this.callee.returnType;
// };

// ExpSeq.prototype.analyze = function(context) {
//   this.exps.forEach(e => e.analyze(context));
//   if (this.exps.length > 0) {
//     this.type = this.exps[this.exps.length - 1].type;
//   }
// };

// Field.prototype.analyze = function(context) {
//   this.type = context.lookup(this.type);
// };

// ForExp.prototype.analyze = function(context) {
//   this.low.analyze(context);
//   check.isInteger(this.low, "Low bound in for");
//   this.high.analyze(context);
//   check.isInteger(this.high, "High bound in for");
//   const bodyContext = context.createChildContextForLoop();
//   this.index = new Variable(this.index, this.low.type);
//   this.index.readOnly = true;
//   bodyContext.add(this.index);
//   this.body.analyze(bodyContext);
// };

// // Function analysis is broken up into two parts in order to support (nutual)
// // recursion. First we have to do semantic analysis just on the signature
// // (including the return type). This is so other functions that may be declared
// // before this one have calls to this one checked.
// Func.prototype.analyzeSignature = function(context) {
//   this.bodyContext = context.createChildContextForFunctionBody();
//   this.params.forEach(p => p.analyze(this.bodyContext));
//   this.returnType = !this.returnType
//     ? undefined
//     : context.lookup(this.returnType);
// };

// Func.prototype.analyze = function() {
//   this.body.analyze(this.bodyContext);
//   check.isAssignableTo(
//     this.body,
//     this.returnType,
//     "Type mismatch in function return"
//   );
//   delete this.bodyContext; // This was only temporary, delete to keep output clean.
// };

// IdExp.prototype.analyze = function(context) {
//   this.ref = context.lookup(this.ref);
//   this.type = this.ref.type;
// };

// IfExp.prototype.analyze = function(context) {
//   this.test.analyze(context);
//   check.isInteger(this.test, "Test in if");
//   this.consequent.analyze(context);
//   if (this.alternate) {
//     this.alternate.analyze(context);
//     if (this.consequent.type) {
//       check.expressionsHaveTheSameType(this.consequent, this.alternate);
//     } else {
//       check.mustNotHaveAType(this.alternate);
//     }
//   }
//   this.type = this.consequent.type;
// };

// LetExp.prototype.analyze = function(context) {
//   const newContext = context.createChildContextForBlock();
//   this.decs.filter(d => d.constructor === TypeDec).map(d => newContext.add(d));
//   this.decs
//     .filter(d => d.constructor === Func)
//     .map(d => d.analyzeSignature(newContext));
//   this.decs.filter(d => d.constructor === Func).map(d => newContext.add(d));
//   this.decs.map(d => d.analyze(newContext));
//   check.noRecursiveTypeCyclesWithoutRecordTypes(this.decs);
//   this.body.map(e => e.analyze(newContext));
//   if (this.body.length > 0) {
//     this.type = this.body[this.body.length - 1].type;
//   }
// };

// Literal.prototype.analyze = function() {
//   if (typeof this.value === "number") {
//     this.type = IntType;
//   } else {
//     this.type = StringType;
//   }
// };

// MemberExp.prototype.analyze = function(context) {
//   this.record.analyze(context);
//   check.isRecord(this.record);
//   const field = this.record.type.getFieldForId(this.id);
//   this.type = field.type;
// };

// NegationExp.prototype.analyze = function(context) {
//   this.operand.analyze(context);
//   check.isInteger(this.operand, "Operand of negation");
//   this.type = IntType;
// };

// Nil.prototype.analyze = function() {
//   this.type = NilType;
// };

// Param.prototype.analyze = function(context) {
//   this.type = context.lookup(this.type);
//   context.add(this);
// };

// RecordExp.prototype.analyze = function(context) {
//   this.type = context.lookup(this.type);
//   check.isRecordType(this.type);
//   this.bindings.forEach(binding => {
//     const field = this.type.getFieldForId(binding.id);
//     binding.analyze(context);
//     check.isAssignableTo(binding.value, field.type);
//   });
// };

// RecordType.prototype.analyze = function(context) {
//   const usedFields = new Set();
//   this.fields.forEach(field => {
//     check.fieldHasNotBeenUsed(field.id, usedFields);
//     usedFields.add(field.id);
//     field.analyze(context);
//   });
// };

// RecordType.prototype.getFieldForId = function(id) {
//   const field = this.fields.find(f => f.id === id);
//   if (!field) {
//     throw new Error("No such field");
//   }
//   return field;
// };

// SubscriptedExp.prototype.analyze = function(context) {
//   this.array.analyze(context);
//   check.isArray(this.array);
//   this.subscript.analyze(context);
//   check.isInteger(this.subscript);
//   this.type = this.array.type.memberType;
// };

// TypeDec.prototype.analyze = function(context) {
//   this.type.analyze(context);
// };

// Variable.prototype.analyze = function(context) {
//   this.init.analyze(context);
//   if (this.type) {
//     this.type = context.lookup(this.type);
//     check.isAssignableTo(this.init, this.type);
//   } else {
//     // Yay! type inference!
//     this.type = this.init.type;
//   }
//   context.add(this);
// };

// WhileExp.prototype.analyze = function(context) {
//   this.test.analyze(context);
//   check.isInteger(this.test, "Test in while");
//   this.body.analyze(context.createChildContextForLoop());
// };

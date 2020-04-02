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
  const newContext = context.createChildContextForLoop();
  this.body.analyze(newContext);
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
  this.localVarDec.analyze(context);
  check.isNumberType(this.localVarDec.variable.type);
  this.loopExp.analyze(context);
  check.isNumber(this.loopExp);
  this.condition.analyze(context);
  check.isBool(this.condition);
  const bodyContext = context.createChildContextForLoop();
  //TODO Do we need index?
  this.index = new Variable(NumType, this.index);
  this.index.readOnly = true;
  bodyContext.add(this.index);
  this.body.analyze(bodyContext);
};

ThroughLoopStatement.prototype.analyze = function(context) {
  this.localVar.analyze(context);
  this.group.analyze(context);
  //TODO Are Lists the only thing ThroughLoop can iterate through?
  check.isListType(this.group.type);
  const bodyContext = context.createChildContextForLoop();
  //TODO Do we need index?
  this.index = new Variable(this.low.type, this.index);
  this.index.readOnly = true;
  bodyContext.add(this.index);
  this.body.analyze(bodyContext);
};

//TODO FINISH THIS
WhileLoopStatement.prototype.analyze = function(context) {
  this.condition.analyze(context);
  check.isBool(this.condition);
  const bodyContext = context.createChildContextForLoop();
  this.body.analyze(bodyContext);
};

//TODO I think we add to context here? Do we need to analyze
VariableDeclaration.prototype.analyze = function(context) {
  context.add(this);
  this.variable.analyze(context);
};

//TODO Do we need to analyze?
Variable.prototype.analyze = function(context) {
  this.initializerExp.analyze(context);
};

//TODO not sure this is right... How do we change assignment?
AssignmentStatement.prototype.analyze = function(context) {
  this.source.analyze(context);
  this.target.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
  check.isNotReadOnly(this.target);
  const current = context.lookup(this.target);
  context.locals.set(this.target, this.source);
};

BreakStatement.prototype.analyze = function(context) {
  check.inLoop(context, "break");
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
    //TODO add array concat and combo
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

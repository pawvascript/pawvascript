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

const {
  NumType,
  StringType,
  BoolType,
  standardFunctions,
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
  this.statements.forEach((statement) => {
    statement.analyze(newContext);
  });
};

ConditionalStatement.prototype.analyze = function(context) {
  this.condition.analyze(context);
  check.isBool(this.condition);
  this.body.analyze(context);
  if (this.otherwise) {
    this.otherwise.analyze(context);
  }
};

InfiniteLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.body.analyze(bodyContext);
};

ForLoopStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  this.localVarDec.analyze(bodyContext);
  check.isNumber(this.localVarDec.variable.type);
  this.loopExp.analyze(context);
  check.isNumber(this.loopExp);
  this.condition.analyze(context);
  check.isBool(this.condition);
  this.body.analyze(bodyContext);
};

ThroughLoopStatement.prototype.analyze = function(context) {
  this.group.analyze(context);
  // Note: PawvaScript currently only supports throughloops that iterate through a ListType.
  // In future iterations, we hope to implement iterating through other types like StringTypes and DictTypes.
  check.isListType(this.group.type);
  const listMemberType = this.group.memberType;

  const bodyContext = context.createChildContextForLoop();

  bodyContext.add(this.localVar.name, new Variable(listMemberType));
  this.localVar.analyze(bodyContext);
  this.localVar.ref.isReadOnly = true;

  this.body.analyze(bodyContext);
};

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
  this.id.ref = this.variable;
  context.add(this.id.name, this.variable);
};

Variable.prototype.analyze = function(context) {
  this.type.analyze(context);
  this.initializerExp.analyze(context);
  check.expressionsHaveTheSameType(this, this.initializerExp);
};

FunctionDeclaration.prototype.analyze = function(context) {
  context.add(this.id.name, this.func);
  const bodyContext = context.createChildContextForFunctionBody();
  this.func.analyze(bodyContext);
};

Function.prototype.analyze = function(context) {
  if (this.parameters) {
    this.parameters.analyze(context);
  }
  if (this.returnType) {
    this.returnType.analyze(context);
  }
  this.body.analyze(context);
};

TypeDeclaration.prototype.analyze = function(context) {
  context.add(this.id.name, this.breedType);
  this.breedType.analyze(context, this.id);
};

BreedType.prototype.analyze = function(context, breedId) {
  const usedIdentifiers = new Set();
  this.fields.forEach((field) => {
    check.identifierHasNotBeenUsed(field.id.name, usedIdentifiers);
    usedIdentifiers.add(field.id.name);
    field.analyze(context);
  });
  this.methods.forEach((method) => {
    check.identifierHasNotBeenUsed(method.id.name, usedIdentifiers);
    usedIdentifiers.add(method.id.name);
    method.analyze(context);
  });
  // Note: PawvaScript currently only supports having at most one constructor per TypeDeclaration.
  // In future iterations, we hope to implement method overloading in PawvaScript, which would
  // allow us to have multiple constructors for a single BreedType.
  check.noMoreThanOneConstructor(this.constructors);
  this.constructors.forEach((constructorDec) => {
    constructorDec.analyze(context, breedId);
  });
};

ConstructorDeclaration.prototype.analyze = function(context, breedId) {
  check.constructorNameMatchesBreedId(this.id, breedId);
  this.constr.analyze(context, breedId);
};

Constructor.prototype.analyze = function(context, constructorId, breedId) {
  const currentBreed = context.lookup(breedId.name);
  if (this.parameters) {
    this.parameters.analyze(context);
  }
  check.constructorParamsAreFields(this.parameters, currentBreed.fields);

  check.constructorHasReturnType(this);
  this.returnType.analyze(context);
  check.constructorReturnsBreedType(this, currentBreed);
};

Field.prototype.analyze = function(context) {
  if (this.variable) {
    this.variable.analyze(context);
  }
  context.add(this.id.name, this.variable); // I DONT THINK WE DO THIS??
};

// toal question: okay, wait: so fields and methods should NOT be added to the context, but what if
// we want to use the type's fields as variables in the methods? do we add the fields as variable
// declarations to the method's context?
Method.prototype.analyze = function(context) {
  if (this.func) {
    const bodyContext = context.createChildContextForFunctionBody();
    this.func.analyze(bodyContext);
  }
  context.add(this.id.name, this.func); // DONT THINK WE DO THIS EITEHR BUT NEED TO ASK
};

// Question what to do here?
PrimitiveType.prototype.analyze = function() {
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
  const targetVariable = context.lookup(this.target.name);
  this.source.analyze(context);
  // do we need this?
  //   targetVariable.analyze(context);
  check.isAssignableTo(this.source, targetVariable.type);
  check.isNotReadOnly(targetVariable);
  // do we need to actually set the new value of the variable??
  // context.locals.set(this.target, this.source);
};

FunctionCall.prototype.analyze = function(context) {
  // this.callee is at first a VariableExpression whose name is the id of the function
  // replace this.callee with a pointer to the actual function defined in this context
  // TODO toal question: or do we set the VariableExpresion's ref???
  this.callee = context.lookup(this.callee.name);
  check.isFunction(this.callee);
  this.args.forEach((arg) => arg.analyze(context));
  check.legalArguments(this.args, this.callee.parameters);
  this.type = this.callee.returnType;
};

PrintStatement.prototype.analyze = function(context) {
  this.expression.analyze(context);
};

GiveStatement.prototype.analyze = function(context) {
  check.inFunction(context, "give");
  this.expression.analyze(context);
  check.typesMatch(this.expression.type, context.currentFunction.returnType);
};

BreakStatement.prototype.analyze = function(context) {
  check.inLoop(context, "poop");
};

ContinueStatement.prototype.analyze = function(context) {
  check.inLoop(context, "walkies");
};

Parameters.prototype.analyze = function(context) {
  this.ids.forEach((paramId, i) => {
    const paramType = this.types[i];
    paramType.analyze(context);
    context.add(paramId.name, new Variable(paramType));
  });
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

TemplateLiteral.prototype.analyze = function(context) {
  this.exps.forEach((exp) => {
    exp.analyze(context);
  });
};

PackLiteral.prototype.analyze = function(context) {
  this.elements.forEach((element) => {
    element.analyze(context);
    check.typesMatch(element.type, this.elements[0].type);
  });
  const memberType = this.elements.length > 0 ? this.elements[0].type : null; // going to cause problems later, but can come back to it
  this.type = new ListType(memberType);
};

ListElement.prototype.analyze = function(context) {
  this.value.analyze(context);
  check.validSpread(context, this.value);
};

KennelLiteral.prototype.analyze = function(context) {
  this.keyValuePairs.forEach((keyValuePair) => {
    keyValuePair.analyze(context);
    check.typesMatch(keyValuePair.key.type, this.keyValuePairs[0].key.type);
    check.typesMatch(keyValuePair.value.type, this.keyValuePairs[0].value.type);
  });

  const keyType =
    this.keyValuePairs.length > 0 ? this.keyValuePairs[0].key.type : null; // going to cause problems later, but can come back to it
  const valueType =
    this.keyValuePairs.length > 0 ? this.keyValuePairs[0].value.type : null; // going to cause problems later, but can come back to it
  this.type = new DictType(keyType, valueType);
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
    if (this.left.constructor === ListType) {
      check.typesMatch(this.left.memberType, this.right.type);
    } else {
      check.isString(this.left);
      check.isString(this.right);
    }
    this.type = this.left.type;
  } else if (/^at$/.test(this.op)) {
    check.isNumber(this.right);
    check.isList(this.left);
    this.type = this.left.memberType;
  } else if (/^of$/.test(this.op)) {
    check.typesMatch(this.left.valueType, this.right.type);
    check.isDict(this.left);
    this.type = this.left.valueType;
  } else {
    check.expressionsHaveTheSameType(this.left, this.right);
  }
  //TODO: Not sure about this. I believe we have covered every binary exp
};

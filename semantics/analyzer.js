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
const check = require("./check");
const Context = require("./context");

const uncalledFunctions = new Set();
// Note: We have not yet implemented finding all unused types
const unusedTypes = new Set();

const analyze = function(exp) {
  exp.analyze(Context.INITIAL);
};

module.exports = {
  analyze,
  uncalledFunctions,
  unusedTypes,
};

Program.prototype.analyze = function(context) {
  this.block.analyze(context);
};

Block.prototype.analyze = function(context) {
  const newContext = context.createChildContextForBlock();
  this.funcDecs = new Set();
  this.typeDecs = new Set();

  const typeDeclarations = this.statements.filter(
    (s) => s.constructor === TypeDeclaration
  );
  // First add type ids to the context so that they can be used everywhere else
  // Also add type ids to a set of declared types to be used in optimization
  typeDeclarations.map((s) => {
    newContext.add(s.id.name, s.breedType);
    unusedTypes.add(s.id.name);
  });

  const functionDeclarations = this.statements.filter(
    (s) => s.constructor === FunctionDeclaration
  );
  // Then analyze each function's signature to figure and
  // add function ids to the context so they also can be called anywhere
  // Also add function ids to a set of declared functions to be used in optimization
  functionDeclarations.map((s) => s.func.analyzeSignature(newContext));
  functionDeclarations.map((s) => {
    newContext.add(s.id.name, s.func);
    uncalledFunctions.add(s.id.name);
  });

  // Then analyze type declarations so that we can use their fields and methods anywhere
  typeDeclarations.forEach((statement) => {
    statement.analyze(newContext);
  });

  // Finally, analyze everything else
  this.statements
    .filter((s) => s.constructor !== TypeDeclaration)
    .forEach((statement) => {
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
  const loopContext = context.createChildContextForLoop();
  this.body.analyze(loopContext);
};

ForLoopStatement.prototype.analyze = function(context) {
  const loopContext = context.createChildContextForLoop();
  this.localVarDec.analyze(loopContext);
  check.isNumber(this.localVarDec.variable);
  this.loopExp.analyze(loopContext);
  check.isNumber(this.loopExp);
  this.condition.analyze(loopContext);
  check.isBool(this.condition);
  this.body.analyze(loopContext);
};

ThroughLoopStatement.prototype.analyze = function(context) {
  this.group.analyze(context);
  // Note: PawvaScript currently only supports throughloops that iterate through a ListType.
  // In future iterations, we hope to implement iterating through other types like StringTypes and DictTypes.
  check.isList(this.group);
  const listMemberType = this.group.memberType;

  const loopContext = context.createChildContextForLoop();

  loopContext.add(this.localVar.name, new Variable(listMemberType));
  this.localVar.analyze(loopContext);
  this.localVar.ref.isReadOnly = true;

  this.body.analyze(loopContext);
};

WhileLoopStatement.prototype.analyze = function(context) {
  const loopContext = context.createChildContextForLoop();
  this.condition.analyze(loopContext);
  check.isBool(this.condition);
  this.body.analyze(loopContext);
};

FixedLoopStatement.prototype.analyze = function(context) {
  const loopContext = context.createChildContextForLoop();
  this.expression.analyze(loopContext);
  check.isNumber(this.expression);
  this.body.analyze(loopContext);
};

VariableDeclaration.prototype.analyze = function(context) {
  this.variable.analyze(context);
  this.id.ref = this.variable;
  context.add(this.id.name, this.variable);
};

Variable.prototype.setDefaultValue = function() {
  if (check.isStringType(this.type)) {
    this.initializerExp = new TemplateLiteral([new StringLiteral("")], null); // TODO: Add test for previously misspelled condition
  } else if (check.isNumType(this.type)) {
    this.initializerExp = new NumberLiteral(0);
  } else if (check.isBoolType(this.type)) {
    this.initializerExp = new BooleanLiteral(false);
  } else if (check.isListType(this.type)) {
    this.initializerExp = new PackLiteral([]);
  } else if (check.isDictType(this.type)) {
    this.initializerExp = new KennelLiteral([], []);
  }
};

Variable.prototype.analyze = function(context) {
  this.type.analyze(context);
  if (this.initializerExp === null) {
    // Set default values for uninitialized primitive types, list types, and dict types.
    // Uninitialized BreedType objects are still left uninitialized.
    this.setDefaultValue();
  }
  if (this.initializerExp) {
    this.initializerExp.analyze(context);
  }
  check.expressionsHaveTheSameType(this, this.initializerExp);
};

FunctionDeclaration.prototype.analyze = function(context) {
  check.funcOrTypeDecNotInLoop(context);
  this.func.analyze();
  context.add(this.id, this.func);
};

Function.prototype.analyzeSignature = function(context) {
  const bodyContext = context.createChildContextForFunctionBody(this);
  this.bodyContext = bodyContext;
  if (this.parameters) {
    this.parameters.analyze(bodyContext);
  }
  if (this.returnType) {
    this.returnType.analyze(bodyContext);
  }
};

Function.prototype.analyze = function(/*context*/) {
  this.body.analyze(this.bodyContext);
  check.functionWithReturnTypeContainsGiveStatement(this);
  delete this.bodyContext;
};

TypeDeclaration.prototype.analyze = function(context) {
  check.funcOrTypeDecNotInLoop(context);
  this.id.analyze(context);
  this.breedType.analyze(context, this.id);
};

BreedType.prototype.analyze = function(context, breedId) {
  this.members = new Map();

  this.fields.forEach((field) => {
    check.identifierHasNotBeenUsed(field.id.name, this.members);
    field.analyze(context);
    this.members.set(field.id.name, field.variable);
  });

  this.methods.forEach((method) => {
    check.identifierHasNotBeenUsed(method.id.name, this.members);
    method.func.analyzeSignature(context);
    this.members.set(method.id.name, method.func);
  });
  this.methods.forEach((method) => {
    method.analyze(this.members);
  });

  // Note: PawvaScript currently only supports having at most one constructor per TypeDeclaration.
  // In future iterations, we hope to implement method overloading in PawvaScript, which would
  // allow us to have multiple constructors for a single BreedType.
  check.noMoreThanOneConstructor(this.constructors);
  // If there is no constructor defined, provide a default constructor that takes in no parameters.
  if (this.constructors.length === 0) {
    this.constructors.push(
      new ConstructorDeclaration(
        new VariableExpression(breedId.name),
        new Constructor(null, new IdType(breedId.name))
      )
    );
  }
  this.constructors.forEach((constructorDec) => {
    constructorDec.analyze(context, breedId);
  });
};

ConstructorDeclaration.prototype.analyze = function(context, breedId) {
  check.constructorNameMatchesBreedId(this.id, breedId);
  this.constr.analyze(context, breedId);
};

Constructor.prototype.analyze = function(context, breedId) {
  const currentBreed = context.lookup(breedId.name);
  if (this.parameters) {
    this.parameters.analyze(context);
    check.constructorParamsAreFields(this.parameters, currentBreed.fields);
  }
  this.returnType.analyze(context);
  check.constructorReturnsBreedType(this, currentBreed);
};

Field.prototype.analyze = function(context) {
  this.variable.analyze(context);
};

Method.prototype.analyze = function(breedMembers) {
  breedMembers.forEach((member, id) => {
    this.func.bodyContext.add(id, member);
  });
  this.func.analyze();
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
  check.isAssignableTo(this.source, targetVariable.type);
  check.isNotReadOnly(targetVariable);
  this.target.analyze(context);
};

FunctionCall.prototype.analyze = function(context) {
  // this.callee starts out as a VariableExpression whose name is the id of the function
  this.callee.analyze(context);
  check.isFunctionOrBreed(this.callee.ref);
  // Remove the function corresponding to this callee id from the uncalledFunctions set
  uncalledFunctions.delete(this.callee.name);

  if (this.callee.ref.constructor === BreedType) {
    this.callee.ref = this.callee.ref.constructors[0].constr;
  }
  this.args.forEach((arg) => arg.analyze(context));
  check.legalArguments(this.args, this.callee.ref.parameters);
  this.type = this.callee.ref.returnType;
};

PrintStatement.prototype.analyze = function(context) {
  this.expression.analyze(context);
};

GiveStatement.prototype.analyze = function(context) {
  check.inFunction(context, "give");
  if (this.expression) {
    this.expression.analyze(context);
  }
  check.giveExpressionHasCorrectReturnType(
    this.expression,
    context.currentFunction
  );
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
    paramId.analyze(context);
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
  this.quasis.forEach((quasi) => {
    quasi.analyze(context);
  });
  if (this.exps) {
    this.exps.forEach((exp) => {
      exp.analyze(context);
    });
  }
  this.type = StringType;
};

PackLiteral.prototype.analyze = function(context) {
  let firstElementType = null;
  if (this.elements.length > 0) {
    this.elements[0].analyze(context);
    // Extract type of first element to compare all other elements to
    firstElementType =
      // First element may be a list with a spread operator
      this.elements[0].hasSpread &&
      this.elements[0].type.constructor === ListType
        ? this.elements[0].type.memberType
        : this.elements[0].type;
  }
  this.elements.forEach((element) => {
    element.analyze(context);
    if (element.hasSpread) {
      check.isValidSpread(element.value);
      element.type = element.type.memberType;
    }
    check.typesMatch(element.type, firstElementType);
  });
  this.type = new ListType(firstElementType);
};

ListElement.prototype.analyze = function(context) {
  this.value.analyze(context);
  this.type = this.value.type;
};

KennelLiteral.prototype.analyze = function(context) {
  this.keyValuePairs.forEach((keyValuePair) => {
    keyValuePair.analyze(context);
    check.typesMatch(keyValuePair.key.type, this.keyValuePairs[0].key.type);
    check.typesMatch(keyValuePair.value.type, this.keyValuePairs[0].value.type);
  });

  const [keyType, valueType] =
    this.keyValuePairs.length > 0
      ? [this.keyValuePairs[0].key.type, this.keyValuePairs[0].value.type]
      : [null, null];
  this.type = new DictType(keyType, valueType);
};

KeyValuePair.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

VariableExpression.prototype.analyze = function(context) {
  this.ref = context.lookup(this.name); // returns the corresponding Variable object
  this.type = this.ref.type;
};

UnaryExpression.prototype.analyze = function(context) {
  this.operand.analyze(context);
  if (/^[-!]$/.test(this.op)) {
    check.isNumber(this.operand);
    this.type = NumType;
  } else {
    // this.op = "not", the only remaining unary op
    check.isBool(this.operand);
    this.type = BoolType;
  }
};

BinaryExpression.prototype.analyze = function(context) {
  this.left.analyze(context);
  if (this.op !== "'s") {
    this.right.analyze(context);
  }
  if (/^'s$/.test(this.op)) {
    const obj = this.left.ref.type.ref;
    const memberId = this.right;
    memberId.ref = obj.members.get(memberId.name);
    this.ref = memberId.ref;
  } else if (/^(?:[-+*/]|mod)$/.test(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = NumType;
  } else if (/^[&|]$/.test(this.op)) {
    check.isBool(this.left);
    check.isBool(this.right);
    this.type = BoolType;
  } else if (
    /^(?:isGreaterThan|isAtLeast|isAtMost|isLessThan|equals|notEquals)$/.test(
      this.op
    )
  ) {
    check.expressionsHaveTheSameType(this.left, this.right);
    check.isNumberOrString(this.left);
    check.isNumberOrString(this.right);
    this.type = BoolType;
  } else if (/^with(?:out)?$/.test(this.op)) {
    if (this.left.type.constructor === ListType) {
      check.typesMatch(this.left.type.memberType, this.right.type);
    } else {
      check.isString(this.left);
      check.isString(this.right);
    }
    this.type = this.left.type;
  } else if (/^at$/.test(this.op)) {
    check.isNumber(this.right);
    check.isList(this.left);
    this.type =
      this.left.constructor === VariableExpression
        ? this.left.ref.type.memberType
        : this.left.type.memberType;
  } else {
    // this.op = "of", the only remaining binary op
    check.isDict(this.left);
    const leftDict =
      this.left.constructor === VariableExpression
        ? this.left.ref.type
        : this.left.type;
    check.typesMatch(leftDict.keyType, this.right.type);
    this.type = leftDict.valueType;
  }
};

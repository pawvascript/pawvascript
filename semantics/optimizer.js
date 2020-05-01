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

module.exports = (program) => program.optimize();

function isZero(e) {
  return e instanceof NumberLiteral && e.value === 0;
}

function isOne(e) {
  return e instanceof NumberLiteral && e.value === 1;
}

function isSameNumber(e) {
  return e.left instanceof NumberLiteral && e.right instanceof NumberLiteral && e.left.value === e.right.value;
}



function isFalse(b) {
  return b instanceof BooleanLiteral && b.value === false;
}

function isTrue(b) {
  return b instanceof BooleanLiteral && b.value === true;
}

function bothNumberLiterals(b) {
  return b.left instanceof NumberLiteral && b.right instanceof NumberLiteral;
}

function bothBooleanLiterals(b) {
  return b.left instanceof BooleanLiteral && b.right instanceof BooleanLiteral;
}

function bothTemplateLiterals(b) {
  return (
    b.left instanceof TemplateLiteral && b.right instanceof TemplateLiteral
  );
}

function toUpperCase(e) {
  return e.toUpperCase();
}

const factorialTable = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, ‬39916800‬, 479001600];
function lookupFactorial(n) {
  if (n >= 0 && n <= 12) {
    return factorialTable[n];
  }
  return factorial(n);
}

function factorial(n) {
  return n != 1 ? n * factorial(n - 1) : 1;
}
// "cat"  1 quasi: ["cat"], 0 exp: []
// a = "cat1 ![name1]"  1 quasi ["cat1 ""], 1 exp
// b = "![name2] cat2"  2 quasis ["", " cat2"], 1 exp
// a with b:
// "cat1 ![name1]![name2] cat2"   quasis: ["cat1 ", "", " cat2"], exps:

// ArrayExp.prototype.optimize = function() {
//   this.size = this.size.optimize();
//   this.fill = this.fill.optimize();
//   return this;
// };
// is it an optimization to deconstruct spreads on lists?

Program.prototype.optimize = function() {
  this.block = this.block.optimize();
  return this;
};

Block.prototype.optimize = function() {
  this.statements = this.statements.map((statement) => statement.optimize()).filter(statement => statement !== null);
  return this;
};

ConditionalStatement.prototype.optimize = function() {
  this.condition = this.condition.optimize();
  if (isFalse(this.condition)) return null;
  this.body = this.body.optimize();
  if (isTrue(this.condition) || !this.otherwise) return this;
  this.otherwise = this.otherwise ? this.otherwise.optimize() : null;
  return this;
};

InfiniteLoopStatement.prototype.optimize = function() {
  this.body = this.body.optimize();
  return this;
};

ForLoopStatement.prototype.optimize = function() {
  this.condition = this.condition.optimize();
  if (isFalse(this.condition)) return;
  this.localVarDec = this.localVarDec.optimize();
  this.loopExp = this.loopExp.optimize();
  this.body = this.body.optimize();
  return this;
};

ThroughLoopStatement.prototype.optimize = function() {
  this.localVar = this.localVar.optimize();
  this.group = this.group.optimize();
  this.body = this.body.optimize();
  return this;
};

WhileLoopStatement.prototype.optimize = function() {
  this.condition = this.condition.optimize();
  if (isFalse(this.condition)) return null;
  this.body = this.body.optimize();
  return this;
};

FixedLoopStatement.prototype.optimize = function() {
  this.expression = this.expression.optimize();
  if (isZero(this.expression)) return null;
  this.body = this.body.optimize();
  return this;
};

VariableDeclaration.prototype.optimize = function() {
  this.variable = this.variable.optimize();
  return this;
};

Variable.prototype.optimize = function() {
  this.initializerExp = this.initializerExp.optimize();
};

FunctionDeclaration.prototype.optimize = function() {
  this.func = this.func.optimize();
};

Function.prototype.optimize = function() {
  this.parameters = this.parameters.optimize();
  this.returnType = this.returnType.optimize();
  this.body = this.body.optimize();
  return this;
};

Parameters.prototype.optimize = function() {
  return this;
  // need anything else here at all?
};

TypeDeclaration.prototype.optimize = function() {
  this.breedType = this.breedType.optimize();
  return this;
};

BreedType.prototype.optimize = function() {
  this.fields = this.fields.map((field) => field.optimize());
  this.methods = this.methods.map((method) => method.optimize());
  this.constructors = this.constructors.map((constructorDec) =>
    constructorDec.optimize()
  );
  return this;
};

ConstructorDeclaration.prototype.optimize = function() {
  this.id = this.id.optimize();
  this.constr = this.constr.optimize();
  return this;
};

Constructor.prototype.optimize = function() {
  this.parameters = this.parameters ? this.parameters.optimize() : null;
  this.returnType = this.returnType ? this.returnType.optimize() : null;
};

Field.prototype.optimize = function() {
  this.variable = this.variable.optimize();
  return this;
};

Method.prototype.optimize = function() {
  this.func = this.func.optimize();
};

PrimitiveType.prototype.optimize = function() {
  this.type = this.type.optimize();
  return this;
};

ListType.prototype.optimize = function() {
  this.memberType = this.memberType.optimize();
  return this;
};

DictType.prototype.optimize = function() {
  this.keyType = this.keyType.optimize();
  this.valueType = this.valueType.optimize();
};

IdType.prototype.optimize = function() {
  this.name = this.name.optimize();
};

AssignmentStatement.prototype.optimize = function() {
  this.target = this.target.optimize();
  this.source = this.source.optimize();
  if (this.target === this.source) {
    return null;
  }
  return this;
};

FunctionCall.prototype.optimize = function() {
  this.args = this.args.map((a) => a.optimize());
  this.callee = this.callee.optimize();
  return this;
};

PrintStatement.prototype.optimize = function() {
  this.expression = this.expression.optimize();
  //TODO: 90% sure this won't work but YOLO
  if (this.flavor === "bark") this.expression = toUpperCase(this.expression);
  return this;
};

GiveStatement.prototype.optimize = function() {
  this.expression = this.expression.optimize();
  return this;
};

BreakStatement.prototype.optimize = function() {
  return this;
};

ContinueStatement.prototype.optimize = function() {
  return this;
};

Parameters.prototype.optimize = function() {
  this.types = this.types ? this.types.map((type) => type.optimize()) : null;
  this.ids = this.ids ? this.ids.map((id) => id.optimize()) : null;
  return this;
};

BooleanLiteral.prototype.optimize = function() {
  return this;
};

NumberLiteral.prototype.optimize = function() {
  return this;
};

StringLiteral.prototype.optimize = function() {
  return this;
};

TemplateLiteral.prototype.optimize = function() {
  // wonder if we even need these two statements because exps can only be id's, and quasis can only be string literals
  this.quasis = this.quasis.map((quasi) => quasi.optimize());
  this.exps = this.exps.map((exp) => exp.optimize());
  return this;
};

PackLiteral.prototype.optimize = function() {
  this.elements = this.elements.map((element) => element.optimize());
  return this;
};

ListElement.prototype.optimize = function() {
  this.value = this.value.optimize();
  return this;
};

KennelLiteral.prototype.optimize = function() {
  this.keyValuePairs = this.keyValuePairs.map((keyValuePair) =>
    keyValuePair.optimize()
  );
  return this;
};

KeyValuePair.prototype.optimize = function() {
  this.key = this.key.optimize();
  this.value = this.value.optimize();
  return this;
};

VariableExpression.prototype.optimize = function() {
  // TODO ask toal:
  // wonder if it's valid code optimization to remove in-between references?
  return this;
};

UnaryExpression.prototype.optimize = function() {
  // REMINDER op == ! (5!) / - (-209) / not (not true)
  this.operand = this.operand.optimize();
  if (this.op === "not" && this.operand instanceof BooleanLiteral)
    return new BooleanLiteral(!this.operand.value);
  if (this.op === "-" && this.operand instanceof NumberLiteral)
    return new NumberLiteral(-this.operand.value);
  if (
    this.op === "!" &&
    this.operand instanceof NumberLiteral &&
    Number.isInteger(this.operand.value)
  ) {
    return new NumberLiteral(lookupFactorial(this.operand.value));
  }
};

BinaryExpression.prototype.optimize = function() {
  this.left = this.left.optimize();
  this.right = this.right.optimize();
  if (this.op === "+" && isZero(this.right)) return this.left;
  if (this.op === "+" && isZero(this.left)) return this.right;
  if (this.op === "-" && isZero(this.right)) return this.left;
  if (this.op === "-" && isSameNumber(this)) return new NumberLiteral(0);
  if (this.op === "*" && isZero(this.right)) return new NumberLiteral(0);
  if (this.op === "*" && isZero(this.left)) return new NumberLiteral(0);
  if (this.op === "*" && isOne(this.right)) return this.left;
  if (this.op === "*" && isOne(this.left)) return this.right;
  if (this.op === "/" && isSameNumber(this)) return new NumberLiteral(1);
  if (this.op === "/" && isOne(this.right)) return this.left;
  if (this.op === "/" && isZero(this.left)) return new NumberLiteral(0);
  if (this.op === "mod" && isZero(this.left)) return new NumberLiteral(0);
  if ((this.op === "isGreaterThan" || this.op === "isLessThan") && isSameNumber(this)) return new BooleanLiteral(false);
  if (this.op === "&" && (isFalse(this.left) || isFalse(this.right))) return new BooleanLiteral(false);
  if (this.op === "|" && (isTrue(this.left) || isTrue(this.right))) return new BooleanLiteral(true);
  if (bothNumberLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === "+") return new NumberLiteral(x + y);
    if (this.op === "-") return new NumberLiteral(x - y);
    if (this.op === "*") {
      if (x % 2 === 0) {
        return new NumberLiteral(y << x / 2)
      }
      if (y % 2 === 0) {
        return new NumberLiteral(x << y / 2)
      }
      return new NumberLiteral(x * y);
    }
    if (this.op === "/") {
      if (x % 2 === 0) {
        return new NumberLiteral(y >> x / 2)
      }
      if (y % 2 === 0) {
        return new NumberLiteral(x >> y / 2)
      }
      return new NumberLiteral(x / y);
    }
    if (this.op === "mod") return new NumberLiteral(x % y);
    if (this.op === "isGreaterThan") return new NumberLiteral(x > y);
    if (this.op === "isAtLeast") return new NumberLiteral(x >= y);
    if (this.op === "isAtMost") return new NumberLiteral(x <= y);
    if (this.op === "isLessThan") return new NumberLiteral(x < y);
    if (this.op === "equals") return new NumberLiteral(x === y);
    if (this.op === "notEquals") return new NumberLiteral(x !== y);
  }
  if (bothTemplateLiterals(this)) {
    if (this.op === "with")
      return new TemplateLiteral(
        this.left.quasis.concat(this.right.quasis),
        this.left.exps.concat(this.right.exps)
      );
  }
  if (bothBooleanLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === "&") return new BooleanLiteral(x && y);
    if (this.op === "|") return new BooleanLiteral(x || y);
  }
  return this;
};

// this is interesting -- if only 1 item in list, just return the one item rather than the list of 1
// ExpSeq.prototype.optimize = function() {
//   this.exps = this.exps.map((s) => s.optimize());
//   if (this.exps.length === 1) {
//     return this.exps[0];
//   }
//   return this;
// };

// IfExp.prototype.optimize = function() {
//   this.test = this.test.optimize();
//   this.consequent = this.consequent.optimize();
//   this.alternate = this.alternate.optimize();
//   if (isZero(this.test)) {
//     return this.alternate;
//   }
//   return this;
// };

// MemberExp.prototype.optimize = function() {
//   this.record = this.record.optimize();
//   return this;
// };

// SubscriptedExp.prototype.optimize = function() {
//   this.array = this.array.optimize();
//   this.subscript = this.subscript.optimize();
//   return this;
// };

// TODO ask toal:
// again do we just return nothing or do we return null or nil or whatever?
// WhileExp.prototype.optimize = function() {
//   this.test = this.test.optimize();
//   if (this.test instanceof Literal && !this.test.value) {
//     // While-false is a no-operation, don't even need the body
//     return new Nil();
//   }
//   this.body = this.body.optimize();
//   return this;
// };

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

const {
  uncalledFunctions,
  // Note: We have not yet implemented finding all unused types
  // In the future, we want to be able to remove all type declarations that
  // are never used or instantiated.
  // unusedTypes
} = require("./analyzer");

module.exports = (program) => program.optimize();

function isZero(e) {
  return e instanceof NumberLiteral && e.value === 0;
}

function isOne(e) {
  return e instanceof NumberLiteral && e.value === 1;
}

function isSameNumber(e) {
  return (
    e.left instanceof NumberLiteral &&
    e.right instanceof NumberLiteral &&
    e.left.value === e.right.value
  );
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

function sameVariableExpression(e1, e2) {
  return (
    e1 instanceof VariableExpression &&
    e2 instanceof VariableExpression &&
    e1.name === e2.name
  );
}

// If the given type is an IdType, returns type.ref; otherwise, returns the given type
function getTypeReference(type) {
  return type.constructor === IdType ? type.ref : type;
}

const factorialTable = [
  1,
  1,
  2,
  6,
  24,
  120,
  720,
  5040,
  40320,
  362880,
  3628800,
  39916800,
  479001600,
];
function lookupFactorial(n) {
  if (n >= 0 && n <= 12) {
    return factorialTable[n];
  }
  return factorial(n);
}

function factorial(n) {
  return n != 12 ? n * factorial(n - 1) : factorialTable[12];
}

Program.prototype.optimize = function() {
  this.block = this.block.optimize();
  return this;
};

Block.prototype.optimize = function() {
  this.statements = this.statements
    // Remove all statements that are FunctionDeclarations whose functions are never called
    .filter(
      (s) =>
        !(
          s.constructor === FunctionDeclaration &&
          uncalledFunctions.has(s.id.name)
        )
    )
    .map((s) => s.optimize())
    // After optimizing, some if/else statements might have been replaced with a Block,
    // so we pull out the statements array from each Block
    .map((s) => (s !== null && s.constructor === Block ? s.statements : s))
    // Flatten all nested arrays (infinite depth)
    .flat(Infinity)
    .filter((s) => s !== null);

  // If we find a return, break, or continue statement, then we can remove
  // all statements after that one since they will never execute anyways
  const stoppingIndex = this.statements.findIndex(
    (s) =>
      s.constructor === GiveStatement ||
      s.constructor === BreakStatement ||
      s.constructor === ContinueStatement
  );
  if (stoppingIndex > -1 && stoppingIndex < this.statements.length - 1) {
    this.statements.splice(
      stoppingIndex + 1,
      this.statements.length - (stoppingIndex + 1)
    );
  }
  return this;
};

ConditionalStatement.prototype.optimize = function() {
  this.condition = this.condition.optimize();
  if (isTrue(this.condition)) {
    this.body = this.body.optimize();
    return this.body;
  }
  if (isFalse(this.condition)) {
    this.otherwise = this.otherwise ? this.otherwise.optimize() : null;
    return this.otherwise;
  }
  this.body = this.body.optimize();
  this.otherwise = this.otherwise ? this.otherwise.optimize() : null;
  return this;
};

InfiniteLoopStatement.prototype.optimize = function() {
  this.body = this.body.optimize();
  return this;
};

ForLoopStatement.prototype.optimize = function() {
  this.condition = this.condition.optimize();
  if (isFalse(this.condition)) return null;
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
  this.id = this.id.optimize();
  return this;
};

Variable.prototype.optimize = function() {
  this.initializerExp = this.initializerExp.optimize();
  this.type.optimize();
  this.type = getTypeReference(this.type);
  return this;
};

FunctionDeclaration.prototype.optimize = function() {
  this.func = this.func.optimize();
  return this;
};

Function.prototype.optimize = function() {
  this.parameters = this.parameters ? this.parameters.optimize() : null;
  this.returnType = this.returnType ? getTypeReference(this.returnType) : null;
  this.body = this.body.optimize();
  return this;
};

TypeDeclaration.prototype.optimize = function() {
  this.breedType = this.breedType.optimize();
  return this;
};

BreedType.prototype.optimize = function() {
  this.fields = this.fields.map((f) => f.optimize());
  this.methods = this.methods.map((m) => m.optimize());
  this.constructors = this.constructors.map((c) => c.optimize());
  return this;
};

ConstructorDeclaration.prototype.optimize = function() {
  this.id = this.id.optimize();
  this.constr = this.constr.optimize();
  return this;
};

Constructor.prototype.optimize = function() {
  this.parameters = this.parameters ? this.parameters.optimize() : null;
  this.returnType = getTypeReference(this.returnType);
  return this;
};

Field.prototype.optimize = function() {
  this.variable = this.variable.optimize();
  return this;
};

Method.prototype.optimize = function() {
  this.func = this.func.optimize();
  return this;
};

ListType.prototype.optimize = function() {
  this.memberType = getTypeReference(this.memberType);
  return this;
};

DictType.prototype.optimize = function() {
  this.keyType = getTypeReference(this.keyType);
  this.valueType = getTypeReference(this.valueType);
};

IdType.prototype.optimize = function() {
  return this.ref;
};

AssignmentStatement.prototype.optimize = function() {
  this.target = this.target.optimize();
  this.source = this.source.optimize();
  if (sameVariableExpression(this.target, this.source)) {
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
  if (
    this.flavor === "bark" &&
    this.expression.constructor === TemplateLiteral &&
    this.expression.exps === null
  ) {
    const upperCased = this.expression.quasis[0].value.toUpperCase();
    return new PrintStatement(
      "woof",
      new TemplateLiteral([new StringLiteral(upperCased)], null)
    );
  }
  return this;
};

GiveStatement.prototype.optimize = function() {
  this.expression = this.expression ? this.expression.optimize() : null;
  return this;
};

BreakStatement.prototype.optimize = function() {
  return this;
};

ContinueStatement.prototype.optimize = function() {
  return this;
};

Parameters.prototype.optimize = function() {
  this.types = this.types.map((type) => type.optimize());
  this.ids = this.ids.map((id) => id.optimize());
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
  this.quasis = this.quasis.map((quasi) => quasi.optimize());
  this.exps = this.exps ? this.exps.map((exp) => exp.optimize()) : null;
  return this;
};

PackLiteral.prototype.optimize = function() {
  // TODO: In the future we intend to include the optimization of unpacking
  // list elements that have spreads and are themselves also PackLiterals
  this.elements = this.elements.map((e) => e.optimize());
  return this;
};

ListElement.prototype.optimize = function() {
  this.value = this.value.optimize();
  this.type = getTypeReference(this.type);
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
  this.keyType = getTypeReference(this.key.type);
  this.value = this.value.optimize();
  this.valueType = getTypeReference(this.value.type);
  return this;
};

VariableExpression.prototype.optimize = function() {
  // Not all variable expressions have this.type;
  // variable expressions that represent a function have no type,
  // such as the variable expression with name "gcd" whose ref is the
  // function gcd.
  if (this.type) this.type = getTypeReference(this.type);
  // TODO: a future optimization would be to return what this variable expression
  // actuall references instead of returning the variable itself
  return this;
};

UnaryExpression.prototype.optimize = function() {
  // Possible Operations: op === ! or - or not
  // examples: 5!, -209, not good
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
  return this;
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
  if (this.op === "mod" && isOne(this.right)) return new NumberLiteral(0);
  if (this.op === "mod" && isSameNumber(this)) return new NumberLiteral(0);
  if (
    (this.op === "isGreaterThan" || this.op === "isLessThan") &&
    isSameNumber(this)
  ) {
    return new BooleanLiteral(false);
  }

  if (
    (this.op === "isAtLeast" || this.op === "isAtMost") &&
    isSameNumber(this)
  ) {
    return new BooleanLiteral(true);
  }
  if (this.op === "&" && (isFalse(this.left) || isFalse(this.right)))
    return new BooleanLiteral(false);
  if (this.op === "|" && (isTrue(this.left) || isTrue(this.right)))
    return new BooleanLiteral(true);
  if (bothNumberLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === "+") return new NumberLiteral(x + y);
    if (this.op === "-") return new NumberLiteral(x - y);
    if (this.op === "*") {
      if (Number.isInteger(Math.log2(x))) {
        return new NumberLiteral(y << Math.log2(x));
      }
      if (Number.isInteger(Math.log2(y))) {
        return new NumberLiteral(x << Math.log2(y));
      }
      return new NumberLiteral(x * y);
    }
    if (this.op === "/") return new NumberLiteral(x / y);
    // TODO: Add bitwise shift for dividing two numbers that are both multiples of 2
    // both left and right must be multiples of 2 and left >= right
    if (this.op === "mod") return new NumberLiteral(x % y);
    if (this.op === "isGreaterThan") return new BooleanLiteral(x > y);
    if (this.op === "isAtLeast") return new BooleanLiteral(x >= y);
    if (this.op === "isAtMost") return new BooleanLiteral(x <= y);
    if (this.op === "isLessThan") return new BooleanLiteral(x < y);
    if (this.op === "equals") return new BooleanLiteral(x === y);
    // this.op === "notEquals"
    return new BooleanLiteral(x !== y);
  }
  if (bothTemplateLiterals(this)) {
    // TODO: implement optimization for when checking if a String/TemplateLiteral
    // equals another string/TemplateLiteral
    if (this.op === "with") {
      const leftQuasiLength = this.left.quasis.length;
      // Combine the last quasi of the left and the first quasi of the right
      const middleQuasi = this.left.quasis[leftQuasiLength - 1].value.concat(
        this.right.quasis[0].value
      );
      const newQuasiArray = this.left.quasis.concat(this.right.quasis);
      newQuasiArray.splice(
        leftQuasiLength - 1,
        2,
        new StringLiteral(middleQuasi)
      );
      let newExpArray = this.left.exps
        ? this.left.exps.concat(this.right.exps)
        : this.right.exps;
      if (newExpArray !== null)
        newExpArray = newExpArray.filter((exp) => exp !== null);
      return new TemplateLiteral(newQuasiArray, newExpArray);
    }
    return this;
  }
  if (bothBooleanLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === "&") return new BooleanLiteral(x && y);
    // this.op === '|'
    return new BooleanLiteral(x || y);
  }
  return this;
};

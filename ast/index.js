class Program {
  constructor(block) {
    this.block = block;
  }
}

class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

class Statement {}

class ConditionalStatement extends Statement {
  constructor(condition, body, otherwise) {
    super();
    Object.assign(this, { condition, body, otherwise });
  }
}

class InfiniteLoopStatement {
  constructor(body) {
    this.body = body;
  }
}

class ForLoopStatement {
  constructor(localVar, loopExp, condition, body) {
    Object.assign(this, { localVar, loopExp, condition, body });
  }
}

class ThroughLoopStatement {
  constructor(localVar, group, body) {
    Object.assign(this, { localVar, group, body });
  }
}

class WhileLoopStatement {
  constructor(condition, body) {
    Object.assign(this, { condition, body });
  }
}

class FixedLoopStatement {
  constructor(expression, body) {
    Object.assign(this, { expression, body });
  }
}

class VariableDeclaration {
  constructor(id, type, keyType = null, valueType = null) {
    Object.assign(this, { id, type, keyType, valueType });
  }
}

class FunctionDeclaration {
  constructor(id, parameters, returnType) {
    Object.assign(this, { id, parameters, returnType });
  }
}

class TypeDeclaration {
  constructor(id, block) {
    Object.assign(this, { id, block });
  }
}

class Type {
  constructor(name) {
    this.name = name;
  }
}

const IntType = new Type("toeBeans");
const BoolType = new Type("goodBoy");
const StringType = new Type("leash");
const ArrayType = new Type("pack");
const DictType = new Type("kennel");
const ObjectType = new Type("breed");

class AssignmentStatement {
  constructor(target, grouping = null, source) {
    Object.assign(this, { target, grouping, source });
  }
}

class FunctionCallStatement {
  constructor(id, arguments) {
    Object.assign(this, { id, arguments });
  }
}

class WoofStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class BarkStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class HowlStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class GiveStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class Expression {}

// TODO: change name of Grouping to something like VariableTypeMapping
class Grouping {
  constructor(keyType, valueType) {
    Object.assign(this, { keyType, valueType });
  }
}

class Parameters {
  constructor(types, ids) {
    Object.assign(this, { types, ids });
  }
}

class BooleanLiteral extends Expression {
  constructor(value) {
    super();
    this.value = value;
  }
}

class IntegerLiteral extends Expression {
  constructor(value) {
    super();
    this.value = value;
  }
}

class StringLiteral extends Expression {
  constructor(value) {
    super();
    this.value = value;
  }
}

class VariableExpression extends Expression {
  constructor(name) {
    super();
    this.name = name;
  }
}

class UnaryExpression extends Expression {
  constructor(op, operand) {
    super();
    Object.assign(this, { op, operand });
  }
}

class BinaryExpression extends Expression {
  constructor(op, left, right) {
    super();
    Object.assign(this, { op, left, right });
  }
}

module.exports = {
  Program,
  Block,
  ConditionalStatement,
  InfiniteLoopStatement,
  ForLoopStatement,
  ThroughLoopStatement,
  WhileLoopStatement,
  FixedLoopStatement,
  VariableDeclaration,
  Type,
  FunctionDeclaration,
  TypeDeclaration,
  IntType,
  BoolType,
  StringType,
  ArrayType,
  DictType,
  ObjectType,
  AssignmentStatement,
  FunctionCallStatement,
  WoofStatement,
  BarkStatement,
  HowlStatement,
  GiveStatement,
  Expression,
  Grouping,
  Parameters,
  BooleanLiteral,
  IntegerLiteral,
  StringLiteral,
  VariableExpression,
  UnaryExpression,
  BinaryExpression
};

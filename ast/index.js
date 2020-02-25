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

class ConditionalStatement {
  constructor(condition, body, otherwise) {
    Object.assign(this, { condition, body, otherwise });
  }
}

class InfiniteChaseStatement {
  constructor(body) {
    this.body = body;
  }
}

class ForChaseStatement {
  constructor(localVar, loopExp, condition, body) {
    Object.assign(this, { localVar, loopExp, condition, body });
  }
}

class ThroughStatement {
  constructor(localVar, group, body) {
    Object.assign(this, { localVar, group, body });
  }
}

class WhileChaseStatement {
  constructor(condition, body) {
    Object.assign(this, { condition, body });
  }
}

class DefinedChaseStatement {
  constructor(expression, body) {
    Object.assign(this, { expression, body });
  }
}

class VariableDeclaration {
  constructor(id, type) {
    Object.assign(this, { id, type });
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
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

class FunctionCallStatement {
  constructor(id, arguments) {
    Object.assign(this, { id, arguments });
  }
}

class ReadStatement {
  constructor(varexps) {
    this.varexps = varexps;
  }
}

class WriteStatement {
  constructor(expressions) {
    this.expressions = expressions;
  }
}

class Expression {}

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
  VariableDeclaration,
  Type,
  IntType,
  BoolType,
  AssignmentStatement,
  ReadStatement,
  WriteStatement,
  WhileStatement,
  Expression,
  BooleanLiteral,
  IntegerLiteral,
  VariableExpression,
  UnaryExpression,
  BinaryExpression
};

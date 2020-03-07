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
  constructor(localVarDec, loopExp, condition, body) {
    Object.assign(this, { localVarDec, loopExp, condition, body });
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
  constructor(id, type, exp) {
    Object.assign(this, { id, type, exp });
  }
}

class FunctionDeclaration {
  constructor(id, parameters, returnType, body = null) {
    Object.assign(this, { id, parameters, returnType, body });
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

const NumType = new Type("toeBeans");
const BoolType = new Type("goodBoy");
const StringType = new Type("leash");

class ListType extends Type {
  constructor(grouping) {
    super("pack");
    this.grouping = grouping;
  }
}

class DictType extends Type {
  constructor(grouping) {
    super("kennel");
    this.grouping = grouping;
  }
}

class AssignmentStatement {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

class FunctionCall {
  constructor(id, args = null) {
    Object.assign(this, { id, args });
  }
}

class PrintStatement {
  constructor(flavor, expression) {
    // flavor can be woof, bark, or howl
    Object.assign(this, { flavor, expression });
  }
}

class GiveStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class BreakStatement {}

class ContinueStatement {}

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

class NumberLiteral extends Expression {
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

class TemplateLiteral extends Expression {
  constructor(members, exps) {
    super();
    Object.assign(this, { members, exps });
  }
}

class PackLiteral extends Expression {
  constructor(elements) {
    super();
    this.elements = elements;
  }
}

class ListElement {
  constructor(hasSpread, value) {
    Object.assign(this, { hasSpread, value });
  }
}

class KennelLiteral extends Expression {
  constructor(keyValuePairs) {
    super();
    this.keyValuePairs = keyValuePairs;
  }
}

class KeyValuePair {
  constructor(key, value) {
    Object.assign(this, { key, value });
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
  NumType,
  BoolType,
  StringType,
  ListType,
  DictType,
  AssignmentStatement,
  FunctionCall,
  PrintStatement,
  GiveStatement,
  BreakStatement,
  ContinueStatement,
  Expression,
  Grouping,
  Parameters,
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
};

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
  constructor(id, variable) {
    Object.assign(this, { id, variable });
  }
}

class Variable {
  constructor(type, initializerExp = null) {
    Object.assign(this, { type, initializerExp });
  }
}

class FunctionDeclaration {
  constructor(id, func) {
    Object.assign(this, { id, func });
  }
}

class Function {
  constructor(parameters, returnType, body) {
    Object.assign(this, { parameters, returnType, body });
  }
}

class Type {}

class TypeDeclaration {
  constructor(id, breedType) {
    Object.assign(this, { id, breedType });
  }
}

class BreedType extends Type {
  constructor(fields, constructors, methods) {
    super();
    // fields and methods will be arrays of Field objects and Method objects, respectively
    Object.assign(this, { fields, constructors, methods });
  }
}

class ConstructorDeclaration {
  constructor(id, constr) {
    Object.assign(this, { id, constr });
  }
}

class Constructor {
  constructor(parameters, returnType) {
    Object.assign(this, { parameters, returnType });
  }
}

class Field {
  constructor(id, variable) {
    Object.assign(this, { id, variable });
  }
}

class Method {
  constructor(id, func) {
    Object.assign(this, { id, func });
  }
}

class PrimitiveType extends Type {
  constructor(type) {
    super();
    Object.assign(this, { type });
  }
}

class ListType extends Type {
  constructor(memberType) {
    super();
    Object.assign(this, { memberType });
  }
}

class DictType extends Type {
  constructor(keyType, valueType) {
    super();
    Object.assign(this, { keyType, valueType });
  }
}

class IdType extends Type {
  // An intermediate node class that is used for Variables whose types are BreedTypes
  // that must have been previously defined with a TypeDeclaration. During semantic
  // analysis, if a variable's type is IdType, it will replace the `ref` field (null by default) with a
  // pointer to the BreedType object with the corresponding name in the context.
  constructor(name, ref = null) {
    super();
    Object.assign(this, { name, ref });
  }
}

class AssignmentStatement {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

class FunctionCall {
  constructor(callee, args = []) {
    Object.assign(this, { callee, args });
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
  constructor(quasis, exps) {
    super();
    Object.assign(this, { quasis, exps });
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
    this.ref = null;
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
  BinaryExpression,
};

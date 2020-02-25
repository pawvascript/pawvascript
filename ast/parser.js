// Parser module
//
//   const parse = require('./parser');
//   const ast = parse(sourceCodeString);

const ohm = require("ohm-js");
const fs = require("fs");

const {
  Program,
  Block,
  ConditionalStatement,
  InfiniteLoopStatement,
  ForLoopStatement,
  ThroughLoopStatement,
  WhileLoopStatement,
  DefinedLoopStatement,
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
} = require(".");

const grammar = ohm.grammar(fs.readFileSync("./grammar/pawvascript.ohm"));

/* eslint-disable no-unused-vars */
const astBuilder = grammar.createSemantics().addOperation("ast", {
  Program(b) {
    return new Program(b.ast());
  },
  Block(s) {
    return new Block(s.ast());
  },
  Stmt_VariableDeclaration(type, id, group, _1, expression) {
    return new VariableDeclaration(
      type.ast(),
      id.ast(),
      group.ast(),
      expression.ast()
    );
  },
  Stmt_TypeDeclaration(_1, id, _2, _colon, body, _3) {
    return new TypeDeclaration(id.ast(), body.ast());
  },
  // Stmt_declaration(_1, id, _2, type) {
  //    return new VariableDeclaration(id.sourceString, type.ast());
  // },
  // Stmt_assignment(varexp, _, exp) {
  //   return new AssignmentStatement(varexp.ast(), exp.ast());
  // },
  Stmt_InfLoop(_1, _colon, body) {
    return new InfiniteLoopStatement(body.ast());
  },
  Stmt_ForLoop(_1, localVar, _2, loopExp, _3, condition, _colon, body) {
    return new ForLoopStatement(
      localVar.ast(),
      loopExp.ast(),
      condition.ast(),
      body.ast()
    );
  },
  Stmt_ThroughLoop(_1, localVar, _2, group, _colon, body) {
    return new ThroughLoopStatement(localVar.ast(), group.ast(), body.ast());
  },
  Stmt_WhileLoop(_1, _2, expression, _colon, body) {
    return new WhileLoopStatement(expression.ast(), body.ast());
  },
  Stmt_DefinedLoop(_1, expression, _2, _colon, body) {
    return new DefinedLoopStatement(expression.ast(), body.ast());
  },
  Stmt_Conditional(_1, condition, _2, _colon, body, _else, otherwise) {
    return new ConditionalStatement(condition.ast(), body.ast());
  }
  // Stmt_read(_1, v, _2, more) {
  //   return new ReadStatement([v.ast(), ...more.ast()]);
  // },
  // Stmt_write(_1, e, _2, more) {
  //   return new WriteStatement([e.ast(), ...more.ast()]);
  // },
  // Stmt_while(_1, e, _2, b, _3) {
  //   return new WhileStatement(e.ast(), b.ast());
  // },
  // Type(typeName) {
  //   return typeName.sourceString === "int" ? IntType : BoolType;
  // },
  // Exp_binary(e1, _, e2) {
  //   return new BinaryExpression("or", e1.ast(), e2.ast());
  // },
  // Exp1_binary(e1, _, e2) {
  //   return new BinaryExpression("and", e1.ast(), e2.ast());
  // },
  // Exp2_binary(e1, op, e2) {
  //   return new BinaryExpression(op.sourceString, e1.ast(), e2.ast());
  // },
  // Exp3_binary(e1, op, e2) {
  //   return new BinaryExpression(op.sourceString, e1.ast(), e2.ast());
  // },
  // Exp4_binary(e1, op, e2) {
  //   return new BinaryExpression(op.sourceString, e1.ast(), e2.ast());
  // },
  // Exp5_unary(op, e) {
  //   return new UnaryExpression(op.sourceString, e.ast());
  // },
  // Exp6_parens(_1, e, _2) {
  //   return e.ast();
  // },
  // boollit(_) {
  //   return new BooleanLiteral(this.sourceString === "true");
  // },
  // intlit(_) {
  //   return new IntegerLiteral(this.sourceString);
  // },
  // VarExp(_) {
  //   return new VariableExpression(this.sourceString);
  // }
});
/* eslint-enable no-unused-vars */

module.exports = text => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw match.message;
  }
  return astBuilder(match).ast();
};

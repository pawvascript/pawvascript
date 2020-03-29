const {
  //   Program,
  //   Block,
  //   ConditionalStatement,
  //   InfiniteLoopStatement,
  //   ForLoopStatement,
  //   ThroughLoopStatement,
  //   WhileLoopStatement,
  //   FixedLoopStatement,
  //   VariableDeclaration,
  //   Type,
  FunctionDeclaration,
  //   TypeDeclaration,
  //   ConstructorDeclaration,
  NumType,
  BoolType,
  StringType,
  //   ListType,
  //   DictType,
  //   AssignmentStatement,
  //   FunctionCall,
  //   PrintStatement,
  //   GiveStatement,
  //   BreakStatement,
  //   ContinueStatement,
  //   TypeGrouping,
  Parameters,
  //   BooleanLiteral,
  //   NumberLiteral,
  //   StringLiteral,
  //   TemplateLiteral,
  //   PackLiteral,
  //   ListElement,
  //   KennelLiteral,
  //   KeyValuePair,
  VariableExpression
  //   UnaryExpression,
  //   BinaryExpression
} = require("../ast");

const standardFunctions = [
  // built-in string functions:
  new FunctionDeclaration(
    new VariableExpression("size"),
    new Parameters([StringType], [new VariableExpression("s")]),
    NumType,
    null // what to put here?
  ),
  new FunctionDeclaration(
    new VariableExpression("substring"),
    new Parameters(
      [StringType, NumType, NumType],
      [
        new VariableExpression("s"),
        new VariableExpression("beginIndex"),
        new VariableExpression("endIndex")
      ]
    ),
    StringType,
    null // todo
  ),
  new FunctionDeclaration(
    new VariableExpression("containsSubstring"),
    new Parameters([StringType], [new VariableExpression("substring")]),
    BoolType,
    null // todo
  )
  // built-in list functions:
  // how do you a generic sort of function like this??? the parameter could be any type, whatever the type of the list is
  //   new FunctionDeclaration(
  //       new VariableExpression("containsElement"),
  //       new Parameters([ListType, ??????????])
  //   )

  // conversion between different primitive types:
  // num -> string
  // string -> num
  // bool -> num
  // num -> bool
  // string --> bool
  // bool -> string

  // standard toString function for any object:
];

/* eslint-disable no-param-reassign */
standardFunctions.forEach(f => {
  f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = { standardFunctions };

const {
  PrimitiveType,
  ListType,
  DictType,
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
} = require("../ast");

const NumType = new PrimitiveType("toeBeans");
const StringType = new PrimitiveType("leash");
const BoolType = new PrimitiveType("goodBoy");

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
        new VariableExpression("endIndex"),
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
  ),
  new FunctionDeclaration(
    new VariableExpression("indexOf"),
    new Parameters([StringType], [new VariableExpression("substring")]),
    NumType,
    null // todo
  ),
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

// add a flag to functions to indicate they are standard
// will not be pure pawvascript
// can use function overloading

/* eslint-disable no-param-reassign */
standardFunctions.forEach((f) => {
  f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = { NumType, StringType, BoolType, standardFunctions };

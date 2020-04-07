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
    new Function(
      new Parameters([StringType], [new VariableExpression("s")]),
      NumType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("substring"),
    new Function(
      new Parameters(
        [StringType, NumType, NumType],
        [
          new VariableExpression("s"),
          new VariableExpression("beginIndex"),
          new VariableExpression("endIndex"),
        ]
      ),
      StringType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("containsSubstring"),
    new Function(
      new Parameters([StringType], [new VariableExpression("substring")]),
      BoolType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("indexOfChar"),
    new Function(
      new Parameters([StringType], [new VariableExpression("substring")]),
      NumType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("toeBeansToLeash"),
    new Function(
      new Parameters([NumType], [new VariableExpression("number")]),
      StringType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("leashToToeBeans"),
    new Function(
      new Parameters([StringType], [new VariableExpression("string")]),
      NumType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("goodBoyToToeBeans"),
    new Function(
      new Parameters([BoolType], [new VariableExpression("boolean")]),
      NumType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("toeBeansToGoodBoy"),
    new Function(
      new Parameters([NumType], [new VariableExpression("number")]),
      BoolType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("leashToGoodBoy"),
    new Function(
      new Parameters([StringType], [new VariableExpression("string")]),
      BoolType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("goodBoyToLeash"),
    new Function(
      new Parameters([BoolType], [new VariableExpression("boolean")]),
      StringType,
      null
    )
  ),
  // built-in list functions:
  // how do you a generic sort of function like this??? the parameter could be any type, whatever the type of the list is
  //   new FunctionDeclaration(
  //       new VariableExpression("containsElement"),
  //       new Parameters([ListType, ??????????])
  //   )

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

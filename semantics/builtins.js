const {
  PrimitiveType,
  FunctionDeclaration,
  Function,
  Parameters,
  VariableExpression,
} = require("../ast");

const NumType = new PrimitiveType("toeBeans");
const StringType = new PrimitiveType("leash");
const BoolType = new PrimitiveType("goodBoy");

const standardFunctions = [
  /* Built-in String Functions */
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
    new VariableExpression("contains"),
    new Function(
      new Parameters([StringType], [new VariableExpression("substring")]),
      BoolType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("indexOfSubstring"),
    new Function(
      new Parameters([StringType], [new VariableExpression("substring")]),
      NumType,
      null
    )
  ),
  /* Conversion Between Primitive Types */
  new FunctionDeclaration(
    new VariableExpression("toeBeansToLeash"),
    new Function(
      new Parameters([NumType], [new VariableExpression("n")]),
      StringType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("leashToToeBeans"),
    new Function(
      new Parameters([StringType], [new VariableExpression("s")]),
      NumType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("goodBoyToToeBeans"),
    new Function(
      new Parameters([BoolType], [new VariableExpression("b")]),
      NumType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("toeBeansToGoodBoy"),
    new Function(
      new Parameters([NumType], [new VariableExpression("n")]),
      BoolType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("leashToGoodBoy"),
    new Function(
      new Parameters([StringType], [new VariableExpression("s")]),
      BoolType,
      null
    )
  ),
  new FunctionDeclaration(
    new VariableExpression("goodBoyToLeash"),
    new Function(
      new Parameters([BoolType], [new VariableExpression("b")]),
      StringType,
      null
    )
  ),
  /* Built-In List Functions */

  // how do you a generic sort of function like this??? the parameter could be any type, whatever the type of the list is
  //   new FunctionDeclaration(
  //       new VariableExpression("containsElement"),
  //       new Parameters([ListType, ??????????])
  //   )

  // standard toString function for any object:
];

// will not be pure pawvascript
// can use function overloading

/* eslint-disable no-param-reassign */
standardFunctions.forEach((f) => {
  f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = { NumType, StringType, BoolType, standardFunctions };

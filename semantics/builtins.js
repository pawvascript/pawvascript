const {
    PrimitiveType,
    FunctionDeclaration,
    Function,
    Parameters,
    VariableExpression
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
                    new VariableExpression("endIndex")
                ]
            ),
            StringType,
            null
        )
    ),
    new FunctionDeclaration(
        new VariableExpression("contains"),
        new Function(
            new Parameters([StringType, StringType], [new VariableExpression("s"), new VariableExpression("substring")]),
            BoolType,
            null
        )
    ),
    new FunctionDeclaration(
        new VariableExpression("indexOfSubstring"),
        new Function(
            new Parameters([StringType, StringType], [new VariableExpression("s"), new VariableExpression("substring")]),
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
    )
    /* Built-In List Functions */
    // TODO: Future versions of PawvaScript will include more built-in's, including:
    // - built-in functions for lists:
    //      - indexOf: returns index of the first instance of the element in the given list
    // - toString function that takes in an argument of any arbitrary type and returns a string describing it

    // TODO: how to make a generic function like this in our language?
    // for indexOf, the first parameter could be any list type with an arbitrary member type;
    // the second parameter would be this member type and could also be any type
    //   new FunctionDeclaration(
    //       new VariableExpression("containsElement"),
    //       new Parameters([ListType, ??????????])
    //   )
];

/* eslint-disable no-param-reassign */
standardFunctions.forEach(f => {
    f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = {
    NumType,
    StringType,
    BoolType,
    standardFunctions
};
const util = require("util");
const {
  ListType,
  DictType,
  IdType,
  BreedType,
  VariableExpression,
  GiveStatement,
} = require("../ast");
const { NumType, StringType, BoolType } = require("./builtins");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  // Returns whether the given type is a ListType
  isListType(type) {
    return this.typesAreEquivalent(new ListType(null), type);
  },

  // Verifies that the type of the given expression a list type
  isList(expression) {
    doCheck(expression.type.constructor === ListType, "Not a list");
  },

  // Returns whether the given type is a DictType
  isDictType(type) {
    return this.typesAreEquivalent(new DictType(null, null), type);
  },

  // Verifies that the type of the given expression a dictionary type
  isDict(expression) {
    doCheck(expression.type.constructor === DictType, "Not a dictionary");
  },

  // Returns whether the given type is a NumType
  isNumType(type) {
    return this.typesAreEquivalent(type, NumType);
  },

  // Verifies that the type of the given expression a number type
  isNumber(expression) {
    doCheck(this.typesAreEquivalent(expression.type, NumType), "Not a number");
  },

  // Returns whether the given type is a StringType
  isStringType(type) {
    return this.typesAreEquivalent(type, StringType);
  },

  // Verifies that the type of the given expression a string type
  isString(expression) {
    doCheck(
      this.typesAreEquivalent(expression.type, StringType),
      "Not a string"
    );
  },

  // Returns whether the given type is a BoolType
  isBoolType(type) {
    return this.typesAreEquivalent(type, BoolType);
  },

  // Verifies that the type of the given expression a boolean type
  isBool(expression) {
    doCheck(
      this.typesAreEquivalent(expression.type, BoolType),
      "Not a boolean"
    );
  },

  // Verifies that the type of the given expression a number type or string type
  isNumberOrString(expression) {
    doCheck(
      this.typesAreEquivalent(expression.type, NumType) ||
        this.typesAreEquivalent(expression.type, StringType),
      "Not a number or string"
    );
  },

  // Verifies that the given entity is a function or a breed
  isFunctionOrBreed(value) {
    doCheck(
      value.constructor.name === "Function" || value.constructor === BreedType,
      "Attempt to call a non-function"
    );
  },

  // Recursive helper function that determines whether two types are exactly the same
  typesAreEquivalent(t1, t2) {
    if (t1 === null || t2 === null) {
      return true;
    }
    if (t1.constructor === ListType && t2.constructor === ListType) {
      return this.typesAreEquivalent(t1.memberType, t2.memberType);
    } else if (t1.constructor === DictType && t2.constructor === DictType) {
      return (
        this.typesAreEquivalent(t1.keyType, t2.keyType) &&
        this.typesAreEquivalent(t1.valueType, t2.valueType)
      );
    } else if (t1.constructor === IdType) {
      return this.typesAreEquivalent(t1.ref, t2);
    } else if (t2.constructor === IdType) {
      return this.typesAreEquivalent(t1, t2.ref);
    } else {
      return t1 === t2;
    }
  },

  // Verifies that two types are equivalent
  typesMatch(t1, t2) {
    doCheck(
      this.typesAreEquivalent(t1, t2),
      `Type ${util.format(t1)} is not compatible with type ${util.format(t2)}`
    );
  },

  // Verifies that two expressions have equivalent types
  expressionsHaveTheSameType(e1, e2) {
    if (e1 === null || e2 === null) {
      return;
    }
    doCheck(
      this.typesAreEquivalent(e1.type, e2.type),
      `Expression of type ${util.format(
        e1.type
      )} not compatible with expression of type ${util.format(e2.type)}`
    );
  },

  // Verifies that we can assign the given expression to a variable/param/field of the given type
  isAssignableTo(expression, type) {
    let expressionType =
      expression.constructor === VariableExpression
        ? expression.ref.type
        : expression.type;
    let targetType = type;
    doCheck(
      this.typesAreEquivalent(expressionType, targetType),
      `Expression of type ${util.format(
        expressionType
      )} not assignable to variable/param/field of type ${util.format(
        targetType
      )}`
    );
  },

  // Verifies that the given variable expression being assigned to is not read-only
  // Variables that are read-only include the length of a list, the index of a through loop, etc.
  isNotReadOnly(lvalue) {
    doCheck(!lvalue.isReadOnly, "Assignment to read-only variable");
  },

  // Verifies that a breed member's identifier is unique
  identifierHasNotBeenUsed(identifierName, members) {
    doCheck(
      !members.has(identifierName),
      `Duplicate identifier ${identifierName}`
    );
  },

  // Verifies that there is either 0 or 1 constructor
  // Note: PawvaScript currently only supports having at most one constructor per TypeDeclaration.
  // In future iterations, we hope to implement method overloading in PawvaScript, which would
  // allow us to have multiple constructors for a single BreedType.
  noMoreThanOneConstructor(constructors) {
    doCheck(
      constructors.length <= 1,
      `A type declaration can define at most one constructor`
    );
  },

  // Verifies that the constructor id is the same as the breed's id
  constructorNameMatchesBreedId(constructorId, breedId) {
    doCheck(
      constructorId.name === breedId.name,
      `A constructor's identifier must match the identifier of the breed in which it is defined`
    );
  },

  // Verifies that the ids of the constructor's parameters are in the breed's fields
  constructorParamsAreFields(parameters, fields) {
    const fieldIds = fields.map((field) => field.id.name);
    const fieldVars = fields.map((field) => field.variable);
    doCheck(
      parameters.ids.every((paramId, i) => {
        const matchingField = fieldIds.indexOf(paramId.name);
        const fieldAndParamTypesMatch = this.typesAreEquivalent(
          parameters.types[i],
          fieldVars[matchingField].type
        );
        return matchingField !== -1 && fieldAndParamTypesMatch;
      }),
      `Parameters of a constructor must be fields of the breed`
    );
  },

  // Verifies that a breedType's constructor's return type is the breed itself
  constructorReturnsBreedType(constr, breed) {
    doCheck(
      this.typesAreEquivalent(constr.returnType, breed),
      `The return type of a constructor must be the breed in which it is defined`
    );
  },

  // Verifies that the given keyword is being validly used in a loop context
  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },

  // Verifies that a function or type declaration does not occur in a loop context
  funcOrTypeDecNotInLoop(context) {
    doCheck(
      !context.inLoop,
      `Functions and types cannot be declared in a loop`
    );
  },

  // Verifies that the given keyword is being validly used in a function context
  inFunction(context, keyword) {
    doCheck(
      context.currentFunction !== null,
      `${keyword} can only be used in a function`
    );
  },

  // Verifies that there are the same number of args and params, and all types compatible
  legalArguments(args, parameters) {
    if (args.length === 0 && parameters === null) {
      return;
    }
    doCheck(
      args.length === parameters.types.length,
      `Expected ${parameters.types.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, parameters.types[i]));
  },

  // Verifies that a function with a non-null return type contains at least one return statement in its body.
  functionWithReturnTypeContainsGiveStatement(func) {
    if (func.returnType === null) {
      return;
    }
    doCheck(
      func.body.statements.some((s) => s.constructor === GiveStatement),
      `Expected function to return expression of type ${util.format(
        func.returnType
      )}, but body does not contain a give statement`
    );
  },

  // Verifies that the returned expression has the same type as the function's return type
  giveExpressionHasCorrectReturnType(expression, func) {
    const giveType = expression === null ? null : expression.type;
    const returnType = func.returnType;
    doCheck(
      (expression === null && returnType === null) ||
        this.typesAreEquivalent(giveType, returnType),
      `Expected function to return expression of type ${util.format(
        returnType
      )}, got ${util.format(giveType)}`
    );
  },

  // Verifies that the spread operator is only used in front of a list element that is also a list type
  isValidSpread(expression) {
    const expressionType =
      expression.constructor === VariableExpression
        ? expression.ref.type
        : expression.type;
    doCheck(this.isListType(expressionType), "Not a valid spread operator");
  },
};

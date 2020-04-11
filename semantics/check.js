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
  // Is this type an array type?
  isListType(type) {
    doCheck(type.constructor === ListType, "Not a list type");
  },

  // Is the type of this expression an array type?
  isList(expression) {
    doCheck(expression.type.constructor === ListType, "Not a list");
  },

  isDict(expression) {
    doCheck(expression.type.constructor === DictType, "Not a dictionary");
  },

  isNumber(expression) {
    doCheck(this.typesAreEquivalent(expression.type, NumType), "Not a number");
  },

  isString(expression) {
    doCheck(
      this.typesAreEquivalent(expression.type, StringType),
      "Not a string"
    );
  },

  isBool(expression) {
    doCheck(
      this.typesAreEquivalent(expression.type, BoolType),
      "Not a boolean"
    );
  },

  isNumberOrString(expression) {
    doCheck(
      this.typesAreEquivalent(expression.type, NumType) ||
        this.typesAreEquivalent(expression.type, StringType),
      "Not a number or string"
    );
  },

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

  typesMatch(t1, t2) {
    doCheck(
      this.typesAreEquivalent(t1, t2),
      `Type ${util.format(t1)} is not compatible with type ${util.format(t2)}`
    );
  },

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

  // Can we assign expression to a variable/param/field of type type?
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

  // Variables that are read-only include the length of a list, the index of a through loop, etc.
  isNotReadOnly(lvalue) {
    doCheck(!lvalue.isReadOnly, "Assignment to read-only variable");
  },

  identifierHasNotBeenUsed(identifierName, members) {
    doCheck(
      !members.has(identifierName),
      `Duplicate identifier ${identifierName}`
    );
  },

  // Note: PawvaScript currently only supports having at most one constructor per TypeDeclaration.
  // In future iterations, we hope to implement method overloading in PawvaScript, which would
  // allow us to have multiple constructors for a single BreedType.
  noMoreThanOneConstructor(constructors) {
    doCheck(
      constructors.length <= 1,
      `A type declaration can define at most one constructor`
    );
  },

  constructorNameMatchesBreedId(constructorId, breedId) {
    doCheck(
      constructorId.name === breedId.name,
      `A constructor's identifier must match the identifier of the breed in which it is defined`
    );
  },

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

  constructorHasReturnType(constr) {
    doCheck(constr.returnType !== null, `Constructors must have a return type`);
  },

  // Checks that a breedType's constructor has a return type and that the return type is the breed itself
  constructorReturnsBreedType(constr, breed) {
    doCheck(
      this.typesAreEquivalent(constr.returnType, breed),
      `The return type of a constructor must be the breed in which it is defined`
    );
  },

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },

  inFunction(context, keyword) {
    doCheck(
      context.currentFunction !== null,
      `${keyword} can only be used in a function`
    );
  },

  // Same number of args and params; all types compatible
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

  isValidSpread(expression) {
    const expressionType =
      expression.constructor === VariableExpression
        ? expression.ref.type
        : expression.type;
    doCheck(
      expressionType.constructor === ListType,
      "Not a valid spread operator"
    );
  },
};

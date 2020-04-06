const util = require("util");
const {
  ListType,
  DictType,
  IdType,
  FunctionDeclaration,
  VariableExpression,
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

  isDictType(type) {
    doCheck(type.constructor === DictType, "Not a dictionary type");
  },

  // Is the type of this expression an array type?
  isList(expression) {
    doCheck(expression.type.constructor === ListType, "Not a list");
  },

  isDict(expression) {
    doCheck(expression.type.constructor === DictType, "Not a dictionary");
  },

  isNumber(expression) {
    doCheck(expression.type === NumType, "Not a number");
  },

  isString(expression) {
    doCheck(expression.type === StringType, "Not a string");
  },

  isBool(expression) {
    doCheck(expression.type === BoolType, "Not a boolean");
  },

  mustNotHaveAType(expression) {
    doCheck(!expression.type, "Expression must not have a type");
  },

  isNumberOrString(expression) {
    doCheck(
      expression.type === NumType || expression.type === StringType,
      "Not a number or string"
    );
  },

  isNumberOrBool(expression) {
    doCheck(
      expression.type === NumType || expression.type === BoolType,
      "Not a number or boolean"
    );
  },

  isPrimitive(expression) {
    doCheck(
      expression.type === NumType ||
        expression.type === BoolType ||
        expression.type === StringType,
      "Not a primitive type (toeBeans, leash, goodBoy)"
    );
  },

  isFunction(value) {
    doCheck(value.constructor === Function, "Attempt to call a non-function");
  },

  typesMatch(t1, t2) {
    if (t1.constructor === ListType && t2.constructor === ListType) {
      this.typesMatch(t1.memberType, t2.memberType);
    } else if (t1.constructor === DictType && t2.constructor === DictType) {
      this.typesMatch(t1.keyType, t2.keyType);
      this.typesMatch(t1.valueType, t2.valueType);
    } else if (t1.constructor === IdType && t2.constructor === IdType) {
      this.typesMatch(t1.ref, t2.ref);
    } else {
      doCheck(
        t1 === t2 || t1 === null || t2 === null, // TODO: once we figure out the answer to the primitive types question, come back to this. === or .equals?
        `Expression of type ${util.format(
          t1
        )} not compatible with type ${util.format(t2)}`
      );
    }
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    // doCheck(e1.type === e2.type, "Types must match exactly");
    this.typesMatch(e1.type, e2.type);
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    // if expression is a variableexpression, check if expression.ref.type === type
    // otherwise, check if expression.type === type
    let expressionType =
      expression.constructor === VariableExpression
        ? expression.ref.type
        : expression.type;
    let targetType = type;
    this.typesMatch(expressionType, targetType);
  },

  // Variables that are read-only include the length of a list, the index of a through loop, etc.
  isNotReadOnly(lvalue) {
    doCheck(
      !lvalue.isReadOnly,
      //!(lvalue.constructor === VariableExpression && lvalue.ref.readOnly),
      "Assignment to read-only variable"
    );
  },

  identifierHasNotBeenUsed(identifierName, usedIdentifiers) {
    doCheck(
      !usedIdentifiers.has(identifierName),
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
    const fieldIds = fields.map((field) => field.id);
    const fieldVars = fields.map((field) => field.variable);
    doCheck(
      parameters.ids.every((paramId, i) => {
        const matchingField = fieldIds.indexOf(paramId.name);
        const fieldAndParamTypesMatch = this.typesMatch(
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
      this.typesMatch(constr.returnType, breed),
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
    doCheck(
      args.length === parameters.types.length,
      `Expected ${parameters.types.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, parameters.types[i]));
  },

  isValidSpread(expression) {
    let expressionType =
      expression.constructor === VariableExpression
        ? expression.ref.type
        : expression.type;
    doCheck(
      expressionType.constructor === ListType,
      "Not a valid spread operator"
    );
  },
};

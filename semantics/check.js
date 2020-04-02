const util = require("util");
const {
  ListType,
  DictType,
  IdType,
  FunctionDeclaration,
  VariableExpression
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

  isFunction(value) {
    doCheck(value.constructor === Function, "Attempt to call a non-function");
  },

  typesMatch(t1, t2) {
    if (t1.constructor === ListType && t2.constructor === ListType) {
      this.listTypesHaveSameMemberType(t1, t2);
    } else if (t1.constructor === DictType && t2.constructor === DictType) {
      this.dictTypesHaveSameKeyValueTypes(t1, t2);
    } else if (t1.constructor === IdType && t2.constructor === IdType) {
      this.idTypesMatch(t1, t2);
    } else {
      doCheck(
        t1 === t2,
        `Expression of type ${util.format(
          t1
        )} not compatible with type ${util.format(t2)}`
      );
    }
  },

  listTypesHaveSameMemberType(listType1, listType2) {
    this.typesMatch(listType1.memberType, listType2.memberType);
  },

  dictTypesHaveSameKeyValueTypes(dictType1, dictType2) {
    this.typesMatch(dictType1.keyType, dictType2.keyType);
    this.typesMatch(dictType1.valueType, dictType2.valueType);
  },

  idTypesMatch(idType1, idType2) {
    this.typesMatch(idType1.ref, idType2.ref);
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

  fieldHasNotBeenUsed(fieldName, usedFields) {
    doCheck(!usedFields.has(fieldName), `Field ${fieldName} already declared`);
  },

  methodHasNotBeenUsed(methodName, usedMethods) {
    doCheck(
      !usedMethods.has(methodName),
      `Method ${methodName} already declared`
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

  // do we need this??? what is this even for
  // If there is a cycle in types, they must go through a record
  // noRecursiveTypeCyclesWithoutRecordTypes() {
  //   /* TODO - not looking forward to this one */
  // },

  isValidSpread(expression) {
    let expressionType =
      expression.constructor === VariableExpression
        ? expression.ref.type
        : expression.type;
    doCheck(
      expressionType.constructor === ListType,
      "Not a valid spread operator"
    );
  }
};

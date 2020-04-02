const util = require("util");
const {
  ListType,
  FunctionDeclaration,
  DictType,
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

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  },
  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    doCheck(
      // (expression.type === NilType && type.constructor === RecordType) ||
      //   expression.type === type,
      // if expression is a variableexpression, check if expression.ref.type === type
      // otherwise, check if expression.type === type
      // if either of the two types is an idtype, we need to do .ref again lol
      // if either of them are list types, we need to check member types???
      // and if dict type, check key type and value type??
      `Expression of type ${util.format(
        expression.type
      )} not compatible with type ${util.format(type)}`
    );
  },

  // do we need this? we don't have const's but i can imagine a user trying to change something like list.length
  isNotReadOnly(lvalue) {
    doCheck(
      !lvalue.isReadOnly,
      //!(lvalue.constructor === VariableExpression && lvalue.ref.readOnly),
      "Assignment to read-only variable"
    );
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  // don't need this because context.lookup already throws an error if var not declared
  // variableWasPreviouslyDeclared(id, context) {},

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },

  // Same number of args and params; all types compatible
  legalArguments(args, parameters) {
    doCheck(
      args.length === parameters.types.length,
      `Expected ${parameters.types.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, parameters.types[i]));
  },

  // If there is a cycle in types, they must go through a record
  noRecursiveTypeCyclesWithoutRecordTypes() {
    /* TODO - not looking forward to this one */
  },

  isValidSpread(expression) {
    doCheck(
      expression.type.constructor == ListType,
      "Not a valid spread operator"
    );
  }
};

const util = require("util");
const {
  ListType,
  FunctionDeclaration,
  RecordType,
  VariableExpression
} = require("../ast");
const { IntType, StringType, NilType } = require("./builtins");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  // Is this type an array type?
  isArrayType(type) {
    doCheck(type.constructor === ListType, "Not an array type");
  },

  isRecordType(type) {
    doCheck(type.constructor === RecordType, "Not a record type");
  },

  // Is the type of this expression an array type?
  isArray(expression) {
    doCheck(expression.type.constructor === ListType, "Not an array");
  },

  isRecord(expression) {
    doCheck(expression.type.constructor === RecordType, "Not a record");
  },

  isInteger(expression) {
    doCheck(expression.type === IntType, "Not an integer");
  },

  mustNotHaveAType(expression) {
    doCheck(!expression.type, "Expression must not have a type");
  },

  isIntegerOrString(expression) {
    doCheck(
      expression.type === IntType || expression.type === StringType,
      "Not an integer or string"
    );
  },

  isFunction(value) {
    doCheck(value.constructor === FunctionDeclaration, "Not a function");
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    doCheck(
      (expression.type === NilType && type.constructor === RecordType) ||
        expression.type === type,
      `Expression of type ${util.format(
        expression.type
      )} not compatible with type ${util.format(type)}`
    );
  },

  // do we need this? we don't have const's but i can imagine a user trying to change something like list.length
  isNotReadOnly(lvalue) {
    doCheck(
      !(lvalue.constructor === VariableExpression && lvalue.ref.readOnly),
      "Assignment to read-only variable"
    );
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

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
  }
};

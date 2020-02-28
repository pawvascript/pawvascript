// Parser module
//
//   const parse = require('./parser');
//   const ast = parse(sourceCodeString);

const ohm = require("ohm-js");
const fs = require("fs");

const {
  Program,
  Block,
  ConditionalStatement,
  InfiniteLoopStatement,
  ForLoopStatement,
  ThroughLoopStatement,
  WhileLoopStatement,
  FixedLoopStatement,
  VariableDeclaration,
  Type,
  FunctionDeclaration,
  TypeDeclaration,
  IntType,
  BoolType,
  StringType,
  ArrayType,
  DictType,
  ObjectType,
  AssignmentStatement,
  FunctionCallStatement,
  WoofStatement,
  BarkStatement,
  HowlStatement,
  GiveStatement,
  Grouping,
  Parameters,
  BooleanLiteral,
  IntegerLiteral,
  StringLiteral,
  PackLiteral,
  KennelLiteral,
  //   VariableExpression, // ??? what's this for
  UnaryExpression,
  BinaryExpression
} = require(".");

const grammar = ohm.grammar(fs.readFileSync("./grammar/pawvascript.ohm"));

function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

const astBuilder = grammar.createSemantics().addOperation("ast", {
  Program(b) {
    return new Program(b.ast());
  },
  Block(s) {
    return new Block(s.ast()); // TOAL QUESTION: do we break this up into [...s] because it comes in as a list of statements?
  },
  Conditional_basic(_1, condition, _2, _3, body) {
    return new ConditionalStatement(condition.ast(), body.ast(), null);
  },
  Conditional_else(_1, condition, _2, _3, body, _4, _5, otherwise) {
    return new ConditionalStatement(
      condition.ast(),
      body.ast(),
      otherwise.ast()
    );
  },
  Conditional_elseif(
    _1,
    condition,
    _2,
    _3,
    body,
    _4,
    _5,
    moreConditions,
    _6,
    _7,
    moreBodies,
    _8,
    otherwise
  ) {
    let nestedConditional = otherwise.ast();
    while (moreConditions.length > 0) {
      nestedConditional = new ConditionalStatement(
        moreConditions.pop().ast(),
        moreBodies.pop().ast(),
        nestedConditional
      );
    }
    return new ConditionalStatement(
      condition.ast(),
      body.ast(),
      nestedConditional
    );
  },
  // TODO: change all of these to While_defined etc in both this file and the grammar
  Chase_defined(_1, exp, _2, _3, body) {
    return new FixedLoopStatement(exp.ast(), body.ast());
  },
  Chase_while(_1, _2, test, _3, body) {
    return new WhileLoopStatement(test.ast(), body.ast());
  },
  Chase_through(_1, elementId, _2, collectionId, _3, body) {
    return new ThroughLoopStatement(
      elementId.ast(),
      collectionId.ast(),
      body.ast()
    );
  },
  Chase_for(_1, varDec, _2, updateExp, _3, test, _4, body) {
    return new ForLoopStatement(
      varDec.ast(),
      updateExp.ast(),
      test.ast(),
      body.ast()
    );
  },
  Chase_infinite(_1, _2, body) {
    return new InfiniteLoopStatement(body.ast());
    // TODO ADD A BREAK STATEMENT
  },
  Statement(a, semicolonOrTail) {
    return a.ast();
  },
  Statement_give(_1, exp, _2) {
    return new GiveStatement(arrayToNullable(exp.ast()));
  },
  Assignment(id, grouping, _, exp) {
    return new AssignmentStatement(
      id.ast(),
      arrayToNullable(grouping.ast()),
      exp.ast()
    );
  },
  Woof(_, exp) {
    return new WoofStatement(exp.ast());
  },
  Bark(_, exp) {
    return new BarkStatement(exp.ast());
  },
  Howl(_, exp) {
    return new HowlStatement(exp.ast());
  },
  Declaration_varDec(v, _) {
    return v.ast();
  },
  FuncDec_basic(_1, id, _2, parameters, _3, returnType, _4, body, _5) {
    return new FunctionDeclaration(
      id.ast(),
      arrayToNullable(parameters.ast()),
      arrayToNullable(returnType.ast()),
      body.ast()
    );
  },
  FuncDec_constructor(_1, id, _2, parameters, _3, returnType, _4) {
    // TODO maybe make a constructor class?
    // return new Constructor();
    return new FunctionDeclaration(
      id.ast(),
      arrayToNullable(parameters.ast()),
      returnType.ast()
    );
  },
  VarDec(type, id, grouping, _, exp) {
    return new VariableDeclaration(id.ast(), type.ast(), grouping.ast());
  },
  TypeDec(_1, id, _2, _3, body, _4) {
    return new TypeDeclaration(id, body);
  },
  Grouping(_1, keyType, _2, valueType, _3) {
    // a grouping probably would not be a node in the abstract syntax tree,
    // so do we maybe want to get rid of this class and absorb it into var/type decs?
    return new Grouping(arrayToNullable(keyType), valueType);
  },
  FuncCall(id, _1, firstArg, _2, moreArgs, _3) {
    // do we need a separate class for function calls instead of function call statements?
    return new FunctionCallStatement(id.ast(), [
      arrayToNullable(firstArg.ast()),
      ...moreArgs.ast() // no idea if this is the right syntax for this
    ]);
  },
  Parameters(_1, firstType, _2, firstId, _3, moreTypes, _4, moreIds, _5) {
    const types = [arrayToNullable(firstType.ast())].concat(moreTypes.ast());
    const ids = [arrayToNullable(firstId.ast())].concat(moreIds.ast());
    return new Parameters(types, ids);
  },
  RelopExp_assignment(term1, _, term2) {
    // why do we need this grammar rule? do we need a new kind of node?
    return new AssignmentStatement(term1.ast(), null, term2.ast());
  },
  RelopExp_relop(term1, relop, term2) {
    return new BinaryExpression(relop.ast(), term1.ast(), term2.ast());
  },
  Term_addOp(term, op, factor) {
    return new BinaryExpression(op.ast(), term.ast(), factor.ast());
  },
  Factor_mulOp(factor, op, negation) {
    return new BinaryExpression(op.ast(), factor.ast(), negation.ast());
  },
  Negation(prefixOp, factorial) {
    return new UnaryExpression(
      arrayToNullable(prefixOp.ast()),
      factorial.ast()
    );
  },
  Factorial(primary, postfixOp) {
    return new UnaryExpression(arrayToNullable(postfixOp.ast()), primary.ast());
  },
  Primary_parens(_1, exp, _2) {
    return exp.ast();
  },
  Primary_pack(_1, spreadOp, firstElem, _2, moreSpreadOps, moreElems, _3) {
    let elements = [];
    const concatElements = (spread, element) => {
      if (arrayToNullable(spread.ast())) {
        // do I need to do arrayToNullable(arrayToNullable(spread.ast())) twice because it was an optional in an optional?
        elements.concat(...element.ast());
      } else {
        elements.concat(arrayToNullable(element.ast()));
      }
    };
    concatElements(spreadOp, firstElem);
    while (moreElems.length > 0) {
      concatElements(moreSpreadOps.shift(), moreElems.shift());
    }
    return new PackLiteral(elements);
  },
  Primary_kennel(_1, firstKey, _2, firstVal, _3, moreKeys, _4, moreVals, _5) {
    let keys = [];
    let values = [];
    const concatKeysValues = (key, value) => {
      if (arrayToNullable(key.ast())) {
        keys.concat(key.ast());
        values.concat(value.ast());
      }
    };
    concatKeysValues(firstKey, firstVal);
    while (moreKeys.length > 0) {
      concatKeysValues(moreKeys.shift(), moreVals.shift());
    }
    return new KennelLiteral(keys, values);
  },
  Property(id, _, exp) {
    return; // ????????????
  },
  boolean(_) {
    return new BooleanLiteral(this.sourceString === "good");
  },
  numlit(_1, _2, _3) {
    //rename as NumberLiteral not integer
    return new IntegerLiteral(this.sourceString);
  },
  strlit(_1, chars, _2) {
    // ??????? not sure if right
    return new StringLiteral(chars.ast());
  },
  id(_1, _2) {
    return this.sourceString;
  },
  type(typeName) {
    switch (typeName) {
      case "toeBeans":
        return IntType;
      case "leash":
        return StringType;
      case "goodBoy":
        return BoolType;
      case "pack":
        return ArrayType;
      case "kennel":
        return DictType;
      case "breed":
        return ObjectType;
    }
    // what about types that are an ID??
    return new Type(typeName);
  }
});

module.exports = text => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw match.message;
  }
  return astBuilder(match).ast();
};

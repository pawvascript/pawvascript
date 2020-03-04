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
  NumType,
  BoolType,
  StringType,
  ListType,
  DictType,
  AssignmentStatement,
  FunctionCall,
  PrintStatement,
  GiveStatement,
  Grouping,
  Parameters,
  BooleanLiteral,
  NumberLiteral,
  StringLiteral,
  PackLiteral,
  ListElement,
  KennelLiteral,
  KeyValuePair,
  //   VariableExpression, // ??? what's this for
  UnaryExpression,
  BinaryExpression
} = require(".");

const grammar = ohm.grammar(fs.readFileSync("./grammar/pawvascript.ohm"));

function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

function getType(typeName) {
  switch (typeName) {
    case "toeBeans":
      return NumType;
    case "leash":
      return StringType;
    case "goodBoy":
      return BoolType;
  }
  const foundPack = typeName.match(/^(?:pack)(?:\[)(.+)(?:\])$/);
  if (foundPack) {
    return new ListType(new Grouping(null, getType(foundPack[1])));
  }
  const foundKennel = typeName.match(/^(?:kennel)(?:\[)(.+)(?::)(.+)(?:\])$/);
  if (foundKennel) {
    return new DictType(
      new Grouping(getType(foundKennel[1]), getType(foundKennel[2]))
    );
  }
  return new Type(typeName);
}

const astBuilder = grammar.createSemantics().addOperation("ast", {
  Program(b) {
    return new Program(b.ast());
  },
  Block(s) {
    return new Block(s.ast()); // TOAL QUESTION: do we break this up into [...s] because it comes in as a list of statements?
  },
  Conditional(
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
    _9,
    otherwise,
    _10
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
  Loop_defined(_1, exp, _2, _3, body, _4) {
    return new FixedLoopStatement(exp.ast(), body.ast());
  },
  Loop_while(_1, _2, test, _3, body, _4) {
    return new WhileLoopStatement(test.ast(), body.ast());
  },
  Loop_through(_1, elementId, _2, collectionId, _3, body, _4) {
    return new ThroughLoopStatement(
      elementId.ast(),
      collectionId.ast(),
      body.ast()
    );
  },
  Loop_for(_1, varDec, _2, updateExp, _3, test, _4, body, _5) {
    return new ForLoopStatement(
      varDec.ast(),
      updateExp.ast(),
      test.ast(),
      body.ast()
    );
  },
  Loop_infinite(_1, _2, body, _3) {
    return new InfiniteLoopStatement(body.ast());
  },
  //   Statement(a) {
  //     return a.ast();
  //   },
  //   Statement_assignment(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  Statement_funccall(a, _) {
    return a.ast();
  },
  //   Statement_print(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  //   Statement_break(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  //   Statement_continue(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  //   Statement_loop(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  //   Statement_conditional(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  //   Statement_property(a, semicolonOrTail) {
  //     return a.ast();
  //   },
  //   Statement_give(_1, exp, _2) {
  //     return new GiveStatement(arrayToNullable(exp.ast()));
  //   },
  Assignment(id, _1, exp, _2) {
    return new AssignmentStatement(id.ast(), exp.ast());
  },
  Print(flavor, exp, _) {
    return new PrintStatement(flavor.ast(), exp.ast());
  },
  Break(keyword, _) {
    return keyword.ast();
  },
  Continue(keyword, _) {
    return keyword.ast();
  },
  Return(_1, exp, _2) {
    return new GiveStatement(arrayToNullable(exp.ast()));
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
  VarDec(type, id, _is, exp) {
    return new VariableDeclaration(
      id.ast(),
      type.ast(),
      arrayToNullable(exp.ast())
    );
  },
  TypeDec(_1, id, _2, _3, body, _4) {
    return new TypeDeclaration(id, body);
  },
  FuncCall(id, _1, firstArg, _2, moreArgs, _3) {
    // do we need a separate class for function calls instead of function call statements?
    return new FunctionCall(id.ast(), [
      arrayToNullable(firstArg.ast()),
      ...moreArgs.ast() // no idea if this is the right syntax for this
    ]);
  },
  Parameters(_1, firstType, _2, firstId, _3, moreTypes, _4, moreIds, _5) {
    const types = [arrayToNullable(firstType.ast())].concat(moreTypes.ast());
    const ids = [arrayToNullable(firstId.ast())].concat(moreIds.ast());
    return new Parameters(types, ids);
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
  Negation_preFix(prefixOp, factorial) {
    return new UnaryExpression(
      arrayToNullable(prefixOp.ast()),
      factorial.ast()
    );
  },
  Factorial_postFix(primary, postfixOp) {
    return new UnaryExpression(arrayToNullable(postfixOp.ast()), primary.ast());
  },
  Primary_parens(_1, exp, _2) {
    return exp.ast();
  },
  Primary_pack(_1, elements, _2) {
    // let elements = [];
    // const concatElements = (spread, element) => {
    //   console.log("CALLED concatElements");
    //   if (spread) {
    //     elements = elements.concat(...element);
    //   } else if (element) {
    //     elements = elements.concat(element);
    //   }
    // };
    // concatElements(
    //   arrayToNullable(spreadOp.ast()),
    //   arrayToNullable(firstElem.ast())
    // );
    // remainingElems = moreElems.ast();
    // remainingSpreads = moreSpreadOps.ast();
    // while (remainingElems.length > 0) {
    //   console.log("LABS WITH ABS");
    //   concatElements(remainingSpreads.shift(), remainingElems.shift());
    // }
    return new PackLiteral(
      elements.ast().length === 0 ? [] : elements.ast()[0]
    );
  },
  ListElems(firstElem, _, moreElems) {
    return [firstElem.ast(), ...moreElems.ast()];
  },
  ListElem(spreadOp, exp) {
    return new ListElement(spreadOp.ast().length > 0, exp.ast());
  },
  Primary_kennel(_1, pairs, _2) {
    // let keys = [];
    // let values = [];
    // const concatKeysValues = (key, value) => {
    //   if (key) {
    //     keys = keys.concat(key);
    //     values = values.concat(value);
    //   }
    // };
    // concatKeysValues(
    //   arrayToNullable(firstKey.ast()),
    //   arrayToNullable(firstVal.ast())
    // );
    // remainingKeys = moreKeys.ast();
    // remainingValues = moreVals.ast();
    // while (remainingKeys.length > 0) {
    //   concatKeysValues(remainingKeys.shift(), remainingValues.shift());
    // }
    // return new KennelLiteral(keys, values);
    return new KennelLiteral(pairs.ast());
  },
  KeyValPairs(firstPair, _, morePairs) {
    return [firstPair.ast(), ...morePairs.ast()];
  },
  KeyValPair(key, _, val) {
    return new KeyValuePair(key.ast(), val.ast());
  },
  Primary_empty_kennel(_1, _colon, _2) {
    return new KennelLiteral([], []);
  },
  nullval(_) {
    return null;
  },
  booleanlit(_) {
    return new BooleanLiteral(this.sourceString === "good");
  },
  numlit(_1, _2, _3) {
    return new NumberLiteral(+this.sourceString);
  },
  strlit(_1, chars, _2) {
    // ??????? not sure if right
    return new StringLiteral(chars.ast().join(""));
  },
  interpolation(_1, id, _2) {
    // I HAVE NO IDEA WHAT THIS SHOULD RETURN SO I JUST RETURNED ITSELF LMFAO
    return `${_1.ast()}${id.ast()}${_2.ast()}`;
  },
  id(_1, _2) {
    return this.sourceString;
  },
  Type(t) {
    return getType(t.sourceString);
  },
  _terminal() {
    return this.sourceString;
  }
});

module.exports = text => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw match.message;
  }
  return astBuilder(match).ast();
};

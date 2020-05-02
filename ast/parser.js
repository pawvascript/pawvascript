/* eslint-disable no-unused-vars */

/*
 * Parser module for PawvaScript
 *
 * Usage:
 *   const parse = require('./parser');
 *   const ast = parse(sourceCodeString);
 *       Returns the abstract syntax tree for the given program text. This function
 *       will first match against an Ohm grammar, then apply AST generation rules.
 *       If there are any errors, this function will throw an error.
 */

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
  Variable,
  TypeDeclaration,
  Type,
  BreedType,
  Field,
  Method,
  PrimitiveType,
  ListType,
  DictType,
  IdType,
  FunctionDeclaration,
  Function,
  Parameters,
  ConstructorDeclaration,
  Constructor,
  AssignmentStatement,
  FunctionCall,
  PrintStatement,
  GiveStatement,
  BreakStatement,
  ContinueStatement,
  Expression,
  BooleanLiteral,
  NumberLiteral,
  StringLiteral,
  TemplateLiteral,
  PackLiteral,
  ListElement,
  KennelLiteral,
  KeyValuePair,
  VariableExpression,
  UnaryExpression,
  BinaryExpression,
} = require(".");

const grammar = ohm.grammar(fs.readFileSync("./grammar/pawvascript.ohm"));

function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}
function checkForEmptyArray(item) {
  return item.length === 0 ? null : item;
}

function getType(typeName) {
  //   const foundPrimitiveType = typeName.match(/^toeBeans$|^leash$|^goodBoy$/);
  //   if (foundPrimitiveType) {
  //     return new PrimitiveType(typeName);
  //   }
  const foundPack = typeName.match(/^(?:pack)(?:\[)(.+)(?:\])$/);
  if (foundPack) {
    return new ListType(getType(foundPack[1]));
  }
  const foundKennel = typeName.match(/^(?:kennel)(?:\[)(.+)(?::)(.+)(?:\])$/);
  if (foundKennel) {
    return new DictType(getType(foundKennel[1]), getType(foundKennel[2]));
  }
  return new IdType(typeName);
}

const astBuilder = grammar.createSemantics().addOperation("ast", {
  Program(b) {
    return new Program(b.ast());
  },
  Block(s) {
    return new Block(s.ast());
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
    let nestedConditional = arrayToNullable(moreConditions.ast());
    function generateConditional(moreCond, moreBody, nest) {
      if (moreCond.length === 0) {
        nest.push(arrayToNullable(otherwise.ast()));
        for (let i = nest.length - 1; i >= 1; i--) {
          nest[i - 1].otherwise = nest[i];
        }
        return nest[0];
      }
      nest.push(new ConditionalStatement(moreCond.shift(), moreBody.shift()));
      return generateConditional(moreCond, moreBody, nest);
    }
    if (nestedConditional === null) {
      return new ConditionalStatement(
        condition.ast(),
        body.ast(),
        arrayToNullable(otherwise.ast())
      );
    } else {
      nestedConditional = new ConditionalStatement(
        condition.ast(),
        body.ast(),
        generateConditional(moreConditions.ast(), moreBodies.ast(), [])
      );
      return nestedConditional;
    }
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
  Statement_funccall(a, _) {
    return a.ast();
  },
  Assignment(id, _1, exp, _2) {
    return new AssignmentStatement(id.ast(), exp.ast());
  },
  Print(flavor, exp, _) {
    return new PrintStatement(flavor.ast(), exp.ast());
  },
  Break(_keyword, _) {
    return new BreakStatement();
  },
  Continue(_keyword, _) {
    return new ContinueStatement();
  },
  Return(_1, exp, _2) {
    return new GiveStatement(arrayToNullable(exp.ast()));
  },
  Declaration_varDec(v, _) {
    return v.ast();
  },
  FuncDec(_1, id, _2, parameters, _3, returnType, _4, body, _5) {
    return new FunctionDeclaration(
      id.ast(),
      new Function(
        arrayToNullable(parameters.ast()),
        arrayToNullable(returnType.ast()),
        body.ast()
      )
    );
  },
  VarDec(type, id, _is, exp) {
    return new VariableDeclaration(
      id.ast(),
      new Variable(getType(type.sourceString), arrayToNullable(exp.ast()))
    );
  },
  TypeDec(_1, id, _2, _3, typeBody, _4) {
    return new TypeDeclaration(id.ast(), typeBody.ast()); // TODO
  },
  TypeBody(body) {
    let fields = [];
    let constructors = [];
    let methods = [];
    body.ast().forEach((member) => {
      if (member instanceof Field) {
        fields.push(member);
      }
      if (member instanceof ConstructorDeclaration) {
        constructors.push(member);
      }
      if (member instanceof Method) {
        methods.push(member);
      }
    });
    return new BreedType(fields, constructors, methods);
  },
  Field(type, id, _is, exp, _) {
    return new Field(
      id.ast(),
      new Variable(getType(type.sourceString), arrayToNullable(exp.ast()))
    );
  },
  Constructor(_1, id, _2, parameters, _3, returnType, _4) {
    return new ConstructorDeclaration(
      id.ast(),
      new Constructor(arrayToNullable(parameters.ast()), returnType.ast())
    );
  },
  Method(_1, id, _2, parameters, _3, returnType, _4, body, _5) {
    return new Method(
      id.ast(),
      new Function(
        arrayToNullable(parameters.ast()),
        arrayToNullable(returnType.ast()),
        body.ast()
      )
    );
  },
  FuncCall(id, _1, firstArg, _2, moreArgs, _3) {
    if (firstArg.ast().length === 0 && moreArgs.ast().length == 0) {
      return new FunctionCall(id.ast());
    }
    let argsArray = [arrayToNullable(firstArg.ast())].concat(
      checkForEmptyArray(moreArgs.ast())[0]
    );
    return new FunctionCall(id.ast(), argsArray);
  },
  Parameters(_1, firstType, _2, firstId, _3, moreTypes, _4, moreIds, _5) {
    const types = [arrayToNullable(firstType.ast())].concat(moreTypes.ast());
    const ids = [arrayToNullable(firstId.ast())].concat(moreIds.ast());
    return new Parameters(types, ids);
  },
  Exp_logop(left, logop, right) {
    return new BinaryExpression(logop.ast(), left.ast(), right.ast());
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
    return new UnaryExpression(prefixOp.ast(), factorial.ast());
  },
  Factorial_postFix(primary, postfixOp) {
    return new UnaryExpression(arrayToNullable(postfixOp.ast()), primary.ast());
  },
  AtExp_array_index(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast());
  },
  OfExp_dictionary_lookup(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast());
  },
  Primary_parens(_1, exp, _2) {
    return exp.ast();
  },
  Primary_class_member_access(primary, op, id) {
    return new BinaryExpression(op.ast(), primary.ast(), id.ast());
  },
  Primary_pack(_1, elements, _2) {
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
    let membersAST = checkForEmptyArray(chars.ast());
    let quasis = [];
    let exps = [];
    membersAST.forEach((item, i) => {
      if (Array.isArray(item)) {
        quasis.push(new StringLiteral(item.join("")));
      } else {
        // if a template literal begins with an interpolated expression, make sure to include an empty
        // string as the first quasi so that the interpolation happens in the right order
        if (quasis.length === 0) {
          quasis.push(new StringLiteral(""));
        }
        exps.push(item);
        if (i === membersAST.length - 1) {
          quasis.push(new StringLiteral(""));
        }
      }
    });
    return new TemplateLiteral(
      checkForEmptyArray(quasis),
      checkForEmptyArray(exps)
    );
  },
  interpolation(_1, id, _2) {
    return id.ast();
  },
  id(_1, _2) {
    return new VariableExpression(this.sourceString);
  },
  Type(t) {
    return getType(t.sourceString);
  },
  _terminal() {
    return this.sourceString;
  },
});

module.exports = (text) => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw match.message;
  }
  return astBuilder(match).ast();
};

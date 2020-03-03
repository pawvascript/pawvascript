/*
 * Parser Tests
 *
 * These tests check that the parser produces the PawvaScript AST that we expect.
 *
 * Note we are only checking syntactic forms here, so our test programs
 * may have semantic errors.
 */

const parse = require("../parser");

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
  FunctionCallStatement,
  PrintStatement,
  GiveStatement,
  Grouping,
  Parameters,
  BooleanLiteral,
  NumberLiteral,
  StringLiteral,
  PackLiteral,
  KennelLiteral,
  //   VariableExpression, // ??? what's this for
  UnaryExpression,
  BinaryExpression
} = require("..");

const fixture = {
  numberVariableDeclaration: [
    String.raw`toeBeans CeCeAge is 1;`,
    new Program(
      new Block([
        new VariableDeclaration("CeCeAge", NumType, new NumberLiteral(1))
      ])
    )
  ],
  emptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is [];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new ListType(new Grouping(null, StringType)),
          new PackLiteral([])
        )
      ])
    )
  ],
  emptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is [];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new DictType(new Grouping(StringType, NumType)),
          new KennelLiteral([], [])
        )
      ])
    )
  ],
  nonEmptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is ["CeCe", "Buster"];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new ListType(new Grouping(null, StringType)),
          new PackLiteral([
            new StringLiteral("CeCe"),
            new StringLiteral("Buster")
          ])
        )
      ])
    )
  ],
  nonEmptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is ["CeCe":1, "Buster":2];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new DictType(new Grouping(StringType, NumType)),
          new KennelLiteral(
            [new StringLiteral("CeCe"), new StringLiteral("Buster")],
            [new NumberLiteral(1), new NumberLiteral(2)]
          )
        )
      ])
    )
  ]
  /*whiles: [
    String.raw`while false loop x = 3; end;`,
    new Program(
      new Block([
        new WhileStatement(
          new BooleanLiteral(false),
          new Block([
            new AssignmentStatement(
              new VariableExpression("x"),
              new IntegerLiteral("3")
            )
          ])
        )
      ])
    )
  ],

  declarations: [
    String.raw`var x: int; var y: bool;`,
    new Program(
      new Block([
        new VariableDeclaration("x", IntType),
        new VariableDeclaration("y", BoolType)
      ])
    )
  ],

  math: [
    String.raw`read x, y; write 2 * (-5 > 7+1);`,
    new Program(
      new Block([
        new ReadStatement([
          new VariableExpression("x"),
          new VariableExpression("y")
        ]),
        new WriteStatement([
          new BinaryExpression(
            "*",
            new IntegerLiteral("2"),
            new BinaryExpression(
              ">",
              new UnaryExpression("-", new IntegerLiteral("5")),
              new BinaryExpression(
                "+",
                new IntegerLiteral("7"),
                new IntegerLiteral("1")
              )
            )
          )
        ])
      ])
    )
  ],

  logic: [
    String.raw`write x and (not y or x);`,
    new Program(
      new Block([
        new WriteStatement([
          new BinaryExpression(
            "and",
            new VariableExpression("x"),
            new BinaryExpression(
              "or",
              new UnaryExpression("not", new VariableExpression("y")),
              new VariableExpression("x")
            )
          )
        ])
      ])
    )
  ]*/
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });

  test("throws an exception on a syntax error", done => {
    // We only need one test here that an exception is thrown.
    // Specific syntax errors are tested in the grammar test.
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});

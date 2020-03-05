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
  ListElement,
  KennelLiteral,
  KeyValuePair,
  //   VariableExpression, // ??? what's this for
  UnaryExpression,
  BinaryExpression
} = require("..");

const fixture = {
  uninitializedVariableDeclaration: [
    String.raw`leash dogName;`,
    new Program(
      new Block([new VariableDeclaration("dogName", StringType, null)])
    )
  ],
  variableDeclarationInitializedToNull: [
    String.raw`leash dogName is cat;`,
    new Program(
      new Block([new VariableDeclaration("dogName", StringType, null)])
    )
  ],
  numberVariableDeclaration: [
    String.raw`toeBeans CeCeAge is 1;`,
    new Program(
      new Block([
        new VariableDeclaration("CeCeAge", NumType, new NumberLiteral(1))
      ])
    )
  ],
  stringVariableDeclaration: [
    String.raw`leash name is "CeCe";`,
    new Program(
      new Block([
        new VariableDeclaration("name", StringType, new StringLiteral("CeCe"))
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
    String.raw`kennel[leash:toeBeans] dogs is [:];`,
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
    String.raw`pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new ListType(new Grouping(null, StringType)),
          new PackLiteral([
            new ListElement(false, new StringLiteral("CeCe")),
            new ListElement(false, new StringLiteral("Buster")),
            new ListElement(false, new StringLiteral("Dumpling"))
          ])
        )
      ])
    )
  ],
  listVariableDeclarationWithSpreads: [
    String.raw`pack[Dog] dogs is [dog1, dog2, peanutButter otherDogs];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new ListType(new Grouping(null, new Type("Dog"))),
          new PackLiteral([
            new ListElement(false, "dog1"),
            new ListElement(false, "dog2"),
            new ListElement(true, "otherDogs")
          ])
        )
      ])
    )
  ],
  listVariableDeclarationUsingWithout: [
    String.raw`pack[Dog] dogs is [dog1, dog2, dog3] without dog1;`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new ListType(new Grouping(null, new Type("Dog"))),
          new BinaryExpression(
            "without",
            new PackLiteral([
              new ListElement(false, "dog1"),
              new ListElement(false, "dog2"),
              new ListElement(false, "dog3")
            ]),
            "dog1"
          )
        )
      ])
    )
  ],
  nonEmptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is ["CeCe":1, "Buster":2, "Mo":3];`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogs",
          new DictType(new Grouping(StringType, NumType)),
          new KennelLiteral([
            new KeyValuePair(new StringLiteral("CeCe"), new NumberLiteral(1)),
            new KeyValuePair(new StringLiteral("Buster"), new NumberLiteral(2)),
            new KeyValuePair(new StringLiteral("Mo"), new NumberLiteral(3))
          ])
        )
      ])
    )
  ],
  leashConcatenation: [
    String.raw`leash dogName is "Ce" with "Ce";`,
    new Program(
      new Block([
        new VariableDeclaration(
          "dogName",
          StringType,
          new BinaryExpression(
            "with",
            new StringLiteral("Ce"),
            new StringLiteral("Ce")
          )
        )
      ])
    )
  ],
  leashInterpolation: [
    // TODO HELP
    String.raw`leash sentence is "![x] is a good girl";`,
    new Program(
      new Block([
        new VariableDeclaration(
          "sentence",
          StringType,
          new StringLiteral("![x] is a good girl")
        )
      ])
    )
  ],
  variableAssignment: [
    String.raw`cuteness is 100;`,
    new Program(
      new Block([new AssignmentStatement("cuteness", new NumberLiteral(100))])
    )
  ],
  equalityOperators: [
    String.raw`goodBoy testBool1 is x equals y; goodBoy testBool2 is x notEquals y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          "testBool1",
          BoolType,
          new BinaryExpression("equals", "x", "y")
        ),
        new VariableDeclaration(
          "testBool2",
          BoolType,
          new BinaryExpression("notEquals", "x", "y")
        )
      ])
    )
  ],
  
/*
ifElseStatement : [
  String.raw.`if x isAtLeast y then: 
      leash dogName is "CeCe; 
  else: 
      leash dogName is Fluffy; 
      leash dogAge is 12; tail`,
  new Program(
    new Block([
      new ConditionalStatement(
      )
    ])
  )
]

ifElseIfStatement: [
  String.raw`if x notEquals y then:
        woof "CeCe is kinda cute";
    else if x isGreaterThan y then:
        woof "CeCe is pretty cute";
    else if x isLessThan y then:
        woof "Okay, CeCe is really cute";
    else:
        woof "CeCe is the cutest of the cutest";
    tail`,
  New Program(
    New Block([
       new ConditionalStatement(
       )
    ])
  )
]
*/
  
  infiniteLoop: [
    String.raw`chase: woof "I run forever\!"; tail`,
    new Program(
      new Block([
        new InfiniteLoopStatement(
          new Block([
            new PrintStatement("woof", new StringLiteral("I run forever\\!"))
          ])
        )
      ])
    )
  ],
  fixedLoop: [
    String.raw`chase 5 times: woof "Stay"; tail`,
    new Program(
      new Block([
        new FixedLoopStatement(
          new NumberLiteral(5),
          new Block([new PrintStatement("woof", new StringLiteral("Stay"))])
        )
      ])
    )
  ],
  whileLoop: [
  String.raw`chase while x isAtMost 5: woof x; tail`,
  new Program(
    new Block([
      new WhileLoopStatement(
        new NumberLiteral(5),
        new Block([new PrintStatement("woof", new VariableExpression("x"))])
      )
    ])
  )
]
  
  /*forLoop: [
  String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10: woof i; tail`,
  new Program(
    new Block([      
      )
    ])
  )
],*/

/*forEachLoop: [
  String.raw `chase element through mypack:
  woof element;
tail`,
new Program(
  New Block([

  ])
)
],*/

/*poopLoop: [
  String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
  if i mod 2 equals 0 then:
      walkies;
  tail
  woof i;
tail`,
new Program(
  New Block([
  ])
)
],*/

/*walkiesLoop: [
  String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
  if i mod 2 equals 0 then:
      walkies;
  tail
  woof i;
tail`,
new Program(
  New Block([

  ])
)
],/*

  /*declarations: [
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

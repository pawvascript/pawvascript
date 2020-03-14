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
  ConstructorDeclaration,
  NumType,
  BoolType,
  StringType,
  ListType,
  DictType,
  AssignmentStatement,
  FunctionCall,
  PrintStatement,
  GiveStatement,
  BreakStatement,
  ContinueStatement,
  TypeGrouping,
  Parameters,
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
  BinaryExpression
} = require("..");

const fixture = {
  /* Basic Declarations */
  uninitializedVariableDeclaration: [
    String.raw`leash dogName;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogName"),
          StringType,
          null
        )
      ])
    )
  ],
  variableDeclarationInitializedToNull: [
    String.raw`leash dogName is cat;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogName"),
          StringType,
          null
        )
      ])
    )
  ],
  numberVariableDeclaration: [
    String.raw`toeBeans CeCeAge is 1;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("CeCeAge"),
          NumType,
          new NumberLiteral(1)
        )
      ])
    )
  ],
  booleanVariableDeclaration: [
    String.raw`goodBoy isGoodBoy is good;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("isGoodBoy"),
          BoolType,
          new BooleanLiteral(true)
        )
      ])
    )
  ],
  stringVariableDeclaration: [
    String.raw`leash name is "CeCe";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("name"),
          StringType,
          new TemplateLiteral([new StringLiteral("CeCe")], null)
        )
      ])
    )
  ],
  emptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is [];`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new ListType(new TypeGrouping(null, StringType)),
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
          new VariableExpression("dogs"),
          new DictType(new TypeGrouping(StringType, NumType)),
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
          new VariableExpression("dogs"),
          new ListType(new TypeGrouping(null, StringType)),
          new PackLiteral([
            new ListElement(
              false,
              new TemplateLiteral([new StringLiteral("CeCe")], null)
            ),
            new ListElement(
              false,
              new TemplateLiteral([new StringLiteral("Buster")], null)
            ),
            new ListElement(
              false,
              new TemplateLiteral([new StringLiteral("Dumpling")], null)
            )
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
          new VariableExpression("dogs"),
          new ListType(new TypeGrouping(null, new Type("Dog"))),
          new PackLiteral([
            new ListElement(false, new VariableExpression("dog1")),
            new ListElement(false, new VariableExpression("dog2")),
            new ListElement(true, new VariableExpression("otherDogs"))
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
          new VariableExpression("dogs"),
          new ListType(new TypeGrouping(null, new Type("Dog"))),
          new BinaryExpression(
            "without",
            new PackLiteral([
              new ListElement(false, new VariableExpression("dog1")),
              new ListElement(false, new VariableExpression("dog2")),
              new ListElement(false, new VariableExpression("dog3"))
            ]),
            new VariableExpression("dog1")
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
          new VariableExpression("dogs"),
          new DictType(new TypeGrouping(StringType, NumType)),
          new KennelLiteral([
            new KeyValuePair(
              new TemplateLiteral([new StringLiteral("CeCe")], null),
              new NumberLiteral(1)
            ),
            new KeyValuePair(
              new TemplateLiteral([new StringLiteral("Buster")], null),
              new NumberLiteral(2)
            ),
            new KeyValuePair(
              new TemplateLiteral([new StringLiteral("Mo")], null),
              new NumberLiteral(3)
            )
          ])
        )
      ])
    )
  ],
  /* String Operations */
  leashConcatenation: [
    String.raw`leash dogName is "Ce" with "Ce";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogName"),
          StringType,
          new BinaryExpression(
            "with",
            new TemplateLiteral([new StringLiteral("Ce")], null),
            new TemplateLiteral([new StringLiteral("Ce")], null)
          )
        )
      ])
    )
  ],
  stringInterpolation: [
    String.raw`leash sentence is "![x] is a good girl";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("sentence"),
          StringType,
          new TemplateLiteral(
            [new StringLiteral(" is a good girl")],
            [new VariableExpression("x")]
          )
        )
      ])
    )
  ],
  stringInterpolationInMiddleOfString: [
    String.raw`leash phrase is "Come back here, ![name]. Good girl.";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("phrase"),
          StringType,
          new TemplateLiteral(
            [
              new StringLiteral("Come back here, "),
              new StringLiteral(". Good girl.")
            ],
            [new VariableExpression("name")]
          )
        )
      ])
    )
  ],
  /* Assignment */
  variableAssignment: [
    String.raw`cuteness is 100;`,
    new Program(
      new Block([
        new AssignmentStatement(
          new VariableExpression("cuteness"),
          new NumberLiteral(100)
        )
      ])
    )
  ],
  /* Relops */
  equalityOperators: [
    String.raw`goodBoy testBool1 is x equals y; goodBoy testBool2 is x notEquals y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testBool1"),
          BoolType,
          new BinaryExpression(
            "equals",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testBool2"),
          BoolType,
          new BinaryExpression(
            "notEquals",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        )
      ])
    )
  ],
  greaterThanLessThanComparators: [
    String.raw`goodBoy testGreater is x isGreaterThan y; goodBoy testLess is x isLessThan y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testGreater"),
          BoolType,
          new BinaryExpression(
            "isGreaterThan",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testLess"),
          BoolType,
          new BinaryExpression(
            "isLessThan",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        )
      ])
    )
  ],
  greaterThanLessThanOrEqualToComparators: [
    String.raw`goodBoy testAtLeast is x isAtLeast y; goodBoy testAtMost is x isAtMost y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testAtLeast"),
          BoolType,
          new BinaryExpression(
            "isAtLeast",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testAtMost"),
          BoolType,
          new BinaryExpression(
            "isAtMost",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        )
      ])
    )
  ],
  logicalNegation: [
    String.raw`goodBoy testNegation1 is x equals not y; goodBoy testNegation2 is y equals not x;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testNegation1"),
          BoolType,
          new BinaryExpression(
            "equals",
            new VariableExpression("x"),
            new UnaryExpression("n", new VariableExpression("y"))
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testNegation2"),
          BoolType,
          new BinaryExpression(
            "equals",
            new VariableExpression("y"),
            new UnaryExpression("n", new VariableExpression("x"))
          )
        )
      ])
    )
  ],
  /* Arithmetic */
  arithmeticOperators: [
    String.raw`toeBeans a is x + y; a is x - y; a is x * y; a is x / y;
    a is x mod y; a is x!; a is -x;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("a"),
          NumType,
          new BinaryExpression(
            "+",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new AssignmentStatement(
          new VariableExpression("a"),
          new BinaryExpression(
            "-",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new AssignmentStatement(
          new VariableExpression("a"),
          new BinaryExpression(
            "*",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new AssignmentStatement(
          new VariableExpression("a"),
          new BinaryExpression(
            "/",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new AssignmentStatement(
          new VariableExpression("a"),
          new BinaryExpression(
            "mod",
            new VariableExpression("x"),
            new VariableExpression("y")
          )
        ),
        new AssignmentStatement(
          new VariableExpression("a"),
          new UnaryExpression("!", new VariableExpression("x"))
        ),
        new AssignmentStatement(
          new VariableExpression("a"),
          new UnaryExpression("-", new VariableExpression("x"))
        )
      ])
    )
  ],
  /* Conditionals */
  ifStatement: [
    String.raw`if x then: x is y; tail`,
    new Program(
      new Block([
        new ConditionalStatement(
          new VariableExpression("x"),
          new Block([
            new AssignmentStatement(
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          ]),
          null
        )
      ])
    )
  ],
  ifElseStatement: [
    String.raw`if x isAtLeast y then: 
        leash dogName is "CeCe"; 
    else: 
        leash dogName is "Fluffy"; 
        toeBeans dogAge is 12; 
    tail`,
    new Program(
      new Block([
        new ConditionalStatement(
          new BinaryExpression(
            "isAtLeast",
            new VariableExpression("x"),
            new VariableExpression("y")
          ),
          new Block([
            new VariableDeclaration(
              new VariableExpression("dogName"),
              StringType,
              new TemplateLiteral([new StringLiteral("CeCe")], null)
            )
          ]),
          new Block([
            new VariableDeclaration(
              new VariableExpression("dogName"),
              StringType,
              new TemplateLiteral([new StringLiteral("Fluffy")], null)
            ),
            new VariableDeclaration(
              new VariableExpression("dogAge"),
              NumType,
              new NumberLiteral(12)
            )
          ])
        )
      ])
    )
  ],
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
    new Program(
      new Block([
        new ConditionalStatement(
          new BinaryExpression(
            "notEquals",
            new VariableExpression("x"),
            new VariableExpression("y")
          ),
          new Block([
            new PrintStatement(
              "woof",
              new TemplateLiteral(
                [new StringLiteral("CeCe is kinda cute")],
                null
              )
            )
          ]),
          new ConditionalStatement(
            new BinaryExpression(
              "isGreaterThan",
              new VariableExpression("x"),
              new VariableExpression("y")
            ),
            new Block([
              new PrintStatement(
                "woof",
                new TemplateLiteral(
                  [new StringLiteral("CeCe is pretty cute")],
                  null
                )
              )
            ]),
            new ConditionalStatement(
              new BinaryExpression(
                "isLessThan",
                new VariableExpression("x"),
                new VariableExpression("y")
              ),
              new Block([
                new PrintStatement(
                  "woof",
                  new TemplateLiteral(
                    [new StringLiteral("Okay, CeCe is really cute")],
                    null
                  )
                )
              ]),
              new Block([
                new PrintStatement(
                  "woof",
                  new TemplateLiteral(
                    [new StringLiteral("CeCe is the cutest of the cutest")],
                    null
                  )
                )
              ])
            )
          )
        )
      ])
    )
  ],
  /* Comments */
  oneLineComment: [
    String.raw`!!! I'm a one line comment !!!`,
    new Program(new Block([]))
  ],
  multiLineComment: [
    String.raw`!!! I'm a \n multiline \n comment !!!`,
    new Program(new Block([]))
  ],
  /* Loops */
  infiniteLoop: [
    String.raw`chase: woof "I run forever"; tail`,
    new Program(
      new Block([
        new InfiniteLoopStatement(
          new Block([
            new PrintStatement(
              "woof",
              new TemplateLiteral([new StringLiteral("I run forever")], null)
            )
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
          new Block([
            new PrintStatement(
              "woof",
              new TemplateLiteral([new StringLiteral("Stay")], null)
            )
          ])
        )
      ])
    )
  ],
  whileLoop: [
    String.raw`chase while x isAtMost 5: woof x; tail`,
    new Program(
      new Block([
        new WhileLoopStatement(
          new BinaryExpression(
            "isAtMost",
            new VariableExpression("x"),
            new NumberLiteral(5)
          ),
          new Block([new PrintStatement("woof", new VariableExpression("x"))])
        )
      ])
    )
  ],
  forLoop: [
    String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10: woof i; tail`,
    new Program(
      new Block([
        new ForLoopStatement(
          new VariableDeclaration(
            new VariableExpression("i"),
            NumType,
            new NumberLiteral(0)
          ),
          new BinaryExpression(
            "*",
            new VariableExpression("i"),
            new NumberLiteral(2)
          ),
          new BinaryExpression(
            "isLessThan",
            new VariableExpression("i"),
            new NumberLiteral(10)
          ),
          new Block([new PrintStatement("woof", new VariableExpression("i"))])
        )
      ])
    )
  ],
  forEachLoop: [
    String.raw`chase element through mypack:
        woof element;
    tail`,
    new Program(
      new Block([
        new ThroughLoopStatement(
          new VariableExpression("element"),
          new VariableExpression("mypack"),
          new Block([
            new PrintStatement("woof", new VariableExpression("element"))
          ])
        )
      ])
    )
  ],
  loopWithPoopStatement: [
    String.raw`
     chase:
        woof "I run forever\!";
        poop;
    tail`,
    new Program(
      new Block([
        new InfiniteLoopStatement(
          new Block([
            new PrintStatement(
              "woof",
              new TemplateLiteral([new StringLiteral("I run forever\\!")], null)
            ),
            new BreakStatement()
          ])
        )
      ])
    )
  ],
  loopWithWalkiesStatement: [
    String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
          if i mod 2 equals 0 then:
              walkies;
          tail
          woof i;
      tail`,
    new Program(
      new Block([
        new ForLoopStatement(
          new VariableDeclaration(
            new VariableExpression("i"),
            NumType,
            new NumberLiteral(0)
          ),
          new BinaryExpression(
            "*",
            new VariableExpression("i"),
            new NumberLiteral(2)
          ),
          new BinaryExpression(
            "isLessThan",
            new VariableExpression("i"),
            new NumberLiteral(10)
          ),
          new Block([
            new ConditionalStatement(
              new BinaryExpression(
                "equals",
                new BinaryExpression(
                  "mod",
                  new VariableExpression("i"),
                  new NumberLiteral(2)
                ),
                new NumberLiteral(0)
              ),
              new Block([new ContinueStatement()]),
              null
            ),
            new PrintStatement("woof", new VariableExpression("i"))
          ])
        )
      ])
    )
  ],
  /* Function Declarations */
  functionDeclaration: [
    String.raw`trick gcd chews[toeBeans:num1, toeBeans:num2] fetches toeBeans:
        toeBeans remainder;
        chase while (a mod b) isGreaterThan 0:
            remainder is (a mod b);
            a is b;
            b is remainder;
        tail
        give a;
    tail
    toeBeans greatestCommonDivisor is gcd(21, 49);`,
    new Program(
      new Block([
        new FunctionDeclaration(
          new VariableExpression("gcd"),
          new Parameters(
            [NumType, NumType],
            [new VariableExpression("num1"), new VariableExpression("num2")]
          ),
          NumType,
          new Block([
            new VariableDeclaration(
              new VariableExpression("remainder"),
              NumType,
              null
            ),
            new WhileLoopStatement(
              new BinaryExpression(
                "isGreaterThan",
                new BinaryExpression(
                  "mod",
                  new VariableExpression("a"),
                  new VariableExpression("b")
                ),
                new NumberLiteral(0)
              ),
              new Block([
                new AssignmentStatement(
                  new VariableExpression("remainder"),
                  new BinaryExpression(
                    "mod",
                    new VariableExpression("a"),
                    new VariableExpression("b")
                  )
                ),
                new AssignmentStatement(
                  new VariableExpression("a"),
                  new VariableExpression("b")
                ),
                new AssignmentStatement(
                  new VariableExpression("b"),
                  new VariableExpression("remainder")
                )
              ])
            ),
            new GiveStatement(new VariableExpression("a"))
          ])
        ),
        new VariableDeclaration(
          new VariableExpression("greatestCommonDivisor"),
          NumType,
          new FunctionCall(new VariableExpression("gcd"), [
            new NumberLiteral(21),
            new NumberLiteral(49)
          ])
        )
      ])
    )
  ],
  /* Breed Declarations */
  breedDeclaration: [
    String.raw`
    breed Owner is:
      leash dogName;
      trick Owner chews[leash:dogName] fetches Owner;
      trick introduceDog:
        woof "My dog's name is " with Owner's dogName;
      tail
      trick command fetches leash:
        give Owner's dogName with ", stay.";
      tail
    tail

    Owner lucille is Owner("CeCe");
    lucille's introduceDog();  !!! output: "My dog's name is CeCe" !!!
    woof lucille's command(); !!! output: "CeCe, stay." !!!`,
    new Program(
      new Block([
        new TypeDeclaration(
          new VariableExpression("Owner"),
          new Block([
            new VariableDeclaration(
              new VariableExpression("dogName"),
              StringType,
              null
            ),
            new ConstructorDeclaration(
              new VariableExpression("Owner"),
              new Parameters([StringType], [new VariableExpression("dogName")]),
              new Type("Owner")
            ),
            new FunctionDeclaration(
              new VariableExpression("introduceDog"),
              null,
              null,
              new Block([
                new PrintStatement(
                  "woof",
                  new BinaryExpression(
                    "with",
                    new TemplateLiteral(
                      [new StringLiteral("My dog's name is ")],
                      null
                    ),
                    new BinaryExpression(
                      "'s",
                      new VariableExpression("Owner"),
                      new VariableExpression("dogName")
                    )
                  )
                )
              ])
            ),
            new FunctionDeclaration(
              new VariableExpression("command"),
              null,
              StringType,
              new Block([
                new GiveStatement(
                  new BinaryExpression(
                    "with",
                    new BinaryExpression(
                      "'s",
                      new VariableExpression("Owner"),
                      new VariableExpression("dogName")
                    ),
                    new TemplateLiteral([new StringLiteral(", stay.")], null)
                  )
                )
              ])
            )
          ])
        ),
        //Owner lucille is Owner("Cece");
        new VariableDeclaration(
          new VariableExpression("lucille"),
          new Type("Owner"),
          new FunctionCall(new VariableExpression("Owner"), [
            new TemplateLiteral([new StringLiteral("CeCe")], null)
          ])
        ),
        //lucille's introduceDog();
        new FunctionCall(
          new BinaryExpression(
            "'s",
            new VariableExpression("lucille"),
            new VariableExpression("introduceDog")
          ),
          null
        ),
        // woof lucille's command();
        new PrintStatement(
          "woof",
          new FunctionCall(
            new BinaryExpression(
              "'s",
              new VariableExpression("lucille"),
              new VariableExpression("command")
            ),
            null
          )
        )
      ])
    )
  ]
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

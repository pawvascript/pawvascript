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
  Variable,
  TypeDeclaration,
  BreedType,
  Field,
  Method,
  IdType,
  ListType,
  DictType,
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
} = require("..");

const fixture = {
  /* Basic Declarations */
  uninitializedVariableDeclaration: [
    String.raw`leash dogName;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogName"),
          new Variable(new IdType("leash"), null)
        ),
      ])
    ),
  ],
  variableDeclarationInitializedToNull: [
    String.raw`leash dogName is cat;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogName"),
          new Variable(new IdType("leash"), null)
        ),
      ])
    ),
  ],
  numberVariableDeclaration: [
    String.raw`toeBeans CeCeAge is 1;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("CeCeAge"),
          new Variable(new IdType("toeBeans"), new NumberLiteral(1))
        ),
      ])
    ),
  ],
  booleanVariableDeclaration: [
    String.raw`goodBoy isGoodBoy is good;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("isGoodBoy"),
          new Variable(new IdType("goodBoy"), new BooleanLiteral(true))
        ),
      ])
    ),
  ],
  stringVariableDeclaration: [
    String.raw`leash name is "CeCe";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("name"),
          new Variable(
            new IdType("leash"),
            new TemplateLiteral([new StringLiteral("CeCe")], null)
          )
        ),
      ])
    ),
  ],
  emptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is [];`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new Variable(new ListType(new IdType("leash")), new PackLiteral([]))
        ),
      ])
    ),
  ],
  emptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is [:];`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new Variable(
            new DictType(new IdType("leash"), new IdType("toeBeans")),
            new KennelLiteral([], [])
          )
        ),
      ])
    ),
  ],
  nonEmptyListVariableDeclaration: [
    String.raw`pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new Variable(
            new ListType(new IdType("leash")),
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
              ),
            ])
          )
        ),
      ])
    ),
  ],
  listVariableDeclarationWithSpreads: [
    String.raw`pack[Dog] dogs is [dog1, dog2, peanutButter otherDogs];`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new Variable(
            new ListType(new IdType("Dog")),
            new PackLiteral([
              new ListElement(false, new VariableExpression("dog1")),
              new ListElement(false, new VariableExpression("dog2")),
              new ListElement(true, new VariableExpression("otherDogs")),
            ])
          )
        ),
      ])
    ),
  ],
  listVariableDeclarationUsingWithout: [
    String.raw`pack[Dog] dogs is [dog1, dog2, dog3] without dog1;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new Variable(
            new ListType(new IdType("Dog")),
            new BinaryExpression(
              "without",
              new PackLiteral([
                new ListElement(false, new VariableExpression("dog1")),
                new ListElement(false, new VariableExpression("dog2")),
                new ListElement(false, new VariableExpression("dog3")),
              ]),
              new VariableExpression("dog1")
            )
          )
        ),
      ])
    ),
  ],
  nonEmptyDictVariableDeclaration: [
    String.raw`kennel[leash:toeBeans] dogs is ["CeCe":1, "Buster":2, "Mo":3];`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogs"),
          new Variable(
            new DictType(new IdType("leash"), new IdType("toeBeans")),
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
              ),
            ])
          )
        ),
      ])
    ),
  ],
  /* String Operations */
  leashConcatenation: [
    String.raw`leash dogName is "Ce" with "Ce";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("dogName"),
          new Variable(
            new IdType("leash"),
            new BinaryExpression(
              "with",
              new TemplateLiteral([new StringLiteral("Ce")], null),
              new TemplateLiteral([new StringLiteral("Ce")], null)
            )
          )
        ),
      ])
    ),
  ],
  stringInterpolation: [
    String.raw`leash sentence is "![x] is a good girl";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("sentence"),
          new Variable(
            new IdType("leash"),
            new TemplateLiteral(
              [new StringLiteral(""), new StringLiteral(" is a good girl")],
              [new VariableExpression("x")]
            )
          )
        ),
      ])
    ),
  ],
  stringInterpolationInMiddleOfString: [
    String.raw`leash phrase is "Come back here, ![name]. Good girl.";`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("phrase"),
          new Variable(
            new IdType("leash"),
            new TemplateLiteral(
              [
                new StringLiteral("Come back here, "),
                new StringLiteral(". Good girl."),
              ],
              [new VariableExpression("name")]
            )
          )
        ),
      ])
    ),
  ],
  /* Assignment */
  variableAssignment: [
    String.raw`cuteness is 100;`,
    new Program(
      new Block([
        new AssignmentStatement(
          new VariableExpression("cuteness"),
          new NumberLiteral(100)
        ),
      ])
    ),
  ],
  /* Relops */
  equalityOperators: [
    String.raw`goodBoy testBool1 is x equals y; goodBoy testBool2 is x notEquals y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testBool1"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "equals",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testBool2"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "notEquals",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          )
        ),
      ])
    ),
  ],
  greaterThanLessThanComparators: [
    String.raw`goodBoy testGreater is x isGreaterThan y; goodBoy testLess is x isLessThan y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testGreater"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "isGreaterThan",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testLess"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "isLessThan",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          )
        ),
      ])
    ),
  ],
  greaterThanLessThanOrEqualToComparators: [
    String.raw`goodBoy testAtLeast is x isAtLeast y; goodBoy testAtMost is x isAtMost y;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testAtLeast"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "isAtLeast",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testAtMost"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "isAtMost",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
          )
        ),
      ])
    ),
  ],
  logicalNegation: [
    String.raw`goodBoy testNegation1 is x equals not y; goodBoy testNegation2 is y equals not x;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("testNegation1"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "equals",
              new VariableExpression("x"),
              new UnaryExpression("not", new VariableExpression("y"))
            )
          )
        ),
        new VariableDeclaration(
          new VariableExpression("testNegation2"),
          new Variable(
            new IdType("goodBoy"),
            new BinaryExpression(
              "equals",
              new VariableExpression("y"),
              new UnaryExpression("not", new VariableExpression("x"))
            )
          )
        ),
      ])
    ),
  ],
  /* Arithmetic */
  arithmeticOperators: [
    String.raw`toeBeans a is x + y; 
              a is x - y; 
              a is x * y; 
              a is x / y;
              a is x mod y; 
              a is x!; 
              a is -x;`,
    new Program(
      new Block([
        new VariableDeclaration(
          new VariableExpression("a"),
          new Variable(
            new IdType("toeBeans"),
            new BinaryExpression(
              "+",
              new VariableExpression("x"),
              new VariableExpression("y")
            )
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
        ),
      ])
    ),
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
            ),
          ]),
          null
        ),
      ])
    ),
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
              new Variable(
                new IdType("leash"),
                new TemplateLiteral([new StringLiteral("CeCe")], null)
              )
            ),
          ]),
          new Block([
            new VariableDeclaration(
              new VariableExpression("dogName"),
              new Variable(
                new IdType("leash"),
                new TemplateLiteral([new StringLiteral("Fluffy")], null)
              )
            ),
            new VariableDeclaration(
              new VariableExpression("dogAge"),
              new Variable(new IdType("toeBeans"), new NumberLiteral(12))
            ),
          ])
        ),
      ])
    ),
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
            ),
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
              ),
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
                ),
              ]),
              new Block([
                new PrintStatement(
                  "woof",
                  new TemplateLiteral(
                    [new StringLiteral("CeCe is the cutest of the cutest")],
                    null
                  )
                ),
              ])
            )
          )
        ),
      ])
    ),
  ],
  /* Comments */
  oneLineComment: [
    String.raw`!!! I'm a one line comment !!!`,
    new Program(new Block([])),
  ],
  multiLineComment: [
    String.raw`!!! I'm a \n multiline \n comment !!!`,
    new Program(new Block([])),
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
            ),
          ])
        ),
      ])
    ),
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
            ),
          ])
        ),
      ])
    ),
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
        ),
      ])
    ),
  ],
  forLoop: [
    String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10: woof i; tail`,
    new Program(
      new Block([
        new ForLoopStatement(
          new VariableDeclaration(
            new VariableExpression("i"),
            new Variable(new IdType("toeBeans"), new NumberLiteral(0))
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
        ),
      ])
    ),
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
            new PrintStatement("woof", new VariableExpression("element")),
          ])
        ),
      ])
    ),
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
            new BreakStatement(),
          ])
        ),
      ])
    ),
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
            new Variable(new IdType("toeBeans"), new NumberLiteral(0))
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
            new PrintStatement("woof", new VariableExpression("i")),
          ])
        ),
      ])
    ),
  ],
  /* Function Declarations */
  functionDeclaration: [
    String.raw`
    trick gcd chews[toeBeans:a, toeBeans:b] fetches toeBeans:
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
          new Function(
            new Parameters(
              [new IdType("toeBeans"), new IdType("toeBeans")],
              [new VariableExpression("a"), new VariableExpression("b")]
            ),
            new IdType("toeBeans"),
            new Block([
              new VariableDeclaration(
                new VariableExpression("remainder"),
                new Variable(new IdType("toeBeans"), null)
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
                  ),
                ])
              ),
              new GiveStatement(new VariableExpression("a")),
            ])
          )
        ),
        new VariableDeclaration(
          new VariableExpression("greatestCommonDivisor"),
          new Variable(
            new IdType("toeBeans"),
            new FunctionCall(new VariableExpression("gcd"), [
              new NumberLiteral(21),
              new NumberLiteral(49),
            ])
          )
        ),
      ])
    ),
  ],
  /* Function Call */
  functionCallWithoutArgs: [
    String.raw`
      fib();
    `,
    new Program(new Block([new FunctionCall(new VariableExpression("fib"))])),
  ],
  functionCallWithArgs: [
    String.raw`
      fib(100);
    `,
    new Program(
      new Block([
        new FunctionCall(new VariableExpression("fib"), [
          new NumberLiteral(100),
        ]),
      ])
    ),
  ],
  /* Breed Declarations */
  emptyBreedDeclaration: [
    String.raw`breed Owner is:
    tail`,
    new Program(
      new Block([
        new TypeDeclaration(
          new VariableExpression("Owner"),
          new BreedType([], [], [])
        ),
      ])
    ),
  ],
  breedWithFields: [
    String.raw`breed PetSitter is:
      leash name;
      toeBeans yearsOfExperience is 0;
    tail`,
    new Program(
      new Block([
        new TypeDeclaration(
          new VariableExpression("PetSitter"),
          new BreedType(
            [
              new Field(
                new VariableExpression("name"),
                new Variable(new IdType("leash"))
              ),
              new Field(
                new VariableExpression("yearsOfExperience"),
                new Variable(new IdType("toeBeans"), new NumberLiteral(0))
              ),
            ],
            [],
            []
          )
        ),
      ])
    ),
  ],
  breedWithFieldAndMethods: [
    String.raw`breed DogHotel is:
      leash name;

      trick greet:
        woof "Welcome to our Dog Hotel";
      tail
    tail`,
    new Program(
      new Block([
        new TypeDeclaration(
          new VariableExpression("DogHotel"),
          new BreedType(
            [
              new Field(
                new VariableExpression("name"),
                new Variable(new IdType("leash"))
              ),
            ],
            [],
            [
              new Method(
                new VariableExpression("greet"),
                new Function(
                  null,
                  null,
                  new Block([
                    new PrintStatement(
                      "woof",
                      new TemplateLiteral(
                        [new StringLiteral("Welcome to our Dog Hotel")],
                        null
                      )
                    ),
                  ])
                )
              ),
            ]
          )
        ),
      ])
    ),
  ],
  breedWithMethod: [
    String.raw`breed DogLover is:
      trick barkAtDog:
        bark "woof woof";
      tail
    tail`,
    new Program(
      new Block([
        new TypeDeclaration(
          new VariableExpression("DogLover"),
          new BreedType(
            [],
            [],
            [
              new Method(
                new VariableExpression("barkAtDog"),
                new Function(
                  null,
                  null,
                  new Block([
                    new PrintStatement(
                      "bark",
                      new TemplateLiteral(
                        [new StringLiteral("woof woof")],
                        null
                      )
                    ),
                  ])
                )
              ),
            ]
          )
        ),
      ])
    ),
  ],
  breedWithEverything: [
    String.raw`breed DogHotel is:
      leash name;

      trick DogHotel chews[leash: name] fetches DogHotel;

      trick greet:
        woof "Welcome to our Dog Hotel";
      tail
    tail
    
    myDogHotel's greet();`,
    new Program(
      new Block([
        new TypeDeclaration(
          new VariableExpression("DogHotel"),
          new BreedType(
            [
              new Field(
                new VariableExpression("name"),
                new Variable(new IdType("leash"))
              ),
            ],
            [
              new ConstructorDeclaration(
                new VariableExpression("DogHotel"),
                new Constructor(
                  new Parameters(
                    [new IdType("leash")],
                    [new VariableExpression("name")]
                  ),
                  new IdType("DogHotel")
                )
              ),
            ],
            [
              new Method(
                new VariableExpression("greet"),
                new Function(
                  null,
                  null,
                  new Block([
                    new PrintStatement(
                      "woof",
                      new TemplateLiteral(
                        [new StringLiteral("Welcome to our Dog Hotel")],
                        null
                      )
                    ),
                  ])
                )
              ),
            ]
          )
        ),
        new FunctionCall(
          new BinaryExpression(
            "'s",
            new VariableExpression("myDogHotel"),
            new VariableExpression("greet"),
            null
          ),
          []
        ),
      ])
    ),
  ],
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, (done) => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });

  test("throws an exception on a syntax error", (done) => {
    // We only need one test here that an exception is thrown.
    // Specific syntax errors are tested in the grammar test.
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});

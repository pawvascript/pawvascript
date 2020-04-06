/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const fixture = {
  /* Basic Declarations */
  uninitializedVariableDeclaration: String.raw`leash dogName;`,
  variableDeclarationInitializedToNull: String.raw`leash dogName is cat;`,
  numberVariableDeclaration: String.raw`toeBeans CeCeAge is 1;`,
  booleanVariableDeclaration: String.raw`goodBoy isGoodBoy is good;`,
  stringVariableDeclaration: String.raw`leash name is "CeCe";`,
  emptyListVariableDeclaration: String.raw`pack[leash] dogs is [];`,
  emptyDictVariableDeclaration: String.raw`kennel[leash:toeBeans] dogs is [:];`,
  nonEmptyListVariableDeclaration: String.raw`pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];`,
  listVariableDeclarationWithSpreadOnPackLiteral: String.raw`
    pack[leash] allDogs is ["Bear", "Bermuda", peanutButter ["CeCe", "Buster", "Dumpling"]];
  `,
  listVariableDeclarationWithSpreadOnVarExp: String.raw`
      pack[leash] dogs is ["CeCe", "Buster", "Dumpling"];
      pack[leash] allDogs is ["Bear", "Bermuda", peanutButter dogs];
    `,
  listVariableDeclarationUsingWithout: String.raw`
      pack[leash] fewerDogs is ["CeCe", "Buster", "Dumpling"] without "CeCe";
    `,
  nonEmptyDictVariableDeclaration: String.raw`kennel[leash:toeBeans] dogs is ["CeCe":1, "Buster":2, "Mo":3];`,
  /* String Operations */
  leashConcatenation: String.raw`leash dogName is "Ce" with "Ce";`,
  stringInterpolation: String.raw`
    toeBeans x is 1;
    leash sentence is "![x] is a good girl";
  `,
  stringInterpolationInMiddleOfString: String.raw`
    leash name is "CeCe";
    leash phrase is "Come back here, ![name]. Good girl.";
  `,
  /* Assignment */
  variableAssignment: String.raw`
    toeBeans cuteness is 0;
    cuteness is 100;
  `,
  /* Relops */
  equalityOperators: String.raw`
    leash name is "CeCe";
    leash nickname is "CeCe";
    toeBeans age1 is 1;
    toeBeans age2 is 2;
    goodBoy testBool1 is name equals nickname; 
    goodBoy testBool2 is age1 notEquals age2;
  `,
  // greaterThanLessThanComparators: [
  //   String.raw`goodBoy testGreater is x isGreaterThan y; goodBoy testLess is x isLessThan y;`,
  //   new Program(
  //     new Block([
  //       new VariableDeclaration(
  //         new VariableExpression("testGreater"),
  //         new Variable(
  //           new PrimitiveType("goodBoy"),
  //           new BinaryExpression(
  //             "isGreaterThan",
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           )
  //         )
  //       ),
  //       new VariableDeclaration(
  //         new VariableExpression("testLess"),
  //         new Variable(
  //           new PrimitiveType("goodBoy"),
  //           new BinaryExpression(
  //             "isLessThan",
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           )
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // greaterThanLessThanOrEqualToComparators: [
  //   String.raw`goodBoy testAtLeast is x isAtLeast y; goodBoy testAtMost is x isAtMost y;`,
  //   new Program(
  //     new Block([
  //       new VariableDeclaration(
  //         new VariableExpression("testAtLeast"),
  //         new Variable(
  //           new PrimitiveType("goodBoy"),
  //           new BinaryExpression(
  //             "isAtLeast",
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           )
  //         )
  //       ),
  //       new VariableDeclaration(
  //         new VariableExpression("testAtMost"),
  //         new Variable(
  //           new PrimitiveType("goodBoy"),
  //           new BinaryExpression(
  //             "isAtMost",
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           )
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // logicalNegation: [
  //   String.raw`goodBoy testNegation1 is x equals not y; goodBoy testNegation2 is y equals not x;`,
  //   new Program(
  //     new Block([
  //       new VariableDeclaration(
  //         new VariableExpression("testNegation1"),
  //         new Variable(
  //           new PrimitiveType("goodBoy"),
  //           new BinaryExpression(
  //             "equals",
  //             new VariableExpression("x"),
  //             new UnaryExpression("n", new VariableExpression("y"))
  //           )
  //         )
  //       ),
  //       new VariableDeclaration(
  //         new VariableExpression("testNegation2"),
  //         new Variable(
  //           new PrimitiveType("goodBoy"),
  //           new BinaryExpression(
  //             "equals",
  //             new VariableExpression("y"),
  //             new UnaryExpression("n", new VariableExpression("x"))
  //           )
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // /* Arithmetic */
  // arithmeticOperators: [
  //   String.raw`toeBeans a is x + y;
  //             a is x - y;
  //             a is x * y;
  //             a is x / y;
  //             a is x mod y;
  //             a is x!;
  //             a is -x;`,
  //   new Program(
  //     new Block([
  //       new VariableDeclaration(
  //         new VariableExpression("a"),
  //         new Variable(
  //           new PrimitiveType("toeBeans"),
  //           new BinaryExpression(
  //             "+",
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           )
  //         )
  //       ),
  //       new AssignmentStatement(
  //         new VariableExpression("a"),
  //         new BinaryExpression(
  //           "-",
  //           new VariableExpression("x"),
  //           new VariableExpression("y")
  //         )
  //       ),
  //       new AssignmentStatement(
  //         new VariableExpression("a"),
  //         new BinaryExpression(
  //           "*",
  //           new VariableExpression("x"),
  //           new VariableExpression("y")
  //         )
  //       ),
  //       new AssignmentStatement(
  //         new VariableExpression("a"),
  //         new BinaryExpression(
  //           "/",
  //           new VariableExpression("x"),
  //           new VariableExpression("y")
  //         )
  //       ),
  //       new AssignmentStatement(
  //         new VariableExpression("a"),
  //         new BinaryExpression(
  //           "mod",
  //           new VariableExpression("x"),
  //           new VariableExpression("y")
  //         )
  //       ),
  //       new AssignmentStatement(
  //         new VariableExpression("a"),
  //         new UnaryExpression("!", new VariableExpression("x"))
  //       ),
  //       new AssignmentStatement(
  //         new VariableExpression("a"),
  //         new UnaryExpression("-", new VariableExpression("x"))
  //       ),
  //     ])
  //   ),
  // ],
  // // /* Conditionals */
  // ifStatement: [
  //   String.raw`if x then: x is y; tail`,
  //   new Program(
  //     new Block([
  //       new ConditionalStatement(
  //         new VariableExpression("x"),
  //         new Block([
  //           new AssignmentStatement(
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           ),
  //         ]),
  //         null
  //       ),
  //     ])
  //   ),
  // ],
  // ifElseStatement: [
  //   String.raw`if x isAtLeast y then:
  //       leash dogName is "CeCe";
  //   else:
  //       leash dogName is "Fluffy";
  //       toeBeans dogAge is 12;
  //   tail`,
  //   new Program(
  //     new Block([
  //       new ConditionalStatement(
  //         new BinaryExpression(
  //           "isAtLeast",
  //           new VariableExpression("x"),
  //           new VariableExpression("y")
  //         ),
  //         new Block([
  //           new VariableDeclaration(
  //             new VariableExpression("dogName"),
  //             new Variable(
  //               new PrimitiveType("leash"),
  //               new TemplateLiteral([new StringLiteral("CeCe")], null)
  //             )
  //           ),
  //         ]),
  //         new Block([
  //           new VariableDeclaration(
  //             new VariableExpression("dogName"),
  //             new Variable(
  //               new PrimitiveType("leash"),
  //               new TemplateLiteral([new StringLiteral("Fluffy")], null)
  //             )
  //           ),
  //           new VariableDeclaration(
  //             new VariableExpression("dogAge"),
  //             new Variable(new PrimitiveType("toeBeans"), new NumberLiteral(12))
  //           ),
  //         ])
  //       ),
  //     ])
  //   ),
  // ],
  // ifElseIfStatement: [
  //   String.raw`if x notEquals y then:
  //         woof "CeCe is kinda cute";
  //     else if x isGreaterThan y then:
  //         woof "CeCe is pretty cute";
  //     else if x isLessThan y then:
  //         woof "Okay, CeCe is really cute";
  //     else:
  //         woof "CeCe is the cutest of the cutest";
  //     tail`,
  //   new Program(
  //     new Block([
  //       new ConditionalStatement(
  //         new BinaryExpression(
  //           "notEquals",
  //           new VariableExpression("x"),
  //           new VariableExpression("y")
  //         ),
  //         new Block([
  //           new PrintStatement(
  //             "woof",
  //             new TemplateLiteral(
  //               [new StringLiteral("CeCe is kinda cute")],
  //               null
  //             )
  //           ),
  //         ]),
  //         new ConditionalStatement(
  //           new BinaryExpression(
  //             "isGreaterThan",
  //             new VariableExpression("x"),
  //             new VariableExpression("y")
  //           ),
  //           new Block([
  //             new PrintStatement(
  //               "woof",
  //               new TemplateLiteral(
  //                 [new StringLiteral("CeCe is pretty cute")],
  //                 null
  //               )
  //             ),
  //           ]),
  //           new ConditionalStatement(
  //             new BinaryExpression(
  //               "isLessThan",
  //               new VariableExpression("x"),
  //               new VariableExpression("y")
  //             ),
  //             new Block([
  //               new PrintStatement(
  //                 "woof",
  //                 new TemplateLiteral(
  //                   [new StringLiteral("Okay, CeCe is really cute")],
  //                   null
  //                 )
  //               ),
  //             ]),
  //             new Block([
  //               new PrintStatement(
  //                 "woof",
  //                 new TemplateLiteral(
  //                   [new StringLiteral("CeCe is the cutest of the cutest")],
  //                   null
  //                 )
  //               ),
  //             ])
  //           )
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // /* Comments */
  // oneLineComment: [
  //   String.raw`!!! I'm a one line comment !!!`,
  //   new Program(new Block([])),
  // ],
  // multiLineComment: [
  //   String.raw`!!! I'm a \n multiline \n comment !!!`,
  //   new Program(new Block([])),
  // ],
  // /* Loops */
  // infiniteLoop: [
  //   String.raw`chase: woof "I run forever"; tail`,
  //   new Program(
  //     new Block([
  //       new InfiniteLoopStatement(
  //         new Block([
  //           new PrintStatement(
  //             "woof",
  //             new TemplateLiteral([new StringLiteral("I run forever")], null)
  //           ),
  //         ])
  //       ),
  //     ])
  //   ),
  // ],
  // fixedLoop: [
  //   String.raw`chase 5 times: woof "Stay"; tail`,
  //   new Program(
  //     new Block([
  //       new FixedLoopStatement(
  //         new NumberLiteral(5),
  //         new Block([
  //           new PrintStatement(
  //             "woof",
  //             new TemplateLiteral([new StringLiteral("Stay")], null)
  //           ),
  //         ])
  //       ),
  //     ])
  //   ),
  // ],
  // whileLoop: [
  //   String.raw`chase while x isAtMost 5: woof x; tail`,
  //   new Program(
  //     new Block([
  //       new WhileLoopStatement(
  //         new BinaryExpression(
  //           "isAtMost",
  //           new VariableExpression("x"),
  //           new NumberLiteral(5)
  //         ),
  //         new Block([new PrintStatement("woof", new VariableExpression("x"))])
  //       ),
  //     ])
  //   ),
  // ],
  // forLoop: [
  //   String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10: woof i; tail`,
  //   new Program(
  //     new Block([
  //       new ForLoopStatement(
  //         new VariableDeclaration(
  //           new VariableExpression("i"),
  //           new Variable(new PrimitiveType("toeBeans"), new NumberLiteral(0))
  //         ),
  //         new BinaryExpression(
  //           "*",
  //           new VariableExpression("i"),
  //           new NumberLiteral(2)
  //         ),
  //         new BinaryExpression(
  //           "isLessThan",
  //           new VariableExpression("i"),
  //           new NumberLiteral(10)
  //         ),
  //         new Block([new PrintStatement("woof", new VariableExpression("i"))])
  //       ),
  //     ])
  //   ),
  // ],
  // forEachLoop: [
  //   String.raw`chase element through mypack:
  //       woof element;
  //   tail`,
  //   new Program(
  //     new Block([
  //       new ThroughLoopStatement(
  //         new VariableExpression("element"),
  //         new VariableExpression("mypack"),
  //         new Block([
  //           new PrintStatement("woof", new VariableExpression("element")),
  //         ])
  //       ),
  //     ])
  //   ),
  // ],
  // loopWithPoopStatement: [
  //   String.raw`
  //    chase:
  //       woof "I run forever\!";
  //       poop;
  //   tail`,
  //   new Program(
  //     new Block([
  //       new InfiniteLoopStatement(
  //         new Block([
  //           new PrintStatement(
  //             "woof",
  //             new TemplateLiteral([new StringLiteral("I run forever\\!")], null)
  //           ),
  //           new BreakStatement(),
  //         ])
  //       ),
  //     ])
  //   ),
  // ],
  // loopWithWalkiesStatement: [
  //   String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
  //         if i mod 2 equals 0 then:
  //             walkies;
  //         tail
  //         woof i;
  //     tail`,
  //   new Program(
  //     new Block([
  //       new ForLoopStatement(
  //         new VariableDeclaration(
  //           new VariableExpression("i"),
  //           new Variable(new PrimitiveType("toeBeans"), new NumberLiteral(0))
  //         ),
  //         new BinaryExpression(
  //           "*",
  //           new VariableExpression("i"),
  //           new NumberLiteral(2)
  //         ),
  //         new BinaryExpression(
  //           "isLessThan",
  //           new VariableExpression("i"),
  //           new NumberLiteral(10)
  //         ),
  //         new Block([
  //           new ConditionalStatement(
  //             new BinaryExpression(
  //               "equals",
  //               new BinaryExpression(
  //                 "mod",
  //                 new VariableExpression("i"),
  //                 new NumberLiteral(2)
  //               ),
  //               new NumberLiteral(0)
  //             ),
  //             new Block([new ContinueStatement()]),
  //             null
  //           ),
  //           new PrintStatement("woof", new VariableExpression("i")),
  //         ])
  //       ),
  //     ])
  //   ),
  // ],
  // /* Function Declarations */
  // functionDeclaration: [
  //   String.raw`trick gcd chews[toeBeans:num1, toeBeans:num2] fetches toeBeans:
  //       toeBeans remainder;
  //       chase while (a mod b) isGreaterThan 0:
  //           remainder is (a mod b);
  //           a is b;
  //           b is remainder;
  //       tail
  //       give a;
  //   tail
  //   toeBeans greatestCommonDivisor is gcd(21, 49);`,
  //   new Program(
  //     new Block([
  //       new FunctionDeclaration(
  //         new VariableExpression("gcd"),
  //         new Function(
  //           new Parameters(
  //             [new PrimitiveType("toeBeans"), new PrimitiveType("toeBeans")],
  //             [new VariableExpression("num1"), new VariableExpression("num2")]
  //           ),
  //           new PrimitiveType("toeBeans"),
  //           new Block([
  //             new VariableDeclaration(
  //               new VariableExpression("remainder"),
  //               new Variable(new PrimitiveType("toeBeans"), null)
  //             ),
  //             new WhileLoopStatement(
  //               new BinaryExpression(
  //                 "isGreaterThan",
  //                 new BinaryExpression(
  //                   "mod",
  //                   new VariableExpression("a"),
  //                   new VariableExpression("b")
  //                 ),
  //                 new NumberLiteral(0)
  //               ),
  //               new Block([
  //                 new AssignmentStatement(
  //                   new VariableExpression("remainder"),
  //                   new BinaryExpression(
  //                     "mod",
  //                     new VariableExpression("a"),
  //                     new VariableExpression("b")
  //                   )
  //                 ),
  //                 new AssignmentStatement(
  //                   new VariableExpression("a"),
  //                   new VariableExpression("b")
  //                 ),
  //                 new AssignmentStatement(
  //                   new VariableExpression("b"),
  //                   new VariableExpression("remainder")
  //                 ),
  //               ])
  //             ),
  //             new GiveStatement(new VariableExpression("a")),
  //           ])
  //         )
  //       ),
  //       new VariableDeclaration(
  //         new VariableExpression("greatestCommonDivisor"),
  //         new Variable(
  //           new PrimitiveType("toeBeans"),
  //           new FunctionCall(new VariableExpression("gcd"), [
  //             new NumberLiteral(21),
  //             new NumberLiteral(49),
  //           ])
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // /* Function Call */
  // functionCallWithoutArgs: [
  //   String.raw`
  //     fib();
  //   `,
  //   new Program(new Block([new FunctionCall(new VariableExpression("fib"))])),
  // ],
  // functionCallWithArgs: [
  //   String.raw`
  //     fib(100);
  //   `,
  //   new Program(
  //     new Block([
  //       new FunctionCall(new VariableExpression("fib"), [
  //         new NumberLiteral(100),
  //       ]),
  //     ])
  //   ),
  // ],
  // /* Breed Declarations */
  // emptyBreedDeclaration: [
  //   String.raw`breed Owner is:
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("Owner"),
  //         new BreedType([], [], [])
  //       ),
  //     ])
  //   ),
  // ],
  // breedWithFields: [
  //   String.raw`breed PetSitter is:
  //     leash name;
  //     toeBeans yearsOfExperience is 0;
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("PetSitter"),
  //         new BreedType(
  //           [
  //             new Field(
  //               new VariableExpression("name"),
  //               new Variable(new PrimitiveType("leash"))
  //             ),
  //             new Field(
  //               new VariableExpression("yearsOfExperience"),
  //               new Variable(
  //                 new PrimitiveType("toeBeans"),
  //                 new NumberLiteral(0)
  //               )
  //             ),
  //           ],
  //           [],
  //           []
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // breedWithFieldAndMethods: [
  //   String.raw`breed DogHotel is:
  //     leash name;

  //     trick greet:
  //       woof "Welcome to our Dog Hotel";
  //     tail
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("DogHotel"),
  //         new BreedType(
  //           [
  //             new Field(
  //               new VariableExpression("name"),
  //               new Variable(new PrimitiveType("leash"))
  //             ),
  //           ],
  //           [],
  //           [
  //             new Method(
  //               new VariableExpression("greet"),
  //               new Function(
  //                 null,
  //                 null,
  //                 new Block([
  //                   new PrintStatement(
  //                     "woof",
  //                     new TemplateLiteral(
  //                       [new StringLiteral("Welcome to our Dog Hotel")],
  //                       null
  //                     )
  //                   ),
  //                 ])
  //               )
  //             ),
  //           ]
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // breedWithMethod: [
  //   String.raw`breed DogLover is:
  //     trick barkAtDog:
  //       bark "woof woof";
  //     tail
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("DogLover"),
  //         new BreedType(
  //           [],
  //           [],
  //           [
  //             new Method(
  //               new VariableExpression("barkAtDog"),
  //               new Function(
  //                 null,
  //                 null,
  //                 new Block([
  //                   new PrintStatement(
  //                     "bark",
  //                     new TemplateLiteral(
  //                       [new StringLiteral("woof woof")],
  //                       null
  //                     )
  //                   ),
  //                 ])
  //               )
  //             ),
  //           ]
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // breedWithEverything: [
  //   String.raw`breed DogHotel is:
  //     leash name;

  //     trick DogHotel chews[leash: name] fetches DogHotel;

  //     trick greet:
  //       woof "Welcome to our Dog Hotel";
  //     tail
  //   tail

  //   myDogHotel's greet();`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("DogHotel"),
  //         new BreedType(
  //           [
  //             new Field(
  //               new VariableExpression("name"),
  //               new Variable(new PrimitiveType("leash"))
  //             ),
  //           ],
  //           [
  //             new ConstructorDeclaration(
  //               new VariableExpression("DogHotel"),
  //               new Constructor(
  //                 new Parameters(
  //                   [new PrimitiveType("leash")],
  //                   [new VariableExpression("name")]
  //                 ),
  //                 new IdType("DogHotel")
  //               )
  //             ),
  //           ],
  //           [
  //             new Method(
  //               new VariableExpression("greet"),
  //               new Function(
  //                 null,
  //                 null,
  //                 new Block([
  //                   new PrintStatement(
  //                     "woof",
  //                     new TemplateLiteral(
  //                       [new StringLiteral("Welcome to our Dog Hotel")],
  //                       null
  //                     )
  //                   ),
  //                 ])
  //               )
  //             ),
  //           ]
  //         )
  //       ),
  //       new FunctionCall(
  //         new BinaryExpression(
  //           "'s",
  //           new VariableExpression("myDogHotel"),
  //           new VariableExpression("greet"),
  //           null
  //         ),
  //         []
  //       ),
  //     ])
  //   ),
  // ],
};

// const program = String.raw`toeBeans CeCeAge is 1;`;

describe("The semantic analyzer", () => {
  Object.entries(fixture).forEach(([name, source]) => {
    test(`correctly compiles for ${name}`, (done) => {
      const astRoot = parse(source);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      expect(astRoot).toBeTruthy();
      done();
    });
  });
});

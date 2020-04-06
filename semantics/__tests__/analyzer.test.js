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
  emptyDictVariableDeclaration: String.raw`kennel[leash:toeBeans] do is:];`,
  nonEmptyListVariableDeclaration: String.raw`pack[leash] dogs is"CeCe", "Buster", "Duming"];`,
  listVariableDeclarationWithSpreads: String.raw`pack[Dog] dogs isdog1, dog2, peanutButter othDogs];`,
  listVariableDeclarationUsingWithout: String.raw`pack[Dog] dogs isdog1, dog2, dog3] witho dog1;`,
  nonEmptyDictVariableDeclaration: String.raw`kennel[leash:toeBeans] dogs is"CeCe":1, "Buster":2, o":3];`,
  /* String Operations */
  leashConcatenaon: String.raw`leash dogName is "Ce" with "Ce";`,
  stringInterpolation: String.raw`leash sentence is "![x] is a good girl";`,
  stringInterpolationInMiddleOfString: String.raw`leash phrase is "Come back here, ![name]. Good girl.";`,
  /* Assignment */
  variableAssignnt: String.raw`cuteness is 100;`,
  /* Relops */
  equalityOperors: String.raw`goodBoy testBool1 is x equals y; goodBoy testBool2 is x notEquals y;`,
  greaterThanLessThanComparators: String.raw`goodBoy testGreater is x isGreaterThan y; goodBoy testLess is x isLessThan y;`,
  greaterThanLessThanOrEqualToComparators: String.raw`goodBoy testAtLeast is x isAtLeast y; goodBoy testAtMost is x isAtMost y;`,
  logicalNation: String.raw`goodBoy testNegation1 is x equals not y; goodBoy testNegation2 is y equals not x;`,
  /* Arithmetic */
  arithmeticOperats: String.raw`toeBeans a is x + y; 
              a is x - y; 
              a is x * y; 
              a is x / y;
              a is x mod y; 
              a is x!; 
              a is -x;`,
  // /* Conditionals */
  Statement: String.raw`if x then: x is y; tail`,
  ifElseStement: String.raw`if x isAtLeast y then:
        leash dogName is "CeCe";
    else:
        leash dogName is "Fluffy";
        toeBeans dogAge is 12;
    tail`,
  ifElseIfStatent: String.raw`if x notEquals y then:
          woof "CeCe is kinda cute";
      else if x isGreaterThan y then:
          woof "CeCe is pretty cute";
      else if x isLessThan y then:
          woof "Okay, CeCe is really cute";
      else:
          woof "CeCe is the cutest of the cutest";
      tail`,
  // /* Comments */
  // oneLinomment:
  //   String.raw`!!! I'm a one line comment !!!`,
  //   new Program(new Block([])),
  // ],
  // multiLineCment:
  //   String.raw`!!! I'm a \n multiline \n comment !!!`,
  //   new Program(new Block([])),
  // ],
  // /* Loops */
  // inniteLoop:
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
  // ]  fixedLoop:
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
  // ]  whileLoop:
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
  //   ), ],
  // forLoop:
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
  // rEachLoop:
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
  // loopWithPootatement:
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
  // loopWithWalkiesStatement:  String.raw`chase toeBeans i is 0 by i*2 while i isLessThan 10:
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
  // functionDeclaratn:
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
  //            new PrimitiveType("toeBeans"), new PrimitiveType(oeBeans")],
  //            new VariableExpression("num1"), new VariableExpreson("num2")]
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
  //           new FunctionCall(new VariableExpression("gcd"),
  //          new NumberLiteral(21),
  //             new NumberLiteral(49),
  //           ])
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // /* Function Call */
  // functionCallWhoutArgs:
  //   String.raw`
  //     fib();
  //   `,
  //   new Program(new Block([new FunctionCall(new VariableExpression("fib"))])),
  // ],
  // functionCaWithArgs:
  //   String.raw`
  //     fib(100);
  //   `,
  //   new Program(
  //     new Block([
  //       new FunctionCall(new VariableExpression("fib"),
  //     new NumberLiteral(100),
  //       ]),
  //     ])
  //   ),
  // ],
  // /* Breed Declarations */
  // emptyBreedDeclaratio
  //   String.raw`breed Owner is:
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("Owner"),
  //         new BedType([],],])
  //       ),
  //     ])
  //   ),
  // ],
  // breedWitields:
  //   String.raw`breed PetSitter is:
  //     leash name;
  //     toeBeans yearsOfExperience is 0;
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("PetSitter"),
  //         new BreedTy(

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
  //           ]
  //          ]
  //         )
  //       ),
  //     ])
  //   ),
  // ],
  // breedWithFieldAndMethods:  String.raw`breed DogHotel is:
  //     leash name;

  //     trick greet:
  //       woof "Welcome to our Dog Hotel";
  //     tail
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("DogHotel"),
  //         new BreedTy(

  //             new Field(
  //               new VariableExpression("name"),
  //               new Variable(new PrimitiveType("leash"))
  //             ),
  //           ]          ,

  //             new Method(
  //               new VariableExpression("greet"),
  //               new Function(
  //                 null,
  //                 null,
  //                 new Block([
  //                   new PrintStatement(
  //                     "woof",
  //                     new TemplateLiteral(
  //                      new StringLiteral("Welcome to our Dog Hotel",
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
  // breedWitethod:
  //   String.raw`breed DogLover is:
  //     trick barkAtDog:
  //       bark "woof woof";
  //     tail
  //   tail`,
  //   new Program(
  //     new Block([
  //       new TypeDeclaration(
  //         new VariableExpression("DogLover"),
  //         new BreedType           ]          ,

  //             new Method(
  //               new VariableExpression("barkAtDog"),
  //               new Function(
  //                 null,
  //                 null,
  //                 new Block([
  //                   new PrintStatement(
  //                     "bark",
  //                     new TemplateLiteral(
  //                      new StringLiteral("woof woof",
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
  // breedWithEverythg:
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
  //         new BreedTy(

  //             new Field(
  //               new VariableExpression("name"),
  //               new Variable(new PrimitiveType("leash"))
  //             ),
  //         ,

  //             new ConstructorDeclaration(
  //               new VariableExpression("DogHotel"),
  //               new Constructor(
  //                 new Parameters(
  //                  new PrimitiveType("leh")],
  //                  new VariableExpression("me")]
  //                 ),
  //                 new IdType("DogHotel")
  //               )
  //             ),
  //         ,

  //             new Method(
  //               new VariableExpression("greet"),
  //               new Function(
  //                 null,
  //                 null,
  //                 new Block([
  //                   new PrintStatement(
  //                     "woof",
  //                     new TemplateLiteral(
  //                      new StringLiteral("Welcome to our Dog Hotel",
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
  //     ),
  //        ]
  //       ),
  //     ])
  //   ),
  // ],
};

const program = String.raw`toeBeans CeCeAge is 1;`;

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

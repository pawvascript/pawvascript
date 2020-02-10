/*
 * Grammar Success Test
 *
 * These tests that the PawvaScript grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require('../syntax-checker');

const readmeExamples = [
  ['hello world', 'say "Hello, World!";', 'Statement'],
  ['string declarations', 'bark string dogName is "CeCe";', 'Declaration'],
  ['number declarations', 'bark number dogAge is 12;', 'Declaration'],
  ['boolean declarations', 'bark boolean isCute is true;', 'Declaration'],
  ['list declarations', 'bark list dogNames[string] is ["CeCe", "Fluffy"];', 'Declaration'],
  ['map declarations', 'bark map dogAges[string:number] is ["CeCe": 1, "Fluffy": 2];', 'Declaration'],
  ['uninitialized variable declarations', 'bark number cuteness;', 'Declaration'],
  ['assigning uninitialized variables', 'cuteness is 100', 'Assignment'],
  ['equality comparators', 'x equals y', 'EqualityExp'],
  ['inequaltiy comparators', 'x not equals y', 'EqualityExp'],
  ['greater than comparators', 'x is greater than y', 'EqualityExp'],
  ['less than comparators', 'x is less than y', 'EqualityExp'],
  ['greater or equals comparators', 'x is at least y', 'EqualityExp'],
  ['less or equals comparators', 'x is at most y', 'EqualityExp'],
  ['if, else statements',    `if x is at least y then:
                                               bark string dogName is "CeCe";
                                             else:
                                               bark string dogName is "Fluffy";
                                                 bark string dogAge is 12;
                                             end`, 'Statement'],
  ['if, else if statements', `if x not equals y then:
                                            say "CeCe is kinda cute";
                                          else if x is greater than y then:
                                            say "CeCe is pretty cute";
                                          else if x is less than y then:
                                            say "Okay, CeCe is really cute";
                                          else:
                                            say "CeCe is the cutest of the cutest";
                                          end`, 'Statement'],
  ['one line comments', `!!! I'm a one line comment !!!`, 'comment'],
  ['multiline comments', `!!! I'm a \n multiline \n comment !!!`, 'comment'],
  ['forever loops', `loop:
                                    say "I run forever!";
                                  end`],
  ['fixed loops',   `loop 5 times:
                                      say "Stay.";
                                    end`],
  ['while loops',   `loop while x is at most 5:
                                      say x;
                                  end`, 'Statement'],
  ['for loops',     `loop number i is 0 by i*2 while i is less than 10:
                                    say i;
                                  end`, 'Statement'],
  ['for each loops', `loop element through myList:
                                    say element;
                                  end`, 'Statement'],
  ['function declaration', `bark func gcd chases[number:num1, number:num2] fetches number:
                                            bark number remainder;

                                            loop while (a mod b) is greater than 0:
                                              remainder is (a mod b);
                                              a is b;
                                              b is remainder;
                                            end
                                          end`, 'Declaration'],
  ['object declaration and creation', `bark breed Owner is:
                                                        bark string dogName;
                                                          
                                                          bark func Owner chases[string:dogName] fetches Owner;
                                                          
                                                          bark func introduceDog:
                                                            say "My dog's name is " with Owner's dogName;
                                                          end

                                                          bark func command fetches string:
                                                            give Owner's dogName with ", stay.";
                                                          end
                                                      end
                                                      bark Owner lucille is Owner("Cece");
                                                      lucille's introduceDog();  !!! output: "My dog's name is Cece" !!!
                                                      say lucille's command(); !!! output: "Cece, stay." !!!
                                                      `]
                                                                                                                          
];

const objects = [
  ['object declaration', `bark breed Owner is:
                                          bark string dogName;
                                        end`, 'Declaration'],
  ['object constructor declaration', `bark breed Owner is:
                                                      bark string dogName;
                                                        
                                                        bark func Owner chases[string:dogName] fetches Owner;
                                                    end`, 'Declaration'],
  ['object with function', `bark breed Owner is:
                                            bark string dogName;
                                              
                                              bark func Owner chases[string:dogName] fetches Owner;
                                              
                                              bark func introduceDog:
                                                say "My dog's name is " with Owner's dogName;
                                              end

                                              bark func command fetches string:
                                                give Owner's dogName with ", stay.";
                                              end
                                          end`]                                                  
];

const comments = [
  ['exclamation mark in comment', '!!! I should be a comment! !!!'],
  ['tags on different lines', `!!!\nComment under tags\nlike so\n!!!`],
  ['all kinds of characters', '!!! @#$@#%^&{123456;}!!!']
];

const ids = [
  ['start with _', '_hello'],
  ['end with _', 'hello_'],
  ['_s all over the place', '_oh_hey_there_'],
  ['has numbers', 'not100'],
  ['start with keyword', 'withoutDogs'],
  ['contains keyword', 'living_with_dogs'],
  ['end with keyword', 'never_barks'],
  ['starts with type', 'numberOne'],
  ['one letter', 'm']
]

const Primaries = [
  ['apostrophe operator', "toal's hat"],
  ['list', `["CeCe", "Fluffy", "Mr. Dog"]`],
  ['one element list', `["CeCe"]`],
  ['list within a list', `[["CeCe", "Fluffy"], ["Marvin"]]`],
  ['empty list', `[]`],
  ['map', `["CeCe": "cutest", "Marcy": "cute", "Marvin": "barely passing"]`],
  ['one element map', `["CeCe": "too cute"]`],
  ['map within a map', `["Cece": ["cuteness": 100]]`],
  ['list within a map', `["Marvin": ["bleh": "meh"]]`]
];

describe('The syntax can match', () => {
  readmeExamples.forEach( ([scenario, program, startPoint]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(true);
      done();
    });
  });
});

describe('Declarations can be', () => {
  objects.forEach( ([scenario, snippet, startPoint]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(snippet, startPoint)).toBe(true);
      done();
    });
  })
})

describe('comments match', () => {
  comments.forEach( ([scenario, snippet]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(snippet, 'comment')).toBe(true);
      done();
    });
  })
})

describe('ids match', () => {
  ids.forEach( ([scenario, snippet]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(snippet, 'id')).toBe(true);
      done();
    });
  })
})

describe('Primary matches', () => {
  Primaries.forEach( ([scenario, snippet]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(snippet, 'Primary')).toBe(true);
      done();
    });
  })
})

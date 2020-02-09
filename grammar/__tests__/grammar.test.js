/*
 * Grammar Success Test
 *
 * These tests that the PawvaScript grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require('../syntax-checker');

const readmeExamples = [
  ['Statement', 'hello world', 'say "Hello, World!";'],
  ['Declaration', 'string declarations', 'bark string dogName is "CeCe";'],
  ['Declaration', 'number declarations', 'bark number dogAge is 12;'],
  ['Declaration', 'boolean declarations', 'bark boolean isCute is true;'],
  ['Declaration', 'list declarations', 'bark list dogNames[string] is ["CeCe", "Fluffy"];'],
  ['Declaration', 'map declarations', 'bark map dogAges[string:number] is ["CeCe": 1, "Fluffy": 2];'],
  ['Declaration', 'uninitialized variable declarations', 'bark number cuteness;'],
  ['Assignment', 'assigning uninitialized variables', 'cuteness is 100'],
  ['EqualityExp', 'equality comparators', 'x equals y'],
  ['EqualityExp', 'inequaltiy comparators', 'x not equals y'],
  ['EqualityExp', 'greater than comparators', 'x is greater than y'],
  ['EqualityExp', 'less than comparators', 'x is less than y'],
  ['EqualityExp', 'greater or equals comparators', 'x is at least y'],
  ['EqualityExp', 'less or equals comparators', 'x is at most y'],
  ['Statement', 'if, else statements',    `if x is at least y then:
                                               bark string dogName is "CeCe";
                                             else:
                                               bark string dogName is "Fluffy";
                                                 bark string dogAge is 12;
                                             end`],
  ['Statement', 'if, else if statements', `if x not equals y then:
                                            say "CeCe is kinda cute";
                                          else if x is greater than y then:
                                            say "CeCe is pretty cute";
                                          else if x is less than y then:
                                            say "Okay, CeCe is really cute";
                                          else:
                                            say "CeCe is the cutest of the cutest";
                                          end`],
  ['comment', 'one line comments', `!!! I'm a one line comment !!!`],
  ['comment', 'multiline comments', `!!! I'm a \n multiline \n comment !!!`],
  ['Statement', 'forever loops', `loop:
                                    say "I run forever!";
                                  end`],
  ['Statement', 'fixed loops',   `loop 5 times:
                                      say "Stay.";
                                    end`],
  ['Statement', 'while loops',   `loop while x is at most 5:
                                      say x;
                                  end`],
  ['Statement', 'for loops',     `loop number i is 0 by i*2 while i is less than 10:
                                    say i;
                                  end`],
  ['Statement', 'for each loops', `loop element through myList:
                                    say element;
                                  end`],
  ['Declaration', 'function declaration', `bark func gcd chases[number:num1, number:num2] fetches number:
                                            bark number remainder;

                                            loop while (a mod b) is greater than 0:
                                              remainder is (a mod b);
                                              a is b;
                                              b is remainder;
                                            end
                                          end`]                                                                                                                        
];

describe('The syntax can match', () => {
  readmeExamples.forEach( ([startPoint, scenario, program]) => {
    test(scenario, (done) => {
      expect(syntaxCheck(program, startPoint)).toBe(true);
      done();
    });
  });
});
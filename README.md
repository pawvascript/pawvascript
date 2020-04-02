# PawvaScript

<img alt='PawvaScript Logo' src='assets/pawvascript.png' width='300px'/>

## Introduction

Ever wish that JavaScript had less symbols and more dogs? We did, so we made PawvaScript!

PawvaScript is an object-oriented scripting language designed to make JavaScript more programmer-friendly (so friendly that your dog could learn it, probably). PawvaScript draws on many fundamentals from JavaScript but replaces confusing symbols with clear and (dog-friendly) readable terms, adds types (like TypeScript) to help with debugging, and throws in some paw-sitively awesome dog-related keywords just for fun and tail wags.

<img alt='CeCe Coding Rear View' src='assets/CeCeCoding2.JPG' width='600px'/>

## Features

- Language for scripting
- Object-Oriented
  - breeds are what we call classes!
- Static typing
- Functions
  - we call them tricks!
  - higher-order functions
- 5 basic types
  - leash (string)
  - goodBoy (boolean)
  - toeBeans (number)
  - pack (list)
  - kennel (map)
- 5 kinds of loops
  - Forever
  - Fixed
  - While
  - For
  - ForEach
- Conditional Statements
- Spread/peanutButter syntax
- Single and multi-line comments

## Example Programs

### Hello, World!

Let's start with a classic.

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                woof "Hello, World!";
                bark "my ball!";
                howl "uh-oh";
            </pre>
        </td>
        <td>
            <pre>
                console.log("Hello, World!";)
                console.log("my ball!".toUpperCase());
                console.error("uh-oh");
            </pre>
        </td>
    </tr>
</table>


### Types

PawvaScript's primitive types are similar to JavaScripts, and it also has data structures like Python's lists and dictionaries.

| PawvaScript | Javascript/Python |
| ----------- | ----------------- |
| goodBoy     | boolean           |
| leash       | string            |
| toeBeans    | number            |
| trick       | function          |
| pack        | array/list        |
| kennel      | map/dictionary    |
| breed       | class/object      |

### Variable Declaration and Assignment

Variables are declared with their type.

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                leash dogName is "Cece";
                toeBeans dogAge is 12;
                goodBoy isGoodBoy is good;
                goodBoy isNaughtyDoggo is bad;
            </pre>
        </td>
        <td>
            <pre>
                let dogName = "Cece";
                let dogAge = 12;
                let isGoodBoy = true;
                let isNaughtyDoggo = bad; 
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                pack[leash] dogNames is ["Cece", "Fluffy"];
                kennel[leash:toeBeans] dogAges is ["Cece": 1, "Fluffy": 2];
            </pre>
        </td>
        <td>
            <pre>
                let dogNames = ["Cece", "Fluffy"];
                let dogAges = {"Cece": 1, "Fluffy": 2};
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                toeBeans cuteness; !!! Default value is 0 !!!
                cuteness is 100;
            </pre>
        </td>
        <td>
            <pre>
                let cuteness = 0;
                cuteness = 100;
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                !!! cat is the equivalent of null. Any tpye can have the value cat !!!
                leash theBestestDog is cat;
            </pre>
        </td>
        <td>
            <pre>
                let theBestestDog = null;
            </pre>
        </td>
    </tr>
</table>

### Leashes/Strings

PawvaScript supports leash interpolation and concetation:

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

leash dogName is "Ce" with "Ce";                                    let dogName = "Ce" + "Ce";

leash sentence is "![dogName] is the best dog";                     let sentence = `${dogName} is the best dog`;
```

### Packs/Lists

Packs are the PawvaScript equivalent of lists in Python or arrays in JavaScript:

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

pack[leash] goodDogs is ["CeCe", "Buster", "Muffin"];               let goodDogs = ["CeCe", "Buster", "Muffin"];

!!! The without keyword can remove elements from a pack. !!!
pack[leash] bestDogs is goodDogs without "Muffin";                  let bestDogs = goodDogs;
                                                                    const indexOfMuffin = goodDogs.indexOf("Muffin");
                                                                    if (indexOfMuffin > -1) {
                                                                         bestDogs.splice(indexOfMuffin, 1);
                                                                    }

!!! The peanutButter keyword is the equivalent of JavaScript's spread syntax. !!!
pack[leash] sm0lDogs is ["Tiny", "Teenie", "Boo"];                  let sm0lDogs = ["Tiny", "Teenie", "Boo"];
pack[leash] b1gDogs is ["Boofer", "Woofer," "Mo"];                  let b1gDogs = ["Boofer", "Woofer," "Mo"];
pack[leash] allTheDogs is [                                         let allTheDogs = [
    peanutButter sm0lDogs,                                              ...sm0lDogs,
    peanutButter b1gDogs                                                ...b1gDogs
];                                                                  ];

woof allTheDogs;                                                    console.log(allTheDogs);
!!! ["Tiny", "Teenie", "Boo", "Boofer", "Woofer," "Mo"] !!!         /* ["Tiny", "Teenie", "Boo", "Boofer", "Woofer," "Mo"] */

pack[toeBeans] ages is [1, 1, 2];                                   let ages = [1, 1, 2];
```

### Kennels/Maps

Kennels are data structures like Python dictionaries.

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

kennel[leash:leash] goodDogs is [                                   let goodDogs = {
    "CeCe": "German Shepherd",                                          CeCe: "German Shepherd",
    "Buster": "Golden Doodle",                                          Buster: "Golden Doodle",
    "Mo": "Potato"                                                      Mo: "Potato"
];                                                                  };
kennel[leash:toeBeans] ages is ["CeCe": 1, "Buster": 1, "Mo": 5];   let ages = {CeCe: 1, Buster: 1, Mo: 5};
```

### Relational Operators

Wanna compare stuff?

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

goodBoy a is x equals y;                                            let a = x === y;

a is x notEquals y;                                                 a = x !== y;

a is x isGreaterThan y;                                             a = x > y;

a is x isLessThan y;                                                a = x < y;

a is x isAtLeast y;                                                 a = x >= y;

a is x isAtMost y;                                                  a = x <= y;
```

### Arithmetic Operators

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

toeBeans a is x + y;                                                a = x + y;

a is x - y;                                                         a = x - y;

a is x * y;                                                         a = x * y;

a is x / y;                                                         a = x / y;

a is x mod y;                                                       a = x % y;

a is x!;                                                            a = x!;

a is -x;                                                            a = -x;
```

### Conditional Statements

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

if x isAtLeast y then:                                              if (x <= y) {
    leash dogName is "CeCe";                                            let dogName = "CeCe";
else:                                                               else {
    leash dogName is "Buster";                                          let dogName = "Buster";
tail                                                                }

if x notEquals y then:                                              if (x !== y) {
    woof "CeCe is kinda cute";                                          console.log("CeCe is kinda cute");
else if x isGreaterThan y then:                                     else if (x > y) {
    woof "CeCe is pretty cute";                                         console.log("CeCe is pretty cute");
else if x isLessThan y then:                                        else if (x < y) {
    woof "Okay, CeCe is really cute";                                   console.log("Okay, CeCe is really cute");
else:                                                               else {
    woof "CeCe is the cutest of the cutest";                            console.log("CeCe is the cutest of the cutest");
tail                                                                }
```

### Comments

Let's write some comments!

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

!!! I'm a one line comment !!!                                      // I'm a comment

!!! I'm a                                                           /* I'm a
multiline                                                           multiline
comment !!!                                                         comment */
```

### Loops

Forever Loop

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

chase:                                                              while (true) {
    woof "I run forever!";                                              console.log("I run forever!");
tail                                                                }
```

<br>Fixed Loop

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

chase 5 times:                                                      for (let i = 0; i < 5; i++) {
    woof "Stay.";                                                       console.log("Stay.");
tail                                                                }
```

<br>While Loop

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

chase while x isAtMost 5:                                           while (x <= 5) {
    woof x;                                                             console.log(x);
tail                                                                }
```

<br>For Loop

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

chase toeBeans i is 0 by i*2 while i isLessThan 10:                 for (let i = 0; i < 10; i *= 2) {
    woof i;                                                             console.log(i);
tail                                                                }
```

<br>For Each Loop

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

chase element through myPack:                                       for (let element of myArray) {
    woof element;                                                       console.log(element);
tail                                                                }
```

<br>Use `poop` and `walkies` to `break` and `continue`, respectively.

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

chase element through myPack:                                       for (let element of myArray) {
    if element equals cat then:                                         if (element === null) {
        poop;                                                               break;
    else if element equals "CeCe" then:                                 } else if (element === "CeCe") {
        walkies;                                                            continue;
    tail;                                                               }
    woof element;                                                       console.log(element);
tail                                                                }
```

### Tricks

Let's find the greatest common divisor between two toeBeans!

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

trick gcd chews[toeBeans:num1, toeBeans:num2] fetches toeBeans:     function gcd(num1, num2) {
    toeBeans remainder;                                                 let remainder;
    chases while (a mod b) isGreaterThan 0:                             while ((num1 % num2) > 0) {
        remainder is (a mod b);                                             remainder = a % b;
        a is b;                                                             a = b;
        b is remainder;                                                     b = remainder;
    tail                                                                }
    give a;                                                             return a;
tail                                                                }

toeBeans a is 8;                                                    let a = 8;
toeBeans b is 12;                                                   let b = 12;
toeBeans c is gcd(a, b);                                            let c = gcd(a, b);
```

The classic Fibonacci function to get the nth term of the Fibonacci sequence:

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

trick fib chews[toeBeans:n] fetches toeBeans:                       function fib(n) {
    if n isAtMost 1 then:                                               if (n <=1) {
        give n;                                                             return n;
    else:                                                               } else {
        give fib(n-1) + fib(n-2);                                           return fib(n-1) + fib(n-2);
    tail                                                                }
tail                                                                }

toeBeans huzzah is fib(100);                                        let huzzah = fib(100);
```

### Breeds

Let's make an owner breed!

```JavaScript
PAWVASCRIPT                                                         JAVASCRIPT

breed Owner is:                                                     class Owner {
    leash dogName;                                                      constructor(dogName) {
                                                                            this.dogName = dogName;
    trick Owner chases[leash:dogName] fetches Owner;                    }

    trick introduceDog:                                                 introduceDog() {
        woof "My dog's name is " with Owner's dogName;                      console.log(`My dog's name is ${this.dogName}`);
    tail                                                                }

    trick command fetches leash:                                        command() {
        give Owner's dogName with ", stay!";                                return `${this.dogName}, stay!`;
    tail                                                                }
tail                                                                }

Owner lucille is Owner("Cece")                                      let lucille = new Owner("Cece");
(lucille's introduceDog)() !!! output: "My dog's name is Cece" !!!    lucille.introduceDog();
woof lucille's command()  !!! output: "Cece, stay." !!!             console.log(lucille.command());
```

Happy PawvaScript coding! Remember: _Good Dogs only!_

<img alt='CeCe Coding Front View' src='assets/CeCeCoding3.JPG' width='500px'/>

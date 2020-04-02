# PawvaScript

<img alt='PawvaScript Logo' src='images/pawvascript.png' width='300px'/>

## Introduction

Ever wish that JavaScript had less symbols and more dogs? We did, so we made PawvaScript!

PawvaScript is an object-oriented scripting language designed to make JavaScript more programmer-friendly (so friendly that your dog could learn it, probably). PawvaScript draws on many fundamentals from JavaScript but replaces confusing symbols with clear and (dog-friendly) readable terms, adds types (like TypeScript) to help with debugging, and throws in some paw-sitively awesome dog-related keywords just for fun and tail wags.

<img alt='CeCe Coding Rear View' src='images/CeCeCoding2.JPG' width='600px'/>

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
                leash dogName is "CeCe";
                toeBeans dogAge is 12;
                goodBoy isGoodBoy is good;
                goodBoy isNaughtyDoggo is bad;
            </pre>
        </td>
        <td>
            <pre>
                let dogName = "CeCe";
                let dogAge = 12;
                let isGoodBoy = true;
                let isNaughtyDoggo = bad; 
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                pack[leash] dogNames is ["CeCe", "Fluffy"];
                kennel[leash:toeBeans] dogAges is ["CeCe": 1, "Fluffy": 2];
            </pre>
        </td>
        <td>
            <pre>
                let dogNames = ["CeCe", "Fluffy"];
                let dogAges = {"CeCe": 1, "Fluffy": 2};
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
                !!! cat is the equivalent of null. !!!
                !!! Any tpye can have the value cat !!!
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

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                leash dogName is "Ce" with "Ce";
                leash sentence is "![dogName] is the best dog";
            </pre>
        </td>
        <td>
            <pre>
                let dogName = "Ce" + "Ce";
                let sentence = `${dogName} is the best dog";
            </pre>
        </td>
    </tr>
</table>

### Packs/Lists

Packs are the PawvaScript equivalent of lists in Python or arrays in JavaScript:

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                pack[leash] goodDogs is ["CeCe", "Buster", "Muffin"];
                pack[toeBeans] ages is [1, 1, 2];
            </pre>
        </td>
        <td>
            <pre>
                let goodDogs = ["CeCe", "Buster", "Muffin"];
                let ages = [1, 1, 2];
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                !!! "without" removes elements from a pack !!!
                pack[leash] bestDogs is goodDogs without "Muffin";
            </pre>
        </td>
        <td>
            <pre>
                let bestDogs = goodDogs.filter(dogName => dogName != "Muffin");
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                !!! "peanutButter" is the spread operator !!!
                pack[leash] smallDogs is ["Tiny", "Teenie", "Boo"];
                pack[leash] bigDogs is ["Boofer", "Woofer," "Mo"];
                pack[leash] allDogs is [
                    peanutButter smallDogs,
                    peanutButter bigDogs
                ];
            </pre>
            <pre>
                woof allDogs;
                !!! ["Tiny", "Teenie", "Boo", "Boofer", "Woofer", "Mo"] !!!
            </pre>
        </td>
        <td>
            <pre>
                let smallDogs = ["Tiny", "Teenie", "Boo"];
                let bigDogs = ["Boofer", "Woofer", "Mo"];
                let allDogs = [
                    ...smallDogs,
                    ...bigDogs
                ];
            </pre>
            <pre>
                console.log(allDogs);
                /* ["Tiny", "Teenie", "Boo", "Boofer", "Woofer", "Mo"] */
            </pre>
        </td>
    </tr>
</table>

### Kennels/Maps

Kennels are data structures like Python dictionaries.
<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                kennel[leash:leash] goodDogs is [
                    "CeCe": "German Shepherd",
                    "Buster": "Golden Doodle",
                    "Mo": "Potato"
                ];
            </pre>
            <pre>
                kennel[leash:toeBeans] ages is ["CeCe": 1, "Buster": 1, "Mo": 5];
            </pre>
        </td>
        <td>
            <pre>
                let goodDogs = {
                    "CeCe": "German Shepherd",
                    "Buster": "Golden Doodle",
                    "Mo": "Potato" 
                };
            </pre>
            <pre>
                let ages = {CeCe: 1, Buster: 1, Mo: 5};
            </pre>
        </td>
    </tr>
</table>


### Relational Operators

Wanna compare stuff?

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                goodBoy a is x equals y;
            </pre>
            <pre>
                a is x notEquals y;
            </pre>
            <pre>
                a is x isGreaterThan y;
            </pre>
            <pre>
                a is x isLessThan y;
            </pre>
            <pre>
                a is x isAtLeast y;
            </pre>
            <pre>
                a is x isAtMost y;
            </pre>
        </td>
        <td>
            <pre>
                let a = x === y;
            </pre>
            <pre>
                a = x !== y;
            </pre>
            <pre>
                let a = x > y;
            </pre>
            <pre>
                a = x < y;
            </pre>
            <pre>
                let a = x >= y;
            </pre>
            <pre>
                a = x <= y;
            </pre>
        </td>
    </tr>
</table>

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

Owner lucille is Owner("CeCe")                                      let lucille = new Owner("CeCe");
(lucille's introduceDog)() !!! output: "My dog's name is CeCe" !!!    lucille.introduceDog();
woof lucille's command()  !!! output: "CeCe, stay." !!!             console.log(lucille.command());
```

Happy PawvaScript coding! Remember: _Good Dogs only!_

<img alt='CeCe Coding Front View' src='images/CeCeCoding3.JPG' width='500px'/>

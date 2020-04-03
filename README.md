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

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                toeBeans a is x + y; 
            </pre>
            <pre>
                a is x - y;
            </pre>
            <pre>
                a is x * y;
            </pre>
            <pre>
                a is x / y;
            </pre>
            <pre>
                a is x mod y;
            </pre>
            <pre>
                a is x!;
            </pre>
            <pre>
                a is -x;
            </pre>
        </td>
        <td>
            <pre>
                a = x + y;
            </pre>
            <pre>
                a = x - y;
            </pre>
            <pre>
                a = x * y;
            </pre>
            <pre>
                a = x / y;
            </pre>
            <pre>
                a = x % y;
            </pre>
            <pre>
                a = x!;
            </pre>
            <pre>
                a = -x;
            </pre>
        </td>
    </tr>
</table>

### Conditional Statements

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                if x isAtLeast y then:
                    leash dogName is "CeCe"; 
                else:
                    leash dogName is "Buster";  
                tail  
            </pre>
        </td>
        <td>
            <pre>
                if (x <= y) {
                    let dogName = "CeCe";
                else {
                    let dogName = "Buster";
                }
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                if x notEquals y then:
                    woof "CeCe is kinda cute";
                else if x isGreaterThan y then:
                    woof "CeCe is pretty cute";
                else if x isLessThan y then:
                    woof "Okay, CeCe is really cute";
                else:
                    woof "CeCe is the cutest of the cutest";
            </pre>
        </td>
        <td>
            <pre>
                if (x !== y) {
                    console.log("CeCe is kinda cute");
                else if (x > y) {
                    console.log("CeCe is pretty cute");
                else if (x < y) {
                    console.log("Okay, CeCe is really cute");
                else {
                    console.log("CeCe is the cutest of the cutest");
                }        
            </pre>
        </td>
    </tr>
</table>

### Comments

Let's write some comments!
<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                !!! I'm a one line comment !!!
            </pre>
            <pre>
               !!! I'm a
               multiline
               comment !!!
            </pre>
        </td>
        <td>
            <pre>
                // I'm a comment
            </pre>
            <pre>
                /* I'm a
                multiline
                comment */
            </pre>
        </td>
    </tr>
</table>


### Loops

Forever Loop

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                chase:
                    woof "I run forever!";
                tail
            </pre>
        </td>
        <td>
            <pre>
                while (true) {
                    console.log("I run forever!");
                }
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
</table>


<br>Fixed Loop

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                chase 5 times:
                    woof "Stay.";
                tail
            </pre>
        </td>
        <td>
            <pre>
                for (let i = 0; i < 5; i++) {
                    console.log("Stay.");
                } 
            </pre>
        </td>
    </tr>
</table>

<br>While Loop

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                chase while x isAtMost 5:
                    woof x;
                tail
            </pre>
        </td>
        <td>
            <pre>
                while (x <= 5) {
                    console.log(x);
                 } 
            </pre>
        </td>
    </tr>
</table>

<br>For Loop
<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                chase toeBeans i is 0 by i*2 while i isLessThan 10:
                    woof i; 
                tail   
            </pre>
        </td>
        <td>
            <pre>
                for (let i = 0; i < 10; i *= 2) {
                    console.log(i);
                 } 
            </pre>
        </td>
    </tr>
</table>

<br>For Each Loop

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                chase element through myPack:   
                    woof element; 
                tail    
            </pre>
        </td>
        <td>
            <pre>
                for (let element of myArray) {
                    console.log(element);
                 } 
            </pre>
        </td>
    </tr>
</table>

<br>Use `poop` and `walkies` to `break` and `continue`, respectively.

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                chase element through myPack:   
                    if element equals cat then: 
                        poop;  
                    else if element equals "CeCe" then: 
                        walkies;  
                    tail;
                    woof element;
                tail
            </pre>
        </td>
        <td>
            <pre>
                for (let element of myArray) {
                    if (element === null) {
                        break;
                    } else if (element === "CeCe") {
                        continue;
                    }
                    console.log(element);
                 } 
            </pre>
        </td>
    </tr>
</table>

### Tricks

Let's find the greatest common divisor between two toeBeans!


<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                trick gcd chews[toeBeans:num1, toeBeans:num2] fetches toeBeans:   
                    toeBeans remainder; 
                    chases while (a mod b) isGreaterThan 0:
                        remainder is (a mod b); 
                        a is b; 
                        b is remainder;  
                    tail;
                    give a;
                tail
            </pre>
        </td>
        <td>
            <pre>
                function gcd(num1, num2) {
                    let remainder;
                    while ((num1 % num2) > 0) {
                        remainder = a % b;
                        a = b;
                        b = remainder;
                    }
                    return a;
                 } 
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                toeBeans a is 8;
                toeBeans b is 12;
                toeBeans c is gcd(a, b); 
            </pre>
        </td>
        <td>
            <pre>
                let a = 8;
                let b = 12;
                let c = gcd(a, b);
            </pre>
        </td>
    </tr>
</table>

The classic Fibonacci function to get the nth term of the Fibonacci sequence:

<tr>
        <td>
            <pre>
                trick fib chews[toeBeans:n] fetches toeBeans:   
                    if n isAtMost 1 then: 
                        give n;
                    else:
                        give fib(n-1) + fib(n-2); 
                    tail 
                tail
            </pre>
        </td>
        <td>
            <pre>
                function fib(n) {
                    if (n <=1) {
                        return n;
                    } else {
                        return fib(n-1) + fib(n-2);
                    }
                }
            </pre>
        </td>
    </tr>
    <tr>
        <td>
            <pre>
                toeBeans huzzah is fib(100);  
            </pre>
        </td>
        <td>
            <pre>
                let huzzah = fib(100);
            </pre>
        </td>
    </tr>
</table>

### Breeds

Let's make an owner breed!

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
            <pre>
                breed Owner is:   
                    leash dogName; 
                    
                    trick Owner chases[leash:dogName] fetches Owner;

                     trick introduceDog:
                        woof "My dog's name is " with Owner's dogName;
                    ${this.dogName}`);
                        tail     

                        trick command fetches leash: 
                            give Owner's dogName with ", stay!";
                        tail
                    tail

                    Owner lucille is Owner("CeCe")  
                    (lucille's introduceDog)() !!! output: "My dog's name is CeCe" !!!
                    woof lucille's command()  !!! output: "CeCe, stay." !!!     
            </pre>
        </td>
        <td>
            <pre>
                class Owner {
                    constructor(dogName) {
                        this.dogName = dogName;
                    } 

                    introduceDog() {
                        console.log(`My dog's name is
                    }

                    command() {
                        return `${this.dogName}, stay!`;
                    }
                }

                let lucille = new Owner("CeCe");
                lucille.introduceDog();
                console.log(lucille.command());
            </pre>
        </td>
    </tr>
</table>

Happy PawvaScript coding! Remember: _Good Dogs only!_

<img alt='CeCe Coding Front View' src='assets/CeCeCoding3.JPG' width='500px'/>

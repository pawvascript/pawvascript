# PawvaScript

<img alt='PawvaScript Logo' src='images/pawvascript.png' width='300px'/>

## Introduction

Ever wish that JavaScript had fewer symbols and more dogs? We did, so we made PawvaScript!

PawvaScript is an object-oriented scripting language designed to make JavaScript more programmer-friendly (so friendly that your dog could learn it, probably). PawvaScript draws on many fundamentals from JavaScript but replaces confusing symbols with clear and (dog-friendly) readable terms, adds types (like TypeScript) to help with debugging, and throws in some paw-sitively awesome dog-related keywords just for fun and tail wags.

<img alt='CeCe Coding Rear View' src='images/CeCeCoding2.JPG' width='600px'/>

## Features

- Language for scripting
- Object-Oriented
  - breeds are what we call classes!
- Static typing
- Functions
  - we call them tricks!
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
<pre style="margin-left: 0; width: 100%">
woof "Hello, World!";
bark "my ball!";
howl "uh-oh";
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
leash dogName is "CeCe";
toeBeans dogAge is 12;
goodBoy isGoodBoy is good;
goodBoy isNaughtyDoggo is bad;
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let dogName = "CeCe";
let dogAge = 12;
let isGoodBoy = true;
let isNaughtyDoggo = false; 
</pre>
        </td>
    </tr>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
pack[leash] dogNames is ["CeCe", "Fluffy"];
kennel[leash:toeBeans] dogAges is ["CeCe": 1, "Fluffy": 2];
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let dogNames = ["CeCe", "Fluffy"];
let dogAges = {"CeCe": 1, "Fluffy": 2};
</pre>
        </td>
    </tr>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
toeBeans cuteness; !!! Default value is 0 !!!
cuteness is 100;
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let cuteness = 0;
cuteness = 100;
</pre>
        </td>
    </tr>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
!!! cat is the equivalent of null. !!!
!!! Any type can have the value cat !!!
leash theBestestDog is cat;
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
<br><br>
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
<pre style="margin-left: 0; width: 100%">
leash dogName is "Ce" with "Ce";
leash sentence is "![dogName] is the best dog";
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
pack[leash] goodDogs is ["CeCe", "Buster", "Muffin"];
pack[toeBeans] ages is [1, 1, 2];
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let goodDogs = ["CeCe", "Buster", "Muffin"];
let ages = [1, 1, 2];
</pre>
        </td>
    </tr>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
!!! "without" removes elements from a pack !!!
pack[leash] bestDogs is goodDogs without "Muffin";
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
<br>

let bestDogs = goodDogs.filter(dogName => dogName != "Muffin");
</pre>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
!!! "peanutButter" is the spread operator !!!
pack[leash] smallDogs is ["Tiny", "Teenie", "Boo"];
pack[leash] bigDogs is ["Boofer", "Woofer," "Mo"];
pack[leash] allDogs is [
    peanutButter smallDogs,
    peanutButter bigDogs
];
woof allDogs;
!!! ["Tiny", "Teenie", "Boo", "Boofer", "Woofer", "Mo"] !!!
</pre>
</td>
        <td>
<pre style="margin-left: 0; width: 100%">
let smallDogs = ["Tiny", "Teenie", "Boo"];
let bigDogs = ["Boofer", "Woofer", "Mo"];
let allDogs = [
    ...smallDogs,
    ...bigDogs
];
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
<pre style="margin-left: 0; width: 100%">
kennel[leash:leash] goodDogs is [
    "CeCe": "German Shepherd",
    "Buster": "Golden Doodle",
    "Mo": "Potato"
];
</pre>
<pre style="margin-left: 0; width: 100%">
kennel[leash:toeBeans] ages is ["CeCe": 1, "Buster": 1, "Mo": 5];
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let goodDogs = {
    "CeCe": "German Shepherd",
    "Buster": "Golden Doodle",
    "Mo": "Potato" 
};
</pre>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
goodBoy a is x equals y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x notEquals y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x isGreaterThan y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x isLessThan y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x isAtLeast y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x isAtMost y;
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let a = x === y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x !== y;
</pre>
<pre style="margin-left: 0; width: 100%">
let a = x > y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x < y;
</pre>
<pre style="margin-left: 0; width: 100%">
let a = x >= y;
</pre>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
toeBeans a is x + y; 
</pre>
<pre style="margin-left: 0; width: 100%">
a is x - y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x * y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x / y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x mod y;
</pre>
<pre style="margin-left: 0; width: 100%">
a is x!;
</pre>
<pre style="margin-left: 0; width: 100%">
a is -x;
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
a = x + y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x - y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x * y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x / y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x % y;
</pre>
<pre style="margin-left: 0; width: 100%">
a = x!;
</pre>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
if x isAtLeast y then:
    leash dogName is "CeCe"; 
else:
    leash dogName is "Buster";  
tail  
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
<br>
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
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
!!! I'm a one line comment !!!
</pre>
<pre style="margin-left: 0; width: 100%">
!!! I'm a
multiline
comment !!!
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
// I'm a comment
</pre>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
chase:
    woof "I run forever!";
tail
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
while (true) {
    console.log("I run forever\!");
}
</pre>
        </td>
    </tr>
</table>


<br>Fixed Loop

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
chase 5 times:
    woof "Stay.";
tail
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
chase while x isAtMost 5:
    woof x;
tail
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
chase toeBeans i is 0 by i*2 while i isLessThan 10:
    woof i; 
tail   
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
chase element through myPack:   
    woof element; 
tail    
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
trick gcd chews[toeBeans:num1, toeBeans:num2] fetches toeBeans:   
    toeBeans remainder; 
    chase while (a mod b) isGreaterThan 0:
        remainder is (a mod b); 
        a is b; 
        b is remainder;  
    tail;
    give a;
tail
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
toeBeans a is 8;
toeBeans b is 12;
toeBeans c is gcd(a, b); 
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
let a = 8;
let b = 12;
let c = gcd(a, b);
</pre>
        </td>
    </tr>
</table>

The classic Fibonacci function to get the nth term of the Fibonacci sequence:

<table>
    <th>PawvaScript</th><th>JavaScript</th>
    <tr>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
toeBeans huzzah is fib(100);  
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
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
<pre style="margin-left: 0; width: 100%">
<br>breed Owner is:   
    leash dogName; 
    trick Owner chews[leash:dogName] fetches Owner;
    <br>
    trick introduceDog:
        woof "My dog's name is " with Owner's dogName;
    tail     
    trick command fetches leash: 
        give Owner's dogName with ", stay!";
    tail
tail
<br>
Owner lucille is Owner("CeCe")  
(lucille's introduceDog)() !!! output: "My dog's name is CeCe" !!!
woof lucille's command()  !!! output: "CeCe, stay." !!!     
</pre>
        </td>
        <td>
<pre style="margin-left: 0; width: 100%">
class Owner {
    constructor(dogName) {
        this.dogName = dogName;
    } 
    introduceDog() {
        console.log(`My dog's name is ${this.dogName}`;
    }
    command() {
        return `${this.dogName}, stay!`;
    }
}
<br>
let lucille = new Owner("CeCe");
lucille.introduceDog();
console.log(lucille.command());
</pre>
        </td>
    </tr>
</table>

### Bad Boys: Semantic Errors

* The target and source of a variable declaration must have the same type.
* The target and source of an assignment statement must have the same type.
* Types and functions cannot be declared in loops.
* Variables can only be declared once in the same block.
* Conditions in if statements must be booleans.
* Conditions in loops must be booleans.
* For loop variables must evaluate to a number.
* Through loops can only be used on lists. (We hope to expand this functionality to other types soon!)
* A through loop's variable cannot be changed in the body of the loop (read-only).
* Types can only have one constructor.
* A constructor's identifier must match the identifier of the type it constructs.
* The parameters of a constructor must be fields in their type.
* A constructor can only return the breedType it is a part of.
* If a function's signature contains a return type, the function must and can only return an object of the return type.
* Functions must be called with the same number of arguments as described in the function signature.
* Each function argument must be the same type as argument in that same positiion in the function signature.
* Spreads can only be used on list members that are also lists, and the member types of the lists must be the same.
* A dictionary's keys must all have the same type and its values must also all be of the same type.
* The unary operators "-" and "!" can only be used with numbers.
* The operator "not" can only be used with booleans.
* The binary operators "-", "+", "*", and "/" can only be used with numbers on either side.
* The operators "&" and "\|" can only be used with booleans on either side.
* The operators "isGreaterThan", "isAtLeast", "isAtMost", "isLessThan", "equals", and "notEquals" can only be used with numbers and strings and the types must match on both sides.
* The operators "with" and "without" can only be used with strings and lists and the types must match on both sides.
* The "at" operator can only be used with a list on the left and numbers on the right.
* The "of" operator can only be used with a dictionary on the left and numbers on the right and the key used must match the type of the keys in the dictionary.
* Give statements can only be used in functions, methods, and loops.
* Break and continue statements can only be used in loops.

Happy PawvaScript coding! Remember: _Good Dogs only!_

<img alt='CeCe Coding Front View' src='images/CeCeCoding3.JPG' width='500px'/>

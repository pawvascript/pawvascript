# PawvaScript

<img alt='PawvaScript Logo' src='assets/pawvascript.png' width='300px'/>

## Introduction
Ever wish that JavaScript had less symbols and more dogs? We did, so we made PawvaScript!

PawvaScript is an object-oriented scripting language designed to make JavaScript more programmer-friendly. PawvaScript draws on many fundamentals from JavaScript but replaces confusing symbols with clear terms, adds types to help with debugging, and adds some dog related stuff just for fun.

## Features
* Language for scripting
* Static typing
* Loops
* Conditionals
* Lists
* Maps
* 5 types
	* string
	* boolean
	* number
	* function
	* breed (what we call objects)
* Single and multi-line comments
* No semicolons after each line
* Object-Oriented 


## Example Programs

### The Basics

```JavaScript
PAWVASCRIPT                                                       JAVASCRIPT

// Hello, World!
say "Hello, World!"                                               console.log("Hello, World!")
```

Initialize variables by barking
```
bark string dogName is "Cece"                                     let dogName = "Cece";

bark number dogAge is 12                                          let dogAge = 12;

bark boolean isCute is true                                       let isCute = true;

bark list dogNames[string] is ["Cece", "Fluffy"]                  let dogNames = ["Cece", "Fluffy"]

bark map dogAges[string:number] is ["Cece": 1, "Fluffy": 2]       let dogAges = {"Cece": 1, "Fluffy": 2} 
```

Let's loop!
```
loop 5 times:                                                     for (let i = 0; i < 4; i++) {
	say "Stay."                                              	 console.log("Stay.")
end                                                               }
```

Let's find some Fibonacci numbers!
```
bark func gcd chases[number num1, number num2] returns[number]:	  function gcd(num1, num2) {
	bark number remainder                                     var remainder;

	loop while (a mod b) is greater than 0:			  	while ( (num1 % num2) > 0) {
	remainder is (a mod b)                              	        	remainder = a % b;
		a is b                                                          a = b;	
		b is remainder                                                  b = remainder
	end					                        }
end                                                                }
```




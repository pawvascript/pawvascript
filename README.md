# PawvaScript

<img alt='PawvaScript Logo' src='assets/pawvascript.png' width='300px'/>

## Introduction
PawvaScript is a functional scripting language designed for non-conventional programmers such as designers, animators, and anyone who wants to make beautiful web pages fast. PawvaScript draws on many fundamentals from JavaScript, while adding aspects of Python such as indentation and readability. Our language is focused on extensive functionality while maintaining readability.

## Features
* Language for scripting
* Static typing
* Loops and conditionals
* Lists
* Dictionaries
* 5 types (String, Boolean, Number, Function, Object)
* Single and multi-line comments
* No semicolons after each line
* Object-Oriented 


## Example Programs

<table style="width: 100%; border: none; text-align: left">
	<th style="width: 49%; border: none; border-right: 2px solid white">PavwaScript</th><th style="width: 49%; border: none">JavaScript</th>
	<tr style="border-top: 5px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				say “Hello, World!”
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				console.log(“Hello, World!”);
		</td>
	</tr>
	<tr style="border-top: 5px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				var myList = [String]:["one", "two", "three"]
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				var myArray = ["one", "two", "three"]
		</td>
	</tr>
	<tr style="border-top: 5px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				var myDictionary = [String:String]:["a": "one", "b": "two", "c": "three"]
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				var myMap = {a: "one", b: "two", c: "three"};
		</td>
	</tr>
	<tr style="border-top: 5px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				! This is a comment<br><br>
				!! This is a lot of comments.<br>
				It is so manny comments,<br>
				that I needed all of these lines. !!
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				// This is a one line comment<br><br>
				/* This is a comment<br>
				that requires many lines<br>
				so many lines<br>
				that it's more than one. */<br>
		</td>
	</tr>
	<tr style="border-top: 5px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				function myForLoop:<br>
				&nbsp;&nbsp;&nbsp;&nbsp;var Number x = 0<br><br>
				&nbsp;&nbsp;&nbsp;&nbsp;loop by 1 until x equals 10:<br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;say x<br>
				&nbsp;&nbsp;&nbsp;&nbsp;end<br>
				end
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function myForLoop() {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;for (var x = 0; x < 10; x++ ) {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(x);<br>
				&nbsp;&nbsp;&nbsp;&nbsp;}<br>
				}
		</td>
	</tr>
	<tr style="border-top: 5px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
			function myWhileLoop:<br>
				&nbsp;&nbsp;&nbsp;&nbsp;var Number x = 0<br><br>
				&nbsp;&nbsp;&nbsp;&nbsp;loop while x is less than 10:<br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x = x + 1<br>
				&nbsp;&nbsp;&nbsp;&nbsp;end<br><br>
				&nbsp;&nbsp;&nbsp;&nbsp;say "x is 10!"<br>
				end
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function myWhileLoop() {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;var x = 0;<br><br>
				&nbsp;&nbsp;&nbsp;&nbsp;while (x < 10) {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x += 2;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;}<br>
				&nbsp;&nbsp;&nbsp;&nbsp;console.log("x is 10!")<br>
				}
		</td>
	</tr>
	<tr style="border-top: 10px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				func toDogAge returns [Number]:<br>
					&nbsp;&nbsp;&nbsp;&nbsp;var Number age is prompt “How old are you?”<br>
    				&nbsp;&nbsp;&nbsp;&nbsp;return age * 7<br>
				end
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function toDogAge() {<br>
					&nbsp;&nbsp;&nbsp;&nbsp;var age = prompt(“How old are you?”);<br>
					&nbsp;&nbsp;&nbsp;&nbsp;return age * 7;<br>
				}
		</td>
	</tr>
	<tr style="border-top: 10px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				func pugChecker uses [String:breed] and returns [String]:<br>
					&nbsp;&nbsp;&nbsp;&nbsp;if breed equals “Pug”:<br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return “You’re a Smol Pup”<br>
					&nbsp;&nbsp;&nbsp;&nbsp;else:<br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return “You’re a Big Pup”<br>
					&nbsp;&nbsp;&nbsp;&nbsp;end<br>
				end<br><br>
				pugChecker("Pug")
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function pugChecker(breed) {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;if (breed == “Pug”) {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return “You’re a Smol Pup”;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;} else {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return “You’re a Big Pup;”<br>
				&nbsp;&nbsp;&nbsp;&nbsp;}<br>
				}<br><br>
				pugChecker("Pug")
		</td>
	</tr>
	<tr style="border-top: 10px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				func createDog uses [String:given_name, Number:given_humanAge, String:given_color] and returns [Object]:<br>
				&nbsp;&nbsp;&nbsp;&nbsp;var Object dog is [name: given_name, humanAge: given_humanAge, color: given_color]<br>
				&nbsp;&nbsp;&nbsp;&nbsp;dog’s dogAge is dog's humanAge * 7<br>
				&nbsp;&nbsp;&nbsp;&nbsp;return dog<br>
				end
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function createDog(given_name, given_humanAge, given_color) {<br>
    			&nbsp;&nbsp;&nbsp;&nbsp;let dog = {name: given_name, humanAge: given_humanAge, color: given_color};<br>
    			&nbsp;&nbsp;&nbsp;&nbsp;dog.dogAge = dog.humanAge * 7;<br>
    			&nbsp;&nbsp;&nbsp;&nbsp;return dog<br>
				}
		</td>
	</tr>
	<tr style="border-top: 10px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				func gcd uses [Number:number1, Number:number2] and returns [Number] {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;if number2 equals 0:<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return number1<br>
				&nbsp;&nbsp;&nbsp;&nbsp;end<br>
				&nbsp;&nbsp;&nbsp;&nbsp;return gcd(number2, number1 mod number2)<br>
				end
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function gcd(number1, number2) {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;if (number2 == 0) {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return number1;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;}<br>
				&nbsp;&nbsp;&nbsp;&nbsp;return gcd(number2, number1 % number2);<br>
				}
		</td>
	</tr>
	<tr style="border-top: 10px solid white">
		<td style="border: none; border-right: 20px solid white; background-color: rgba(0,0,0,.05); margin:">
				func fibonacci uses [Number:number1, Number:number2] and returns [Number] {<br>
				&nbsp;&nbsp;&nbsp;&nbsp;if number2 equals 0:<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return number1<br>
				&nbsp;&nbsp;&nbsp;&nbsp;end<br>
				&nbsp;&nbsp;&nbsp;&nbsp;return gcd(number2, number1 mod number2)<br>
				end
		</td>
		<td style="border: none; background-color: rgba(0,0,0,.05)">
				function fib(n) {<br>
  				&nbsp;&nbsp;&nbsp;&nbsp;if (n < 2) {<br>
    			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return n;<br>
  				&nbsp;&nbsp;&nbsp;&nbsp;}<br>
  				&nbsp;&nbsp;&nbsp;&nbsp;return fib(n - 1) + fib (n - 2)<br>
				}
		</td>
	</tr>
</table>


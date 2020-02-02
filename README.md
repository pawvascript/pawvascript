# PawvaScript

<img alt='PawvaScript Logo' src='assets/pawvascript.png' width='300px'/>

## Introduction
PawvaScript is a functional scripting language designed for non-conventional programmers such as designers, animators, and anyone who wants to make beautiful web pages fast. PawvaScript draws on many fundamentals from JavaScript, while adding aspects of Python such as indentation and readability. Our language is focused on extensive functionality while maintaining readability.

## Features
* Language for scripting
* Static typing
* Indentation based
* Loops and conditionals
* Lists
* Dictionaries/Maps
* 5 types (String, Boolean, Number, Function, Object)
* Single and multi-line comments
* No semicolons after each line
* Object-Oriented 


## Example Programs
#### Pawvascript:
```
say “Hello World!”
```
#### Javascript:
```
console.log(“Hello, World!”);
```
#### Pawvascript:
```
func toDogAge uses [] and returns [Number]:
	var number age is prompt “How old are you?”
    return age * 7 
end
```
#### Javascript:
```
function toDogAge() {
	var age = prompt(“How old are you?”);
	return age * 7;
}
```
#### Pawvascript:
```
func pugChecker uses [String:breed] and returns [String]
	if breed equals “Pug”
		return “You’re a Smol Pup”
	else
		return “You’re a Big Pup”
	end
end

pugChecker(Pug)
```
#### Javascript:
```
function pugChecker(breed) {
	if (breed == “Pug”) {
		return “You’re a Smol Pup”;
	} else {
		return “You’re a Big Pup;”
	}
}
pugChecker(Pug)
```
#### Pawvascript:
```
func createDog uses [String:given_name, Number:given_humanAge, String:given_color] and returns [Object]:
	var Object dog is [name: given_name, humanAge: given_humanAge, color: given_color]
	dog’s dogAge is dog's humanAge * 7
	return dog
end
```
#### Javascript
```
function createDog(given_name, given_humanAge, given_color) {
    let dog = {name: given_name, humanAge: given_humanAge, color: given_color};
    dog.dogAge = dog.humanAge * 7;
    return dog
}
```

"use strict"
let view = {
	displayMessage: function(msq) {
		let messageArea = document.querySelector("#messageArea");
		messageArea.innerHTML = msq;
	},
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.classList.add("hit"); 
	},
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.classList.add("miss"); 
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
	fire: function (guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Попали!");
				if (this.isSunk(ship)) {
					view.displayMessage("Вы потопили корабль!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Вы промахнулись!");
		return false;
	},
	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		} 
		return true;
	},
};
let controller = {
	guesses: 0,
	processGuess: function(guess) {
		let location  = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit & model.shipsSunk === model.numShips) {
				view.displayMessage(`Вы потопили все корабли! Затратив на это ${this.guesses} выстрелов.`);
				table.removeEventListener("click", touch);
			}
		}
	},
	
};

function parseGuess(guess) {
	const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess.match(/[A-G][0-6]/)) {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar)
		let column = guess.charAt(1);
		return row + column;
	} else if (guess.match(/[0-6][0-6]/)) { //для тач
		return guess;
  } else {
    view.displayMessage("Введите корректное значение!");
  }
};

function init() {
	let fireButton = document.querySelector("#fireButton");
	fireButton.onclick = handleFireButton;
};

function handleFireButton() {
	let guessInput = document.querySelector("#guessInput");
	let guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
};
window.onload = init;


function touch () {
	let target = event.target;
	if (target.closest('td')) {
		console.log(target.getAttribute('id'));
		controller.processGuess(target.getAttribute("id"));
	}
}
const table = document.querySelector("table");
table.addEventListener('click', touch);

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
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
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
  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {//для каждого корабля генерируем набор занимаемых клеток
      do {
        locations = this.generateShip(); //Генерируем новый набор позиций
      } while (this.collision(locations)); //Проверка не перекрываются ли
      this.ships[i].locations = locations; //Полученные без перекрытия позиции сохраняем
    }
  },
  generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;
    if (direction === 1) {
      // horizontal
      row = Math.floor(Math.random() * this.boardSize); //Начальная позиция на игровом поле
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // vertical
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i)); //Генерируем 01 02 03 пример
      } else {
        newShipLocations.push(row + i + "" + col); //31 32 33 например
      }
    }
    return newShipLocations;
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {//для каждого корабля на поле 
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {//проверить всречается ли какая из позиций массива locations нового корабл в массиве locations сущест корабл
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;// Возврат из цикла выполн в другом цикле, прерывает оба цикла и функц возвращ true
        }
      }
    }
    return false;
  }
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
window.onload = init;

function init() {
	let fireButton = document.querySelector("#fireButton");
	fireButton.onclick = handleFireButton;
	model.generateShipLocations();
};

function handleFireButton() {
	let guessInput = document.querySelector("#guessInput");
	let guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
};



function touch () {
	let target = event.target;
	if (target.closest('td')) {
		controller.processGuess(target.getAttribute("id"));
	}
}
const table = document.querySelector("table");
table.addEventListener('click', touch);

var leafBlade = {
  name: "Leaf Blade",
  type: "Grass",
  power: 20,
  description: "A leaf attack."
}

var megaDrain = {
  name: "Mega Drain",
  type: "Grass",
  power: 10,
  description: "User gains half the HP inflicted on opponent."
}

var ember = {
  name: "Ember",
  type: "Fire",
  power: 10,
  description: "May inflict burn on opponent."
}

var heatWave = {
  name: "Heat Wave",
  type: "Fire",
  power: 20,
  description: "Burning wave of heat."
}

var bulbasaur = {
  name: "Bulbasaur",
  type: "Grass",
  hp: 120,
  attack: 60,
  defense: 80,
  speed: 40,
  moves: [leafBlade, megaDrain],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/bulbasaur.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/bulbasaur.gif",
  weakAgainst: "Fire",
  strongAgainst: "Ground"
}

var charmander = {
  name: "Charmander",
  type: "Fire",
  hp: 70,
  attack: 100,
  defense: 50,
  speed: 80,
  moves: [ember, heatWave],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/charmander.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/charmander.gif",
  weakAgainst: "Water",
  strongAgainst: "Grass"
}

var squirtle = {
  name: "Squirtle",
  type: "Water",
  hp: 80,
  attack: 60,
  defense: 100,
  speed: 60,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/squirtle.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/squirtle.gif",
  weakAgainst: "Electric",
  strongAgainst: "Fire"
}

var pikachu = {
  name: "Pikachu",
  type: "Electric",
  hp: 60,
  attack: 80,
  defense: 60,
  speed: 100,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/pikachu.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/pikachu.gif",
  weakAgainst: "Ground",
  strongAgainst: "Water"
}

var meowth = {
  name: "Meowth",
  type: "Normal",
  hp: 80,
  attack: 70,
  defense: 60,
  speed: 90,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/meowth.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/meowth.gif",
  weakAgainst: "Fighting",
  strongAgainst: "Psychic"
}

var mew = {
  name: "Mew",
  type: "Psychic",
  hp: 100,
  attack: 90,
  defense: 80,
  speed: 80,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/mew.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/mew.gif",
  weakAgainst: "Normal",
  strongAgainst: "Fighting"
}

var abra = {
  name: "Abra",
  type: "Psychic",
  hp: 100,
  attack: 80,
  defense: 90,
  speed: 80,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/abra.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/abra.gif",
  weakAgainst: "Normal",
  strongAgainst: "Fighting"
}

var jigglypuff = {
  name: "Jigglypuff",
  type: "Normal",
  hp: 120,
  attack: 40,
  defense: 80,
  speed: 60,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/jigglypuff.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/jigglypuff.gif",
  weakAgainst: "Fighting",
  strongAgainst: "Psychic"
}

var mankey = {
  name: "Mankey",
  type: "Fighting",
  hp: 70,
  attack: 120,
  defense: 50,
  speed: 60,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/mankey.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/mankey.gif",
  weakAgainst: "Psychic",
  strongAgainst: "Normal"
}

var cubone = {
  name: "Cubone",
  type: "Ground",
  hp: 60,
  attack: 90,
  defense: 110,
  speed: 40,
  moves: [],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/cubone.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/cubone.gif",
  weakAgainst: "Grass",
  strongAgainst: "Electric"
}

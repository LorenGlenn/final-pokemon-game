var activePokemon;

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

var bubble = {
  name: "Bubble",
  type: "Water",
  power: 10,
  description: "Lowers speed stat of defending Pokemon"
}

var waterfall = {
  name: "Waterfall",
  type: "Water",
  power: 20,
  description: "A powerful waterfall move"
}

var thunderwave = {
  name: "Thunder Wave",
  type: "Electric",
  power: 10,
  description: "An electric charge that paralyzes the opponent."
}

var electroball = {
  name: "Electroball",
  type: "Electric",
  power: 20,
  description: "A strong electric energy ball that is thrown at the opponent."
}

var screech = {
  name: "Screech",
  type: "Normal",
  power: 10,
  description: "A harsh scream that lowers the opponents defense."
}

var payday = {
  name: "Pay Day",
  type: "Normal",
  power: 20,
  description: "Meowth's signature attack that deals damage."
}

var psychic = {
  name: "Psychic",
  type: "Psychic",
  power: 20,
  description: "Deals strong psychic damage to the opponent"
}

var barrier = {
  name: "Barrier",
  type: "Psychic",
  power: 0,
  description: "Greatly increases defense stat"
}

var psyshock = {
  name: "Barrier",
  type: "Psychic",
  power: 20,
  description: "Powerful psychic attack"
}

var torment = {
  name: "Torment",
  type: "Psychic",
  power: 10,
  description: "Lowers target's attack stat"
}

var sing = {
  name: "Sing",
  type: "Normal",
  power: 10,
  description: "Puts opponent to sleep"
}

var rollout = {
  name: "Rollout",
  type: "Normal",
  power: 20,
  description: "Attack move that deals heavy damage"
}

var karatechop = {
  name: "Karate Chop",
  type: "Fighting",
  power: 20,
  description: "Attack move that deals damage"
}

var closecombat = {
  name: "Close Combat",
  type: "Fighting",
  power: 30,
  description: "Deals very heavy damage but user hurts self"
}

var bonerush = {
  name: "Bone Rush",
  type: "Ground",
  power: 10,
  description: "Increases user speed and deals small amount of damage"
}

var earthquake = {
  name: "Earthquake",
  type: "Ground",
  power: 20,
  description: "Ground move that deals heavy damage to opponent"
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
  moves: [bubble, waterfall],
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
  moves: [thunderwave, electroball],
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
  moves: [screech, payday],
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
  moves: [psychic, barrier],
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
  moves: [psyshock, torment],
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
  moves: [sing, rollout],
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
  moves: [karatechop, closecombat],
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
  moves: [bonerush, earthquake],
  backSprite: "http://www.pokestadium.com/sprites/xy/back/cubone.gif",
  frontSprite: "http://www.pokestadium.com/sprites/xy/cubone.gif",
  weakAgainst: "Grass",
  strongAgainst: "Electric"
}

var Player1 = {
  pokemons : [],
  turn:0
}

var Player2 = {
  pokemons :[],
  turn:0

}
var Game = {
  currentTurn:-1
}

$(function() {
  activePokemon="cubone";
  var p1SelectedPokemons=0;
  var p2SelectedPokemons=0;
  $("#pokeSelector img").click(function(){
    activePokemon=eval($(this).attr("id"));
  });

  $(".icon").click(function(){
    // console.log(activePokemon);
    // console.log(activePokemon.name);
    $("#activePokemon").html("<img src='" + activePokemon.frontSprite + "'>");
    $("#pokemonName").html(activePokemon.name);
    $("#hp").html(activePokemon.hp);
    $("#attack").html(activePokemon.attack);
    $("#defense").html(activePokemon.defense);
    $("#speed").html(activePokemon.speed);
    $("#weakness").html(activePokemon.weakAgainst);
    $("#resistance").html(activePokemon.strongAgainst);
    $("#moves").empty();
    activePokemon.moves.forEach(function(move) {
      $("#moves").append("<li>" + move.name + "</li>")
    })
  })


})

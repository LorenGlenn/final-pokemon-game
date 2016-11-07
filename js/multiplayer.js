var uuid = PUBNUB.uuid();
var turn=1;
var mySign = '1';
function getGameId(){ //Generate game ID
    if(window.location.search.substring(1).split('?')[0].split('=')[0] !== 'id') {
      return null;
    } else {
      return window.location.search.substring(1).split('?')[0].split('=')[1];
    }
  }


$(function() {
// Initialize variables
  var gameId =  $('#gameId');
  var gameIdQuery = $('#gameIdQuery');
  var output = $('#output');
  var whosTurn = $('#whosTurn');
  var gameid = '';
  var rand = (Math.random() * 9999).toFixed(0);
  gameid = (getGameId()) ? getGameId() : rand;
  $('#gameid').text(gameid);
  var channel = 'pokebattle--'+ gameid;
  var pubnub = PUBNUB.init({
      subscribe_key: 'sub-c-ffc4b4e4-a451-11e6-9fcd-0619f8945a4f',
      publish_key: 'pub-c-943a6772-fe6e-435b-a3d1-78ad3ddd1d65',
      uuid: uuid
  });


  // Button action to go to opponent's url
  $("#enterGameButton").click(function(event){
    if($("#inputGameId").val()){
      // var opponentUrl = 'http://LorenGlenn.github.io/final-pokemon-game/index.html?id=' + $("#inputGameId").val();
      var opponentUrl = 'file:///Users/Guest/Desktop/final-pokemon-game/index.html?id=' + $("#inputGameId").val();
      window.location.href=opponentUrl;
      return false;
    }
    else{
      event.preventDefault();
    }
  });

  // add pokemons
  $("#addPokemon").click(function(){
    console.log(("#"+activePokemon.name))
    $(("#"+activePokemon.name).toLowerCase()).addClass("disabled");
    set();

  });

  pubnub.subscribe({
     channel: channel,
     connect: function(){console.log("connected")},
     presence: function(m) {
       console.log(m);

       if(m.uuid === uuid && m.action === 'join') {
          if(m.occupancy < 2) {
            // modal to select new Game or join host
            $('#myModal').modal({
              backdrop: 'static',
              keyboard: false
            });

            $("#whosTurn").text('Waiting for your opponent...');
          } else if(m.occupancy === 2) {
            mySign = '2';
          } else if (m.occupancy > 2) {
            alert('This game already have two players!');
            $("#pokeSelector").addClass("disabled");
          }
        }

       if(m.occupancy === 2) {
         $("#pokeSelector").removeClass("disabled");
         console.log("Start the game!")
         startNewGame(mySign);
       }
       $('#player').text(mySign);
       // Presence Stuff
       if(document.querySelector('.presence')) {
         showPresenceExamples(m);
       }

     },
     callback: function(m) {
       if(Game.state=="Menu"){
         changeTurn(m.player);
         (turn==1) ? Player1.turn++ : Player2.turn++;
         $("#player1Turn").text(Player1.turn);
         $("#player2Turn").text(Player2.turn);
         if(Game.currentTurn>1){
           console.log("received " + m.pokemon.name)
           $(("#"+m.pokemon.name).toLowerCase()).addClass("disabled");
           (m.pokemon) ? eval("Player"+turn).pokemons.push(m.pokemon): console.log("got squat");
           (Game.currentTurn>1 && turn==1) ? $("#selectedPokemonsP"+turn).append("<img src='" + eval(eval("Player"+turn).pokemons[Player1.turn-2]).frontSprite + "'>") : console.log("wont append the pokemon1");
           (Game.currentTurn>1 && turn==2) ? $("#selectedPokemonsP"+turn).append("<img src='" + eval(eval("Player"+turn).pokemons[Player2.turn-2]).frontSprite + "'>") : console.log("wont append the pokemon2");
           if(Player1.pokemons.length == 3 ) {
             $("#battleReadyP1").removeClass("btn-primary");
             $("#battleReadyP1").addClass("btn-success");
             checkReady();
           }
           if(Player2.pokemons.length == 3 ) {
             $("#pokeSelector").addClass("disabled");
             $("#battleReadyP2").removeClass("btn-primary");
             $("#battleReadyP2").addClass("btn-success");
             checkReady();
           }
          }
        }
      if(Game.state=="Battle"){
        displaySprite(0);

        Game.state="Done";
      }
    },
   });

function displaySprite(index){
  $("#Player"+mySign+"Fighter").append("<img src='" + eval("Player"+mySign).pokemons[index].backSprite + "'>")
}

 function publishPosition(player,pokemonChosen) {
   pubnub.publish({
     channel: channel,
     message: {player: player, pokemon: pokemonChosen},
     callback: function(m){
       console.log(m);
     }
   });
  }
  function set() {
    if (turn !== mySign) return;
    publishPosition(mySign,activePokemon);

  }
  function startNewGame(mySign){
    turn =1;
    console.log("Starting new game!")
    console.log("My sign is: "+mySign)
    publishPosition(mySign);
  }

  function changeTurn(player) {
      Game.currentTurn++;
      turn = (turn === '1') ? '2' : '1';
      console.log("changing turns, "+ turn);
      $("#whosTurn").text((turn === mySign) ? 'Your turn' : 'Your opponent\'s turn');
      (turn==mySign) ? $("#pokeSelector").removeClass("disabled") : $("#pokeSelector").addClass("disabled");
      $("#currentTurn").text(Game.currentTurn);
    }

    function checkReady(){
      if($('#battleReadyP1').hasClass("btn-success") && $('#battleReadyP2').hasClass("btn-success")) {
        $('#pokeSelector').hide();
        Game.state="Battle";
      }
    }

})

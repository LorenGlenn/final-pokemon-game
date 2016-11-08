var uuid = PUBNUB.uuid();
var turn=2;
var mySign = '2';
var playerNumber='2';
var battleTurn =1;
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
            mySign = '1';
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
       (mySign==1)? $('#player').text("2"):$('#player').text("1");
       (mySign==1)? playerNumber=2:playerNumber=1;
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
           if(Player1.pokemons.length == 1 ) {
             $("#battleReadyP1").removeClass("btn-primary");
             $("#battleReadyP1").addClass("btn-success");
             checkReady();
           }
           if(Player2.pokemons.length == 1) {
             $("#pokeSelector").addClass("disabled");
             $("#battleReadyP2").removeClass("btn-primary");
             $("#battleReadyP2").addClass("btn-success");
             checkReady();
           }
          }
        }
      if(Game.state=="Battle"){
        displaySprite(0);
        var roundBegin = false;
        $(".attack").click(function(){
          eval("Player"+playerNumber).currentAction = $(this).val();
          if (Player1.currentAction !== false && Player2.currentAction !== false) {
             roundBegin = true;
          }
        });
        if (roundBegin){
          console.log("Round begins!")

          if(parseInt(eval("Player"+playerNumber).currentAction)){
            eval("Player"+playerNumber).currentPokemon = parseInt(eval("Player"+playerNumber).currentAction);
            eval("Player"+playerNumber).currentAction = "skip";
            displaySprite(eval("Player"+playerNumber).currentPokemon);
          }
          else{
            if(Player2.pokemons[Player2.currentPokemon].speed > Player1.pokemons[Player1.currentPokemon].speed){
              battleTurn=2;
              attack(Player2.currentAction);
              attack(Player1.currentAction);
            }else{
              battleTurn=1;
              attack(Player1.currentAction);
              attack(Player2.currentAction);
            }
        }
          eval("Player"+playerNumber).currentAction = "";

        }

        Game.state="Done";
      }
    },
   });


function attack(attackName){
  if(eval("Player"+playerNumber).currentAction !=="skip"){
    var attacker= (Player1.isPlayerTurn) ? (Player1.pokemons[Player1.currentPokemon]) : (Player2.pokemons[Player2.currentPokemon])
    var defender= (Player1.isPlayerTurn) ? (Player2.pokemons[Player2.currentPokemon]) : (Player1.pokemons[Player1.currentPokemon])
    var damage = ((attacker.attack + eval(attackName).power) - defender.defense);
    console.log("attacker is: "+attacker + " Defender is: "+ defender);
    if(attacker.type == defender.weakAgainst){
      damage *= 2;
    } else if (attackName.type == defender.strongAgainst){
      damage *= .5;
    }
    defender.hp -= damage;
  }
}

function displaySprite(index){

  eval("Player"+playerNumber).currentPokemon = index;
<<<<<<< HEAD
  $("#Player1Fighter").append("<img src='" + eval("Player"+playerNumber).pokemons[index].backSprite + "'><br>");

=======
  $("#Player1Fighter").append("<img src='" + eval("Player"+playerNumber).pokemons[index].backSprite + "' width='150px'><br>");
  $("#Player2Fighter").append("<img src='" + eval("Player"+mySign).pokemons[index].frontSprite + "' width='90px'><br>");
>>>>>>> ad45b59a14dd1fb092e254272640961e7c1c39c7
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
      if(Player1.isPlayerTurn) {
        Player1.isPlayerTurn = false;
        Player2.isPlayerTurn = true;
      } else {
        Player2.isPlayerTurn = false;
        Player1.isPlayerTurn = true;
      }
    }

    function checkReady(){
      if($('#battleReadyP1').hasClass("btn-success") && $('#battleReadyP2').hasClass("btn-success")) {
        $('#container').hide();
        $("#battleContainer").show();
        Game.state="Battle";
      }
    }

})

var uuid = PUBNUB.uuid();
var turn=2;
var mySign = '2';
var playerNumber='2';
var battleTurn =1;
var P1damage;
var P2damage;
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
    $(("#"+activePokemon.name).toLowerCase()).addClass("disabled");
    set();

  });

  $(".attack").click(function(){
    var battleTurn=1;
    var newPokemon;
    $("#startAttack").removeClass("disabled");
    eval("Player"+playerNumber).currentAction = $(this).attr("value");
    if(parseInt(eval("Player"+playerNumber).currentAction)+1){
      newPokemon = parseInt(eval("Player"+playerNumber).currentAction);
      eval("Player"+playerNumber).currentAction = "skip";
    }
    else{ // get battleTurn
      if(Player2.pokemons[Player2.currentPokemon].speed > Player1.pokemons[Player1.currentPokemon].speed){
        battleTurn=2;
      }else{
        battleTurn=1;
      }
      if(eval("Player"+playerNumber).currentAction !=="skip"){  // get damage
        var attacker= (Player1.isPlayerTurn) ? (Player1.pokemons[Player1.currentPokemon]) : (Player2.pokemons[Player2.currentPokemon])
        var defender= (Player1.isPlayerTurn) ? (Player2.pokemons[Player2.currentPokemon]) : (Player1.pokemons[Player1.currentPokemon])
        var damage = ((attacker.attack + eval(eval("Player"+playerNumber).currentAction).power) - defender.defense);
        if(attacker.type == defender.weakAgainst){
          damage *= 2;
        } else if (attacker.type == defender.strongAgainst){
          damage *= .5;
        }
      }
    }
    var tmpStatusEffect="Burn";
    publishAttack(playerNumber, newPokemon, battleTurn, damage, tmpStatusEffect);
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
           $(("#"+m.pokemon.name).toLowerCase()).addClass("disabled");

           (m.pokemon) ? eval("Player"+turn).pokemons.push(m.pokemon): console.log("got squat");

           (Game.currentTurn>1 && turn==1) ? $("#selectedPokemonsP"+turn).append("<img src='" + eval(eval("Player"+turn).pokemons[Player1.turn-2]).frontSprite + "'>") : console.log("wont append the pokemon1");
           (Game.currentTurn>1 && turn==2) ? $("#selectedPokemonsP"+turn).append("<img src='" + eval(eval("Player"+turn).pokemons[Player2.turn-2]).frontSprite + "'>") : console.log("wont append the pokemon2");
           if(Player1.pokemons.length == 3 ) {
             $("#battleReadyP1").removeClass("btn-primary");
             $("#battleReadyP1").addClass("btn-success");
             checkReady();
           }
           if(Player2.pokemons.length == 3) {
             $("#pokeSelector").addClass("disabled");
             $("#battleReadyP2").removeClass("btn-primary");
             $("#battleReadyP2").addClass("btn-success");
             checkReady();
           }
          }
        }
        console.log("Player: "+m.player + " changing pokemon to: " + m.pokemonChange + " damage: "+ m.damage + " statusEffect: "+ m.statusEffect);
        (m.player===1) ? P1damage=m.damage : P2damage=m.damage;
        if(!P1damage){
          P1damage=0;
        }
        if(!P2damage){
          P2damage=0;
        }
        Game.player1Attack=P1damage;
        Game.player2Attack=P2damage;

        if(m.player===1 && m.pokemonChange+1) {
          Player1.currentPokemon = m.pokemonChange;
          Game.player1Attack = 1;
        }

        if (m.player===2 && m.pokemonChange+1)
        {
          Player2.currentPokemon = m.pokemonChange;
          Game.player2Attack = 1;
        }
        // console.log("new message1 player: "+ m.player +" pokemonIndex: "+ m.pokemonChange +" damage: "+ m.damage + " status: " +m.statusEffect + " battleTurn "+ m.battleTurn)
      if(m.GameStatus=="Attacking"){
        console.log("attacking on both screens")
        if(eval("Player"+playerNumber).currentAction=="skip"){
          displaySprite(eval("Player"+playerNumber).currentPokemon);
        }
        publishReset();
      }
      if(Game.state=="Battle"){
        console.log("Test2"+eval("Player"+playerNumber).currentPokemon)
        displaySprite(0);
        var roundBegin = false;
        $("#startAttack").click(function(){
          if(Game.player1Attack!== 0 && Game.player2Attack!== 0){
            beginAttack();
            // console.log("Attacking!");
            //
            // else{
            //   console.log("computing attack")
            //   if(Player2.pokemons[Player2.currentPokemon].speed > Player1.pokemons[Player1.currentPokemon].speed){
            //     Player2.pokemons[Player2.currentPokemon].hp -= Game.player1Attack;
            //     // pokemonDeathCheck();
            //     // playerWinCheck();
            //   }else {
            //     Player1.pokemons[Player1.currentPokemon].hp -= Game.player2Attack;
            //     // pokemonDeathCheck();
            //     // playerWinCheck();
            //   }
            //}


          }

        });
          eval("Player"+playerNumber).currentAction = "";

        Game.state="Done";
      }
      if(m.reset=="Reset"){
        Game.player1Attack= 0;
        Game.player2Attack= 0;
        P1damage=0;
        P2damage=0;
      }
    },
   });


function displaySprite(index1){

  eval("Player"+playerNumber).currentPokemon = index1;
  $("#Player1Fighter").html("<img src='" + eval("Player"+playerNumber).pokemons[index1].backSprite + "' width='150px'><br>");
  $("#Player2Fighter").html("<img src='" + eval("Player"+mySign).pokemons[index1].frontSprite + "' width='90px'><br>");

  $("#Pokemon1Name").html(eval("Player"+playerNumber).pokemons[index1].name);
  $("#Pokemon2Name").html(eval("Player"+mySign).pokemons[index1].name);

  var hpToPercent = function(hp, maxHP) {
    return (hp / maxHP) * 100;
  }

  hpToPercent()

  // $(".pokemon1HP").html(eval("Player"+playerNumber).pokemons[index1].hp + " HP");
  // $(".pokemon2HP").html(eval("Player"+mySign).pokemons[index1].hp + " HP");
  $(".move1Name").html(eval("Player"+playerNumber).pokemons[index1].moves[0].name);
  $("#move1").attr("value",eval("Player"+playerNumber).pokemons[index1].moves[0].name.toLowerCase().replace(" ",""));
  $(".move2Name").html(eval("Player"+playerNumber).pokemons[index1].moves[1].name);
  $("#move2").attr("value",eval("Player"+playerNumber).pokemons[index1].moves[1].name.toLowerCase().replace(" ",""));

  $(".move1Description").html(eval("Player"+playerNumber).pokemons[index1].moves[0].description);
  $(".move2Description").html(eval("Player"+playerNumber).pokemons[index1].moves[1].description);

  $(".move1Power").html(eval("Player"+playerNumber).pokemons[index1].moves[0].power);
  $(".move2Power").html(eval("Player"+playerNumber).pokemons[index1].moves[1].power);

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
  function beginAttack(player,pokemonChosen) {
    pubnub.publish({
      channel: channel,
      message: {GameStatus: "Attacking"},
      callback: function(m){
        console.log(m);
      }
    });
   }

 function publishReset(player,pokemonChosen) {
   pubnub.publish({
     channel: channel,
     message: {reset:"Reset"},
     callback: function(m){
       console.log(m);
     }
   });
  }
  function publishAttack(player,pokemonChange,battleTurn,damage,statusEffect) {
    pubnub.publish({
      channel: channel,
      message: {player: player, pokemonChange: pokemonChange, battleTurn: battleTurn, damage: damage, statusEffect: statusEffect},
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

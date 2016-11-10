var uuid = PUBNUB.uuid();
var turn=2;
var mySign = '2';
var playerNumber='2';
var rdy1=0;
var rdy2=0;
var attackHack=0;
var health1=[0,0,0];
var health2=[0,0,0];

function megaDrain(player,damage){
  eval("Player"+player).pokemons[eval("Player"+player).currentPokemon].hp+=damage*2;
  eval("Player"+player).status="MegaDrain"
  eval("Player"+player).statusTurns=1;
}

function clear(player){
  eval("Player"+player).status=""
}
function ember(player,damage){
  eval("Player"+player).pokemons[eval("Player"+player).currentPokemon].hp-=damage*.1;
  eval("Player"+player).status="Ember"
  eval("Player"+player).statusTurns=4;
}
function sleep(player){
  eval("Player"+player).status="Sleep"
  eval("Player"+player).statusTurns=4;
}
function barrier(player){
  eval("Player"+player).pokemons[eval("Player"+player).currentPokemon].defense*=2;
  eval("Player"+player).status="Barrier"
  eval("Player"+player).statusTurns=2;
}
function closeCombat(player,damage){
  eval("Player"+player).pokemons[eval("Player"+player).currentPokemon].hp-=damage*.3;
  eval("Player"+player).status="Close Combat"
  eval("Player"+player).statusTurns=1;
}


function getGameId(){ //Generate game ID
    if(window.location.search.substring(1).split('?')[0].split('=')[0] !== 'id') {
      return null;
    } else {
      return window.location.search.substring(1).split('?')[0].split('=')[1];
    }
  }

function updateHealths(){
  for(i=0;i<3;i++){
    if(Player1.pokemons[i].hp<health1[i]){
      health1[i]=Player1.pokemons[i].hp;
      Player1.pokemons[i].hp=health1[i];
    }else{
      Player1.pokemons[i].hp=health1[i];
    }
    if(Player2.pokemons[i].hp<health2[i]){
      health2[i]=Player2.pokemons[i].hp;
      Player2.pokemons[i].hp=health2[i];
    }else{
      Player2.pokemons[i].hp=health2[i];
    }
  }
}
$(function() {
// Initialize variables
  var gameId =  $('#gameId');
  var gameIdQuery = $('#gameIdQuery');
  var output = $('#output');
  var whosTurn = $('#whosTurn');
  var gameid = '';
  var rand = (Math.random() * 99).toFixed(0);
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
      // var opponentUrl = 'file:///Users/Guest/Desktop/final-pokemon-game/index.html?id=' + $("#inputGameId").val();
      // var opponentUrl = 'file:///C:/Users/main/Desktop/pokebattle/index.html?id=' + $("#inputGameId").val();

      window.location.href=opponentUrl;
      return false;
    }
    else{
      event.preventDefault();
    }
  });

  // add pokemons
  $("#addPokemon").click(function(){
    $("#addPokemon").addClass("notReadyButton");
    $(("#"+activePokemon.name).toLowerCase()).addClass("disabled");
    set();
    activePokemon = "";
  });

  $(".attack").click(function(){
    var newPokemon;
    //classes stuff
    $(".attack").removeClass("selection");
    $(this).addClass("selection");
    $("#startAttack").removeClass("disabled");

    eval("Player"+playerNumber).currentAction = $(this).attr("value");


    if(parseInt(eval("Player"+playerNumber).currentAction)<3){
      newPokemon = parseInt(eval("Player"+playerNumber).currentAction);
      damage=0;
    }
    else{
        newPokemon=parseInt(eval("Player"+playerNumber).currentPokemon);
        var attacker= (playerNumber == 1) ? (Player1.pokemons[Player1.currentPokemon]) : (Player2.pokemons[Player2.currentPokemon])
        var defender= (playerNumber == 1) ? (Player2.pokemons[Player2.currentPokemon]) : (Player1.pokemons[Player1.currentPokemon])
        var damage = ((attacker.attack + eval(eval("Player"+playerNumber).currentAction).power) - defender.defense);
        if(attacker.type == defender.weakAgainst){
          damage *= 1.5;
        } else if (attacker.type == defender.strongAgainst){
          damage *= .5;
        }
      }
    var tmpStatusEffect="Burn";
    console.log("info::: "+ newPokemon + " :: "+ damage)
    publishSelection(playerNumber, newPokemon, damage, tmpStatusEffect, eval("Player"+playerNumber).currentAction);
  });
  $("#startAttack").click(function(){

    publishReady(playerNumber);
    // console.log("p"+playerNumber+" newPokemon is: "+eval("Player"+playerNumber).nextPokemon + " damage is: "+eval("Player"+playerNumber).damageOutput );
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
            $("#pokeSelector").addClass("disabled");
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

           (Game.currentTurn>1 && turn==1) ? $("#selectedPokemonsP"+turn).append("<img src='" + eval(eval("Player"+turn).pokemons[Player1.turn-2]).frontSprite + "'>") : console.log("");
           (Game.currentTurn>1 && turn==2) ? $("#selectedPokemonsP"+turn).append("<img src='" + eval(eval("Player"+turn).pokemons[Player2.turn-2]).frontSprite + "'>") : console.log("");
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

        //Storing variables with each click on attack name or pokemon
        if(m.player==1 && m.pokemonChange<3){
          Player1.nextPokemon=m.pokemonChange;
          Player1.currentPokemon=Player1.nextPokemon;
          Player1.currentAction=m.action;
        }
        if(m.player==1 && m.damage){
          Player1.currentAction=m.action;
          Player1.damageOutput=m.damage;
        }
        if(m.player==2 && m.pokemonChange<3){
          Player2.nextPokemon=m.pokemonChange;
          Player2.currentPokemon=Player2.nextPokemon;
          Player2.currentAction=m.action;
        }
        if(m.player==2 && m.damage){
          Player2.damageOutput=m.damage;
          Player2.currentAction=m.action;
        }
        if(m.playerReady==1){

          $("#p1status").removeClass("notReady");
          $("#p1status").addClass("ready");
          rdy1=1;
        }
        else if (m.playerReady==2) {
          $("#p2status").removeClass("notReady");
          $("#p2status").addClass("ready");
          rdy2=1;
        }

        if(rdy1==1 && rdy2==1){

          if(Player1.currentAction<3 && Player2.currentAction<3){
            $("#battleOutput1").html("Player 1 switched to "+ Player1.pokemons[Player1.currentAction].name)
            $("#battleOutput1").fadeIn().delay(1500).fadeOut();
            $("#battleOutput2").html("Player 2 switched to "+ Player2.pokemons[Player2.currentAction].name)
            $("#battleOutput2").fadeIn().delay(1500).fadeOut();
          }
          if((Player1.currentAction<3) && !(Player2.currentAction<3)){
            $("#battleOutput1").html("Player 1 switched to "+ Player1.pokemons[Player1.currentAction].name)
            $("#battleOutput1").fadeIn().delay(1500).fadeOut();
            $("#battleOutput2").html(Player2.pokemons[Player2.currentPokemon].name + " used " + Player2.currentAction);
            $("#battleOutput2").fadeIn().delay(1500).fadeOut();
          }
          if(!(Player1.currentAction<3) && (Player2.currentAction<3)){
            $("#battleOutput1").html(Player1.pokemons[Player1.currentPokemon].name + " used " + Player1.currentAction);
            $("#battleOutput1").fadeIn().delay(1500).fadeOut();
            $("#battleOutput2").html("Player 2 switched to "+ Player2.pokemons[Player2.currentAction].name)
            $("#battleOutput2").fadeIn().delay(1500).fadeOut();
          }
          if(!(Player1.currentAction<3) && !(Player2.currentAction<3)){
            $("#battleOutput1").html(Player1.pokemons[Player1.currentPokemon].name + " used " + Player1.currentAction);
            $("#battleOutput1").fadeIn().delay(1500).fadeOut();
            $("#battleOutput2").html(Player2.pokemons[Player2.currentPokemon].name + " used " + Player2.currentAction);
            $("#battleOutput2").fadeIn().delay(1500).fadeOut();
          }
          rdy1=0;
          rdy2=0;
          beginAttack()
          attackHack=0;
        }
        if(m.loserPlayer==1){
          (playerNumber==1) ? $("#lose").show():$("#win").show();
        }
        else if(m.loserPlayer==2){
          (playerNumber==2) ? $("#lose").show():$("#win").show();
        }
        if(m.GameStatus=="Attacking"){
        if(attackHack==0){
          console.log("attacking on both screens")
          console.log("player next: "+ eval("Player"+playerNumber).nextPokemon+ " damage: "+eval("Player"+playerNumber).damageOutput)
          if((Player1.nextPokemon!==99 && Player1.damageOutput<1) && (Player2.nextPokemon!==99 && Player2.damageOutput<1)){ //both switch
            displaySprite(eval("Player"+playerNumber).nextPokemon,eval("Player"+mySign).nextPokemon);
          }

          else{
            //debugger;
            if(Player2.pokemons[Player2.currentPokemon].speed > Player1.pokemons[Player1.currentPokemon].speed){
              Player1.pokemons[Player1.currentPokemon].hp -= Player2.damageOutput;
              checkWin();
              Player2.pokemons[Player2.currentPokemon].hp -= Player1.damageOutput;
            }else {
              Player2.pokemons[Player2.currentPokemon].hp -= Player1.damageOutput;
              checkWin();
              Player1.pokemons[Player1.currentPokemon].hp -= Player2.damageOutput;
            }
            updateHealths();
            if(Player1.damageOutput>0){
              if(Player2.pokemons[Player2.currentPokemon].hp <= 0 ){
                (playerNumber==2) ? $("#pokemonOption" + (Player2.currentPokemon +1) + " img").addClass("dead"): console.log("test");
                console.log("he dead p2: " + Player2.currentPokemon);
                for(i=0;i<3;i++){
                  if(Player2.pokemons[i].hp>0){
                    Player2.nextPokemon=i;
                    Player2.currentPokemon = i;
                    break;
                  }
                };
              }
              displaySprite(eval("Player"+playerNumber).nextPokemon,eval("Player"+mySign).nextPokemon);
            }
            if(Player2.damageOutput>0){
              if(Player1.pokemons[Player1.currentPokemon].hp <= 0 ){
                (playerNumber==1) ? $("#pokemonOption" + (Player1.currentPokemon +1) + " img").addClass("dead"): console.log("test");
                console.log("he dead p1: " + Player1.currentPokemon);
                for(i=0;i<3;i++){
                  if(Player1.pokemons[i].hp>0){
                    Player1.nextPokemon=i;
                    Player1.currentPokemon = i;
                    break;
                  }
                };
              }
              displaySprite(eval("Player"+playerNumber).nextPokemon,eval("Player"+mySign).nextPokemon);
            }

            if(Player1.currentAction=="megadrain"){megaDrain(1,Player1.damageOutput);}
            if(Player2.currentAction=="megadrain"){megaDrain(2,Player2.damageOutput);}
            if(Player1.currentAction=="closecombat"){closeCombat(1,Player1.damageOutput);}
            if(Player2.currentAction=="closecombat"){closeCombat(2,Player2.damageOutput);}


              displaySprite(eval("Player"+playerNumber).nextPokemon,eval("Player"+mySign).nextPokemon);
          //  updateHealths();

          }
        }
        // displaySprite(eval("Player"+playerNumber).currentPokemon);
        attackHack++;
        checkWin();
         Game.state="Reset";
      }
      if(Game.state=="Battle"){
        $("#hidingAudio").html("<audio autoplay> <source src='battlemusic.mp3' type='audio/mpeg' loop='loop'></audio>");
        $("#pokeBall").show();
        $("#pokeTop").animate({top: '-1000px'}, 1500);
        $("#pokeBottom").animate({bottom: '-1000px'}, 1500);
        //Initialize battle
        // change the active pokemons
        $("#pokemonOption1").html("<img src="+eval("Player"+playerNumber).pokemons[0].frontSprite+ ">")
        $("#pokemonOption2").html("<img src="+eval("Player"+playerNumber).pokemons[1].frontSprite+ ">")
        $("#pokemonOption3").html("<img src="+eval("Player"+playerNumber).pokemons[2].frontSprite+ ">")
        for(i=0;i<3;i++){
          health1[i]=Player1.pokemons[i].hp;
          health2[i]=Player2.pokemons[i].hp;
        }
        displaySprite(0,0);
        Game.state="Done";
      }
      if(Game.state=="Reset"){
        $("#startAttack").addClass("disabled");
        $(".attack").removeClass("selection");
        $("#p1status").removeClass("ready");
        $("#p2status").removeClass("ready");
        $("#p1status").addClass("notReady");
        $("#p2status").addClass("notReady");
        console.log("!!!!!!RESETTING!!!!!!! "+playerNumber )
        Game.player1Attack= 0;
        Game.player2Attack= 0;
        Game.state="Done";
        Player1.nextPokemon=99;
        Player1.damageOutput=0;
        Player2.nextPokemon=99;
        Player2.damageOutput=0;

      }
    },
   });

function checkWin() {
  var p1DeathCount = 0;
  for(i=0;i<=2; i++) {
    if(Player1.pokemons[i].hp <= 0){
      p1DeathCount++;
      if(p1DeathCount == 3){
        console.log("P1 you lose :(")
        publishLoser("1");
      }
    }
  }
  var p2DeathCount = 0;
  for (i=0;i<=2; i++) {
    if(Player2.pokemons[i].hp <= 0){
      p2DeathCount++;
      if(p2DeathCount == 3){
        console.log("P2 you lose :(")
        publishLoser("2");
      }
    }
  }
}

function displaySprite(index1,index2){
  // $("#player1Status").html(eval("Player"+playerNumber).status);
  // $("#player2Status").html(eval("Player"+mySign).status);

  $(".attack").removeClass("disabled");
  if(index1==0 && playerNumber==1){
    $("#pokemonOption1").addClass("disabled")
  }
  else if (index1==1 && playerNumber==1) {
    $("#pokemonOption2").addClass("disabled")
  }
  else if (index1==2 && playerNumber==1) {
    $("#pokemonOption3").addClass("disabled")
  }
  if(index1==0 && playerNumber==2){
    $("#pokemonOption1").addClass("disabled")
  }
  else if (index1==1 && playerNumber==2) {
    $("#pokemonOption2").addClass("disabled")
  }
  else if (index1==2 && playerNumber==2) {
    $("#pokemonOption3").addClass("disabled")
  }

  $("#Player1Fighter").html("<img src='" + eval("Player"+playerNumber).pokemons[index1].backSprite + "' width='150px'><br>");
  $("#Player2Fighter").html("<img src='" + eval("Player"+mySign).pokemons[index2].frontSprite + "' width='90px'><br>");

  $("#Pokemon1Name").html(eval("Player"+playerNumber).pokemons[index1].name);
  $("#Pokemon2Name").html(eval("Player"+mySign).pokemons[index2].name);

  $("#pk1MaxHp").html(eval(eval("Player"+playerNumber).pokemons[index1].name.toLowerCase()).hp);
  $("#pk2MaxHp").html(eval(eval("Player"+mySign).pokemons[index2].name.toLowerCase()).hp);
  $("#pk1Hp").html(eval("Player"+playerNumber).pokemons[index1].hp);
  $("#pk2Hp").html(eval("Player"+mySign).pokemons[index2].hp);
  var hpPercent1= (eval("Player"+playerNumber).pokemons[index1].hp/(eval(eval("Player"+playerNumber).pokemons[index1].name.toLowerCase()).hp) * 100);

  var hpPercent2= (eval("Player"+mySign).pokemons[index2].hp/(eval(eval("Player"+mySign).pokemons[index2].name.toLowerCase()).hp) * 100);
  console.log("!!!!!!!!!!!!!"+hpPercent1)

  if(hpPercent1<50){
    $(".pokemon1HP").removeClass("progress-bar-success")
    $(".pokemon1HP").addClass("progress-bar-warning")
  }
  else{
    $(".pokemon1HP").addClass("progress-bar-success")
    $(".pokemon1HP").removeClass("progress-bar-warning")
    $(".pokemon1HP").removeClass("progress-bar-danger")
  }
  if(hpPercent2<50){
    $(".pokemon2HP").removeClass("progress-bar-success")
    $(".pokemon2HP").addClass("progress-bar-warning")
  }
  else{
    $(".pokemon2HP").addClass("progress-bar-success")
    $(".pokemon2HP").removeClass("progress-bar-warning")
    $(".pokemon2HP").removeClass("progress-bar-danger")
  }
  if(hpPercent1<20){
    $(".pokemon1HP").removeClass("progress-bar-warning")
    $(".pokemon1HP").addClass("progress-bar-danger")
  }
  if(hpPercent2<20){
    $(".pokemon2HP").removeClass("progress-bar-warning")
    $(".pokemon2HP").addClass("progress-bar-danger")
  }
  $(".pokemon1HP").attr("style", "width:" + hpPercent1 + "%");
  $(".pokemon2HP").attr("style", "width:" + hpPercent2 + "%");

  $(".pokemon1HP").attr("aria-valuenow", eval("Player"+playerNumber).pokemons[index1].hp);
  $(".pokemon1HP").attr("aria-valuemax", eval(eval("Player"+playerNumber).pokemons[index1].name.toLowerCase()).hp);

  $(".pokemon2HP").attr("aria-valuenow", eval("Player"+playerNumber).pokemons[index1].hp);
  $(".pokemon2HP").attr("aria-valuemax", eval(eval("Player"+mySign).pokemons[index2].name.toLowerCase()).hp);

  $(".move1Name").html(eval("Player"+playerNumber).pokemons[index1].moves[0].name);
  $("#move1").attr("value",eval("Player"+playerNumber).pokemons[index1].moves[0].name.toLowerCase().replace(" ",""));
  $(".move2Name").html(eval("Player"+playerNumber).pokemons[index1].moves[1].name);
  $("#move2").attr("value",eval("Player"+playerNumber).pokemons[index1].moves[1].name.toLowerCase().replace(" ",""));

  $(".move1Description").html(eval("Player"+playerNumber).pokemons[index1].moves[0].description);
  $(".move2Description").html(eval("Player"+playerNumber).pokemons[index1].moves[1].description);

  $(".move1Power").html(eval("Player"+playerNumber).pokemons[index1].moves[0].power);
  $(".move2Power").html(eval("Player"+playerNumber).pokemons[index1].moves[1].power);

}
function publishLoser(loser) {
  pubnub.publish({
    channel: channel,
    message: {loserPlayer: loser},
    callback: function(m){
     //  console.log(m);
    }
  });
 }
 function publishPosition(player,pokemonChosen) {
   pubnub.publish({
     channel: channel,
     message: {player: player, pokemon: pokemonChosen},
     callback: function(m){
      //  console.log(m);
     }
   });
  }
  function beginAttack(player,pokemonChosen) {
    pubnub.publish({
      channel: channel,
      message: {GameStatus: "Attacking"},
      callback: function(m){
        // console.log(m);
      }
    });
   }

 function publishReset(player,pokemonChosen) {
   pubnub.publish({
     channel: channel,
     message: {reset:"Reset"},
     callback: function(m){
      //  console.log(m);
     }
   });
  }
  function publishSelection(playerNumber,pokemonChange,damage,statusEffect, action) {
    pubnub.publish({
      channel: channel,
      message: {player: playerNumber, pokemonChange: pokemonChange, damage: damage, statusEffect: statusEffect, action:action},
      callback: function(m){
        // console.log(m);
      }
    });
   }
   function publishReady(playerReady) {
     pubnub.publish({
       channel: channel,
       message: {playerReady: playerReady},
       callback: function(m){
         // console.log(m);
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
    publishPosition(mySign);
  }

  function changeTurn(player) {
      Game.currentTurn++;
      turn = (turn === '1') ? '2' : '1';
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
        $("#gameInfo").hide();
        $('#container').hide();
        $("#battleContainer").show();
        Game.state="Battle";
      }
    }

})

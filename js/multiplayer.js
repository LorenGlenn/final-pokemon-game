var uuid = PUBNUB.uuid();
var turn=1;

function getGameId(){ //Generate game ID
    if(window.location.search.substring(1).split('?')[0].split('=')[0] !== 'id') {
      return null;
    } else {
      return window.location.search.substring(1).split('?')[0].split('=')[1];
    }
  }


$(function() {
  var gameId =  $('#gameId');
  var gameIdQuery = $('#gameIdQuery');
  var tictactoe = $('#pokeSelector');
  var output = $('#output');
  var whosTurn = $('#whosTurn');

// generate gameID
  var gameid = '';
  var rand = (Math.random() * 9999).toFixed(0);
  gameid = (getGameId()) ? getGameId() : rand;
  $('#gameid').text(gameid);

  var channel = 'pokebattle--'+ gameid;
  console.log('Channel: '+channel);

  // modal to select new Game or join host
  $('#myModal').modal({
    backdrop: 'static',
    keyboard: false
  });

  // Button action to go to opponent's url
  $("#enterGameButton").click(function(event){
    if($("#inputGameId").val()){
      // var opponentUrl = 'http://LorenGlenn.github.io/final-pokemon-game/index.html?id=' + $("#inputGameId").val();
      var opponentUrl = 'C:/Users/main/Desktop/pokebattle/index.html?id=' + $("#inputGameId").val();
      window.location.href=opponentUrl;
      return false;
    }
    else{
      event.preventDefault();
    }
  });
  var pubnub = PUBNUB.init({
      subscribe_key: 'sub-c-ffc4b4e4-a451-11e6-9fcd-0619f8945a4f',
      publish_key: 'pub-c-943a6772-fe6e-435b-a3d1-78ad3ddd1d65',
      uuid: uuid
  });

  var mySign = '1';

  pubnub.subscribe({
     channel: channel,
     connect: function(){console.log("connected")},
     presence: function(m) {
       console.log(m);

       if(m.uuid === uuid && m.action === 'join') {
          if(m.occupancy < 2) {
            $("#whosTurn").text('Waiting for your opponent...');
          } else if(m.occupancy === 2) {
            mySign = '2';
          } else if (m.occupancy > 2) {
            alert('This game already have two players!');
            tictactoe.className = 'disabled';
          }
        }

       if(m.occupancy === 2) {
         tictactoe.className = '';
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
       changeTurn(m.player);

     },
   });


   function publishPosition(player) {
     pubnub.publish({
       channel: channel,
       message: {player: player},
       callback: function(m){
         console.log(m);
       }
     });
    }
    function startNewGame(mySign){
      turn =1;
      console.log("Starting new game!")
      console.log("My sign is: "+mySign)
      publishPosition(mySign);
    }

    function changeTurn(player) {
        turn = (turn === '1') ? '2' : '1';
        console.log("changing turns, "+ turn);
        $("#whosTurn").text((turn === mySign) ? 'Your turn' : 'Your opponent\'s turn');
        (turn==mySign) ? $("#pokeSelector").removeClass("disabled") : $("#pokeSelector").addClass("disabled");

      }
})

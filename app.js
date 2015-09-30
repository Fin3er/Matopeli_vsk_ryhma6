/* ==================================================================== */

// ----- Class: GameServer -----

// Objectives: initializes and runs the game

/* ==================================================================== */

var GameServer = (function () {


    /* Constructor GameServer() [inits the game app] */
    // Params: nothing
    // Returns: void

    function constructor() {

        // namespace for the server app
        scope = this;

        // create gs ("gameserver") container for public methods and variables in order to avoid polluting the root scope
        this.gs = {};

        // storage for private variables
        var priv = {};


        // general game-related variables
        priv.playersOnline = [];
        priv.gamesOnline = [];

        // privileged public method addPlayers(player) - create player to the system
        // params: object player
        // return: void
        this.gs.createPlayer = function(username) {

            // TODO check that player with this name doesn't exists already

            // new logged in player
            var player = new priv.player(username);
            
            // save object to online players array
            priv.playersOnline.push(player);
        };

        // privileged public method dropPlayers(player) - takes player off the players list
        // params: object player
        // return: void
        this.gs.dropPlayer = function(player) {
            // TODO delete player object too, not only the reference to it
            priv.playersOnline.splice(priv.playersOnline.indexOf(player), 1);
        };

        // privileged public method getPlayers() - return info of all online players
        // params: none
        // return: object playersOnline
        this.gs.getPlayers = function() {
            return priv.playersOnline;
        };

        // privileged public method getPlayer(username) - return object of one player
        // params: none
        // return: object player
        this.gs.getPlayer = function(username) {
            
            var result = priv.playersOnline.filter(function(player) {
              return player.getUsername() == username;
            });

            // player name should be unique, but let's test it anyway
            if (result.length > 1) return null;
            else return result[0];
        };

        // privileged public method establishNewGame(game) - establish a new game into system
        // params: object game
        // return: void
        this.gs.establishNewGame = function(socket, callback) {

            // check who is trying to establish a game?

            var player = this.getPlayer(socket.name);

            if (player == null) {
                callback("NOK", {'error': "You must be logged in to establish a game."});
                return;
            }

            if (Object.keys(player.getSocket()).length == 0) {
                //socket isn't attached.. what's going on here?
                callback("NOK", {'error': "Socket not attached to player when trying to establishing a new game."});
                return;
            }

            // generate a random id for this game
            var gameID = Math.random().toString(36).substr(2, 5);
            console.log("New game established with id: " + gameID);   

            // establish a new game
            var game = new priv.game(gameID, socket);
            
            // save object to online players array
            priv.gamesOnline.push(game);

            callback("OK", {'gameID': gameID});
        };

        // privileged public method dropGame(game) - takes game off the system
        // params: object game
        // return: void
        this.gs.dropGame = function(game) {
            priv.gamesOnline.splice(priv.gamesOnline.indexOf(game), 1);
        };

        // privileged public method getGames() - return info of all games in the system
        // params: none
        // return: object gamesOnline
        this.gs.getGames = function(game) {
            return priv.gamesOnline;
        };

        // privileged public method getGameState(callback) - return info to new browser, what happens now in the game
        // params: object callback
        // return: void
        this.gs.getGameState = function(callback) {

            // in this dev version there is only 1 concurrent game
            // this is why we write:

            var state;

            if (priv.gamesOnline.length > 1) {
                state = "error"; // too many games online
            }
            if (priv.gamesOnline.length == 1) {
                state = priv.gamesOnline[0].getState();  // 1 game online
            }
            else {
                state = "empty"; // no games online
            }
          
            callback(state);
        };
        

        /* === set up expressjs http server === */

        priv.express = require('express');
        this.app = priv.express();
        this.server = require('http').createServer(this.app);
        this.bodyParser = require('body-parser');

        // for parsing application/json
        this.app.use(this.bodyParser.json());

        // for parsing application/x-www-form-urlencoded
        this.app.use(this.bodyParser.urlencoded({ extended: true }));

        // set public html directory
        this.app.use(priv.express.static('client'));

        // http server to listen port 8080
        this.server.listen(8080);  


        /* ===== Include all project related server side modules ===== */

        /*

        this.fs = require('fs');

            fs.readdirSync(__dirname + '/server').forEach(function(filename) {
                if (~filename.indexOf('.js')) {
                    // Note: all modules will need http server and database server objects
                    require(__dirname + '/server/' + filename)(scope);
                }
            });
        */

        // load the modules (auto-initialization)
        this.gs.db = require('./server/dbhandler.js')(scope);
        require('./server/restapihandler.js')(scope);
        this.gs.ws = require('./server/websocketapihandler.js')(scope);

        // load the classes (objects must be created with 'new' of these)
        priv.player = require('./server/classes/player.js');
        priv.game = require('./server/classes/game.js');

    }


    // Initialize the module
    constructor();

});


// Run the game server
var gameServer = new GameServer();
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
        priv.maxPlayers = 4; // how many players is allowed in the game
        priv.playersOnline = [];
        priv.gamesOnline = [];


        // * Public method posToCoords(params) [converts position (aka gameboard id of cell) to x, y coordinates]
        // Params: string position in format 'x_y'
        // Return: object {'posX': posX, 'posY': posY}
        this.gs.posToCoords = function(position) {
            var pos = position.split('_');
            var x = parseInt(pos[0]);
            var y = parseInt(pos[1]);
            return {'x': x, 'y': y};
        }

        // privileged public method getMaxPlayers() - return number how many players can be in the game
        // params: none
        // return: int maxPlayers
        this.gs.getMaxPlayers = function() {
            return priv.maxPlayers;
        };

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

/* not in use, for some reason

        // privileged public method addPlayerToGame(username, game, callback) - add player to a game
        // params: object player, object game
        // return: object player
        this.gs.addPlayerToGame = function(username, gameID, callback) {

            var player = getPlayer(username);

            if (player == null) {
                callback("NOK", {'error': "Can't add player to the game, because player with that name "+username+" doesn't found."});
                return;
            }

            var game = getGame(gameID);

            if (game == null) {
                callback("NOK", {'error': "Can't add player to the game, because game with that ID "+gameID+"doesn't found."});
                return;
            }

            
        };
*/

        // privileged public method establishNewGame(game) - establish a new game into system
        // params: object game
        // return: void
        this.gs.establishNewGame = function(socket, callback) {

            // is game already established? in this dev version, there can be only 1 concurrent game
            if (priv.gamesOnline.length > 0) {
                // send error
                callback("NOK", {'error': "Game is already established. The dev version allows only one concurrent game. Sorry."});
                // force client to have the existing game
                scope.gs.ws.getGameState(socket);
                return;
            }

            // check who is trying to establish a game
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

            // establish a new game and make establisher to join the game
            var game = new priv.game(gameID, player);
            
            // save object to online games array
            priv.gamesOnline.push(game);

            callback("OK", {'gameID': gameID});
        };


        // privileged public method startGame(username, gameID, callback) - start an established game
        // params: strin username, string GameID, object callback
        // return: void
        this.gs.startGame = function(username, gameID, callback) {

            //TODO check here, is username a joined member of the game

            var game = scope.gs.getGame(gameID);

            if (game == null) {
                callback("NOK", {'error': "Can't add player to the game, because game with that ID "+gameID+"doesn't found."});
                return;
            }

            game.startGame(function (result, data) {
                //TODO incomplete feature

                if (result == "OK") {
                    callback("OK", {'gameID': gameID});
                }
            });
            
        }


        // privileged public method dropGame(game) - takes game off the system
        // params: object game
        // return: void
        this.gs.dropGame = function(game) {
            priv.gamesOnline.splice(priv.gamesOnline.indexOf(game), 1);
        };

        // privileged public method getGame(gameID) - return object of one game
        // params: none
        // return: object game
        this.gs.getGame = function(gameID) {
            
            var result = priv.gamesOnline.filter(function(game) {
              return game.getID() == gameID;
            });

            // in this dev version, there should be only 1 concurrent game; let's test this rule
            if (result.length == 1) return result[0];
            else return null; // no game or more than 1 game
        };

        // privileged public method getGameState(callback) - return info to new browser, what happens now in the game
        // params: object callback
        // return: void
        this.gs.getGameState = function(callback) {

            // in this dev version there is only 1 concurrent game
            // this is why we write:

            var gameState = "empty"; // we expect no games online
            var gameID = ""; // we expect no games online

            if (priv.gamesOnline.length > 1) {
                gameState = "error"; // too many games online
            }
            if (priv.gamesOnline.length == 1) {
                gameState = priv.gamesOnline[0].getGameState();  // 1 game online
                gameID = priv.gamesOnline[0].getID();
            }
          
            callback(gameState, gameID);
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
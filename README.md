# Prototype of a multiplayer worm game



### Installation

1. Preconditions: you've got NodeJS and MySQL server installed

2. Clone the files from git repository

3. In command prompt, change directory to the folder that contains project files and give command: npm install. This will load all dependencies, if some doesn't exist already.

4. Create a mysql user and password. Create database and tables with sql/wormgame.sql, for example on command prompt: mysql -uUSERNAME -pPASSWORD < wormgame.sql

5. Put your mysql username, password, hostname and database name to the file: server/dbconfig.js


### Running

1. Start mysql server, if not running already

2. In command prompt, change directory to the created game project folder

3. Start the game server with command: node app.js

4. Access the game with browser at: http://localhost:8080


### Info for developers


##### Documentation

* If we write documentation in english, it's better, as finnish is understood only 0,75‰ of humans on this planet


##### Files and folders

* app.js file -> launches the game server
* package.json file -> project details -> add here for example the dependencies - more info or additional info see https://docs.npmjs.com/files/package.json
* client folder -> all static client side files, that are public in the internet, served by ExpressJS http server
* server folder -> all server side files
* wormgame.sql > contains mysql database sql schema dump


##### Database

* commit only a sql file, that creates database and schema but doesn't contain any data; for example with command: mysqldump wormgame -uUSERNAME -pPASSWORD --add-drop-database --databases --no-data > wormgame.sql


##### API

* We might rather try to make API with socket.io & websocket, instead of http routes
* Let's use url structure api/class/method or api/feature/subfeature; more info: http://restful-api-design.readthedocs.org/en/latest/urls.html

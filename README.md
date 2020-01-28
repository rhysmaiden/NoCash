# NoCash

A mobile app that allows users to play board and card games that require currency. e.g. Poker without chips, Monopoly without cash.

## Mobile Client

### `Stack`

* Built in React Native.
* Navigation using "react-navigation-stack"
* Sockets using "socket.io-client"

### `Screens`

* Home
* Join Room
* Create Room
* Room
* Pay

### `Actions`

* Create room
* Join room
* Send money to user
* Request money from user
* Accept request from user
* Send money to bot
* Request money from bot


## Server

### `Stack`
* Built in NodeJS.
* Exported using Expo
* Sockets using "socket.io"

### `Sockets`

* connection
* join
* close
* createRoom
* roomExists
* sendMoney
* requestMoney

### `Emits`

* users
* messages
* room


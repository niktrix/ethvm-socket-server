<div align="center">
  <a href="https://raw.githubusercontent.com/enKryptIO/ethvm-socket-server/master/LICENSE.md">
    <img alt="License" src="https://img.shields.io/dub/l/vibe-d.svg">
  </a>
  <a href="https://travis-ci.org/enKryptIO/ethvm-socket-server" target="_blank">
    <img alt="Travis" src="https://travis-ci.org/enKryptIO/ethvm-socket-server.svg?branch=master" />
  </a>
  <a href="https://codecov.io/gh/enKryptIO/ethvm-socket-server" target="_blank">
    <img alt="codecov" src="https://codecov.io/gh/enKryptIO/ethvm-socket-server/branch/master/graph/badge.svg" />
  </a>
  <a href="https://david-dm.org/enKryptIO/ethvm-socket-server" target="_blank">
    <img alt="Dependency Status" src="https://david-dm.org/enKryptIO/ethvm-socket-server.svg" />
  </a>
  <a href="https://david-dm.org/enKryptIO/ethvm-socket-server?type=dev" target="_blank">
    <img alt="devDependency Status" src="https://david-dm.org/enKryptIO/ethvm-socket-server/dev-status.svg" />
  </a>
</div>

<div align="center">
  <h1>
    <img src="https://raw.githubusercontent.com/enKryptIO/ethvm-socket-server/master/assets/logo.png" alt="ethvm-logo">
  </h1>
</div>

# Ethvm Socket Server

Socket server which handles the backend for [EthVM](https://github.com/enKryptIO/ethvm). Powered by [Vue.js](https://github.com/vuejs/vue) / [go-ethereum](https://github.com/ethereum/go-ethereum) / [RethinkDB](https://github.com/rethinkdb/rethinkdb) / [Socket.io](https://github.com/socketio/socket.io) / [Redis](https://redis.io/topics/quickstart)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing puposes.

### Prerequisites

There are two ways to develop on EthVm:

1.  Using `docker`
2.  Manual method

So, choose your own path depending on which experience you want to have (keep in mind that using `docker` and `docker-compose` will streamline a lot the different dependencies you need in order to have a proper setup, so, if you want to start developing ASAP, using `docker` will be a better choice).

### Developing using Docker

Make sure you have installed `docker` and `docker-compose`.

In order to bring up the project you can issue the following command in the terminal (these are regular `docker-compose` commands, nothing fancy):

```sh
$ docker-compose up -d
```

To stop:

```sh
$ docker-compose stop
```

To delete built docker images:

```sh
$ docker-compose rm
```

And to check the logs:

```sh
$ docker-compose logs -f
```

### Developing without Docker (Manual Installation)

#### Prerequisites

Make sure that [RethinkDB](https://rethinkdb.com/docs/install/) and [Redis](https://redis.io/topics/quickstart) server is installed in your system.

In `configs` folder, you can change connection settings for the different available options.

### Running

Execute the following in your terminal:

```sh
$ npm install  
$ npm run start:dev
```

Nodemon will kicstart the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

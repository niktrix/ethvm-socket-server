<div align="center">
  <img src="https://raw.githubusercontent.com/enKryptIO/ethvm-socket-server/master/assets/logo.png" alt="ethvm-logo">
  <p>:zap::zap::zap: EthVM Project: An open source blockchain explorer for Ethereum (and related networks) :zap::zap::zap:</p>
  <p>Powered by <a href="https://www.typescriptlang.org/">TypeScript</a> / <a href="https://github.com/socketio/socket.io">Socket.io</a> / <a href="https://github.com/ethereum/go-ethereum">go-ethereum</a> / <a href="https://github.com/rethinkdb/rethinkdb">RethinkDB</a> / <a href="https://redis.io/topics/quickstart">Redis</a></p>
</div>

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
    <a href="https://david-dm.org/enKryptIO/ethvm-socket-server" title="dependencies status">
    <img src="https://david-dm.org/enKryptIO/ethvm-socket-server/status.svg?style=flat-square" alt="dependencies status"/>
  </a>
  <a href="https://david-dm.org/enKryptIO/ethvm-socket-server?type=dev" title="devDependencies status">
    <img src="https://david-dm.org/enKryptIO/ethvm-socket-server/dev-status.svg?style=flat-square" alt="devDependencies status">/>
  </a>
</div>

# EthVM: Socket Server

**WARNING:** This project is in heavy refactoring mode! Things may break, don't work or anything else! (Phew!)

This is the socket server that handles the backend for the sexy [EthVM](https://github.com/enKryptIO/ethvm) frontend. 


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing puposes.

### Prerequisites

There are two ways to develop on EthVM Socket Server:

1.  Using `docker`. This will provide the complete experience to developing the whole EthVM project (i.e: backend and frontend at the same time). To do that, we recommend you to visit directly [ethvm-dev-kit](https://github.com/enKryptIO/ethvm-dev-kit).
2.  Manual method

So, choose your own path depending on which experience you want to have (keep in mind that using `docker` and `docker-compose` will streamline a lot the different dependencies you need in order to have a proper setup, so, if you want to start developing ASAP, using `docker` will be a better choice).

### Developing without Docker (Manual Installation)

#### Prerequisites

Make sure that [RethinkDB](https://rethinkdb.com/docs/install/) and [Redis](https://redis.io/topics/quickstart) server are installed in your system.

In `configs` folder, you can change connection settings for the different available options.

### Running

Execute the following in your terminal:

```sh
$ yarn install  
$ yarn start:dev
```

Nodemon will kicstart the project.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

<div align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="built with love" />
</div>

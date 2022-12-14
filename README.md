> ⚠️ **Disclaimer**
>
> This is currently being written! The old code is still available [here](https://github.com/electroflameofficial/gdshittylist/tree/archive), but will be deprecated once the new code is fully functional.

![Logo](https://gist.githubusercontent.com/Emonadeo/3c3ca5d44d23ee7c9ae3c048c8f3a2c4/raw/GDOL.svg)

![Version](https://img.shields.io/github/package-json/v/Emonadeo/GDOL)
![License](https://img.shields.io/github/license/Emonadeo/GDOL)

**GDOL is a list stack for geometry dash. It aims to keep your list setup experience nice and easy while giving you complete freedom of customization.**

## Structure

| Module               | Version                                                                                                            | Description                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [**Client**](client) | ![Client Version](https://img.shields.io/github/package-json/v/Emonadeo/GDOpenList?filename=client%2Fpackage.json) | Static Front-end made with [Svelte](https://svelte.dev/)                                            |
| [**Server**](server) | ![Server Version](https://img.shields.io/github/package-json/v/Emonadeo/GDOpenList?filename=server%2Fpackage.json) | REST API built on [Fastify](https://www.fastify.io/) (Node.js) and [Prisma](https://www.prisma.io/) |

## Developer Guide

### 1. Install dependencies

```sh
$ npm install
```

### 2. Setup Server

#### 2.1. Setup a Database

The easiest way to spin up a database is with [Docker](https://www.docker.com/get-started/). When inside the repo folder run:

```sh
$ docker-compose up -d
```

This will start a PostgreSQL instance with the default user `example` and password `example`. For more details take a look at the [`docker-compose.yml`](docker-compose.yml).

Alternatively setup [PostgreSQL](https://www.postgresql.org/) manually.

#### 2.2. Setup Prisma

Generate TypeScript definitions for Prisma:

```sh
$ prisma generate
```

Push the Prisma schema to the database. Your database needs to be running for this.

```sh
$ prisma db push
```

_**Optional:**_ Generate some data

```sh
$ prisma db seed
```

### 3. Launch

```sh
# Serves the client at localhost:3000
$ npm -w client run dev
```

```sh
# Starts the server at localhost:3001
$ npm -w server run dev
```

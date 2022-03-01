# NestJS + TypeORM REST User Microservice

This is an example project using NestJS and TypeORM to demonstrate a Node.js-based REST microservice.

## Requirements

- [Node.js 16+](https://nodejs.org/)
- Docker for your environment
  - [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows
  - [Docker for Linux](https://hub.docker.com/search?offering=community&operating_system=linux&q=&type=edition)

## Installation

The following commands should be run from the project directory after yuo've installed the requirements above.

Install the required node packages and build the project:

```bash
$ npm install
$ npm run build
```

Start up the Docker container with Microsoft SQL Server:

```bash
$ docker-compose up
```

Once the Docker container is started, run the following command to create the necessary database tables:

```bash
$ npm run typeorm:migration:run
```

**OPTIONAL:** Run this command if you'd like some dummy data to play with:

```bash
$ npm run seed:run
```

## Running the app

To run the application, execute the command:

```bash
$ npm run start
```

Once started, you can acess the Swagger API from [http://localhost:3000](http://localhost:3000) to experiment with the API calls.

When finished, you can stop the NestJS app and the docker-compose process by pressing the keys CTRL + C.

## Test

The following commands will run tests. Please note that the database should be running (via docker-compose up) for the e2e tests.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# NestJS + TypeORM + Swagger REST User Microservice

An example NestJS project that uses TypeORM to demonstrate a Node.js-based REST microservice. This example compliments my [Lab Notes: Looking at NestJS for Web Apps – Overview, Performance, Thoughts](https://blog.missiondata.com/lab-notes-looking-at-nestjs-for-web-apps-overview-performance-thoughts/) blog article where I provide an overview of NestJS, discuss performance, and wrap up with thoughts from a developer perspective.

This application uses TypeORM and Swagger to implement a simple REST microservice using the _default_ NestJS configuration. The REST endpoints allow you to retrieve and manage user records from a Microsoft SQL Server database. You are able to get a list of all users, get one user, create a user, update a user, and delete a user. All client input, like user identifiers or details, is validated.

## Requirements

- [Node.js 16+](https://nodejs.org/)
- Docker for your environment
  - [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows
  - [Docker for Linux](https://hub.docker.com/search?offering=community&operating_system=linux&q=&type=edition)

## Installation

The following commands should be run from the project directory after you've installed the requirements above.

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

When finished, you can stop the NestJS app and the docker-compose process by pressing the keys `CTRL + C`.

## Test

The following commands will run tests. Please note that the database should be running (via `docker-compose up`) for the end-to-end tests.

```bash
# unit tests
$ npm run test

# end-to-end tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

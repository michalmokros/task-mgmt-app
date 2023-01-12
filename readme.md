# Task Management Application

Simple sample NodeJS + TypeScript + PostgreSQL Project for demonstration purposes.

## About

### Description

This is a *REST API NodeJS* Application written in *TypeScript* with *PostgreSQL* Database for task management. Each task is assigned to a Project and can have up to 100 Tags. The Tasks can be filtered by their Tags, Projects and all other attributes that they contain. Requests to this Application need to have an `Authorization` header in the form of a *Bearer Token*.

### How To Use

Available endpoints are described through API Documentation which was done in [OpenAPI](https://www.openapis.org/). To view this documentation go to [Editor Swagger](https://editor.swagger.io/) and input file [openapi.yaml](./openapi.yaml) to render the endpoints. Don't forget to use the `Authorization` header with value `Bearer eyJhbGciOiJIUzI1NiJ9.aGVsbG93b3JsZA.vyzLvRb1Wd_T-1Zbh9E9GyqflKi5RFfr2-vinM70Ff0` when testing the endpoints.\

For **experiments** you can use available pregenerated [**Postman Collection**](./postman_collection.json) with already filled authorization, URLs, parameters, queries and bodies.

## Configuration

### Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [NodeJS](https://nodejs.org/en/download/)
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Setup

1. Install the dependencies\
`npm install`
2. Build the Javascript\
`npm run build`
3. Create and start the Docker Container with PostgreSQL database\
`npm run up`
4. Start the NodeJS Application\
`npm start`

### Cleanup

1. Stop the NodeJS Application
2. Stop and remove the Docker Container with PostgreSQL database\
`npm run down`

### Development

- Start the Application through Typescript files\
`npm run dev`
- Start the Application with reload on changes in code\
`npm run watch`
- Run the linters on the code and fix errors and warnings\
`npm run lint`
- Remove all generated files\
`npm run clean`

## Continuation

Possible further improvements that should be done to this Application. Consider this as a TODOs list.

### Functionality

- [ ] Tests
- [ ] Static Code Analysis + Coverage Report
- [ ] Run NodeJS Application in Docker Container
- [ ] Create Entity Relationship Diagram for the database

### Logic

- [ ] Ensure that Project can have some limited number of Tasks
- [ ] Use more advanced pagination(start, cursor) of results for requests that list entities
- [ ] Pump up Authentication/Authorization

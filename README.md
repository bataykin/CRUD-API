# CRUD-API
Simple crud-api on native nodejs

To install run:
1. 'yarn install' in the console
2. run 'build' script in package.json
3. run 'start:prod' script in package.json


Assignment: CRUD API
Description

    Your task is to implement simple CRUD API using in-memory database underneath.
    Technical requirements

    Task can be implemented on Javascript or Typescript
    Only nodemon, dotenv, cross-env, typescript, ts-node, eslint and its plugins, webpack-cli, webpack and its plugins, prettier, uuid, @types/* as well as libraries used for testing are allowed
    Use 18 LTS version of Node.js
    Prefer asynchronous API whenever possible

    Implementation details

    Implemented endpoint api/users:

        GET api/users is used to get all persons
            Server should answer with status code 200 and all users records

        GET api/users/${userId}
            Server should answer with status code 200 and and record with id === userId if it exists
            Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
            Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

        POST api/users is used to create record about new user and store it in database
            Server should answer with status code 201 and newly created record
            Server should answer with status code 400 and corresponding message if request body does not contain required fields

        PUT api/users/{userId} is used to update existing user
            Server should answer with status code 200 and updated record
            Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
            Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

        DELETE api/users/${userId} is used to delete existing user from database
            Server should answer with status code 204 if the record is found and deleted
            Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
            Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

    Users are stored as objects that have following properties:
        id — unique identifier (string, uuid) generated on server side
        username — user's name (string, required)
        age — user's age (number, required)
        hobbies — user's hobbies (array of strings or empty array, required)

    Requests to non-existing endpoints (e.g. some-non/existing/resource) should be handled (server should answer with status code 404 and corresponding human-friendly message)

    Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with status code 500 and corresponding human-friendly message)

    Value of port on which application is running should be stored in .env file

    There should be 2 modes of running application (development and production):
        The application is run in development mode using nodemon (there is a npm script start:dev)
        The application is run in production mode (there is a npm script start:prod that starts the build process and then runs the bundled file)

    There could be some tests for API (not less than 3 scenarios). Example of test scenario:
        Get all records with a GET api/users request (an empty array is expected)
        A new object is created by a POST api/users request (a response containing newly created record is expected)
        With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)
        We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
        With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
        With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)

    There could be implemented horizontal scaling for application (there is a npm script start:multi that starts multiple instances of your application using the Node.js Cluster API 
    (equal to the number of logical processor cores on the host machine, each listening on port PORT + n) with a load balancer that distributes requests across them (using Round-robin algorithm). 
    For example: host machine has 4 cores, PORT is 4000. On run npm run start:multi it works following way
    On localhost:4000/api load balancer is listening for requests
    On localhost:4001/api, localhost:4002/api, localhost:4003/api, localhost:4004/api workers are listening for requests from load balancer
    When user sends request to localhost:4000/api, load balancer sends this request to localhost:4001/api, next user request is sent to localhost:4002/api and so on.
    After sending request to localhost:4004/api load balancer starts from the first worker again (sends request to localhost:4001/api)

    State of db should be consistent between different workers, for example:
        First POST request addressed to localhost:4001/api creates user
        Second GET request addressed to localhost:4002/api should return created user
        Third DELETE request addressed to localhost:4003/api deletes created user
        Fourth GET request addressed to localhost:4004/api should return 404 status code for created user

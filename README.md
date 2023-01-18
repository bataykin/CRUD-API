# CRUD-API
Simple crud-api on native nodejs

To install run:
- 'yarn install' in the console
- set .env like in .en.example (port and execution type SINGLE/MULTI)
- run once 'build' script in package.json
- run 'start:prod' script in package.json
- for development cases use 'start:dev'

You have basic in-memory server on hostname:port/api/users with ability to use cluster of node-processes according to your CPU-cores count.
It supports basic CRUD-requests
userSchema: {
    username: string,
    age: number,
    hobbies: string[]
    }
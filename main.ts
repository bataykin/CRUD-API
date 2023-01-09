import * as dotenv from 'dotenv'
import * as http from 'node:http';
import {IncomingMessage, Server, ServerResponse} from "http";
import {getHandler} from "./handlers/getHandler";
import {postHandler} from "./handlers/postHandler";
import {putHandler} from "./handlers/putHandler";
import {deleteHandler} from "./handlers/deleteHandler";


dotenv.config()

console.log(process.env.PORT)

// Create a local server to receive data from
const server: Server = http.createServer();

// Listen to the request event
server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    //console.log(`New incoming ${req.method}-request from ${req.headers.host}${req.url}`)
    const baseURL: string = 'api/users'
    // const url: string = req.url!.replace(/\/$/, "") // trim trailing slash if exist - sanitizing url
    const parsedURL = req.url!.split('/').slice(1)
    console.log(parsedURL)
    if (parsedURL[0] + '/' + parsedURL[1] !== baseURL) {
        res.statusCode = 404
        return res.end(JSON.stringify({message: 'Wrong URL'}))
    }


    switch (req.method) {
        case 'GET' :
            getHandler(parsedURL[2]);
            break;
        case 'POST' :
            postHandler();


            break;
        case 'PUT' :
            putHandler(parsedURL[2])
            break;
        case 'DELETE' :
            deleteHandler(parsedURL[2])
            break;
        default:
            console.log('Unexpected HTTP-method')
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        data: 'Hello World!',
    }));
});

server.listen(process.env.PORT || 8000);
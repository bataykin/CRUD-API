import * as dotenv from 'dotenv'
import * as http from 'node:http';
import {IncomingMessage, Server, ServerResponse} from "http";
import {getHandler} from "./handlers/getHandler";
import {postHandler} from "./handlers/postHandler";
import {putHandler} from "./handlers/putHandler";
import {deleteHandler} from "./handlers/deleteHandler";
import {UserType} from "./userRepo";

dotenv.config()
export const usersArray: Array<UserType> = []
const server: Server = http.createServer();
const BASEURL: string = 'api/users'

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});


server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
    //console.log(`New incoming ${req.method}-request from ${req.headers.host}${req.url}`)
    // const url: string = req.url!.replace(/\/$/, "") // trim trailing slash if exist - sanitizing url
    const parsedURL: Array<string> = req.url!.split('/').slice(1)
    if (parsedURL[0] + '/' + parsedURL[1] !== BASEURL) {
        res.statusCode = 404
        return res.end(JSON.stringify({message: 'Wrong URL'}))
    }

    // const buffers = [];
    // for await (const chunk of req) {
    //     buffers.push(chunk);
    // }
    // const body = JSON.parse(Buffer.concat(buffers).toString());


    switch (req.method) {
        case 'GET' :
            await getHandler( res, parsedURL[2]);
            break;
        case 'POST' :
            await postHandler(req, res);
            break;
        case 'PUT' :
            await putHandler(parsedURL[2])
            break;
        case 'DELETE' :
            await deleteHandler(parsedURL[2])
            break;
        default:
            console.log('Unexpected HTTP-method')
    }

    // res.writeHead(200, {'Content-Type': 'application/json'});
    // res.end(JSON.stringify({
    //     data: 'Hello World!',
    // }));
});
// console.log(process.pid)
// console.log('SIGINT')

server.listen(process.env.PORT || 3000);
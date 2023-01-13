import * as dotenv from 'dotenv'
import * as http from 'node:http';
import {IncomingMessage, Server, ServerResponse} from "http";
import {UserType} from "./userRepo";
import {parseId, parseRequestBody, ResponseObjectType, sendResponse, serveRoute,} from './helpers';

dotenv.config()
export let usersArray: Array<UserType> = []
const server: Server = http.createServer();
const BASEURL: string = 'api/users'


server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
    if (process.env.NODE_ENV === 'DEV')
        console.log(`New incoming ${req.method}-request from ${req.headers.host}${req.url}, PID=${process.pid}`)
    const parsedURL: Array<string> = req.url!.split('/').slice(1)
    if (parsedURL[0] + '/' + parsedURL[1] !== BASEURL) {
        return await sendResponse({code: 404, body: 'Wrong URL'}, res)
    }
    const userId = await parseId(req)
    const body: any = await parseRequestBody(req)
    const result: ResponseObjectType = await serveRoute(req.method as string, userId, body)
    await sendResponse(await result, res)
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server ${BASEURL} started on port=${process.env.port}, PID=${process.pid}, ${__filename}`)
});

server.on('error', async (err: Error, res: ServerResponse) => {
    try {
        await sendResponse({code: 500, body: 'Something went wrong'}, res)
    } catch (e) {
        console.log(e)
    } finally {
        console.log('Server error: ', err)
    }
})

server.on('clientError', (err: Error, socket: ServerResponse) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})
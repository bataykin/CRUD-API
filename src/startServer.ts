import {IncomingMessage, ServerResponse} from "http";
import {parseId, parseRequestBody, ResponseObjectType, sendResponse, serveRoute} from "./helpers";
import cluster from "cluster";
import {BASEURL, server, usersArray, workersList} from "./main";


export function startServer() {
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

        res.on('finish', () => {
            const parsedURL: Array<string> = req.url!.split('/').slice(1)
            if (parsedURL[0] + '/' + parsedURL[1] == BASEURL) {
                for (const worker of workersList) {
                    console.log(`sending to ${worker.id} ${usersArray}`)
                    cluster.workers![worker.id]?.send({usersArray: usersArray})
                }
                cluster.worker?.send({usersArray: usersArray})
            }
        })
    })

    process.on('uncaughtException', function (err) {
        console.log(err);
    });

    server.listen(process.env.PORT || 5000, () => {
        const serverStatus = (cluster.isPrimary) ? 'Master' : 'Worker'
        console.log(`${serverStatus} server ${BASEURL} started on port=${process.env.port}, PID=${process.pid}, ${__filename}`)
    })


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
}

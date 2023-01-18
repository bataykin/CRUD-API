import {IncomingMessage, ServerResponse} from "http";
import {getHandler} from "./handlers/getHandler";
import {postHandler} from "./handlers/postHandler";
import {putHandler} from "./handlers/putHandler";
import {deleteHandler} from "./handlers/deleteHandler";

export async function sendResponse(resObject: ResponseObjectType, res: ServerResponse) {
    res.statusCode = resObject.code
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(resObject.body))
}

export type ResponseObjectType = {
    code: number
    body: any
}

export async function parseId(req: IncomingMessage) {
    const parsedURL: Array<string> = req.url!.split('/').slice(1)
    return parsedURL[2]
}

export async function parseRequestBody(req: IncomingMessage) {
    let buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    return (buffers.length == 0) ? '' : JSON.parse(Buffer.concat(buffers).toString())
}


export async function serveRoute(routeMethod: string, userId: string, body: any): Promise<ResponseObjectType> {
    let res: ResponseObjectType
    switch (routeMethod) {
        case 'GET' :
            res = await getHandler(userId)
            break;
        case 'POST' :
            res = await postHandler(body);
            break;
        case 'PUT' :
            res = await putHandler(userId, body)
            break;
        case 'DELETE' :
            res = await deleteHandler(userId)
            break;
        default:
            res = {code: 404, body: "Invalid request method"}
            break;
    }
    return res
}
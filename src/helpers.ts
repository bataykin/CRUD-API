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

// export async  function serveRequest(reqMethod: string, userId?: string, body?: any) {
//     switch (reqMethod) {
//         case 'GET' :
//             await getHandler(userId);
//             break;
//         case 'POST' :
//             await postHandler(req, res);
//             break;
//         case 'PUT' :
//             await putHandler(req, res, parsedURL[2])
//             break;
//         case 'DELETE' :
//             await deleteHandler(parsedURL[2])
//             break;
//         default:
//             console.log('Unexpected HTTP-method')
//     }
// }

export async function parseId(req: IncomingMessage) {
    const parsedURL: Array<string> = req.url!.split('/').slice(1)
    return parsedURL[2]
}

export async function requestBody(req: IncomingMessage) {
    let buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    return JSON.parse(Buffer.concat(buffers).toString())

    // let body = "";
    // req.on("data", async (chunk) => {
    //     body += chunk; // convert Buffer to string
    // });
    // req.on("end", async () => {
    //     const result = await JSON.parse(body);
    //     // console.log(result);
    //     return result
    //     // req.emit('close');
    // });
}

export function stringIsAValidUrl(str: string) {
    console.log('stringIsAValidUrl = ', str)
    try {
        new URL(str);
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
};

// validate body
export const validatePostBody = (data: any) => {
    console.log('1 ', typeof  data)
    console.log('2', typeof data === 'object')
    return data !== null
        && typeof data === 'object'
        && 'username' in data
        && 'age' in data
        && 'hobbies' in data
        && typeof data.username === 'string'
        && typeof data.age === 'number'
        && Array.isArray(data.hobbies)
        && data.hobbies.every(function (element: any) {
            return typeof element === 'string'
        })
}

export async function serveRoute(routeMethod: string, userId: string, body: any): Promise<ResponseObjectType> {
    let res:ResponseObjectType
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
            res =  {code: 404, body: "Invalid request method"}
            break;
    }
    return res
}
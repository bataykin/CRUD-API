import {IncomingMessage, ServerResponse} from "http";
import {UserInputType, UserType} from "../userRepo";
import {usersArray} from "../main";
import { v4 as uuidv4 } from 'uuid';

export async function postHandler(req: IncomingMessage, res: ServerResponse) {

    // Getting request body
    const retrieveBody = async (): Promise<any> => {
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const body = JSON.parse(Buffer.concat(buffers).toString());
        return body
    }
    const body = await retrieveBody()
    console.log(body)

    // validate body
    const validateBody = (data: any) => {
        return data !== null
        && typeof data === 'object'
        && 'username' in data
        && 'age' in data
        && 'hobbies' in data
        && typeof data.username === 'string'
        && typeof data.age === 'number'
        && Array.isArray(data.hobbies)
        && data.hobbies.every(function (element:any) {
                return typeof element === 'string'
            })
    }
    const validUser  = validateBody(body)
    if (!validUser) {
        console.log('not valid user')
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            message: 'Not valid user data',
        }));
    } else {
        const user: UserType = {
            id: uuidv4(),
            username: body.username,
            age: body.age,
            hobbies: body.hobbies
        }
        usersArray.push(user)
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
    }

}
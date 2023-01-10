import {ServerResponse} from "http";
import {usersArray} from "../main";
import {v4 as uuidv4, validate} from 'uuid';
import {UserType} from "../userRepo";


export function getHandler(res: ServerResponse, userId?: string) {
    console.log('get')
    if (!userId) {
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(usersArray));
    } else {
        if (!validate(userId)) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'userId is invalid (not uuid)',
            }));
        } else {
            const userIsFound = usersArray.filter((el) => {
                return el.id == userId
            })
            console.log(userIsFound, ' is found')
            if (!userIsFound[0]) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    message: 'userId is not found',
                }));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(userIsFound[0]));
            }

        }

    }

    if (userId) console.log('userId = ', userId)


}
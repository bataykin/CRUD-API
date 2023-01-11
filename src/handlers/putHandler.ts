import {IncomingMessage, ServerResponse} from "http";
import {v4 as uuidv4, validate} from 'uuid';
import {UserType} from "../userRepo";
import {usersArray} from "../main";
import {ResponseObjectType} from "../helpers";


export async function putHandler(userId: string, body: any): Promise<ResponseObjectType> {
    console.log('put handler, userId = ', userId)
    const isUserIdValid = validate(userId)
    const isUserExist = usersArray.find(u => {
        return u.id == userId
    })

    if (!isUserIdValid) {

        return {code: 400, body: 'userId is invalid (not uuid)'}
    } else {
        if (!isUserExist) return {code: 404, body: 'userId is not found'}

        //TODO VALIDATE body

        const index = usersArray.findIndex((el) => {
            return el.id == userId
        })
        usersArray[index].username = body.username || usersArray[index].username
        usersArray[index].age = body.age || usersArray[index].age
        usersArray[index].hobbies = body.hobbies || usersArray[index].hobbies

        return {code: 200, body: usersArray[index]}
    }


}
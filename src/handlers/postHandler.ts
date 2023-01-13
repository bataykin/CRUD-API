import {UserType} from "../userRepo";
import {usersArray} from "../main";
import {v4 as uuidv4} from 'uuid';
import {ResponseObjectType} from "../helpers";
import {validatePostBody} from "../validators/createBodyValidator";


export async function postHandler(body: any): Promise<ResponseObjectType> {
    const validUser = validatePostBody(body)
    if (!validUser) {
        return {code: 400, body: 'Not valid user data'}
    } else {
        const user: UserType = {
            id: uuidv4(),
            username: body.username,
            age: body.age,
            hobbies: body.hobbies
        }
        usersArray.push(user)
        return {code: 201, body: user}
    }
}
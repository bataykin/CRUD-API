import {validate} from 'uuid';
import {UserInputType} from "../userTypes";
import {usersArray} from "../main";
import {ResponseObjectType} from "../helpers";
import {validateUpdateBody} from "../validators/updateBodyValidator";

function updateUser(user: UserInputType, body: UserInputType) {
    for (const userKey in user) {
        // @ts-ignore
        user[userKey] = body[userKey] || user[userKey]
    }
}

export async function putHandler(userId: string, body: any): Promise<ResponseObjectType> {
    const isUserIdValid = validate(userId)
    const isUserExist = usersArray.find(u => {
        return u.id == userId
    })
    if (!isUserIdValid) {
        return {code: 400, body: 'userId is invalid (not uuid)'}
    } else {
        if (!isUserExist) return {code: 404, body: 'userId is not found'}
        const index = usersArray.findIndex((el) => {
            return el.id == userId
        })
        const validBody = validateUpdateBody(body)
        if (!validBody) return {code: 200, body: usersArray[index]}
        updateUser(usersArray[index], body)
        return {code: 200, body: usersArray[index]}
    }
}
import {ResponseObjectType} from "../helpers";
import {validate} from "uuid";
import {usersArray} from "../main";

export async function deleteHandler(userId: string): Promise<ResponseObjectType> {
    console.log('delete handler')
    const isUserIdValid = validate(userId)
    const isUserExist = usersArray.find(u => {
        return u.id == userId
    })

    if (!isUserIdValid) {
        return {code: 400, body: 'userId is invalid (not uuid)'}
    } else {
        const user = usersArray.find((el) => {
            return el.id === userId
        })
        if (!user) return {code: 404, body: 'userId is not found'}
        const index = usersArray.findIndex((el) => {
            return el.id == userId
        })
        usersArray.push(   usersArray.slice(index, 1)[0])
        usersArray.pop()
        return {code: 204, body: 'User deleted successfully'}
    }
}

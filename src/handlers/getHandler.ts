import {usersArray} from "../main";
import {validate} from 'uuid';
import {ResponseObjectType} from "../helpers";


export async function getHandler(userId?: string): Promise<ResponseObjectType> {
    if (!userId) {
        return {code: 201, body: usersArray}
    } else {
        if (!validate(userId)) {
            return {code: 400, body: 'userId is invalid (not uuid)'}
        } else {
            const user = usersArray.find((el) => {
                return el.id === userId
            })
            return (!user)
                ? {code: 404, body: 'userId is not found'}
                : {code: 200, body: (user)}
        }
    }
}
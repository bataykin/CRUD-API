export const validatePostBody = (data: any) => {
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
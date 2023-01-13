export const validateUpdateBody = (data: any) => {
    if (data === null || typeof data !== 'object') return false
    if ('username' in data) {
        if (typeof data.username !== 'string') return false
    }
    if ('age' in data) {
        if (typeof data.age !== 'number') return false
    }
    if ('hobbies' in data) {
        if (!Array.isArray(data.hobbies)) return false
        const checkItems: boolean = data.hobbies.every(function (element: any) {
            return typeof element === 'string'
        })
        if (!checkItems) return false
    }
    return true
}

export function responseSuccessWithData(status, message, data) {
    return {
        success: status,
        message: message,
        data: data
    }
}


export function response(status, message) {
    return {
        success: status,
        message: message
    }
}
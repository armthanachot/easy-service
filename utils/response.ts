import { getReasonPhrase, StatusCodes } from "http-status-codes"


const responseMessages = (code, message?: any, data?: any) => {
    try {
        
        const msg = message || getReasonPhrase(code)
        return {
            code,
            message: msg,
            data
        }
    } catch (error) {
        console.log("error: ",error.message);
        return false
    }
}

export {
    responseMessages
}
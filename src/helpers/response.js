export const responseHelper = (statusCode, message, success,data)=>{
    return {
        status:statusCode,
        message:message,
        success:success,
        data:data
    }
}
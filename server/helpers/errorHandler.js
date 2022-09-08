//Error is default class in node for error handling
class ErrorHandler extends Error{  //basically we can use this class to pass our custom error messages and statuses also. this automatically add err to req and send res accordingly using middleware
    constructor(message,statusCode){
        super(message) // access constructor of Error Class
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor); //target object and this constructor
    }
}

module.exports = ErrorHandler
// responseHelper.js

// 1. Status Codes Object - Easy reference for common status codes
const StatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

// 2. Simple API Response Handler
class ApiResponse {
    // Success response
    static success(res, data, message = "Success") {
        return res.status(StatusCode.OK).json({
            status: "success",
            code: StatusCode.OK,
            message,
            data,
        });
    }

    // Created response - for new resources
    static created(res, data, message = "Created") {
        return res.status(StatusCode.CREATED).json({
            status: "success",
            code: StatusCode.CREATED,
            message,
            data,
        });
    }

    // Error response
    static error(res, message, statusCode = StatusCode.SERVER_ERROR) {
        return res.status(statusCode).json({
            status: "error",
            code: statusCode,
            message,
        });
    }
}

export { ApiResponse, StatusCode };

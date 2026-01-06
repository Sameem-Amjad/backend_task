import { ENV } from "../../constants/ENV.js";

export const commonResponses = {
    success: {
        OPERATION_SUCCESSFUL: "Operation completed successfully.",
        SERVICE_UP: 'Service is up and running.',
        SERVICE_UP_WITH_ENV: 'Service is up and running in ' + ENV.NODE_ENV + ' mode.'
    },
    fail: {
        OPERATION_FAILED: "Operation failed.",
        INVALID_TOKEN: "The provided token is invalid.",
        AUTHORIZATION_HEADER_MISSING_OR_INVALID: 'Authorization header missing or invalid',
        USER_NOT_AUTHENTICATED: 'User not authenticated',
        INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
        RESOURCE_NOT_FOUND: 'Resource not found'
    }
};
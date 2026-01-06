import { commonResponses } from "./commonResponses.js";
import * as statusCode from "http-status";

const ResponseHandler: Record<string, any> = {
    success: (
        res: any,
        data: any = {},
        status: number = (statusCode as any).OK,
        messageKey: string = commonResponses.success.OPERATION_SUCCESSFUL,
    ) => {
        console.log(data);
        res.status(status).json({
            status: true,
            message: messageKey,
            data,
            ...(Object.keys(data).length === 0 && { data: null })
        });
    }
    ,
    fail: (
        res: any,
        messageKey: string = commonResponses.fail.OPERATION_FAILED,
        data: any = {},
        status: number = (statusCode as any).BAD_REQUEST,
    ) => {
        res.status(status).json({
            status: false,
            message: messageKey,
            data,
            ...(Object.keys(data).length === 0 && { data: null })
        });
    }
}

export default ResponseHandler;
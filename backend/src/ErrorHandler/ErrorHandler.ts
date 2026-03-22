import { HttpException } from "@nestjs/common";

export class ErrorHandler extends HttpException {
    constructor(message: string, statusCode: number) {
        super(message, statusCode)
    }
}
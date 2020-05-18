import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from "uuid";
import handlerFn from "../../libs/handler";
import { getUploadUrl } from '../../libs/s3'

export const handler = handlerFn(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const { key } = event.pathParameters
    const url = getUploadUrl(key)

    return { url }
})
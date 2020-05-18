import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import handlerFn from "../../libs/handler";
import { createChannel } from '../../businessLogic/Channels'
import { CreateChannelRequest } from "../../models/CreateChannelRequest"

export const handler = handlerFn(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    const { name, createdBy }: CreateChannelRequest = JSON.parse(event.body)

    return await createChannel(name, createdBy)
})
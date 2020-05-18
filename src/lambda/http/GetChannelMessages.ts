import "source-map-support/register";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import handlerFn from "../../libs/handler";
import { getChannelMessages } from "../../businessLogic/Messages";

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { channelId } = event.pathParameters;
    const messages = await getChannelMessages(channelId);
    return messages;
  }
);

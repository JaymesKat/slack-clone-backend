import "source-map-support/register";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import handlerFn from "../../libs/handler";
import { editMessage } from "../../businessLogic/Messages";

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);

    const { messageId } = event.pathParameters;
    const { message } = JSON.parse(event.body);

    const updatedMessage = await editMessage(messageId, message);

    return updatedMessage;
  }
);

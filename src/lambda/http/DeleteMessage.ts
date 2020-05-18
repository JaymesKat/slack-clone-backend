import "source-map-support/register";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import handlerFn from "../../libs/handler";
import { deleteMessage } from "../../businessLogic/Messages";

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { messageId } = event.pathParameters;
     await deleteMessage(messageId);
    return { status: "Success"};
  }
);

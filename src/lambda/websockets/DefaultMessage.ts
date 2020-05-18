import "source-map-support/register";
import * as util from 'util'
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendMessageToClient } from "../../libs/websockets";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Websocket event", event);

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;

  const endpoint = util.format(util.format("https://%s/%s", domain, stage));
  await sendMessageToClient(endpoint, connectionId, event);

  return {
    statusCode: 200,
  };
};

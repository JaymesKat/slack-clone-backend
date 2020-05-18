import "source-map-support/register";
import * as AWS from "aws-sdk";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { createDynamoDBClient } from "../../utils/createDynamoDbClient";
import { getChannelMessages, postMessage } from "../../businessLogic/Messages";
import { getConnections } from "../../businessLogic/Connections";
import { postMessageToClients } from "../../libs/apiGateway";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Websocket event", event);

  const {
    data: { userId, channelId, message, image },
  } = JSON.parse(event.body);

  const newMessage = await postMessage(userId, channelId, message, image);
  const connections = await getConnections();

  const endpoint =
    event.requestContext.domainName + "/" + event.requestContext.stage;

  return await postMessageToClients(endpoint, connections, newMessage);
};

import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import {
  createConnection,
  deleteConnection,
} from "../../businessLogic/Connections";
import { createLogger } from "../../utils/logger";

const logger = createLogger("Websocket manager");

const connectionsTable = process.env.CONNECTIONS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Websocket event", event);

  const connectionId = event.requestContext.connectionId;

  if (event.requestContext.eventType == "CONNECT") {
    await createConnection(connectionId);

    return {
      statusCode: 200,
      body: JSON.stringify({ connectionId }),
    };
  } else if (event.requestContext.eventType === "DISCONNECT") {
    await deleteConnection(connectionId)

    return {
      statusCode: 200,
      body: "",
    };
  }
};

import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handlerFn from "../../libs/handler";
import { getAllUsers } from "../../businessLogic/Users";

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return await getAllUsers();
  }
);

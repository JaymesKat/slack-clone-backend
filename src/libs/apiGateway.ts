import * as AWS from "aws-sdk";
import { deleteConnection } from "../businessLogic/Connections";

export const createApigwApiInstance = (endpoint: string) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint,
  });
  return apigwManagementApi;
};

export const postMessageToClients = async(
  endpoint: string,
  connections: Connection[],
  message: string
) => {
  const apigwManagementApi = createApigwApiInstance(endpoint);

  const postCalls = connections.Items.map(async ({ id }) => {
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: id,
          Data: JSON.stringify(message),
        })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        await deleteConnection(id);
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack, message: "Failed postCalls" };
  }

  return { statusCode: 200, body: "Data sent." };
};

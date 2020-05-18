import { createDynamoDBClient } from "../utils/createDynamoDbClient";
import { Connection } from "../models/Connection";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class ConnectionDAO {
  constructor() {
    (this.connectionsTable = process.env.CONNECTIONS_TABLE),
      (this.dbClient = createDynamoDBClient());
  }

  async createConnection(connection: Connection): Promise<void> {
    await this.dbClient
      .put({
        TableName: this.connectionsTable,
        Item: connection,
        ttl: parseInt(Date.now() / 1000 + 1200),
      })
      .promise();
  }

  async deleteConnection(connectionId: string): Promise<void> {
    const key = {
      id: connectionId,
    };

    await this.dbClient
      .delete({
        TableName: this.connectionsTable,
        Key: key,
      })
      .promise();
  }

  async getConnections(): Promise<Connection[]> {
    const result = await this.dbClient
      .scan({
        TableName: this.connectionsTable,
        ProjectionExpression: "id",
      })
      .promise();
    return result;
  }
}

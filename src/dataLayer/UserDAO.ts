import { createDynamoDBClient } from "../utils/createDynamoDbClient";
import { User } from "../models/User";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class UserDAO {
  constructor(
    dbClient: DocumentClient = createDynamoDBClient(),
    usersTable: string = process.env.USERS_TABLE,
    usersIndex: string = process.env.USERS_INDEX,
    userIndex2: string = process.env.USERS_INDEX2
  ) {
    this.dbClient = dbClient;
    this.usersTable = usersTable;
    this.usersIndex = usersIndex;
    this.userIndex2 = userIndex2;
  }

  async getUsers(): Promise<User[]> {
    const result = await this.dbClient
      .query({
        TableName: this.usersTable,
        IndexName: this.userIndex2,
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":status": "active"
        }
      })
      .promise();

    return result.Items as User[];
  }

  async getUser(userId: string): Promise<User> {
    const result = await this.dbClient
      .get({
        TableName: this.usersTable,
        Key: {
          id: userId,
        },
      })
      .promise();

    return result.Item as User;
  }

  async getProfile(authId: string): Promise<User> {
    const result = await this.dbClient
      .query({
        TableName: this.usersTable,
        IndexName: this.usersIndex,
        KeyConditionExpression: "authId = :authId",
        ExpressionAttributeValues: {
          ":authId": authId,
        },
      })
      .promise();
    return result.Items[0] as User;
  }

  async createUserProfile(user: User): Promise<User> {
    await this.dbClient
      .put({
        TableName: this.usersTable,
        Item: user,
      })
      .promise();

    return user;
  }
}

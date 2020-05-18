import { createDynamoDBClient } from "../utils/createDynamoDbClient";
import { Membership } from "../models/Membership";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class MembershipDAO {

  constructor(
    dbClient: DocumentClient = createDynamoDBClient(),
    membershipsTable: string = process.env.MEMBERSHIPS_TABLE,
    membershipsIndex: string = process.env.MEMBERSHIPS_INDEX,
    membershipsIndex2: string = process.env.MEMBERSHIPS_INDEX_2
  ) {
    this.dbClient = dbClient;
    this.membershipsTable = membershipsTable;
    this.membershipsIndex = membershipsIndex;
    this.membershipsIndex2 = membershipsIndex2;
  }

  async getUserMemberships(userId: string, direct: string): Promise<Membership[]> {
    const result = await this.dbClient
      .query({
        TableName: this.membershipsTable,
        IndexName: this.membershipsIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":direct": direct
        },
        FilterExpression: "direct = :direct"
      })
      .promise();
  
    return result.Items as Membership[];
  }


  async getChannelMemberships(channelId: string): Promise<Membership[]> {
    const result = await this.dbClient
    .query({
      TableName: this.membershipsTable,
      IndexName: this.membershipsIndex2,
      KeyConditionExpression: "channelId = :channelId",
      ExpressionAttributeValues: {
        ":channelId": channelId,
        ":direct": false
      },
      FilterExpression: "direct = :direct"
    }).promise();

    return result.Items as Membership[];
  }
  async createMembership(membership: Membership): Promise<Membership> {
    await this.dbClient.put({
      TableName: this.membershipsTable,
      Item: membership
    }).promise()

    return membership
  }
}
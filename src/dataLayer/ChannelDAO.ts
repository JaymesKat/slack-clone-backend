import { createDynamoDBClient } from "../utils/createDynamoDbClient";
import { Channel } from "../models/Channel";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class ChannelDAO {
  constructor(
    dbClient: DocumentClient = createDynamoDBClient(),
    channelsTable: string = process.env.CHANNELS_TABLE
  ) {
    this.dbClient = dbClient;
    this.channelsTable = channelsTable;
  }

  async getSingleChannel(channelId: string): Promise<Channel> {
    const result = await this.dbClient
      .get({
        TableName: this.channelsTable,
        Key: {id: channelId}
      })
      .promise();

    const channel = result.Item;

    return channel;
  }

  async getAllChannels(): Promise<Channel> {
    const result = await this.dbClient.scan({
      TableName: this.channelsTable
    }).promise()

    return result.Items as Channel[]
  }

  async getChannels(channelIds: string[]): Promise<Channel[]> {
    const params = {RequestItems: {}};
    params.RequestItems[this.channelsTable] = {
      Keys: [
        ...channelIds.map((channelId) => ({
          id: channelId,
        })),
      ],
      AttributesToGet: [
        "id",
        "name"
      ]
    };
    
    const result = await this.dbClient.batchGet(params).promise();  
    return result.Responses[this.channelsTable] as Channel[];

  }

  async createChannel(channel: Channel): Promise<Channel> {
    await this.dbClient.put({
      TableName: this.channelsTable,
      Item: channel
    }).promise()

    return channel
  }
}

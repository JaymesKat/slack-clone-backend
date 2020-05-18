import { createDynamoDBClient } from "../utils/createDynamoDbClient";
import { Message } from "../models/Channel";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { UserDAO } from "./UserDAO";

export class MessageDAO {
  constructor(
    dbClient: DocumentClient = createDynamoDBClient(),
    messagesTable: string = process.env.MESSAGES_TABLE,
    messagesIndex: string = process.env.MESSAGES_INDEX
  ) {
    this.dbClient = dbClient;
    this.messagesTable = messagesTable;
    this.messagesIndex = messagesIndex;
  }

  async getMessage(messageId: string): Promise<Message> {
    const result = await this.dbClient
      .query({
        TableName: this.messagesTable,
        IndexName: this.messagesIndex,
        KeyConditionExpression:
          "messageId = :messageId",
        ExpressionAttributeValues: {
          ":messageId": messageId
        },
      })
      .promise();
    return result.Items[0] as Message;
  }

  async getChannelMessages(channelId: string): Promise<Message[]> {
    const date = new Date().toISOString();
    const result = await this.dbClient
      .query({
        TableName: this.messagesTable,
        KeyConditionExpression: "channelId = :channelId AND createdAt < :date",
        ExpressionAttributeValues: {
          ":channelId": channelId,
          ":date": date,
        },
        ScanIndexForward: true,
      })
      .promise();

    return result.Items as Message[];
  }

  async postMessage(message: Message): Promise<Message> {
    const result = await this.dbClient
      .put({
        TableName: this.messagesTable,
        Item: message,
      })
      .promise();
    return message;
  }

  async deleteMessage(message: Message) {
    await this.dbClient.delete({
      TableName: this.messagesTable,
      Key: {
        channelId: message.channelId,
        createdAt: message.createdAt
      }
    }).promise();
  }
}

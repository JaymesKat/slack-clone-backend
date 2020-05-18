import * as uuid from "uuid";
import { Message } from "../models/Message";
import { getUser } from "./Users";
import { MessageDAO } from "../dataLayer/MessageDAO";

const messageDAO = new MessageDAO();
const bucketName = process.env.IMAGES_BUCKET;

export async function getChannelMessages(
  channelId: string
): Promise<Message[]> {
  let messages = await messageDAO.getChannelMessages(channelId);

  return await messages;
}

export async function postMessage(
  userId: string,
  channelId: string,
  message: string,
  image: string
): Promise<Message> {
  const item = {
    messageId: uuid.v4(),
    userId,
    channelId,
    message,
    createdAt: new Date().toISOString(),
  };

  item.user = await getUser(userId);

  if (image && image.length > 0) {
    item.imageUrl = `https://${bucketName}.s3.amazonaws.com/${image}`;
  }

  return await messageDAO.postMessage(item);
}

export async function editMessage(messageId, message){
  const item = await messageDAO.getMessage(messageId)
  item.message = message
  return await messageDAO.postMessage(item)
}
export async function deleteMessage(
  messageId: string
) {
  const item = await messageDAO.getMessage(messageId)
  return await messageDAO.deleteMessage(item)
}

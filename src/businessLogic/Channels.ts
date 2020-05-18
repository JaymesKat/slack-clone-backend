import * as uuid from "uuid";
import { Channel } from "../models/Channel";
import {
  createMembership,
  getChannelMemberships,
} from "../businessLogic/Memberships";
import { ChannelDAO } from "../dataLayer/ChannelDAO";

const channelDAO = new ChannelDAO();

export async function getChannel(channelId: string): Promise<Channel> {
  return await channelDAO.getSingleChannel(channelId);
}

export async function getChannels(channelIds: string[]): Promise<Channel> {
  let channels = await channelDAO.getChannels(channelIds);

  channels = channels.map(async (channel) => {
    channel.Memberships = await getChannelMemberships(channel.id);
    return channel;
  });
  channels = await Promise.all(channels);

  return channels;
}

export async function getAllChannels(): Promise<Channel[]> {
  let channels = await channelDAO.getAllChannels();

  channels = channels.map(async (channel) => {
    channel.Memberships = await getChannelMemberships(channel.id);
    return channel;
  });
  channels = await Promise.all(channels);

  return channels.filter(channel => channel.Memberships.some(membership => membership.direct == false));
}

export async function createChannel(
  name: string,
  createdBy: string
): Promise<Channel> {
  const channel = {
    id: uuid.v4(),
    name,
    createdBy,
    createdAt: new Date().toISOString(),
  } as Channel;

  const createdChannel = await channelDAO.createChannel(channel);

  createdChannel['Memberships'] = [];
  const membership = await createMembership(createdChannel, createdBy, false);
  delete membership.channel
  createdChannel['Memberships'].push(membership);
  return createdChannel;
}

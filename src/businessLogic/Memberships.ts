import * as uuid from "uuid";
import { Channel } from "../models/Channel";
import { Membership } from "../models/Membership";
import { MembershipDAO } from "../dataLayer/MembershipDAO";

const membershipDAO = new MembershipDAO();

export async function getDirectMessages(userId: string): Promise<Membership> {
  return await membershipDAO.getUserMemberships(userId, true);
}

export async function getUserChannelMemberships(
  userId: string
): Promise<Membership[]> {
  return await membershipDAO.getUserMemberships(userId, false);
}

export async function getChannelMemberships(channelId: string) {
  return await membershipDAO.getChannelMemberships(channelId);
}

export async function createMembership(
  channel: Channel,
  userId: string,
  direct: boolean
): Promise<Membership> {
  const membership = {
    membershipId: uuid.v4(),
    channelId: channel.id,
    channel,
    userId,
    direct,
  };
  const userMemberships = await getUserChannelMemberships(userId, false);
  const channelMemberships = await userMemberships.filter(
    (membership) => membership.channelId === channel.id
  );
  if (channelMemberships.length > 0) {
    return channelMemberships[0];
  }
  return await membershipDAO.createMembership(membership);
}

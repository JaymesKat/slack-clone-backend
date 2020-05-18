import { Channel } from "./Channel";

export interface Membership {
  membershipId: string;
  userId: string;
  channelId: string;
  direct: boolean;
  channel?: Channel;
}

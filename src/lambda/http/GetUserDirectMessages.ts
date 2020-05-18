import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handlerFn from "../../libs/handler";
import { getDirectMessages } from "../../businessLogic/Memberships";
import { getChannels } from '../../businessLogic/Channels'

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { userId } = event.pathParameters;

    const directChannelMemberships = await getDirectMessages(userId);
    const channelIds = directChannelMemberships.map(
      (membership) => membership.channelId
    );

    const directChannels = channelIds.length > 0 ? (await getChannels(channelIds)) : [];
    return directChannels;
  }
);

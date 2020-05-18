import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handlerFn from "../../libs/handler";
import { getUserChannelMemberships } from '../../businessLogic/Memberships'
import { getChannels } from '../../businessLogic/Channels'

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { userId } = event.pathParameters

    const memberships = await getUserChannelMemberships(userId)
    const channelIds = memberships.map(membership => membership.channelId)
    
    if(channelIds.length > 0){
      return await getChannels(channelIds)
    }
    return [];
  }
);

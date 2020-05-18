import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handlerFn from "../../libs/handler";
import { getChannel } from "../../businessLogic/Channels";
import { createMembership } from "../../businessLogic/Memberships";
import { CreateMembershipRequest } from "../../models/CreateMembershipRequest";

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);

    const { channelId, userId }: CreateMembershipRequest = JSON.parse(
      event.body
    );

    const channel = await getChannel(channelId);
    return await createMembership(channel, userId, false);
  }
);

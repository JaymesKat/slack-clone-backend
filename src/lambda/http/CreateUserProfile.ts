import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import handlerFn from "../../libs/handler";
import { createUserProfile } from "../../businessLogic/Users";
import { CreateUserProfileRequest } from "../../models/CreateUserProfileRequest";
import { parseUserId, getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("UserProfile");

export const handler = handlerFn(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Processing event ${event}`);

    const { Authorization } = event.headers;
    const token = getToken(Authorization);
    const authId = parseUserId(token);

    const { name, username }: CreateUserProfileRequest = JSON.parse(event.body);

    const userProfile = await createUserProfile(name, username, authId);
    console.log("User profile: ", userProfile);
    return userProfile;
  }
);

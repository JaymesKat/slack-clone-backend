import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import handlerFn from "../../libs/handler";
import { getUserProfile } from '../../businessLogic/Users'
import { parseUserId, getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('UserProfile')

export const handler = handlerFn(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Processing event ${event}`)
    const { Authorization } = event.headers
    const token = getToken(Authorization)
    const authId = parseUserId(token)

    const userProfile = await getUserProfile(authId)
    if(!userProfile){
        throw Error('No user profile')
    }
    return userProfile
})
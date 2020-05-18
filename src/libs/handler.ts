import * as middy from "middy";
import { cors } from "middy/middlewares";

export default function handlerFn(lambda) {
  return middy((event) => {
    return Promise.resolve()
      .then(() => lambda(event))
      .then((responseBody) => [200, responseBody])
      .catch((e) => {
        return [500, { error: e.message }];
      })
      .then(([statusCode, body]) => ({
        statusCode,
        body: JSON.stringify(body),
      }));
  }).use(cors());
}

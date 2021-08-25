const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require('discord-interactions');
const getRawBody = require('raw-body');

const TEST_COMMAND = {
  name: 'Test',
  description: 'This is a test, try it!',
};

module.exports = async (request, response) => {
  if (request.method === 'POST') {
    const signature = request.headers['x-signature-ed25519'];
    const timestamp = request.headers['x-signature-timestamp'];
    const rawBody = await getRawBody(request);

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.error('Invalid Request');
      return response.status(401).send({ error: 'Bad request signature ' });
    }

    const message = request.body;

    if (message.type === InteractionType.PING) {
      console.log('Handling Ping request');
      response.send({
        type: InteractionResponseType.PONG,
      });
    else if (message.type === InteractionType.APPLICATION_COMMAND) {
      // Handle our Slash Commands
      switch (message.data.name.toLowerCase()) {
        case TEST_COMMAND.name.toLocaleLowerCase():
          response.status(200).send({
            type: 4,
            data: {
              content: "TEST!",
            },
          });
          console.log("Test Request");
          break;
        default:
          console.error("Unknown Command");
          response.status(400).send({ error: "Unknown Type" });
          break;
        }
      }
    }
  }
};

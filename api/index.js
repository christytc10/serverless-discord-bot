const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require('discord-interactions');
const getRawBody = require('raw-body');

const SLAP_COMMAND = {
  name: 'Slap',
  description: 'Sometimes you gotta slap a person with a large trout',
  options: [
    {
      name: 'user',
      description: 'The user to slap',
      type: 6,
      required: true,
    },
  ],
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
    }
  }
};

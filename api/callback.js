const { AuthorizationCode } = require('simple-oauth2');

const client = new AuthorizationCode({
  client: {
    id: 'Ov23lij7I1DC5dk67C38',
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
});

module.exports = async (req, res) => {
  const { code } = req.query;

  try {
    const accessToken = await client.getToken({
      code,
    });

    const token = accessToken.token.access_token;
    
    // This response is what Decap CMS expects
    const content = `
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({
              token: token,
              provider: 'github'
            })}',
            message.origin
          );
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (error) {
    console.error('Access Token Error', error.message);
    res.status(500).json(error.message);
  }
};

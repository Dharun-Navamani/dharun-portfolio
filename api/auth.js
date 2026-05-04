const { AuthorizationCode } = require('simple-oauth2');

const client = new AuthorizationCode({
  client: {
    id: 'Ov23lij7IlDC5dk67C38',
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
});

module.exports = async (req, res) => {
  const authorizationUri = client.authorizeURL({
    scope: 'repo,user',
    state: Math.random().toString(36).substring(2),
  });

  res.writeHead(302, { Location: authorizationUri });
  res.end();
};

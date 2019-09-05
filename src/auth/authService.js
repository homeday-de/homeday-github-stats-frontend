import createAuth0Client from '@auth0/auth0-spa-js';

let auth0 = null;

const AuthService = () => {
  const getInstance = async () => {
    if (auth0) {
      return auth0;
    }

    auth0 = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN,
      client_id: process.env.AUTH0_CLIENT_ID,
    });

    return auth0;
  };

  const login = async () => {
    const auth0Client = await getInstance();

    await auth0Client.loginWithPopup();

    const user = await auth0Client.getUser();
    return user;
  };

  return {
    getInstance,
    login,
  };
};

export default AuthService();

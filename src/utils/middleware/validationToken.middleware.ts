import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const validationToken = (handler: Function) => {
  return async (req: NextApiRequest | any, res: NextApiResponse) => {
    let { 'nextauth.token.uno': token } = req.cookies;

    if (!token) {
      token = `Bearer ${req.body?.tokenRecover}`;
    }

    const authorizationHeader = req.headers.authorization || token;
    let isAuthenticated = false;

    await axios
      .post('/api/auth/token', null, {
        headers: {
          Authorization: authorizationHeader,
        },
      })
      .then((res) => {
        isAuthenticated = true;

        req.userInfo = res.data;
      })
      .catch((e) => {
        isAuthenticated = false;
      });

    if (!authorizationHeader || !isAuthenticated) {
      res.status(401).json({
        code: 401,
        message:
          'Cabeçalho de autorização ausente por favor preencher ou token inválido',
      });
      return;
    }

    return handler(req, res);
  };
};

export default validationToken;

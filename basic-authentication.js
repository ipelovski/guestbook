'use strict';

const basicPrefix = 'basic ';

function createMiddleware(options) {
  const realm = options.realm || 'default realm';
  const authenticate = options.authenticate;
  if (authenticate == null || !(typeof authenticate === 'function')) {
    throw new Error('Need a function to authenticate users. Put it in the "authenticate" property.');
  }
  function middleware(req, res, next) {
    const requireAuthentication = () => {
      res.set('WWW-Authenticate', `Basic realm="${realm}"`);
      return res.status(401).end();
    }
    let credentials = readCredentials(req);
    if (credentials === null) {
      requireAuthentication();
    }
    else {
      try {
        let authentication = authenticate(credentials.username, credentials.password);
        if (authentication instanceof Promise) {
          authentication.then(next).catch(requireAuthenticationres);
        }
        else {
          if (authentication) {
            next();
          }
          else {
            requireAuthentication();
          }
        }
      }
      catch(err) {
        requireAuthentication();
      }
    }
  }

  function readCredentials(req) {
    let authorization = req.headers.authorization;
    if (authorization == null) {
      return null;
    }
    let isBasic = authorization.substring(0, basicPrefix.length).toLowerCase() === basicPrefix;
    if (!isBasic) {
      return null;
    }
    let encodedCredentials = authorization.substring(basicPrefix.length);
    let buffer = Buffer.from(encodedCredentials, 'base64');
    let decodedCredentials = buffer.toString('utf8');
    let separatorIndex = decodedCredentials.indexOf(':');
    let username = decodedCredentials.substring(0, separatorIndex);
    let password = decodedCredentials.substring(separatorIndex + 1);
    return { username, password };
  }

  return middleware;
}

module.exports = createMiddleware;

import queryString from 'query-string';
import request from 'superagent';
import { apiHost, appHost } from 'c0nfig';

let token;

const buildResourceUrl = resourceSlug => {
  return `${apiHost}/${resourceSlug}`;
}

const auth = () => {
  return new Promise(resolve => {
    const query = queryString.parse(window.location.search);
    const { access_token } = query;

    if (access_token) {
      token = access_token;

      // save token to storage
      localStorage.setItem('access_token', access_token);

      // remove token from query
      delete query.access_token;
      window.location = `${window.location.pathname}?${queryString.stringify(query)}`;

      return;
    }

    // check if token already exists
    token = localStorage.getItem('access_token');

    if (!token) {
      window.location = `${apiHost}/auth/github?redirect_uri=${appHost}`;
      return;
    }

    resolve();
  });
}

const list = () => {
  const path = buildResourceUrl('list');

  return request.get(path).query({access_token: token}).then(r => r.body);
}

const rescan = () => {
  const path = buildResourceUrl('rescan');

  return request.post(path).query({access_token: token}).then(r => r.body);
}

export {
  auth,
  list,
  rescan
}

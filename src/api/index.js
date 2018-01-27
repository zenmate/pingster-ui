import request from 'superagent';
import queryString from 'query-string';
import {
  apiHost,
  appHost
} from '../config';

let token = '';

const buildResourceUrl = (resourceSlug) => {
  return `${apiHost}/${resourceSlug}`;
}

const auth = () => {
  const { access_token } = queryString.parse(window.location.search);

  return new Promise((resolve, reject) => {
    token = localStorage.getItem('access_token');

    if (access_token) {
      localStorage.setItem('access_token', access_token);
      token = access_token;
      return resolve();
    } else if (!token) {
      window.location = `${apiHost}/auth/github?redirect_uri=${appHost}`;
    }

    return resolve();
  });
}

const list = () => {
  const path = buildResourceUrl('list');
  return request.get(path).query({ access_token: token }).then(r => r.body);
}

const rescan = () => {
  const path = buildResourceUrl('rescan');
  return request.post(path).query({ access_token: token }).then(r => r.body);
}

export {
  list,
  rescan,
  auth
}

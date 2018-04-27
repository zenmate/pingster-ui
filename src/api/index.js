import queryString from 'query-string';
import request from 'superagent';
import { pingster_api } from 'c0nfig';

let token;

const buildResourceUrl = resourceSlug => {
  return `${pingster_api}/${resourceSlug}`;
}

const auth = () => {
  return new Promise(resolve => {
    const query = queryString.parse(window.location.search);
    const { access_token } = query;

    token = localStorage.getItem('access_token');

    if (access_token) {
      token = access_token;

      localStorage.setItem('access_token', access_token);

      delete query.access_token;
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    resolve(!!token);
  });
}

const login = () => {
  window.location = `${pingster_api}/auth/github?redirect_uri=${window.location.href}`;
}

const logout = () => {
  token = null;
  localStorage.removeItem('access_token');
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
  rescan,
  logout,
  login
}

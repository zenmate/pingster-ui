import request from 'superagent';
import config from '../config';

const buildResourceUrl = (resourceSlug) => {
  const { api_host } = config;
  return `${api_host}/${resourceSlug}`;
}

const list = () => {
  const path = buildResourceUrl('list');
  return request.get(path).then(r => r.body);
}

const rescan = () => {
  const path = buildResourceUrl('rescan');
  return request.post(path).then(r => r.body);
}

export {
  list,
  rescan
}
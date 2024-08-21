import { TIMEOUT_SEC } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, method = undefined, data = undefined) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(data && { body: JSON.stringify(data) }),
    };

    const fetchPro = method ? fetch(url, options) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`One test: ${data.message} (${data.status})`);

    if (method !== 'DELETE') return res.json();
    // Return the data
  } catch (err) {
    throw err;
  }
};

import { TIMEOUT_SEC } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, data = undefined) {
  try {
    console.log(url, data);
    const fetchPro = data
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`One test: ${data.message} (${data.status})`);

    return res.json();
  } catch (err) {
    throw err;
  }
};

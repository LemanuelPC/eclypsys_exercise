import xmlrpc from 'xmlrpc';

const url = 'https://lab.rochatindustrie.ch/xmlrpc/2/common';
const db = 'rochat_test';
const username = 'admin@eclypsys.ch';
const password = 'mU"6f.Y>8T)HUkE';

const commonClient = xmlrpc.createClient({
  url: url,
});

commonClient.methodCall('authenticate', [db, username, password, {}], (error, uid) => {
  if (error) {
    console.error('Authentication Error:', error.message);
  } else if (!uid) {
    console.error('Authentication failed: Invalid credentials.');
  } else {
    console.log('Authentication successful, user ID:', uid);
  }
});

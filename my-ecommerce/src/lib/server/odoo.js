import xmlrpc from 'xmlrpc';

// Define Odoo connection parameters
const url = 'https://lab.rochatindustrie.ch/xmlrpc/2/';
const db = 'rochat_test';
const username = 'admin@eclypsys.ch';
const password = 'mU"6f.Y>8T)HUkE';

// Create XML-RPC clients for common and object endpoints
const commonClient = xmlrpc.createClient({ url: `${url}common` });
const objectClient = xmlrpc.createClient({ url: `${url}object` });

// Function to check the server version
export async function checkServerVersion() {
  return new Promise((resolve, reject) => {
    commonClient.methodCall('version', [], (error, versionInfo) => {
      if (error) {
        console.error('Version Check Error:', error);
        reject(`Failed to check server version: ${error.message}`);
      } else {
        console.log('Server Version Information:', versionInfo);
        resolve(versionInfo);
      }
    });
  });
}

// Function to authenticate with Odoo
export async function authenticate() {
  return new Promise((resolve, reject) => {
    commonClient.methodCall('authenticate', [db, username, password, {}], (error, uid) => {
      if (error) {
        console.error('Authentication Error:', error);
        console.error('Full Response:', error.response ? error.response.data : 'No response data available');
        reject(`Authentication failed: ${error.message}`);
      } else {
        console.log('Authentication successful, user ID:', uid);
        resolve(uid);
      }
    });
  });
}

// Function to get products from Odoo
export async function getProducts() {
  try {
    // Perform a version check to verify server connection
    await checkServerVersion();

    const uid = await authenticate(); // Get the UID after successful authentication

    return new Promise((resolve, reject) => {
      const params = [
        db,
        uid,
        password,
        'product.template',
        'search_read',
        [],
        {
          fields: ['name', 'list_price', 'standard_price', 'qty_available', 'categ_id'],
          limit: 10,
        },
      ];

      objectClient.methodCall('execute_kw', params, (error, products) => {
        if (error) {
          console.error('Error in getProducts:', error);
          reject(`Failed to fetch products: ${error.message}`);
        } else {
          console.log('Products:', products);
          resolve(products);
        }
      });
    });
  } catch (error) {
    console.error('Error in getProducts:', error.message);
    throw error;
  }
}

// Function to get categories from Odoo
export async function getCategories() {
  try {
    // Perform a version check to verify server connection
    await checkServerVersion();

    const uid = await authenticate();

    return new Promise((resolve, reject) => {
      const params = [
        db,
        uid,
        password,
        'product.category',
        'search_read',
        [],
        {
          fields: ['name'],
        },
      ];

      objectClient.methodCall('execute_kw', params, (error, categories) => {
        if (error) {
          console.error('Error in getCategories:', error);
          reject(`Failed to fetch categories: ${error.message}`);
        } else {
          console.log('Categories:', categories);
          resolve(categories);
        }
      });
    });
  } catch (error) {
    console.error('Error in getCategories:', error.message);
    throw error;
  }
}

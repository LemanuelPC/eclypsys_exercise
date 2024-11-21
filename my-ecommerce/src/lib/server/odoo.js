import axios from 'axios';
import { parseStringPromise } from 'xml2js';  // Import the XML parser

// Define Odoo connection parameters
const url = 'https://lab.rochatindustrie.ch/xmlrpc/2/';
const db = 'rochat_test';
const username = 'admin@eclypsys.ch';
const password = 'mU"6f.Y>8T)HUkE';

// Function to authenticate with Odoo using Axios
export async function authenticate() {
    const xmlRequest = `<?xml version="1.0"?>
<methodCall>
  <methodName>authenticate</methodName>
  <params>
    <param><value><string>${db}</string></value></param>
    <param><value><string>${username}</string></value></param>
    <param><value><string>${password}</string></value></param>
    <param><value><struct /></value></param>
  </params>
</methodCall>`;

    try {
        const response = await axios.post(`${url}common`, xmlRequest, {
            headers: {
                'Content-Type': 'text/xml',
            },
        });

        const responseData = response.data;

        // Extract user ID from XML response
        const parsedResponse = await parseStringPromise(responseData);
        const uid = parsedResponse?.methodResponse?.params?.[0]?.param?.[0]?.value?.[0]?.int?.[0];

        if (uid) {
            console.log('Authentication successful, user ID:', uid);
            return parseInt(uid);
        } else {
            throw new Error('Failed to extract user ID from response.');
        }

    } catch (error) {
        console.error('Authentication Error:', error.message);
        throw new Error(`Authentication failed: ${error.message}`);
    }
}

// Function to get products from Odoo using Axios
export async function getProducts() {
    try {
        const uid = await authenticate(); // Get the UID after successful authentication

        if (uid) {
            const xmlRequest = `<?xml version="1.0"?>
<methodCall>
  <methodName>execute_kw</methodName>
  <params>
    <param><value><string>${db}</string></value></param>
    <param><value><int>${uid}</int></value></param>
    <param><value><string>${password}</string></value></param>
    <param><value><string>product.template</string></value></param>
    <param><value><string>search_read</string></value></param>
    <param><value><array><data></data></array></value></param>
    <param>
      <value>
        <struct>
          <member>
            <name>fields</name>
            <value>
              <array>
                <data>
                  <value><string>name</string></value>
                  <value><string>list_price</string></value>
                  <value><string>description</string></value>
                  <value><string>image_1920</string></value>
                </data>
              </array>
            </value>
          </member>
        </struct>
      </value>
    </param>
  </params>
</methodCall>`;

            const response = await axios.post(`${url}object`, xmlRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                },
            });

            const productsData = response.data;

            // Parse the XML response to extract products data
            const parsedResponse = await parseStringPromise(productsData);
            const productList = parsedResponse?.methodResponse?.params?.[0]?.param?.[0]?.value?.[0]?.array?.[0]?.data?.[0]?.value;

            if (productList) {
                // Process each product
                const products = productList.map(product => {
                    const fields = product?.struct?.[0]?.member || [];
                    const productData = {};

                    fields.forEach(field => {
                        const name = field?.name?.[0];
                        const value = field?.value?.[0]?.string?.[0] || field?.value?.[0]?.double?.[0] || field?.value?.[0]?.base64?.[0];
                        if (name) {
                            productData[name] = value;
                        }
                    });

                    return productData;
                });

                console.log('Products:', products);
                return products;
            } else {
                throw new Error('Failed to extract products from response.');
            }
        }
    } catch (error) {
        console.error('Error in getProducts:', error.message);
        throw error;
    }
}

// Function to get categories from Odoo using Axios
export async function getCategories() {
    try {
        const uid = await authenticate(); // Get the UID after successful authentication

        if (uid) {
            const xmlRequest = `<?xml version="1.0"?>
<methodCall>
  <methodName>execute_kw</methodName>
  <params>
    <param><value><string>${db}</string></value></param>
    <param><value><int>${uid}</int></value></param>
    <param><value><string>${password}</string></value></param>
    <param><value><string>product.category</string></value></param>
    <param><value><string>search_read</string></value></param>
    <param><value><array><data></data></array></value></param>
    <param>
      <value>
        <struct>
          <member>
            <name>fields</name>
            <value>
              <array>
                <data>
                  <value><string>name</string></value>
                </data>
              </array>
            </value>
          </member>
        </struct>
      </value>
    </param>
  </params>
</methodCall>`;

            const response = await axios.post(`${url}object`, xmlRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                },
            });

            const categoriesData = response.data;

            // Parse the XML response to extract categories data
            const parsedResponse = await parseStringPromise(categoriesData);
            const categoryList = parsedResponse?.methodResponse?.params?.[0]?.param?.[0]?.value?.[0]?.array?.[0]?.data?.[0]?.value;

            if (categoryList) {
                // Process each category
                const categories = categoryList.map(category => {
                    const fields = category?.struct?.[0]?.member || [];
                    const categoryData = {};

                    fields.forEach(field => {
                        const name = field?.name?.[0];
                        const value = field?.value?.[0]?.string?.[0];
                        if (name) {
                            categoryData[name] = value;
                        }
                    });

                    return categoryData;
                });

                console.log('Categories:', categories);
                return categories;
            } else {
                throw new Error('Failed to extract categories from response.');
            }
        }
    } catch (error) {
        console.error('Error in getCategories:', error.message);
        throw error;
    }
}

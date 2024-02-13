const { parseString } = require('xml2js');
const Ajv = require('ajv');

const validateWithXSD = (xmlData, xsdData) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(new Error(err.message));
      } else {
        const ajv = new Ajv();
        const validate = ajv.compile(xsdData);

        if (validate(result)) {
          console.log('XML is valid.');
          resolve(result);
        } else {
          console.error('XML is not valid according to XSD:', ajv.errors);
          reject(new Error('XML is not valid according to XSD'));
        }
      }
    });
  });
};

module.exports = { validateWithXSD };
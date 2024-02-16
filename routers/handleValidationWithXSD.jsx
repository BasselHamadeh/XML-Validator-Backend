const { parseXml } = require('libxmljs');

const validateWithXSD = (xmlData, xsdData) => {
  return new Promise((resolve, reject) => {
    try {
      const xmlDoc = parseXml(xmlData);
      const xsdDoc = parseXml(xsdData);
      xmlDoc.validate(xsdDoc);

      if (xmlDoc.validationErrors.length === 0) {
        console.log('XML is valid.');
        resolve({ success: true, result: xmlDoc });
      } else {
        const validationErrorMessages = xmlDoc.validationErrors.map(error => error.toString());
        console.error('XML is not valid according to XSD:', validationErrorMessages);
        reject({ success: false, errors: validationErrorMessages });
      }
    } catch (error) {
      console.error('Error parsing XML or XSD:', error);
      reject({ success: false, errors: [error.message] });
    }
  });
};

module.exports = { validateWithXSD };
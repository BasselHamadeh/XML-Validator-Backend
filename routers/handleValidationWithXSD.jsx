const { parseXml } = require('libxmljs');

const validateXSD = (xsdData) => {
    try {
        if (!xsdData) {
            throw new Error('XSD data is not defined.');
        }
        parseXml(xsdData);
        console.log('XSD is valid.');
        return true;
    } catch (error) {
        console.error('Error validating XSD:', error);
        throw new Error('Invalid XSD data.');
    }
};

const validateWithXSD = async (xmlData, xsdData) => {
  try {
      const xsdIsValid = validateXSD(xsdData);
      if (!xsdIsValid) {
          throw new Error('Invalid XSD data.');
      }

      const xmlDoc = parseXml(xmlData);
      const xsdDoc = parseXml(xsdData);
      xmlDoc.validate(xsdDoc);

      if (xmlDoc.validationErrors.length === 0) {
          console.log('XML is valid.');
          return { success: true };
      } else {
          const validationErrorMessages = xmlDoc.validationErrors.map(error => error.toString());
          console.error(validationErrorMessages);
          throw new Error(`${validationErrorMessages}`);
      }
  } catch (error) {
      console.error('Error validating XML with XSD:', error);
      throw error;
  }
};

module.exports = { validateWithXSD };
const { parseXml } = require('libxmljs');

const validateXSD = (xsdData) => {
    try {
        if (!xsdData) {
            throw new Error('XSD data is not defined.');
        }
        parseXml(xsdData);
        return true;
    } catch (error) {
        console.error('Error validating XSD:', error);
        throw new Error('XML or XSD content is missing, which is essential for the system to process data effectively.');
    }
};

const validateWithXSD = async (xmlData, xsdData) => {
  try {
      if (!xmlData || !xsdData) {
          throw new Error('XML or XSD content is missing, which is essential for the system to process data effectively.');
      }
      
      const xsdIsValid = validateXSD(xsdData);
      if (!xsdIsValid) {
          throw new Error('Invalid XSD data.');
      }

      const xmlDoc = parseXml(xmlData);
      const xsdDoc = parseXml(xsdData);
      xmlDoc.validate(xsdDoc);

      if (xmlDoc.validationErrors.length === 0) {
          console.log('Based on the provided XSD schema, the XML document is determined to be valid.');
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
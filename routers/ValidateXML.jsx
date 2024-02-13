const { parseString } = require('xml2js');

const validateWithoutXSD = async (xmlData) => {
  return new Promise((resolve, reject) => {
    if (!xmlData.trim()) {
      reject(['No XML content provided']);
      return;
    }

    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error(err);
        reject([err.message]);
      } else {
        if (result && result.parsererror) {
          const parserErrors = result.parsererror;
          const errorMessage = parserErrors.trim();
          reject([errorMessage]);
        } else {
          resolve(result);
        }
      }
    });
  });
};

const handleValidationWithoutXSD = async (req, res) => {
  try {
    const xmlData = req.body.xmlData;

    validateWithoutXSD(xmlData)
      .then((result) => {
        res.json({ success: true, validationResults: result });
      })
      .catch((error) => {
        console.error('Error during validation without XSD:', error);
        res.status(400).json({ success: false, errors: [...error] });
      });
  } catch (error) {
    console.error('Error during validation without XSD:', error);
    res.status(500).json({ success: false, errors: ['Internal Server Error'] });
  }
};

module.exports = { handleValidationWithoutXSD };
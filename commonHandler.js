'use strict'
const ErrorList = require('./constants/errors.json')
const error = require('./utils/error')
const constants = require('./constants/constants')
const DataDocument = require('./models/sampleData')


module.exports = {

  /**
   * Calls the associated handler to execute functions specific to document/ asset type
   * @param {ChaincodeStub} stub Chaincode stub
   * @param {String} dataDocumentType Document/record type
   * @param {String} methodType Method associated with a document type to be executed
   * @param {Object} data Data
   */
  async runOperation(stub, dataDocumentType, methodType, data) {
    let documentType
    // document types and thus models can be added if new asset types are subsequently defined
    switch (dataDocumentType) {
      case constants.DOCUMENT_TYPE_DATA: {
        documentType = DataDocument
        break
      }
      default: {
        throw error(ErrorList.UNKNOWN_DATA_CATEGORY.name)
      }
    }
    if (typeof documentType[methodType] !== 'function') {
      throw error(ErrorList.UNKNOWN_METHOD_ERROR.name, { methodName: methodType })
    }
    return documentType[methodType](stub, data)
  }
}

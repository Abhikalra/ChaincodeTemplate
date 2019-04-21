'use strict'
const errorList = require('../constants/errors.json')
const error = require('../utils/error')
const dataValidation = require('../validations/sampleValidation')
const constants = require('../constants/constants')
const Validation = require('../utils/validateData')
const Helper = require('../utils/helper')

module.exports = {

  /**
   * Creates new records on the blockchain
   * @param {ChaincodeStub} stub Chaincode stub
   * @param {Object} data data to be stored on the blockchain for a document/asset type
   */
  async create(stub, data) {
    console.info('Starting add data transaction')
    let validatedData = Validation.validateData(dataValidation.sampleData, data)
    validatedData = await Helper.addDocumentTypeToData(constants.DOCUMENT_TYPE_DATA, validatedData)
    await Helper.putData(stub, constants.DOCUMENT_TYPE_DATA, validatedData.id, validatedData)
    console.info('Ending add data transaction')
    return Buffer.from('success')
  },

  /**
   * Gets records from the blockchain
   * @param {ChaincodeStub} stub Chaincode stub
   * @param {Number} key Document Key ID
   */
  async get(stub, key) {
    let results = await Helper.getData(stub, constants.DOCUMENT_TYPE_DATA, key)
    if (results.length === 0) {
      throw error(errorList.KEY_NOT_FOUND.name, {
        documentType: 'Sample data',
        key: key
      })
    }
    return results
  },

  /**
 * Updates data/asset details on blockchain
 * @param {ChaincodeStub} stub Chaincode stub 
 * @param {Object} updatedInfo Data to be updated
 */
  async update(stub, updatedInfo) {
    console.info('Starting update data transaction')
    const foundData = await Helper.getData(stub, constants.DOCUMENT_TYPE_DATA, updatedInfo.id)
    if (foundData.length === 0) {
      throw error(errorList.KEY_NOT_FOUND.name, {
        documentType: 'Sample Data',
        key: updatedInfo.id
      })
    }
    let originalObject = JSON.parse(foundData.toString('utf8'))
    const validatedInfo = Validation.validateData(dataValidation.sampleData, updatedInfo)
    for (let key in validatedInfo) {
      originalObject[key] = validatedInfo[key]
    }
    await Helper.putData(stub, constants.DOCUMENT_TYPE_DATA, originalObject.id, originalObject)
    console.info('Ending update data transaction')
    return Buffer.from('success')
  },

  /**
   * Fetches all documents by a rich query against the data Store(Only if using CouchDB)
   * The query can be whatever data we wish to search against the data store as long as it follows the format for rich query against couchDB
   * @param {ChaincodeStub} stub Chaincode stub
   * @param {Number} filterParam Data to filter the data
   */
  async getAllByFilter(stub, filterParam) {
    const queryString = {
      "selector": {
        "id": {
          "$eq": filterParam
        },
        "_id": {
          "$regex": constants.DOCUMENT_TYPE_DATA
        }
      }
    }
    return Helper.getDataByQuery(stub, queryString)
  }
}


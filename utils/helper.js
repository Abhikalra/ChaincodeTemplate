'use strict'

/*
  This module function as a wrapper around the common CRUD based functions provided by the Chaincode interface on for Fabric shim
  Multiple chaincodes can be deployed to handle data for different asset type differentiated by the corresponding key namespace
  Herein, different document types storing different types of assets are stored via a single chaincode. The differentiator is the document type
  and the keys being created to store the value. The key can be a unique numeric identifier while the key for storing the asset on Fabric thus
  becomes the concatenation of document type + key ID
*/

module.exports = {
  /**
   * Creates a unique key for the record by concatenating the record/document type and key ID
   * @param {String} documentType Chaincode document/record type
   * @param {Number} keyId Id for the record
   */
  generateKey(documentType, keyId) {
    return String(documentType + keyId)
  },

  /**
   * Adds the document/ record type to the data that will be stored as the value associated to the key
   * @param {String} documentType Record/document type
   * @param {Object} data Data to be stored
   */
  addDocumentTypeToData(documentType, data) {
    if (data) {
      if (Array.isArray(data)) {
        for (const record of data) {
          record.documentType = documentType
        }
      } else {
        data.documentType = documentType
      }
    }
    return data
  },

  /**
   * Returns the data associated with the key
   * @param {ChaincodeStub} stub Chaincode stub 
   * @param {String} documentType Record/document type
   * @param {Number} keyId ID to be searched
   */
  getData(stub, documentType, keyId) {
    const dataKey = this.generateKey(documentType, keyId)
    return stub.getState(dataKey)
  },

  /**
   * Adds data to the blockchain
   * @param {ChaincodeStub} stub Chaincode stub
   * @param {String} key Unique key to store the data
   * @param {String} documentType Record/document type
   * @param {Object} data Data to be stored
   */
  putData(stub, documentType, key, data) {
    const dataKey = this.generateKey(documentType, key)
    return stub.putState(dataKey, Buffer.from(JSON.stringify(data)))
  },

  /**
  * Deletes key from blockchain state store
  * @param {ChaincodeStub} stub Chaincode stub
  * @param {String} key Unique key to store the data
  * @param {String} documentType Record/document type
  */
  deleteData(stub, documentType, key) {
    const dataKey = this.generateKey(documentType, key)
    return stub.deleteState(dataKey)
  },

  /**Fetches records based on a rich query run against the blockchain data
   * This is only valid if we are using CouchDB as the state store for Hyperledger fabric.
   * The getQueryResult() function of fabric-shim.ChaincodeStub class returns an iterator.
   * We loop through the result of the function to get the matching values and return it.
   * @param {ChaincodeStub} stub Chaincode stub
   * @param {Object} queryString Rich query to be executed
   */
  async getDataByQuery(stub, queryString = {}) {
    const queryResult = []
    const results = await stub.getQueryResult(JSON.stringify(queryString))
    let shouldContinue = true
    do {
      const iterator = await results.next()
      if (iterator.value && iterator.value.value.toString()) {
        let record = JSON.parse(iterator.value.value.toString('utf8'))
        queryResult.push(record)
      }
      if (iterator.done) shouldContinue = false
    } while (shouldContinue)
    await results.close()
    return Buffer.from(JSON.stringify(queryResult))
  }
}
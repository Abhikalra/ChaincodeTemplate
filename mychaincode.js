const shim = require('fabric-shim')
const errorList = require('./constants/errors.json')
const error = require('./utils/error')
const commonHandler = require('./commonHandler')

/*
Chaincode that will be deployed on Hyperledger Fabric
*/

class MySampleChaincode {
  /**
   * Called when chaincode is deployed or upgraded
   * @param {ChaincodeStub} stub Chaincode Stub
   */
  async Init(stub) {
    return shim.success()
  }

  /**
   * Invokes operations on blockchain
   * @param {ChaincodeStub} stub Chaincode stub
   */
  async Invoke(stub) {
    try {
      console.info('Start Invoke transaction...')

      const passedArguments = stub.getArgs()
      const chaincodeOperationType = passedArguments[0]
      const categoryType = passedArguments[1]
      const method = passedArguments[2]
      const operationData = passedArguments[3] ? JSON.parse(passedArguments[3]) : {}
      console.info('Chaincode operation type: ', chaincodeOperationType)
      console.log('Document category: ', categoryType)
      if (!['invoke', 'query'].includes(chaincodeOperationType)) throw error(errorList.UNKNOWN_CHAINCODE_OPERATION_TYPE.name)
      const returnData = await commonHandler.runOperation(stub, categoryType, method, operationData)
      if (returnData === undefined || returnData === null || !Buffer.isBuffer(returnData)) {
        throw error(errorList.CHAINCODE_ERROR.name)
      }
      return shim.success(returnData)
    } catch (err) {
      if (!err.hasOwnProperty('name')) {
        const chaincodeError = error(errorList.CHAINCODE_ERROR.name)
        return shim.error(JSON.stringify(chaincodeError))
      }
      return shim.error(JSON.stringify(err))
    }
  }
}

shim.start(new MySampleChaincode())
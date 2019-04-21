'use strict'

const Joi = require('joi')
const error = require('../utils/error')
const ErrorList = require('../constants/errors')

/*
  Validate the incoming data that needs to be stored on hyperledger fabric.
  JOI package is used to validate the incoming JSON schema
  If the object is found to be adhering to the schema defined, the validated object will be returned else an error with an array
  object listing the erros will be thrown.
 */

module.exports = {
  /**
   * Validates the provided incoming data to chaincode against the validation schema
   * @param {Object} schema Schema for JOI validation
   * @param {Bbject} data Data to be validated
   */
  validateData(schema, data) {
    const errObj = { message: `The following fields are missing or have been entered with invalid data:`, errors: [] }
    const validationResult = Joi.validate(data, schema, { abortEarly: false })
    if (validationResult.error) {
      validationResult.error.details.forEach((error) => {
        errObj.errors.push(` ${error.message.replace(/['"]+/g, '')} at ${error.path}`)
      })
      throw error(ErrorList.VALIDATION_ERRORS_ENCOUNTERED.name, errObj)
    }
    return validationResult.value
  }
}
'use strict'
const errors = require('../constants/errors')
const _ = require('lodash')

/**
 * Formats the errors from the error.json.
 * @param {String} name - The name of the error to be logged.
 * @param {Object} data - The object to be added to the error object.
 * @return {String} - The error object as a string value.
 */
module.exports = (name, data) => {
  const error = new Error()
  error.name = _.get(errors, `${name}.name`, name)
  error.message = _.get(errors, `${name}.message`, '')
  error.statusCode = _.get(errors, `${name}.statusCode`, '')
  error.status = _.get(errors, `${name}.statusCode`, '')
  error.object = {}

  data = data || {}
  if (_.isPlainObject(data) && !_.isEmpty(data)) {
    const keys = Object.keys(data)
    keys.forEach(key => {
      error.object[key] = data[key]
    })
  }
  return error
}

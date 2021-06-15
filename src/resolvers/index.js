const merge = require('lodash/merge')
const Hello = require('./Hello.js')
const Query = require('./Query.js')
const Mutation = require('./Mutation.js')
const Subscription = require('./Subscription.js')
const PureObj = Object.create(null)

module.exports = merge(PureObj, Hello, Query, Mutation, Subscription)
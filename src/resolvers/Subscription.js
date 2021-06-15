const Db = require('../db')
const { PubSub, withFilter } = require('apollo-server')
const pubsub = new PubSub()

const USER_UPDATE_CHANNEL = 'USER_UPDATE'

module.exports = {
    Mutation: {
        updateUser: (parent, { id, name, email, age, gender }) => Db.user({ id })
            .then(existUser => {
                if (!existUser)
                    throw new Error('没有这个id的人')
                return existUser
            })
            .then(() => Db.updateUser({ id, name, email, age, gender }))
            .then(user => {
                pubsub.publish(USER_UPDATE_CHANNEL, { subsUser: user })
                return user
            })

    },
    Subscription: {
        subsUser: {
            subscribe: withFilter(
                (parent, { id }) => pubsub.asyncIterator(USER_UPDATE_CHANNEL),
                (payload, variables) => payload.subsUser.id === variables.id
            ),
            resolve: (payload, variables) => {
                console.log('🚢 接收到数据： ', payload)
                return payload.subsUser
            }
        }
    }
}
const Db = require('../db')

module.exports = {
    Query: {
        users: (parent, args) => Db.users({}),
        user: (parent, { id }) => Db.user({ id })
    }
}
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 7000

const schema = buildSchema(
    fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' })
);

// query: http://localhost:7000/graphql?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20tool%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%20see%20intelligent%0A%23%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%20live%20syntax%20and%0A%23%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20GraphQL%20queries%20typically%20start%20with%20a%20%22%7B%22%20character.%20Lines%20that%20start%0A%23%20with%20a%20%23%20are%20ignored.%0A%23%0A%23%20An%20example%20GraphQL%20query%20might%20look%20like%3A%0A%23%0A%23%20%20%20%20%20%7B%0A%23%20%20%20%20%20%20%20field(arg%3A%20%22value%22)%20%7B%0A%23%20%20%20%20%20%20%20%20%20subField%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%0A%23%20Keyboard%20shortcuts%3A%0A%23%0A%23%20%20Prettify%20Query%3A%20%20Shift-Ctrl-P%20(or%20press%20the%20prettify%20button%20above)%0A%23%0A%23%20%20%20%20%20Merge%20Query%3A%20%20Shift-Ctrl-M%20(or%20press%20the%20merge%20button%20above)%0A%23%0A%23%20%20%20%20%20%20%20Run%20Query%3A%20%20Ctrl-Enter%20(or%20press%20the%20play%20button%20above)%0A%23%0A%23%20%20%20Auto%20Complete%3A%20%20Ctrl-Space%20(or%20just%20start%20typing)%0A%23%0A%0A%0Aquery%20%7B%0A%20%20hello%0A%20%20user(id%3A%20%222%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20email%0A%20%20%20%20age%0A%20%20%7D%0A%20%20users%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%7D%0A%7D
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: require('./resolvers/index').Query,
    graphiql: true
}))

// TODO: 增删改

app.listen(PORT, () =>
    console.log(`Server started on port http://localhost:${PORT}/graphql`)
)
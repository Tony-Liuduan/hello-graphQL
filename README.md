# **GraphQL**

* <https://graphql.cn/learn/queries/>
* <https://github.com/SHERlocked93/graphql-demo/blob/master/README.md>

## REST

### 缺点

#### 1. 接口减字段

* 前端直接使用原来接口，数据冗余
* 后端开发新接口，接口冗余

#### 2. 接口加减字段

* 后端开发新接口，但是取得还是同一个 VO 上的字段
* 当前现状：整个 VO 全部返回

```js
domain.com/books/:id
```

## GraphQL

* 声明式查询 schema
* 图表数据库，返回的数据不多不少
* 不面向接口返回固定的数据，而是面向 schema，客户端要啥给啥

```json
query{
  book(id:123){
    title
    reviews
    content
    author {
      name
      age
      gender
    }
  }
}

{
  book:{
    id: 123,
    reviews: "xxx",
    content: "xxx",
    author: {
      name: "xx",
      age: 18,
      gender: "F"
    }
  }
}
```

### 获取数据步骤

1. 用 ts interface 描述数据模型
2. 用 schema 描述需要请求数据对象类型和需要的字段
3. 服务端根据 schema 自动组装字段数据返回给前端

### 开发步骤

1. client
2. graphQL server
3. 后端服务

#### 数据操作 API

1. Query 查询：查
2. Mutation 变更：增删改
3. Subscription 订阅：websocket 双向通信

#### 接口类型修饰符

* 列表：[Type]
* 非空：Type!
* 列表非空：[Type]!
* 非空列表，列表内容类型非空：[Type!]!

##### type

```ts
type User {
 id: ID!
 name: string!
 articles: [Article!]!
}
```

##### Interfaces

```ts
inferface A {
  id: ID!
  name: String!
}

type B implemements A {
 id: ID!
 name: String!
 friends: [A!]!
}
```

##### union

```ts
union SearchResult = A | B
```

##### input

更新数据时有用 ==TODO: ??==

```js
input ReviewInput {
  stars: Int!
  commentary: String
}
```

#### 实操

##### schame

```ts
# src/schema.graphql

# Query 入口
type Query {
    hello: String
    users: [User]!
    user(id: String): [User]!
}

# Mutation 入口
type Mutation {
    createUser(id: ID!, name: String!, email: String!, age: Int,gender: Gender): User!
    updateUser(id: ID!, name: String, email: String, age: Int, gender: Gender): User!
    deleteUser(id: ID!): User
}

# Subscription 入口
type Subscription {
    subsUser(id: ID!): User
}

type User implements UserInterface {
    id: ID!
    name: String!
    age: Int
    gender: Gender
    email: String!
}

# 枚举类型
enum Gender {
    MAN
    WOMAN
}

# 接口类型
interface UserInterface {
    id: ID!
    name: String!
    age: Int
    gender: Gender
}
```

##### resolve

```ts
// query {
//   hello
// }

Query: {
  hello (parent, args, context, info) {
    return ...
  }
}
  
// parent：当前上一个解析函数的返回值
// args：查询中传入的参数
// context：提供给所有解析器的上下文信息
// info：一个保存与当前查询相关的字段特定信息以及 schema 详细信息的值
```

#### 请求格式

```ts
# Get 方式
http://myapi/graphql?query={me{name}}

# Post 方式的请求体
{
  "query": "...",
  "operationName": "...",
  "variables": { "myVariable": "someValue", ... }
}
  
# 正确返回
{
  "data": { ... }
}

# 执行时发生错误
{
  "errors": [ ... ]
}
```

#### 工具

* graphiql
* Graphql Language Service
* quicktype
* graphpack

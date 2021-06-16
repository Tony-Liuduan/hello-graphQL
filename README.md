# **GraphQL**

* <https://graphql.cn/learn/queries/>
* <https://zhuanlan.zhihu.com/p/93206903>
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

> **1.解决了字段冗余的问题**
> **2.结果可预知，查询响应字段 1V1**
> **3.Merge 请求**

* 核心：schema 声明式查询

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

* Int：有符号 32 位整数
* Float：有符号双精度浮点值
* String：UTF‐8 字符序列
* Boolean：true 或者 false
* ID：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。如 MongoDB 的 id 字段

```js
type User {
 id: ID!
 name: string!
 articles: [Article!]!
}
```

##### Interfaces

```js
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

```js
union SearchResult = A | B
```

##### input

更新数据时有用

```js
input ReviewInput {
  stars: Int!
  commentary: String
}
```

#### 实操

* Schame
* Resolver
  * Query
  * Mutation
  * Subscription
* Request by apollo-server

##### Schame

```js
// schema.graphql file

// Query 入口
type Query {
    hello: String
    users: [User]!
    user(id: String): User
}

// Mutation 入口
type Mutation {
    createUser(user: UserInput!): User!
    updateUser(user: UserInput!): User!
    deleteUser(id: ID!): User
}

// Subscription 入口
type Subscription {
    subsUser(id: ID!): User
}

input UserInput {
    id: ID!
    name: String!
    age: Int!
    gender: Gender!
    email: String!
}

type User implements UserInterface {
    id: ID!
    name: String!
    age: Int
    gender: Gender
    email: String!
}

// 枚举类型
enum Gender {
    MAN
    WOMAN
}

// 接口类型
interface UserInterface {
    id: ID!
    name: String!
    age: Int
    gender: Gender
}
```

##### Resolve

```js
const Db = require('../db')
module.exports = {
    Mutation: {
        createUser: (parent, { user: { id, name, email, age, gender } }) => Db.user({ id })
            .then(existUser => {
                if (existUser)
                    throw new Error('已经有这个id的人了')
            })
            .then(() => Db.createUser({ id, name, email, age, gender }))
        ,
        updateUser: (parent, { user: { id, name, email, age, gender } }) => Db.user({ id })
            .then(existUser => {
                if (!existUser)
                    throw new Error('没有这个id的人')
                return existUser
            })
            .then(() => Db.updateUser({ id, name, email, age, gender }))
        ,
        deleteUser: (parent, { id }) => Db.user({ id })
            .then(existUsers => {
                if (!existUsers.length)
                    throw new Error('没有这个id的人')
                return existUsers[0]
            })
            .then(user => new Promise(resolve => Db.deleteUser(user)
                .then(_ => resolve(user))))
    },
}
```


##### 查询语句

```json
/* *********************************QUERY******************************* */
query {
  hello
  user(id: "2") {
    name
    email
  }
  users {
    id
    name
    email
  }
}

/* *********************************MUTATION******************************* */

mutation createUser($user: UserInput!){
  createUser(user: $user) {
    id
    name
  }
}

// 设置变量 QUERY VARIABLES
{
  "user": {
    "id": "7",
    "name": "jason1",
    "email": "jason1@facebook.cn",
    "age": 11,
    "gender": "MAN"
  }
}
```

==查询（query）字段时，是并行执行，而变更（mutation）字段时，是线性执行，一个接着一个==

#### 请求格式

* Get 方式
`http://myapi/graphql?query={me{name>}}`

* Post 方式的请求体

```json
{
  "operationName": null
  "query": "{\n  hello\n  users {\n    name\n  }\n}\n"
  "variables": {}
}
```

* 正确返回

```json
{
  "data": { ... }
}
```

* 执行时发生错误

```json
{
  "errors": [ ... ]
}
```

#### npm 工具包

* graphql
* apollo-server
* graphpack
  * 类似 webpack 功能

##### react-client

* apollo-boost
  * 创建 request client
* @apollo/react-hooks
  * ApolloProvider
  * useQuery
* graphql-tag
  * ggl

```js
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
// ...

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
```

```js
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

// 定义查询语句
const GET_USERS = gql`
query {
  users {
    name
  }
}
`;

//  定义查询语句
//  const GET_USER = gql`
//  query GET_USER($userName: String!) {
//    user(name: $userName) {
//      name
//      gender
//      tags
//    }
//  }
//  `;

function Users() {
  // 使用 useQuery hook 获取数据
  const { loading, error, data } = useQuery(GET_USERS);

    // 使用 useQuery hook 获取数据 待参数查询
    //   const { loading, error, data } = useQuery(GET_USER, {
    //     variables: {
    //       userName: 'Jack',
    //     }
    //   });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      {data.users.map(user => <p>{user.name}</p>)}
    </div>
  );
}

export default Users;
```

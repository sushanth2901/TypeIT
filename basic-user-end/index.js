const express = require('express');
const { graphqlHTTP } = require("express-graphql");
const { GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLObjectType, GraphQLList } = require('graphql');

const app = express();
let userList =[
    {id: "1", name: "John", email: "xyz@gmail.com"},
    {id: "2", name: "James", email: "abc@gmail.com"},
]
const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: () =>({
        id : {type: GraphQLID},
        name: {type: GraphQLString},
        email : {type: GraphQLString},
    }),
});
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: () =>({
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return userList;
            }
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                return userList.find((user)=>user.id==args.id);
            },
        },
    }),
});

const mutations = new GraphQLObjectType({
    name:"mutations",
    fields: {
        addUser: {
            type:UserType,
            args: {name :{type:GraphQLString}, email:{type:GraphQLString}},
            resolve(parent, {name,email}){
                const newUer = {name,email,id:Date.now().toString()};
                userList.push(newUer);
                return newUer;
            },
        },
        updateUser: {
                type:UserType,
                args: {
                    id : { type:GraphQLID },
                    email : { type:GraphQLString },
                    name : { type:GraphQLString }
                }, 
                resolve(parent, {id, name, email }) {
                    const user = userList.find((u) => u.id === id);
                    user.email=email;
                    user.name=name;
                    return user;
                },
           },
           deleteUser: {
            type:UserType,
            args: {
                id : { type:GraphQLID },
                
            }, 
            resolve(parent, {id}) {
                const user=userList.find((u) => u.id === id);
                userList = userList.filter((u)=>u.id!==id);
                return user;
            },
         },
        },
});
const schema = new GraphQLSchema({ query: RootQuery,mutation: mutations});
app.use("/graphql",graphqlHTTP({schema,graphiql: true}));

app.listen(3000,() => console.log("listening on"));
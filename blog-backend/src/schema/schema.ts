import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull} from "graphql";
export const UserType = new GraphQLObjectType({
    name: "UserType",
    fields:()=>({
        id: {type:GraphQLNonNull(GraphQLID)},
        name: {type:GraphQLNonNull(GraphQLString)},
        email: {type:GraphQLNonNull(GraphQLString)},
        password: {type:GraphQLNonNull(GraphQLString)},
    }),
});

export const BlogType = new GraphQLObjectType({
    name: "BlogTpe",
    fields:()=>({
        id : {type:GraphQLNonNull(GraphQLID)},
        title : {type:GraphQLNonNull(GraphQLString)},
        content: {type:GraphQLNonNull(GraphQLString)},
        date: {type:GraphQLNonNull(GraphQLString)},
    }),
});

export const CommentType = new GraphQLObjectType({
    name: "CommentType",
    fields:()=>({
        id : {type:GraphQLNonNull(GraphQLID)},
        text: {type:GraphQLNonNull(GraphQLString)},
       
    }),
});
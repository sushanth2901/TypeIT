import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import Blog from "../models/Blog";
import User from "../models/User";
import Comment from "../models/Comment";
import { BlogType, CommentType,UserType } from "../schema/schema";
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields:{
        // get all users
        users: {
            type: GraphQLList(UserType),
            async resolve() {
                return await User.find();
            },
        },
                // get all blogs

        blogs: {
            type: GraphQLList(BlogType),
            async resolve() {
                return await Blog.find();
            },
        },
        // get all comments

        comments: {
            type: GraphQLList(CommentType),
            async resolve() {
                return await Comment.find();
            },
        },
    },
});
const mutations = new GraphQLObjectType({
    name: "mutations",
    fields: {
        signup: {
            type: UserType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString)},
            },
        },
    },
});
export default new GraphQLSchema({ query:RootQuery });
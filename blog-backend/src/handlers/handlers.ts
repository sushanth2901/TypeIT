import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import Blog from "../models/Blog";
import User from "../models/User";
import Comment from "../models/Comment";
import { BlogType, CommentType,UserType } from "../schema/schema";
import { hashSync } from "bcryptjs";
import {Document} from 'mongoose';
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
            async resolve(parent,{name,email,password}) {
                let existingUser:Document<any,any,any>;
                try {
                    existingUser = await User.findOne({email});
                    if(existingUser) return new Error("User Already exists");
                    const encryptedPassword = hashSync(password);
                    const user = new User({name, email, password: encryptedPassword});
                    return await user.save();
                } catch(err){
                    return new Error("User Signup Failed");
                }
            },
        },
    },
});
export default new GraphQLSchema({ query:RootQuery, mutation:mutations });
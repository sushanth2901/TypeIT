"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const Blog_1 = __importDefault(require("../models/Blog"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
const schema_1 = require("../schema/schema");
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // get all users
        users: {
            type: (0, graphql_1.GraphQLList)(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            },
        },
        // get all blogs
        blogs: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            },
        },
        // get all comments
        comments: {
            type: (0, graphql_1.GraphQLList)(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            },
        },
    },
});
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        signup: {
            type: schema_1.UserType,
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { name, email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (existingUser)
                        return new Error("User Already exists");
                    const encryptedPassword = (0, bcryptjs_1.hashSync)(password);
                    const user = new User_1.default({ name, email, password: encryptedPassword });
                    return await user.save();
                }
                catch (err) {
                    return new Error("User Signup Failed");
                }
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map
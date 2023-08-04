import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import Blog from "../models/Blog";
import User from "../models/User";
import Comment from "../models/Comment";
import { BlogType, CommentType,UserType } from "../schema/schema";
import { hashSync,compareSync } from "bcryptjs";
import {Document, startSession} from 'mongoose';
import { resolve } from "path";
type DocumentType = Document<any,any,any>
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
        login:{
            type: UserType,
            args: {
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, { email,password }){
                let existingUser: Document<any,any,any>;
                try {
                    existingUser = await User.findOne({email});
                    if(!existingUser)
                       return new Error("No user registration found!, Try Again");
                    const decryptedPassword = compareSync(
                        password, 
                        // @ts-ignore
                        existingUser.password
                        );
                       if(!decryptedPassword) return new Error("Incorrect password");
                       return existingUser;
                }catch(err){
                    return new Error(err);
                }
            },
        },
        addBlog:{
            type: BlogType,
            args: {
                title: {type: GraphQLNonNull(GraphQLString)},
                content: {type: GraphQLNonNull(GraphQLString)},
                date: {type: GraphQLNonNull(GraphQLString)},
                user: {type: GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, {title, content, date, user}) {
                let blog: Document <any,any,any>;
                const session = await startSession();
                try {
                    blog = new Blog({ title,content,date,user});
                    
                    const existingUser = await User.findById(user);
                    if(!existingUser) return new Error("User not found");
                    session.startTransaction({session});
                    existingUser.blogs.push(blog);
                    await existingUser.save({session}); 
                    return await blog.save({session});
                } catch (err) {
                    return new Error(err);
                }finally {
                    await session.commitTransaction();
                }
            },
        },
        updateBlog:{
            type: BlogType,
            args:{
                id: {type: GraphQLNonNull(GraphQLString)},
                title: {type: GraphQLNonNull(GraphQLString)},
                content: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{id,title,content}){
                let existingBlog:DocumentType
                try{
                    existingBlog = await Blog.findById(id);
                    if(!existingBlog) return new Error("Blog not found");
                    return await Blog.findByIdAndUpdate(
                        id, 
                        {
                            title,
                            content,
                        },
                        {new: true}
                    );
                }catch(err){
                    return new Error(err);
                }

            },
        },
        deleteBlog:{
            type: BlogType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{id}){
                let existingBlog:Document;
                const session = await startSession();
                try {
                    session.startTransaction({session});
                    existingBlog = await Blog.findById(id).populate("user");
                    // @ts-ignore
                    const existingUser = existingBlog?.user;
                    if(!existingUser) return new Error("No such blog linked to current user");
                    if(!existingBlog) return new Error("Could not find the Blog");
                    existingUser.blogs.pull(existingBlog);
                    await existingUser.save(session);
                    
                    return await Blog.findByIdAndRemove(id);

                }catch(err){    
                    return new Error(err);
                }finally{
                    session.commitTransaction();
                }
            }
        },
        addCommentToBlog: {
            type: CommentType,
            args: {
                blog: {type: GraphQLNonNull(GraphQLID)},
                user: {type: GraphQLNonNull(GraphQLID)},
                text: {type: GraphQLNonNull(GraphQLString)},
                date: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{user,blog,text,date}){
                const session=await startSession();
                let comment: DocumentType;
                try{
                    session.startTransaction();
                    const existingUser = await User.findById(user);
                    const existingBlog = await Blog.findById(blog);
                    if(!existingBlog || !existingUser)
                      return new Error("Could not fetch Blog or User");
                    comment = new Comment({
                        text,
                        date,
                        blog,
                        user,
                    });
                    existingUser.comments.push(comment);
                    existingBlog.comments.push(comment);  
                    await existingBlog.save({session});
                    await existingUser.save({session});
                    return await comment.save({session});  

                }catch(err){
                    return new Error(err);
                } finally{
                    await session.commitTransaction();
                }
            },
        },
        
    },

});
export default new GraphQLSchema({ query:RootQuery, mutation:mutations });

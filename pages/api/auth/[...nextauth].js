import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import NextAuth from "next-auth/next";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
            },

            async authorize(credentials){
                const {email, password} = credentials;

                try{
                    await mongooseConnect();
                    const user =  await User.findOne({email})

                    if(!user){
                        return null
                    }

                    const confirmPassword = await bcrypt.compare(password, user.password)

                    if(!confirmPassword){
                        return null
                    }

                    return user;
                }catch(error){
                    console.log("Error:", error)
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    },
    
}


export default NextAuth(authOptions)
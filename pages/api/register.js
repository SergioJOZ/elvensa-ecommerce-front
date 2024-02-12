import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

import bcrypt from "bcryptjs"
export default async function handle(req, res){
    await mongooseConnect()

    if(req.method === "POST"){
        try{
        const {
            name,
            email,
            password,
            address,
            phone,
            CI
        } = req.body;

        const emailExist = await User.findOne({email: email})
        

        if(emailExist){
            throw new Error("El usuario ya existe.")
        }

       const securePassword = await bcrypt.hash(password, 10)
       
        await User.create({
            name,
            email,
            password: securePassword,
            address,
            phone,
            CI
        })
        return res.json({message: "Usuario registrado."})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
    }
}
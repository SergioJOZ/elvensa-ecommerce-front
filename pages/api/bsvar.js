import { mongooseConnect } from "@/lib/mongoose";
import { BsVar } from "@/models/BsVar";

export default async function handler(req,res){
    await mongooseConnect();

    if(req.method === "GET"){
        res.json(await BsVar.find())
    }
}
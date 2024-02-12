import { mongooseConnect } from "@/lib/mongoose"
import { User } from "@/models/User";

export default async function handler(req, res){
    await mongooseConnect();

    if(req.method === "GET"){
        if(req.query?.email){
            res.json(await User.findOne({email: req.query.email}))
        }
    }

    if(req.method === "PUT"){
        const {
            name,
            address,
            phone
        } = req.body;

        await User.updateOne({email: req.query.email}, {name, address, phone});
        res.json(true)
    }
}
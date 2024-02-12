import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req,res){
    await mongooseConnect();

    if(req.method === "POST"){

        const {
            productsToOrder,
            userId,
            paymentType,
            deliveryType,
            total,
            payment
        } = req.body;

        productsToOrder.forEach(async product => {
            await Product.updateOne({_id: product.productId}, {
                $inc: {
                    quantity: -product.quantity
                }
            })
        })

        if(payment){
            const newOrder = await Order.create({
                productsToOrder,
                userId,
                paymentType,
                deliveryType,
                total,
                payment
            });
    
            res.json(newOrder);
        }

        const newOrder = await Order.create({
            productsToOrder,
            userId,
            paymentType,
            deliveryType,
            total
        });

        res.json(newOrder)
    }
}
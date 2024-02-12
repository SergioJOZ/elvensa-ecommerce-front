import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColWrapper = styled.div`
display:grid;
grid-template-columns: .8fr 1.2fr;
gap: 40px;
margin-top:40px
`


const PriceRow = styled.div`
display:flex;    
gap: 20px;
align-items:center;
`

const Price = styled.span`
font-size: 1.4rem`;

export default function ProductPage({product}){
    const {data: session} = useSession();
    const {cartProducts, addProduct} = useContext(CartContext);
    const [bsVariable, setBsVariable] = useState()
  
    useEffect(() => {
        axios.get("/api/bsvar").then(response => {
        setBsVariable(response.data[0].bsVariable)
    })

  }, [])



    return (
        <>
            <Header />
            <Center>
                <WhiteBox>
                <ColWrapper>
                
                <WhiteBox>
                <ProductImages images={product.images}/>
                </WhiteBox>

                <div>
                <Title>{product.title.charAt(0).toUpperCase() + product.title.slice(1)}</Title>
                <p className="text-lg pb-5">{product.description.charAt(0).toUpperCase() + product.description.slice(1)}</p>

                <PriceRow>
                <Price>
                    ${product.price}
                </Price>
                <Price>
                    {bsVariable &&  Math.round(((product.price * bsVariable) * 100) / 100).toFixed(2) }Bs
                </Price>
                <div>
                {session ?  cartProducts.filter(id => id === product._id).length >= product.quantity ? '' :  <Button onClick={() => addProduct(product._id)} primary outline>
            Añadir al carrito
          </Button> : ''}
                </div>
                </PriceRow>
                </div>

                
                
                </ColWrapper>
                </WhiteBox>
            </Center>
        </>
    );
}

//FUNCION PARA CONSEGUIR LA INFORMACIÓN DEL PRODUCTO BASADO EN EL _ID QUE LLEGA A TRAVÉS DE LA URL
export async function getServerSideProps(context){
    await mongooseConnect();
    const {id} = context.query;
    const product = await Product.findById(id)
    return {
        props:{
            product: JSON.parse(JSON.stringify(product)),
        }
    }
}
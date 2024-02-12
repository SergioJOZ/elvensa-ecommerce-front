import styled from "styled-components";
import Button from "@/components/Button";

import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import { useSession } from "next-auth/react";

const ProductWrapper = styled.div`
border: 1px solid;  
border-radius: 5px
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img{
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  font-weight: 600;
  font-size: 1.125rem; 
line-height: 1.75rem; 
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

export default function ProductBox({_id,title,description,price,images, quantity}) {
  const {data: session} = useSession()
  const {cartProducts, addProduct} = useContext(CartContext);
  const [bsVariable, setBsVariable] = useState()
  const url = '/product/'+_id;
  useEffect(() => {
    axios.get("/api/bsvar").then(response => {
      setBsVariable(response.data[0].bsVariable)
    })

  }, [])

  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={images[0]} alt=""/>
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title.charAt(0).toUpperCase() + title.slice(1)}</Title>
        <PriceRow>
          <Price>
            ${price}
          </Price>
          <Price>
            {bsVariable && price * bsVariable}Bs
          </Price>
          {session ?  cartProducts.filter(id => id === _id).length >= quantity ? '' :  <Button onClick={() => addProduct(_id)} primary outline>
            Añadir al carrito
          </Button> : ''}
          
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
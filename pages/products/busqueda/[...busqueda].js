import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { BsVar } from "@/models/BsVar";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import styled from "styled-components";



const ProductsGrid = styled.div`
    display:grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap:20px;
    padding-top: 10px
`
const StyledInput = styled.input`
border: none;
background: hsl(0 0% 93%);
border-radius: .25rem;
padding: .75rem 1rem;
`
const StyledError = styled.span`
background-color: red;
color: white;
border: 1px solid red;
border-radius: 5px;
font-size: 1.2rem
`
const StyledDivForm = styled.div`
display:flex;
flex-direction: row;
gap: 10px;
`

const StyledSelect = styled.select`
border: none;
background: hsl(0 0% 93%);
border-radius: .25rem;
padding: .75rem 1rem;
`

export default function ProductsPage({categories, products, bsVar}){
    const [busqueda, setBusqueda] = useState('');
    const [busquedaTipo, setBusquedaTipo] = useState('Selecciona un tipo de producto')
    const [error, setError] = useState(false)
    const filteredProducts = products.filter(product => product.quantity > 0)
    const router = useRouter()
    const {data: session} = useSession()
    const {cartProducts, addProduct} = useContext(CartContext);
    async function busquedaFuncion(e){
        e.preventDefault()

        if(busquedaTipo){
            router.push("/products/busqueda/tipo/" + busquedaTipo)
        }else{
            setError(true);
            return;
        }

        
        
    }
    
    async function busquedaNombreFuncion(e){
        e.preventDefault()

        if(busqueda){
            router.push("/products/busqueda/nombre/" + busqueda)
        }else{
            setError(true);
            return;
        }
    }

    return (<>
        <Header />
        <>
        <Center>
            <WhiteBox>
            <Title>Cátalogo</Title>
            <StyledDivForm>
            <form onSubmit={busquedaNombreFuncion}>
                <StyledInput placeholder="Busca productos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}></StyledInput>
                <Button type='submit'>Buscar</Button>
            </form>
            {error && <StyledError>Hubo un error al buscar</StyledError>}
            <form onSubmit={busquedaFuncion}>
                <StyledSelect label='Busca por tipo de producto' value={busquedaTipo} onChange={(e) => setBusquedaTipo(e.target.value)}>
                    <option value={""}>Selecciona un tipo de producto</option>
                    {categories.map((category, index) => (category.parent && <option key={index} value={category.parentName + "/" + category.name}>
                        {category.name} (Marca: {category.parentName})
                    </option>))}
                </StyledSelect>
                <Button type="submit">Buscar</Button>
            </form>
            </StyledDivForm>
            <div className="grid grid-cols-4 gap-20 pt-10">
                {filteredProducts.length > 0 && filteredProducts.map(product => (<Card key={product._id} className="w-44">
      <CardHeader shadow={false} floated={false} className="h-20">
        <img
          src={product.images[0]}
          alt="card-image"
          className="h-full w-full "
        />
      </CardHeader>
      <CardBody>
        <div className="mb-2 flex items-center justify-between">
            <Link href={"/product/" + product._id}>
                <Typography color="blue-gray" className="font-medium">
                    {product.title.charAt(0).toUpperCase() + product.title.slice(1)}
                </Typography>
            </Link>
        </div>
        {/*<Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75"
        >
          {product.description}
        </Typography> */}
      </CardBody>
      <CardFooter className="pt-0">
      <Typography color="blue-gray" className="font-medium">
            {product.price}$ / {product.price * bsVar[0].bsVariable} Bs
          </Typography>
        
        {session ?  cartProducts.filter(id => id === product._id).length >= product.quantity ? '' : <Button
          ripple={false}
          fullWidth={true}
          className="bg-red-500 text-white-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          onClick={() => addProduct(product._id)}
        >
          Añade al carrito
        </Button> : ''}
      </CardFooter>
    </Card>))}
            </div>
            </WhiteBox>
        </Center>
        </>
    </>)
}

export async function getServerSideProps(context){
    //CONEXIÓN CON LA BASE DE DATOS
    await mongooseConnect();
    const {params} = context;
    const categories = await Category.find()

    if(params.busqueda[0] === 'nombre'){
        const products = await Product.find({$or: [{
         title: {$regex: params.busqueda[1]}
        },
        {
            description: {$regex: params.busqueda[1]}
        }
    ]})
        const bsVar = await BsVar.find()

    return {props:{
        categories: JSON.parse(JSON.stringify(categories)),
        products: JSON.parse(JSON.stringify(products)),
        bsVar: JSON.parse(JSON.stringify(bsVar))
    }};

    }

    if(params.busqueda[0] === 'tipo'){
        const products = await Product.find().populate('category');
        const productsFiltered = products.filter(product => product.category.parentName === params.busqueda[1] && product.category.name === params.busqueda[2])
        const bsVar = await BsVar.find()
   
       return {props:{
           categories: JSON.parse(JSON.stringify(categories)),
           products: JSON.parse(JSON.stringify(productsFiltered)),
           bsVar: JSON.parse(JSON.stringify(bsVar))
       }};
   
    }
  }
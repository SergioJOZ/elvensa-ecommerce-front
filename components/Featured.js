import styled from "styled-components";
import Center from "./Center";
import Image from "next/image";
import Button from "./Button";
import ProductBox from "./ProductBox";
import Link from "next/link";
import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";

const Bg = styled.div`
    background-color: #0B0541;
    color: #fff;
    width: 100svw;
    height: 100svh
`;

const Title = styled.h1`
    margin: 0;
    font-weight:normal;
    padding-top: 15px
`

const Desc = styled.p`
    font-size: 0,8rem;
`

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    gap: 40px;
    img{
        border-radius: 15px;
        max-width: 100%;
    }
    
`

const Column = styled.div`
display: flex;
align-items:center;
`

const NavLink = styled(Link)`
text-decoration: none;
color: #fff;
`

const MisionTitle = styled.h1`
    margin: 0;
    font-weight:normal;
    padding-top: 15px;
    text-align: center;
    justify-content:center
`

const MisionTitleDiv = styled.div`
display: flex;
align-items:center;

`


export default function Featured(){
    return <Bg className="w-svw h-svh">
        <Center>
            <Wrapper >
                <Column>
                    <div>
                        <Title className="text-xl font-bold">Transformamos energía</Title>
                        <Desc className="text-md pb-2">Para poder comprar, inicia sesión o regístrate</Desc>
                        <Button size="l" primary><NavLink href="/products">Usa nuestra tienda virtual</NavLink></Button>
                    </div>
                </Column>
                <Column>
                    <img src="/images/TORRES.jpg" alt="Transformamos energía" />
                </Column>
            </Wrapper>
        </Center>
        <Center>
        <Wrapper>
            <Column className="pt-5">
            <Card className="mt-6 w-96">
      <CardHeader color="blue-gray" className="relative h-56">
        <img
          src="https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg"
          alt="card-image"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          ¿Cuál es nuestra misión?
        </Typography>
        <Typography>
        Proporcionar a nuestros clientes los productos y servicios que necesitan para realizar sus proyectos eléctricos de manera segura y eficiente. Nos esforzamos por ofrecer una amplia gama de productos de alta calidad a precios competitivos, así como un servicio al cliente excepcional.
        </Typography>
      </CardBody>
    </Card>
            </Column>
            <Column className="pt-5">
            <Card className="mt-6 w-96">
      <CardHeader color="blue-gray" className="relative h-56">
        <img
          src="https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="card-image"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          ¿Cuál es nuestra visión?
        </Typography>
        <Typography>
        Queremos ser el proveedor líder de materiales eléctricos en la región, para ser reconocidos por su amplia gama de productos de alta calidad, nuestros precios competitivos y su excelente servicio al cliente, así como la innovación.
        </Typography>
      </CardBody>
    </Card>
            </Column>
        </Wrapper>
        </Center>
    </Bg>
}
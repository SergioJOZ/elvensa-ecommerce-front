import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Table from "@/components/Table";
import WhiteBox from "@/components/WhiteBox";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { PickerOverlay } from "filestack-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";

const ColWrapper = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 80px;
    max-height: 80px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const InformationDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;
const StyledError = styled.span`
  background-color: red;
  color: white;
  border: 1px solid red;
  border-radius: 5px;
  font-size: 1.2rem;
`;

const StyledSuccess = styled.span`
  background-color: green;
  color: white;
  border: 1px solid green;
  border-radius: 5px;
  font-size: 1.2rem;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [informationOrder, setInformationOrder] = useState([]);
  const [paymentType, setPaymentType] = useState("Pago móvil");
  const [deliveryType, setDeliveryType] = useState("Delivery");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bsVariable, setBsVariable] = useState();
  const [images, setImages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const { data: session, status } = useSession();

  //CONSEGUIR INFORMACION DE ORDEN
  useEffect(() => {
    if (session) {
      const userEmail = session.user?.email;
      axios.get("/api/users?email=" + userEmail).then((response) => {
        setInformationOrder(response.data);
      });
    }

    axios.get("/api/bsvar").then((response) => {
      setBsVariable(response.data[0].bsVariable);
    });
  }, [session]);

  //ACTUALIZAR CARRITO
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  //FUNCIONALIDAD DE BOTÓN DE AGREGAR MÁS CANTIDAD DE UN PRODUCTO
  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  //FUNCION PARA MANDAR LA ORDEN
  async function sendOrder(e) {
    e.preventDefault();
    const userId = informationOrder._id;
    let productToOrder;
    const productsToOrder = [];

    for (const product of products) {
      const quantity = cartProducts.filter((id) => id === product._id).length;
      const productId = product._id;

      productToOrder = { productId, quantity };
      productsToOrder.push(productToOrder);
    }

    if (
      paymentType === "Efectivo (Solo para delivery o entregas en oficina)" &&
      deliveryType === "Envío Nacional"
    ) {
      if (images.length <= 0) {
        setShowError(true);
        return;
      }
    }

    if (
      paymentType === "Pago móvil" ||
      paymentType === "Transferencia Bancaria"
    ) {
      if (images.length <= 0) {
        setShowError(true);
        return;
      }

      const data = {
        userId,
        productsToOrder,
        deliveryType,
        paymentType,
        payment: images,
        total,
      };

      try {
        axios.post("/api/orders", data);
      } catch (error) {
        setShowError(true);
      }

      setShowSuccess(true);
      clearCart();
      return;
    }

    const data = {
      userId,
      productsToOrder,
      deliveryType,
      paymentType,
      total,
    };

    try {
      axios.post("/api/orders", data);
    } catch (error) {
      setShowError(true);
    }

    setShowSuccess(true);
    clearCart();
  }

  return (
    <>
      <Header />
      <Center>
        {showPicker && (
          <PickerOverlay
            apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY}
            pickerOptions={{
              accept: ["image/*"],
              maxFiles: 1,
              fromSources: ["local_file_system"],
              onClose: () => setShowPicker(false),
              onUploadDone: (res) => {
                setImages([res.filesUploaded[0].url, ...images]);
              },
            }}
          />
        )}

        <ColWrapper>
          {/*CAJA DE PRODUCTOS */}
          <WhiteBox>
            {showSuccess && (
              <StyledSuccess>
                Tu orden ha sido enviada con éxito. Nos pondremos en contacto
                contigo pronto.
              </StyledSuccess>
            )}
            <h1 className="text-2xl font-bold">Carrito</h1>
            {!cartProducts?.length && <div>Tu carrito está vacio</div>}

            {products?.length > 0 && (
              <Table>
                <thead>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Existencia</th>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <Image src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title.charAt(0).toUpperCase() +
                          product.title.slice(1)}
                      </ProductInfoCell>

                      {cartProducts.filter((id) => id === product._id).length >=
                      product.quantity ? (
                        <td>
                          <Button
                            onClick={() => lessOfThisProduct(product._id)}
                          >
                            -
                          </Button>
                          <QuantityLabel>
                            {" "}
                            {
                              cartProducts.filter((id) => id === product._id)
                                .length
                            }{" "}
                          </QuantityLabel>
                        </td>
                      ) : (
                        <td>
                          <Button
                            onClick={() => lessOfThisProduct(product._id)}
                          >
                            -
                          </Button>
                          <QuantityLabel>
                            {" "}
                            {
                              cartProducts.filter((id) => id === product._id)
                                .length
                            }{" "}
                          </QuantityLabel>
                          <Button
                            onClick={() => moreOfThisProduct(product._id)}
                          >
                            +
                          </Button>
                        </td>
                      )}

                      <td>
                        $
                        {Math.round(
                          (cartProducts.filter((id) => id === product._id)
                            .length *
                            product.price *
                            100) /
                            100
                        ).toFixed(2)}
                      </td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>Total:</td>
                    <td>${total}</td>
                    <td>
                      {bsVariable &&
                        Math.round((bsVariable * total * 100) / 100).toFixed(2)}
                      Bs
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </WhiteBox>

          {/*CAJA DE INFORMACIÓN DE ORDEN */}
          {!!cartProducts?.length && (
            <WhiteBox>
              <h2 className="font-bold text-2xl">Información de orden</h2>
              {showError && (
                <StyledError>
                  Ha ocurrido un error al enviar tu orden, elegiste una opción
                  de entrega invalida para tu tipo de pago o no has subido el
                  recibo de pago, por favor, vuelve a intentarlo.
                </StyledError>
              )}

              {status === "loading" ? (
                <>
                  <p>Cargando...</p>
                </>
              ) : (
                <InformationDiv>
                  <span className="font-bold text-lg">
                    Si necesita cambiar algún dato, diríjase a la página de
                    &quot;Tu cuenta&quot;
                  </span>
                  <span className="font-bold">
                    Nombre: {informationOrder.name}
                  </span>
                  <span className="font-bold">
                    Cédula de identidad: {informationOrder.CI}
                  </span>
                  <span className="font-bold">
                    Dirección: {informationOrder.address}
                  </span>
                  <span className="font-bold">
                    Número de contacto: {informationOrder.phone}
                  </span>
                  <span className="font-bold">Forma de pago</span>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option>Pago móvil</option>
                    <option>
                      Efectivo (Solo para delivery o entregas en oficina)
                    </option>
                    <option>Transferencia Bancaria</option>
                  </select>

                  {paymentType === "Pago móvil" && (
                    <Card className="mt-6 w-96">
                      <CardBody>
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="mb-2"
                        >
                          Datos del pago móvil
                        </Typography>
                        <Typography>
                          Banesco <br />
                          Cédula de identidad: V-4182166 <br />
                          Número de teléfono: 0414-5670256 <br />A nombre de
                          Juan Jiménez
                        </Typography>
                      </CardBody>
                    </Card>
                  )}

                  {paymentType === "Pago móvil" ||
                  paymentType === "Transferencia Bancaria" ? (
                    <div>
                      <ReactSortable list={images} setList={updateImagesOrder}>
                        {!!images?.length &&
                          images.map((link) => (
                            <div key={link} className=" h-50 w-50">
                              <Image src={link} alt="" className="rounded-lg" />
                            </div>
                          ))}
                      </ReactSortable>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPicker(true);
                        }}
                      >
                        <div className="flex justify-center pt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                          Subir comprobante
                        </div>
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                  <span className="pt-2 font-bold">Forma de entrega</span>
                  <div className="pt-2 pb-5">
                    <select
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value)}
                    >
                      <option>Delivery</option>
                      <option>Entega en oficina</option>
                      <option>Envío Nacional</option>
                    </select>
                  </div>
                </InformationDiv>
              )}

              <Button block primary onClick={(e) => sendOrder(e)}>
                Continuar al pago
              </Button>
            </WhiteBox>
          )}
        </ColWrapper>
      </Center>
    </>
  );
}

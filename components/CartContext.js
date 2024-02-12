const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});


//CREA UN "CONTEXTO" DE REACT POR EL CUAL SE PUEDE OBTENER LA INFORMACIÓN DEL PRODUCTO QUE EL CLIENTE AÑADA AL CARRITO
export function CarContextProvider({children}){

    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const defaultProducts = ls ? JSON.parse(ls?.getItem('cart')) : [];

    const [cartProducts, setCartProducts] = useState([]);
    

    useEffect(() => {
        if(cartProducts?.length > 0){
            ls?.setItem('cart', JSON.stringify(cartProducts))
        }

    }, [cartProducts]);

    useEffect(() => {
        if (ls && ls.getItem('cart')){
            setCartProducts(JSON.parse(ls.getItem('cart')))
        }
    }, [])

    //FUNCIÓN QUE SE ADJUNTA A LOS BOTONES Y PASA EL ID DEL PRODUCTO AL CONTEXTO
    function addProduct(productId){
        setCartProducts(prev => [...prev, productId])
      }

    //FUNCIÓN PARA DISMINUIR LA CANITDAD DE UN PRODUCTO
    function removeProduct(productId){
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);

            if(pos !== -1){
                return prev.filter((value, index) => index !== pos);
            };

            return prev;
        })
    }

    function clearCart(){
        setCartProducts([])
    }
    return (
        <CartContext.Provider value={{cartProducts, setCartProducts, addProduct, removeProduct, clearCart}}>{children}</CartContext.Provider>

    )
}
import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    display:flex;
    flex-direction: column;
    row-gap: 10px;
`

const StyledInput = styled.input`
border: none;
background: hsl(0 0% 93%);
border-radius: .25rem;
padding: .75rem 1rem;
`

const StyledDiv = styled.div`
padding-top: 10px
`

const StyledError = styled.span`
    background-color: red;
    color: white;
    border: 1px solid red;
    border-radius: 5px;
    font-size: 1.2rem
`

const StyledSuccess = styled.span`
background-color: green;
color: white;
border: 1px solid green;
border-radius: 5px;
font-size: 1.2rem
`

export default function AccountPage(){
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [showError, setShowError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [information, setInformation] = useState([])
    const  {data: session, status}  = useSession();
    
    useEffect(() => {
        axios.get("/api/users?email=" + session.user.email).then(response => {
            setInformation(response.data)            
        })
    }, [session])

    async function updateUser(e){
        e.preventDefault();

        const userEmail = session.user.email

        const data = {
            name,
            address,
            phone
        };

        try{
            if(!data.name || !data.address || !data.phone){
                throw new Error('Parametros invalidos')
            }
       
        
        await axios.put('/api/users?email=' + userEmail, data)
        

        setShowSuccess(true)

        }catch(error){
            setShowError(true)
        }
    }

    if(status === "loading"){
        return (
            <>
                <Header />
                <Center>
                    <WhiteBox>
                        Cargando...
                    </WhiteBox>
                </Center>
            </>
        )
    }


    return <>
    <Header />
    <Center>
        <StyledDiv>
            
        <WhiteBox>
            {showError && <StyledError>Ha ocurrido un error al guardar los datos.</StyledError>}
            {showSuccess && <StyledSuccess>Tus datos han sido guardados exitosamente.</StyledSuccess>}
            <br/>
                {session && information ? 
                <StyledForm onSubmit={(e) => {updateUser(e)}}>
                <span>Nombre completo</span>
                <StyledInput type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={information.name}></StyledInput>
                <span>Dirección</span>
                <StyledInput type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={information.address}></StyledInput>
                <span>Número de teléfono</span>
                <StyledInput type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={information.phone} onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}></StyledInput>
                <Button primary={true} type="Submit">Actualizar tu información</Button>
                </StyledForm> : "Cargando..."
                }
            
        </WhiteBox>
        </StyledDiv>
    </Center>
    </>
}
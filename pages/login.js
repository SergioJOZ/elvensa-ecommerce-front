import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

const LoginWrapper = styled.div`
padding-top: 30px;
`;

const StyledInput = styled.input`
border: 0.5;
outline: 0;
color: rgb(60, 66, 87);
background-color: rgb(255, 255, 255);
box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px;
border-radius: 4px;
font-size: 14px;
line-height: 20px;
font-weight: 400;
padding: 4px 8px;
min-height: 28px;
vertical-align: middle;
transition: background-color .24s,box-shadow .24s;
transition-property: background-color, box-shadow;
transition-duration: 0.24s, 0.24s;
transition-timing-function: ease, ease;
transition-delay: 0s, 0s;
:focus{
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px;
}
`

const StyledForm = styled.form`
display:flex;
flex-direction: column;
gap: 15px
`

const StyledRegisterBtn = styled(Link)`
display:flex;
justify-content: center;
align-items: center;
font-weight: 700;
`

const StyledLoginBtn = styled.button`
display: inline-block;
outline: none;
cursor: pointer;
font-size: 14px;
line-height: 1;
border-radius: 500px;
transition-property: background-color,border-color,color,box-shadow,filter;
transition-duration: .3s;
border: 1px solid transparent;
letter-spacing: 2px;
min-width: 160px;
text-transform: uppercase;
white-space: normal;
font-weight: 700;
text-align: center;
padding: 16px 14px 18px;
color: #fff;
background-color: #0B0541;
height: 48px;
`

export default function LoginPage(){
    const router = useRouter()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    async function userLogin(e){
        e.preventDefault(e);
        
        try {
            const res = await signIn("credentials", {email, password, redirect:false})
            console.log(res)
            if(res.error){
                setError("Datos incorrectos");
                return
            }
        }catch(error){
            console.log(error)
        }
        
        router.push("/products")

    }


    return <>
<Header />
    <Center>
        <LoginWrapper>
            <WhiteBox>
            <StyledForm onSubmit={userLogin}>
                <StyledInput type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}></StyledInput>
                <StyledInput type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}></StyledInput>
                <StyledLoginBtn type="submit">Inicia sesión</StyledLoginBtn>
                <span className="bg-red-600 text-white p-2 text-lg rounded-md ">{error}</span>
                <StyledRegisterBtn href={"/register"}>Regístrate</StyledRegisterBtn>
            </StyledForm>
            </WhiteBox>
            </LoginWrapper>
        </Center>
</>
}
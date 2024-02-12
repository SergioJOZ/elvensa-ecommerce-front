import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
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

const StyledTextArea = styled.textarea`
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

const StyledRegisterBtn = styled.button`
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
const ErrorDiv = styled.div`
color: red;
font-weight: 700
`

export default function RegisterPage(){

    const [email, setEmail] = useState()
    const [password, setPassword] = useState('')
    const [name, setName] = useState()
    const [ci, setCi] = useState();
    const [address, setAddress] = useState();  
    const [phone, setPhone] = useState()  
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState();
    const router = useRouter()

    const [validPassword, setValidPassword] = useState({
        passNum: null,
        minCharacter: null,
        passLower: null,
        passUpper: null,
        passwordConfirm: null,
    })

    useEffect(() => {
        const hasNumber = /\d/
        const hasUpperCase = /[A-Z]/
        const hasLowerCase = /[a-z]/
        const passLength = password.length

        const passNum = hasNumber.test(password);
        const upperCase = hasUpperCase.test(password);
        const lowerCase = hasLowerCase.test(password);
        const passwordConfirm = password === confirmPassword
        
        setValidPassword({
            passNum: passNum,
            minCharacter: passLength,
            passLower: lowerCase,
            passUpper: upperCase,
            passwordConfirm: passwordConfirm,
        })

    }, [confirmPassword, password])

 
    async function registerUser(e){
        e.preventDefault();

        if(!name || !email || !password || !address || !phone || !ci){
            setError("Todos los campos son necesarios.");
            return;
        }

        if(!validPassword.passNum || !validPassword.minCharacter || !validPassword.passLower || !validPassword.passUpper || !validPassword.passwordConfirm){
            setError("Hay un error en la contraseña.")
            return;
        }

        const data = {
            name,
            email,
            password,
            address,
            phone,
            CI: ci
        }

        try{
        const res = await axios.post("/api/register", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        console.log(res)
        if(res.status === 200){
            router.push("/")
        }else{
            throw new Error("Hubo un error." + res.data.message)
        }
        }catch(err){
            console.log(err)
            setError("Hubo un error o el usuario ya existe.")
        }
    }





    return <>
<Header />
    <Center>
        <LoginWrapper>
            <WhiteBox>
            <StyledForm onSubmit={registerUser}>
                <span>Correo electrónico</span>
                <StyledInput type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}></StyledInput>
                <span>Contraseña</span>
                <StyledInput type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}></StyledInput>
                <span>Confirma tu contraseña</span>
                <StyledInput type="password" placeholder="Confirmar contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></StyledInput>
                <span>Debe contener al menos un número</span>
                <span >Debe contener al menos una letra minúscula</span>
                <span >Debe contener al menos una letra mayúscula</span>
                <span >Debe tener al menos 10 caracteres</span>
                <span>Ambas contraseñas deben ser iguales</span>
                <span>Nombre completo</span>
                <StyledInput type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)}></StyledInput>
                <span>Cédula de identidad</span>
                <StyledInput type="number" placeholder="Cédula de identidad" value={ci} onChange={(e) => setCi(e.target.value)} onKeyDown={(evt) => ["e", "E", "+", "-", ",", "."].includes(evt.key) && evt.preventDefault()}></StyledInput>
                <span>Número de télefono</span>
                <StyledInput type="number" placeholder="Télefono" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(evt) => ["e", "E", "+", "-", ",", "."].includes(evt.key) && evt.preventDefault()}></StyledInput>
                <span>Dirección</span>
                <StyledTextArea placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
                {error && <div><span className="bg-red-600 text-white p-2 text-lg rounded-md ">{error}</span></div>}
                <StyledRegisterBtn type="submit">Regístrate</StyledRegisterBtn>
            </StyledForm>
            </WhiteBox>
            </LoginWrapper>
        </Center>
</>
}
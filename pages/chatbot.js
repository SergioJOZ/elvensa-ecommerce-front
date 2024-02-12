
import Center from "@/components/Center";
import Header from "@/components/Header";
import OpenAI from "openai";
import { useState } from "react";
import styled from "styled-components";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

const StyledOuterDiv = styled.div`
background-color: rgb(243 244 246);
min-height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const StyledInsideDiv = styled.div`
width: 100%;
max-width: 768px;
padding: 1rem;
border-radius: 0.5rem;
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`

const TitleDiv = styled.div`
margin-bottom: 1rem;
`

const Title = styled.div`
font-size: 2.25rem; 
line-height: 2.5rem; 
font-weight: 700;
color: rgb(30 64 175);
margin-bottom: 0.5rem;
`

const StyledWelcome = styled.p`
color: rgb(75 85 99);
font-size: 1.125rem;
line-height: 1.75rem;
`

const OuterChat = styled.div`
margin-bottom: 1rem;
height: 24rem;
overflow: auto;
`

const UserSide = styled.div`
text-align: right;
margin-bottom: 0.5rem;
`

const UserMessage = styled.div`
border-radius: 9999px;
padding: 0.5rem;
max-width: 28rem;
margin-left: 1rem; 
margin-right: 1rem; 
display: inline-block;
background-color: rgb(147 197 253);
color: rgb(30 64 175);
`

const UserContent = styled.div`
max-width: 28rem;
margin-left: 1rem; 
margin-right: 1rem; 
margin-top: 0.5rem; 
margin-bottom: 0.5rem; 
display: inline-block;
background-color: rgb(147 197 253);
color: rgb(30 64 175);
padding: 0.5rem;
border-radius: 0.375rem;
`


const AISide = styled.div`
text-align: left;
margin-bottom: 0.5rem;
`



const AIMessage = styled.div`
border-radius: 9999px;
padding: 0.5rem;
max-width: 28rem;
margin-left: 1rem; 
margin-right: 1rem; 
display: inline-block;
background-color: rgb(134 239 172);
color: rgb(22 101 52);
`



const AIContent = styled.div`
max-width: 28rem;
margin-left: 1rem; 
margin-right: 1rem; 
margin-top: 0.5rem; 
margin-bottom: 0.5rem; 
display: inline-block;
background-color: rgb(134 239 172);
color: rgb(22 101 52);
padding: 0.5rem;
border-radius: 0.375rem;
`

const InputDiv = styled.div`
display:flex
`

const Input = styled.input`
flex: 1 1 0%;
padding: 0.5rem;
border-top-left-radius: 0.5rem;
border-bottom-left-radius: 0.5rem; 
`

const isLoadingDiv = styled.div`
background-color: rgb(59 130 246);
color: rgb(255 255 255);
padding: 0.5rem;
border-top-right-radius: 0.5rem; 
border-bottom-right-radius: 0.5rem; 

animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
`

const StyledBtn = styled.button`
background-color: rgb(59 130 246);
color: rgb(255 255 255);
padding: 0.5rem;
border-top-right-radius: 0.5rem; 
border-bottom-right-radius: 0.5rem; 

`



export default function chatbotPage(){
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const handleUserInput = async () => {
        setIsLoading(true);
        setChatHistory((prevChat) => [...prevChat, {role: 'user', content: userInput}])
    
        const chatCompletion = await openai.chat.completions.create({
            messages: [...chatHistory, {role: 'assistant', content: `Eres un ingeniero electricista. ${userInput}`}],
            model: 'gpt-3.5-turbo'
        })
    
        setChatHistory((prevChat) => [...prevChat, {role: 'assistant', content: chatCompletion.choices[0].message.content}])
    
        setUserInput('');
        setIsLoading(false)  
    }

    return (
        <>
        <Header />
        
        <StyledOuterDiv>
            <StyledInsideDiv>
                <TitleDiv>
                    <Title>Asistente de Chatbot</Title>
                </TitleDiv>
                <StyledWelcome>
                        Bienvenido al asistente virtual chatbot, soy JJ. Pregúntame tus dudas.
                </StyledWelcome>

                <OuterChat>
                    {chatHistory.map((message, index) => (
                        message.role && message.role === 'user' ? 
                        <UserSide key={index}><UserMessage>Humano
                            </UserMessage>
                            <UserContent>{message.content}</UserContent>
                            </UserSide>
                         : <AISide key={index}>
                         <AIMessage>AI</AIMessage>
                         <AIContent>{message.content}</AIContent>
                     </AISide> ))
                    }
                </OuterChat>   
                    <InputDiv>
                        <Input type="text" placeholder="Hazme una pregunta..." value={userInput} onChange={(e) => setUserInput(e.target.value)}></Input>
                    </InputDiv>
                    {isLoading ? <isLoadingDiv>Cargando...</isLoadingDiv> : <StyledBtn onClick={handleUserInput}>Pregunta</StyledBtn>}
            </StyledInsideDiv>
        </StyledOuterDiv>
        </>
    )
}
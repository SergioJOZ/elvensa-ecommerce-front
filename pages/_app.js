import styled, { createGlobalStyle } from "styled-components"
import "@/styles/globals.css";
import { CarContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react"
const GlobalStyles = createGlobalStyle`

  body{
    padding:0;
    margin: 0;
    font-family: 'Raleway', sans-serif;
    background-color: #778899
  }
`;


export default function App({ Component, pageProps: {session, ...pageProps} }) {
  return (
  <>
    <GlobalStyles />
    <SessionProvider session={session}>
    <CarContextProvider>
      <Component {...pageProps} />
    </CarContextProvider>
    </SessionProvider>
  </>)
}

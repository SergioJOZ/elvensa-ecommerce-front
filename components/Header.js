import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "./Button";
import axios from "axios";

const StyledHeader = styled.header`
  background-color: #0b0541;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  padding-left: 20px;
  padding-right: 20px;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 15px;
  align-content: center;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  color: #84879b;
  text-decoration: none;
  &:hover {
    color: white;
    font-size: 1.125rem;
    transition-delay: 100ms;
  }
`;

export default function Header() {
  const { data } = useSession();
  const { cartProducts } = useContext(CartContext);
  const router = useRouter();

  async function logout() {
    await router.push("/");
    await signOut();
  }

  return (
    <StyledHeader>
      <Wrapper>
        <Link href={"/"}>
          <Image
            src={"/images/logoLetrasFondoBlanco.png"}
            width={300}
            height={100}
            alt="Elvensa Web"
          />
        </Link>
        <StyledNav>
          <NavLink href={"/"}>Inicio</NavLink>
          <NavLink href={"/products"}>Cátalogo</NavLink>
          {!data ? (
            <>
              <NavLink href={"/login"}>Iniciar sesión</NavLink>
            </>
          ) : (
            <>
              <NavLink href={"/account"}>Tu cuenta</NavLink>
              {
                <NavLink href={"/cart"}>
                  Carrito de compras ({cartProducts.length})
                </NavLink>
              }

              <Button primary={true} onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          )}
        </StyledNav>
      </Wrapper>
    </StyledHeader>
  );
}

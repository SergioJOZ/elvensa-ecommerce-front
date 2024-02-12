import styled from "styled-components"

const StyledBox = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
    padding-top: 5px;
    background-color: #F0F8FF
`

export default function WhiteBox({children}){
    return (<StyledBox>
        {children}
    </StyledBox>)

}
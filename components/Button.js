import styled from "styled-components";
import css from "styled-jsx/css";




export default function Button({children, ...rest}){
    const StyledBtn = styled.button`

    background-color: rgba(51, 51, 51, 0.05);
    border-radius: 8px;
    border-width: 0;
    color: #333333;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    margin: 0;
    padding: 10px 12px;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;

${props => props.white && !props.outline && css`
background-color: #fff;
color: #000;
`};

${props => props.white && props.outline && css`
background-color: transparent;
color: #fff;
border: 1px solid #fff;
`};

${props => props.primary && css`
background-color: #F63234;
color: #fff;
`};

${props => props.size === 'l' && css `
    font-size: 1.2rem
`}

${props => props.block && css `
    display: block;
    width: 100%
`}

`;

    return <StyledBtn {...rest}>
        {children}
    </StyledBtn>
}


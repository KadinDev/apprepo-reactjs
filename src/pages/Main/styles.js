// keyframes e css para fazer animação do botão logo abaixo
import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
    max-width: 700px;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding: 30px;
    margin: 80px auto;
    box-shadow: 0 0 20px rgba(0,0,0, 0.2);

    h1 {
        font-size: 20px;
        display: flex;
        align-items: center;
        flex-direction: row;

        svg { //svg é como o ícone está
            margin-right: 10px;
        }
    }
`;

export const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;

    input {
        flex: 1;
        border: 1px solid ${props => (props.error ? '#ff0000' : '#eee') };
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 17px;
    }
`;

// criando animação do botão
const animate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

export const SubmitButton = styled.button.attrs( props => ({ //assim é como se pega a props loading={ loading ? 1 : 0
    //que estou enviando pelo SubmitButton
    type: 'submit',
    disabled: props.loading,
}))`
    background-color: #0d2636;
    border: 0;
    border-radius: 4px;
    margin-left: 10px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    &[disabled]{
        cursor: not-allowed;
        opacity: 0.5;
    }

    // acessando a props  loading e animando o botão quando loading for true
    ${ props => props.loading && 
        css `
            svg {
                animation: ${animate} 2s linear infinite;
            }
        `
    } // && quando for loading executa o que tem aqui
`;

export const List = styled.ul`
    list-style: none;
    margin-top: 20px;

    li {
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        & + li { // vai ter border a partir do segundo li para baixo
            border-top: 1px solid #eee;
        }

        a {
            color: #0d2636;
            text-decoration: none;
        }

    };
`;

export const DeleteButton = styled.button.attrs({
    type: 'button',
})`
    background: transparent;
    color: #0d2636;
    border: 0;
    padding: 8px 7px;
    outline: 0;
    border-radius: 4px;
`;


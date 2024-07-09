import styled from 'styled-components';
import { Form } from 'react-bootstrap';

export const AppWrapper = styled.div`
display: flex;
justify-content: center;
`;

export const AppContainer = styled.div`
display: flex;
align-items: center;
flex-direction: column;
width: 288px;
`;

export const TopPanel = styled.div`
display: flex;
margin-top: 1rem;
`;

export const DropDownContainer = styled.div`
position: absolute;
`;

export const CustomForm = styled(Form)`
width: 100%;
margin-bottom: 1rem;
margin-top: 0.5rem;
`;


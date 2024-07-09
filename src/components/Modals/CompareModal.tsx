import { FC } from 'react';
import { Modal, Row } from 'react-bootstrap';

import CarCard from '../CarCard/CarCard';
import { Car } from '../App/App';

import styled from 'styled-components';
const CustomModal = styled(Modal)`
    .modal-dialog {
        max-width: 618px;
    }
`;

interface CompareModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    selectedCars: Car[];
}

const CompareModal: FC<CompareModalProps> = ({ showModal, setShowModal, selectedCars }) => {
    return (
        <CustomModal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Порівняння автомобілів</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{ justifyContent: "space-around" }}>
                    {selectedCars.map((car, index) => (
                        <CarCard key={index} car={car} />
                    ))}
                </Row>
            </Modal.Body>
        </CustomModal>
    );
};

export default CompareModal;

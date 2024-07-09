import React, { FC } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import CarCard from '../CarCard/CarCard';
import { Car } from '../App/App';

interface CompareModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    selectedCars: Car[];
}

const CompareModal: FC<CompareModalProps> = ({ showModal, setShowModal, selectedCars }) => {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Порівняння автомобілів</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {selectedCars.map((car, index) => (
                        <Col key={index} md={6}>
                            <CarCard car={car} />
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Закрити</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CompareModal;

import React, { FC, useEffect, useRef } from 'react';
import { ReactComponent as Ukraine } from '@svg-maps/ukraine/ukraine.svg';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

const CustomModal = styled(Modal)`
    .modal-dialog {
        max-width: 618px;
    }
`;

interface MapModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    regions: string[];
    
}

const MapModal: FC<MapModalProps> = ({ showModal, setShowModal, regions }) => {
    const mapRef = useRef<SVGSVGElement>(null);

    const convertUkrainianToIds = (places: string[]): string[] => {
        const ukrainianToEnglishIdMap = {
            "черкаськ": 'cherkasy',
            "чернігівськ": 'chernihiv',
            "чернівецьк": 'chernivtsi',
            "крим": 'crimea',
            "дніпропетровськ": 'dnipropetrovsk',
            "донецьк": 'donetsk',
            "івано-франківськ": 'ivano-frankivsk',
            "харківськ": 'kharkiv',
            "херсонськ": 'kherson',
            "хмельницьк": 'khmelnytskyi',
            "кіровоградськ": 'kirovohrad',
            "м.київ": 'kyiv-city',
            "київськ": 'kyiv',
            "луганськ": 'luhansk',
            "львівськ": 'lviv',
            "миколаївськ": 'mykolaiv',
            "одеськ": 'odessa',
            "полтавськ": 'poltava',
            "рівненськ": 'rivne',
            "сумськ": 'sumy',
            "тернопільськ": 'ternopil',
            "вінницьк": 'vinnytsia',
            "волинськ": 'volyn',
            "закарпатськ": 'zakarpattia',
            "запорізьк": 'zaporizhia',
            "житомирськ": 'zhytomyr',
        };

        return places
            .filter(place => place.trim() !== '') // Фильтруем пустые строки
            .map(place => {
                for (const [ukrName, engId] of Object.entries(ukrainianToEnglishIdMap)) {
                    if (place.toLowerCase().includes(ukrName)) {
                        return engId;
                    }
                }
                return '';
            });
    };

    const Ids = convertUkrainianToIds(regions);

    useEffect(() => {
        if (mapRef.current) {
            const paths = mapRef.current.querySelectorAll<SVGPathElement>('path');

            paths.forEach((path: SVGPathElement) => {
                path.style.fill = 'rgb(234, 236, 239)';
                path.style.stroke = 'white';
                path.style.strokeWidth = '2';
            });

            Ids.forEach(engId => {
                if (engId) {
                    const path = mapRef.current?.querySelector<SVGPathElement>(`#${engId}`);
                    if (path) {
                        path.style.fill = 'rgb(13, 110, 253)';
                    }
                }
            });
        }
    }, [showModal, regions]);

    return (
        <CustomModal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Мапа реєстрацій</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Ukraine ref={mapRef} />
            </Modal.Body>
        </CustomModal>
    );
};

export default MapModal;

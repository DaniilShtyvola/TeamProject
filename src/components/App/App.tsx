import React, { FC, useState } from 'react';
import axios from 'axios';
import { Alert, ButtonGroup, ToggleButton, Form, Button, Row, Col, Pagination, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CarCard from '../CarCard/CarCard';
import { AppWrapper, AppContainer } from './App.styled';
import getPrice from '../../utils/getPrice';
import { FaBalanceScale } from 'react-icons/fa';

import UkraineMap from '../CustomUkraineMap/CustomUkraineMap';

interface AppProps { }

interface Car {
   isLast: boolean;
   registered_at: string;
   model_year: number;
   vendor: string;
   model: string;
   color: {
     ua: string;
   };
   address: string;
   kind: {
     ua: string;
   };
   fuel: {
     ua: string;
   };
   photo_url: string;
   price: string;
}

const App: FC<AppProps> = () => {
   const [cars, setCars] = useState<Car[]>([]);
   const [regions, setRegions] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [searchRequest, setSearchRequest] = useState<string>('');
   const [radioValue, setRadioValue] = useState('1');
   const [error, setError] = useState<string>('');
   const [selectedCars, setSelectedCars] = useState<Car[]>([]);
   const [showModal, setShowModal] = useState(false);

   const fetchCars = async () => {
      const key: string = "fcdc6fdc64d18e2b37f885c46f130162";

      if (key == "") {
         setError(`Відсутній API ключ.`);
         return;
      }

      try {
         let url = `https://baza-gai.com.ua/vin/${searchRequest.replace(/\s+/g, '')}`;
         const response = await axios.get(url, {
            headers: {
               "Accept": "application/json",
               "X-Api-Key": key
            }
         });

         const carsData: Car[] = await Promise.all(response.data.operations.map(async (operation: any, index: number) => {
            let price = 'Н/Д';
            if (index === 0) {
               try {
                     const fetchedPrice = await getPrice(searchRequest.replace(/\s+/g, ''));
                     price = fetchedPrice + ' UAH';
               } catch (error) {}
            }

            const carData: Car = {
               isLast: operation.isLast,
               registered_at: operation.registered_at,
               model_year: operation.model_year,
               vendor: operation.vendor,
               model: operation.model,
               color: {
                  ua: operation.color.ua,
               },
               address: operation.address,
               kind: {
                  ua: operation.kind.ua,
               },
               fuel: {
                  ua: operation.fuel.ua.charAt(0).toUpperCase() + operation.fuel.ua.slice(1).toLowerCase(),
               },
               photo_url: '',
               price: price,
            };

            setRegions(prevRegions => [...prevRegions, carData.address]);

            const removeSpaces = (str: string) => {
               return str.toLowerCase().replace(/[^\w\s-]/gi, '').replace(/\s+/g, '-');
            };

            try {
               const imageResponse = await axios.get(`https://baza-gai.com.ua/make/${removeSpaces(operation.vendor)}/${removeSpaces(operation.model)}`, {
                  headers: {
                     "Accept": "application/json",
                     "X-Api-Key": key
                  }
               });

               carData.photo_url = imageResponse.data.catalog_model.photo_url;
            } catch (error) {
               console.error('Error fetching car image:', error);
               setError(`Не вдалося отримати зображення авто ${removeSpaces(operation.vendor)} ${removeSpaces(operation.model)}.`);
            }

            return carData;
         }));

         setCars(carsData);
         setCurrentPage(1);
         setError('');
      } catch (error) {
         console.error('Error fetching cars data:', error);
         setError('Нічого не знайдено.');
      }
   };

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const paginatedCars = cars.slice(
      currentPage - 1,
      currentPage
   );

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchRequest(event.target.value);
   };

   const handleSearchClick = () => {
      fetchCars();
   };

   const handleCarSelect = (car: Car) => {
      if (selectedCars.includes(car)) {
         setSelectedCars(selectedCars.filter(c => c !== car));
      } else if (selectedCars.length < 2) {
         setSelectedCars([...selectedCars, car]);
      }
   };

   const handleCompareClick = () => {
      if (selectedCars.length === 2) {
         setShowModal(true);
      } else {
         setError('Будь ласка, виберіть два автомобілі для порівняння.');
      }
   };

   const radios = [
      { name: 'Номер або VIN', value: '1' }
   ];

   return (
      <AppWrapper>
         <AppContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
               <ButtonGroup style={{ width: '80%' }}>
                  {radios.map((radio, idx) => (
                     <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant="primary"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                        style={{ fontSize: '80%', width: '100%' }}
                     >
                        {radio.name}
                     </ToggleButton>
                  ))}
               </ButtonGroup>
               <Button variant="secondary" onClick={handleCompareClick}>
                  <FaBalanceScale />
               </Button>
            </div>
            <Form style={{ width: '100%', marginBottom: '1rem', marginTop: '0.5rem' }}>
               <Row>
                  <Form.Label>{'Перевірка авто за номером та VIN'}</Form.Label>
               </Row>
               <Row>
                  <Col style={{ paddingRight: 0 }}>
                     <Form.Control
                        type="text"
                        placeholder={'Номерний знак або VIN'}
                        value={searchRequest}
                        onChange={handleInputChange}
                     />
                  </Col>
                  <Col xs="auto">
                     <Button variant="primary" onClick={handleSearchClick}>Пошук</Button>
                  </Col>
               </Row>
            </Form>
            {error && (
               <Alert variant="danger">
                  {error}
               </Alert>
            )}
            <Row>
               {paginatedCars.map((car, index) => (
                  <Col key={index} lg={4} md={6} sm={12}>
                     <CarCard car={car} onCarSelect={handleCarSelect} isSelected={selectedCars.includes(car)} />
                  </Col>
               ))}
            </Row>
            <Pagination>
               <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
               />
               {Array.from({ length: cars.length }, (_, index) => (
                  <Pagination.Item
                     key={index}
                     active={index + 1 === currentPage}
                     onClick={() => handlePageChange(index + 1)}
                  >
                     {index + 1}
                  </Pagination.Item>
               ))}
               <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === cars.length}
               />
            </Pagination>
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
            {cars.length > 0 && (
               <>
                  <Pagination>
                     <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                     />
                     {Array.from({ length: cars.length }, (_, index) => (
                        <Pagination.Item
                           key={index}
                           active={index + 1 === currentPage}
                           onClick={() => handlePageChange(index + 1)}
                        >
                           {index + 1}
                        </Pagination.Item>
                     ))}
                     <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === cars.length}
                     />
                  </Pagination>
                  <UkraineMap regions={regions} />
               </>
            )}
         </AppContainer>
      </AppWrapper>
   );
};

export default App;

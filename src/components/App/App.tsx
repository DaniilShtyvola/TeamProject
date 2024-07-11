import React, { FC, useState } from 'react';
import { AppWrapper, AppContainer, TopPanel, DropDownContainer, CustomForm } from './App.styled';

import axios from 'axios';

import { Alert, ButtonGroup, ToggleButton, Form, Button, Row, Col, Pagination, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import CarCard from '../CarCard/CarCard';
import PlateCard from '../PlateCard/PlateCard'
import ModelCard from '../ModelCard/ModelCard';
import CompareModal from '../Modals/CompareModal';
import MapModal from '../Modals/MapModal';

import { Plate } from '../PlateCard/PlateCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced, faMapLocationDot, faEraser, faScrewdriverWrench, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface AppProps { }

export interface Car {
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

export interface Model {
   catalog_model: {
      photo_url: string;
      plate_count: number;
      price_avg: number;
      year_from: number;
      year_to: number;
   };
   full_title: string;
}

const App: FC<AppProps> = () => {
   const key: string = "9fbeb77af7305237b0cfb3273ab3e2f4";

   const [cars, setCars] = useState<Car[]>([]);
   const [selectedCars, setSelectedCars] = useState<Car[]>([]);
   const [regions, setRegions] = useState<string[]>([]);
   const [selectedRegion, setSelectedRegion] = useState<string>('kyiv');

   const [currentPage, setCurrentPage] = useState(1);
   const [searchRequest, setSearchRequest] = useState<string>('');
   const [radioValue, setRadioValue] = useState('1');
   const [error, setError] = useState<string>('');

   const [showCompareModal, setShowCompareModal] = useState(false);
   const [showMapModal, setShowMapModal] = useState(false);

   const [modelSearch, setModelSearch] = useState({ vendor: '', model: '' });
   const [model, setModel] = useState<Model>();
   const [plates, setPlates] = useState<Plate[]>([]);



   const removeSpaces = (str: string) => {
      return str.toLowerCase().trim().replace(/[^\w\s-]/gi, '').replace(/\s+/g, '-');
   };

   const fetchCars = async () => {
      if (key === "") {
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

         setRegions([]);

         const carsData: Car[] = await Promise.all(response.data.operations.map(async (operation: any, index: number) => {
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
               price: '',
            };

            setRegions(prevRegions => [...prevRegions, carData.address]);

            try {
               const modelResponse = await axios.get(`https://baza-gai.com.ua/make/${removeSpaces(operation.vendor)}/${removeSpaces(operation.model)}`, {
                  headers: {
                     "Accept": "application/json",
                     "X-Api-Key": key
                  }
               });

               carData.photo_url = modelResponse.data.catalog_model.photo_url;
               carData.price = modelResponse.data.catalog_model.price_avg;
            } catch (error) {
               console.error('Error fetching car model:', error);

               carData.price = "Н/Д";
               carData.photo_url = "https://baza-gai.com.ua/auto-placeholder.svg";
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

   const fetchModel = async () => {
      if (key === "") {
         setError(`Відсутній API ключ.`);
         return;
      }

      try {
         let url = `https://baza-gai.com.ua/make/${removeSpaces(modelSearch.vendor)}/${removeSpaces(modelSearch.model)}`;
         const response = await axios.get(url, {
            headers: {
               "Accept": "application/json",
               "X-Api-Key": key
            }
         });

         setRegions([]);

         const modelData: Model = {
            catalog_model: {
               photo_url: response.data.catalog_model.photo_url,
               plate_count: response.data.catalog_model.plate_count,
               price_avg: response.data.catalog_model.price_avg,
               year_from: response.data.catalog_model.year_from,
               year_to: response.data.catalog_model.year_to,
            },
            full_title: response.data.full_title,
         };

         setModel(modelData);
         setError('');
      } catch (error) {
         console.error('Error fetching model data:', error);
         setError('Нічого не знайдено.');
      }
   };

   const fetchPlatesByRegion = async () => {
      if (key === "") {
         setError('Відсутній API ключ.');
         return;
      }

      try {

         let url = `https://baza-gai.com.ua/search?region=${selectedRegion}`;
         const response = await axios.get(url, {
            headers: {
               "Accept": "application/json",
               "X-Api-Key": key
            }
         });

         setPlates(response.data.plates);
         setError('');
      } catch (error) {
         console.error('Error fetching plates data:', error);
         setError('Нічого не знайдено.');
      }
   };

   

   const handleFetchPlates = () => {
      fetchPlatesByRegion();
   };

   const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRegion(e.target.value);
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

   const handleCarSelect = (car: Car) => {
      if (selectedCars.includes(car)) {
         setSelectedCars(selectedCars.filter(c => c !== car));
      } else if (selectedCars.length < 2) {
         setSelectedCars([...selectedCars, car]);
      }
   };

   const handleCompareClick = () => {
      if (selectedCars.length === 2) {
         setShowCompareModal(true);
         setError('');
      } else {
         setError('Будь ласка, виберіть два автомобілі для порівняння.');
      }
   };

   const handleClearSelection = () => {
      setSelectedCars([]);
   };

   const handleMapClick = () => {
      setShowMapModal(true);
   };

   const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRadioValue(e.currentTarget.value);
   };

   const radios = [
      { name: 'Номер/VIN', value: '1' },
      { name: 'Область', value: '2' },
      { name: 'Модель', value: '3' }
   ];

   return (
      <AppWrapper>
         <AppContainer>
            <TopPanel style={{ width: '100%' }}>
               <DropDownContainer >
                  <Dropdown style={{ left: "-60px" }}>
                     <Dropdown.Toggle variant="secondary" id="dropdown-basic" disabled={radioValue !== '1'}>
                        <FontAwesomeIcon icon={faScrewdriverWrench} />
                     </Dropdown.Toggle>
                     <Dropdown.Menu style={{ minWidth: 0 }}>
                        <Dropdown.Item onClick={handleMapClick}>
                           <FontAwesomeIcon icon={faMapLocationDot} style={{ marginLeft: "1px" }} />
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleCompareClick}>
                           <FontAwesomeIcon icon={faScaleBalanced} />
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleClearSelection}>
                           <FontAwesomeIcon icon={faEraser} />
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </DropDownContainer>
               <ButtonGroup style={{ width: '100%' }}>
                  {radios.map((radio, idx) => (
                     <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant="primary"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={handleCategoryChange}
                        style={{ fontSize: '80%', width: '100%' }}
                     >
                        {radio.name}
                     </ToggleButton>
                  ))}
               </ButtonGroup>
            </TopPanel>
            {radioValue == '1' && (
               <>
                  <CustomForm>
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
                           <Button variant="primary" onClick={fetchCars}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                           </Button>
                        </Col>
                     </Row>
                  </CustomForm>
                  <Row>
                     {paginatedCars.map((car, index) => (
                        <Col key={index} lg={4} md={6} sm={12}>
                           <CarCard car={car} onCarSelect={handleCarSelect} isSelected={selectedCars.includes(car)} />
                        </Col>
                     ))}
                  </Row>
                  {cars.length > 1 && (
                     <Pagination style={{ marginTop: "1rem" }}>
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
                  )}
               </>
            )}
            {radioValue == '3' && (
               <>
                  <CustomForm>
                     <Row>
                        <Form.Label>{'Перевірка авто по марці та моделі'}</Form.Label>
                     </Row>
                     <Row>
                        <Col>
                           <Form.Control
                              type="text"
                              placeholder="Марка"
                              value={modelSearch.vendor}
                              onChange={(e) => setModelSearch({ ...modelSearch, vendor: e.target.value })}
                           />
                        </Col>
                        <Col style={{ padding: 0 }}>
                           <Form.Control
                              type="text"
                              placeholder="Модель"
                              value={modelSearch.model}
                              onChange={(e) => setModelSearch({ ...modelSearch, model: e.target.value })}
                           />
                        </Col>
                        <Col xs="auto">
                           <Button variant="primary" onClick={fetchModel}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                           </Button>
                        </Col>
                     </Row>
                  </CustomForm>
                  <ModelCard model={model}/>
               </>
            )}

            {radioValue === '2' && (
               <>
                  <CustomForm>
                     <Row>
                        <Form.Label>{'Вибір області'}</Form.Label>
                     </Row>
                     <Row>
                        <Col>
                           <Form.Control
                              as="select"
                              name="region"
                              id="region"
                              className="form-control"
                              value={selectedRegion}
                              onChange={(e) => setSelectedRegion(e.target.value)}
                           >
                              <option value="kyiv">м. Київ</option>
                              <option value="kyivska-oblast">Київська область</option>
                              <option value="vinnytsia-oblast">Вінницька область</option>
                              <option value="volyn-oblast">Волинська область</option>
                              <option value="dnipropetrovsk-oblast">Дніпропетровська область</option>
                              <option value="crimea">АР Крим</option>
                              <option value="donetsk-oblast">Донецька область</option>
                              <option value="zhytomyr-oblast">Житомирська область</option>
                              <option value="zakarpattia-oblast">Закарпатська область</option>
                              <option value="zaporizhia-oblast">Запорізька область</option>
                              <option value="ivano-frankivsk-oblast">Івано-Франківська область</option>
                              <option value="kirovohrad-oblast">Кіровоградська область</option>
                              <option value="luhansk-oblast">Луганська область</option>
                              <option value="lviv-oblast">Львівська область</option>
                              <option value="mykolaiv-oblast">Миколаївська область</option>
                              <option value="odessa-oblast">Одеська область</option>
                              <option value="poltava-oblast">Полтавська область</option>
                              <option value="rivne-oblast">Рівненська область</option>
                              <option value="sevastopol">Севастополь</option>
                              <option value="sumy-oblast">Сумська область</option>
                              <option value="ternopil-oblast">Тернопільська область</option>
                              <option value="kharkiv-oblast">Харківська область</option>
                              <option value="kherson-oblast">Херсонська область</option>
                              <option value="khmelnytskyi-oblast">Хмельницька область</option>
                              <option value="cherkasy-oblast">Черкаська область</option>
                              <option value="chernihiv-oblast">Чернігівська область</option>
                              <option value="chernivtsi-oblast">Чернівецька область</option>
                           </Form.Control>
                        </Col>
                        <Col xs="auto">
                           <Button variant="primary" onClick={handleFetchPlates}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                           </Button>
                        </Col>
                     </Row>
                     </CustomForm>
                     <CustomForm style={{ width: '250%' }}>
                     <Row>
                        {plates.map((plate, index) => (
                           <Col key={index} lg={4} md={6} sm={12}>
                              <PlateCard plate={plate} />
                           </Col>
                        ))}
                     </Row>
                     {error && <Alert variant="danger">{error}</Alert>}
                  </CustomForm>
               </>
            )}
            <CompareModal
               showModal={showCompareModal}
               setShowModal={setShowCompareModal}
               selectedCars={selectedCars}
            />
            <MapModal
               showModal={showMapModal}
               setShowModal={setShowMapModal}
               regions={regions}
            />
            {error && (
               <Alert variant="danger" style={{ textAlign: "center" }}>
                  {error}
               </Alert>
            )}
         </AppContainer>
      </AppWrapper>
   );
};

export default App;

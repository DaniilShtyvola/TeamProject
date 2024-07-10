import React from 'react';
import { CheckContainer, CheckIcon } from './CarCard.styled';

import { Card, Image } from 'react-bootstrap';

import { faCheck } from '@fortawesome/free-solid-svg-icons';

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

interface CarCardProps {
   car: Car;
   onCarSelect?: (car: Car) => void;
   isSelected?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, onCarSelect, isSelected }) => {
   return (
      <Card style={{ width: '18rem', border: isSelected ? '1px solid rgb(0,128,0)' : '' }} onClick={() => onCarSelect && onCarSelect(car)}>
         <Card.Body>
            <Card.Title>
               {car.vendor} {car.model}
            </Card.Title>
            <Image
               src={car.photo_url}
               rounded
               style={{ width: '100%', marginBottom: '12px' }}
            />
            <Card.Subtitle className="mb-2 text-muted">Рік: {car.model_year}</Card.Subtitle>
            <Card.Text style={{ marginBottom: 0 }}>
               <strong>Колір: </strong> {car.color.ua}<br />
               <strong>Адреса: </strong> {car.address}<br />
               <strong>Тип: </strong> {car.kind.ua}<br />
               <strong>Паливо: </strong> {car.fuel.ua}<br />
               <strong>Зареєстровано: </strong> {car.registered_at}<br />
               {car.price !== null && car.price !== "Н/Д" && (
                  <>
                     <strong>Ціна: </strong> {car.price.toLocaleString()} грн
                  </>
               )}
            </Card.Text>
            {isSelected && (
               <CheckContainer>
                  <CheckIcon icon={faCheck} style={{ position: "absolute" }} />
               </CheckContainer>
            )}
         </Card.Body>
      </Card>
   );
};

export default CarCard;

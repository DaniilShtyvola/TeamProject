import React from 'react';
import { Card, Image } from 'react-bootstrap';

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
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
   return (
      <Card style={{ width: '18rem', marginBottom: '1rem' }}>
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
            <Card.Text>
               <strong>Колір: </strong> {car.color.ua}<br />
               <strong>Адреса: </strong> {car.address}<br />
               <strong>Тип: </strong> {car.kind.ua}<br />
               <strong>Паливо: </strong> {car.fuel.ua}<br />
               <strong>Зареєстровано: </strong> {car.registered_at}<br />
               <strong>Ціна: </strong> {car.price}
            </Card.Text>
         </Card.Body>
      </Card>
   );
};

export default CarCard;

import React from 'react';
import { Card } from 'react-bootstrap';
import { StyledCard } from './PlateCard.styled';

export interface Plate {
   digits: string;
   registered_at: string;
   model_year: number;
   vendor: string;
   model: string;
   notes: string;
   operation: {
      group: string;
      code: number;
      title_ru: string | null;
      title_uk: string;
   };
   department: {
      title: string;
      address: string | null;
   };
}

interface PlateCardProps {
   plate: Plate;
}

const PlateCard: React.FC<PlateCardProps> = ({ plate }) => {
   return (
      <StyledCard>
         <Card.Body>
            <Card.Title>{plate.model} {plate.vendor}</Card.Title>
            <Card.Text>
               <strong>Номер:</strong> {plate.digits}<br />
               <strong>Рік випуску:</strong> {plate.model_year}<br />
               <strong>Опис:</strong> {plate.notes}<br />
               <strong>Група операції:</strong> {plate.operation.group}<br />
               <strong>Відділ:</strong> {plate.department.title}
               {plate.department.address && (
                  <React.Fragment>, {plate.department.address}</React.Fragment>
               )}
            </Card.Text>
         </Card.Body>
      </StyledCard>
   );
};

export default PlateCard;
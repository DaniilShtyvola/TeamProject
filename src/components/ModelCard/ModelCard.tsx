import React from 'react';

import { Card, Image } from 'react-bootstrap';

interface Model {
   catalog_model: {
      photo_url: string;
      plate_count: number;
      price_avg: number;
      year_from: number;
      year_to: number;
   };
   full_title: string;
}

interface ModelCardProps {
   model: Model | undefined;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
   if (!model) {
      return null;
   }

   return (
      <Card>
         <Card.Body>
            <Card.Title>
               {model.full_title}
            </Card.Title>
            <Image
               src={model.catalog_model.photo_url}
               rounded
               style={{ width: '100%', marginBottom: '12px' }}
            />
            <Card.Subtitle className="mb-2 text-muted">{model.catalog_model.year_from} - {model.catalog_model.year_to === null ? 'Сьогодні' : model.catalog_model.year_to}</Card.Subtitle>
            <Card.Text style={{ marginBottom: 0 }}>
               <strong>Реєстрацій: </strong> {model.catalog_model.plate_count.toLocaleString('uk-UA')}<br />
               {model.catalog_model.price_avg !== null && (
                  <>
                     <strong>Середня ціна: </strong> {model.catalog_model.price_avg.toLocaleString('uk-UA')} грн<br />
                  </>
               )}
            </Card.Text>
         </Card.Body>
      </Card>
   );
};

export default ModelCard;

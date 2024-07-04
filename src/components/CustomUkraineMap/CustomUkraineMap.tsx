import React, { FC, useEffect } from 'react';
import { CustomUkraineMapWrapper } from './CustomUkraineMap.styled';

import { ReactComponent as Ukraine } from '@svg-maps/ukraine/ukraine.svg';

interface CustomUkraineMapProps {
   regions: string[];
}

const CustomUkraineMap: FC<CustomUkraineMapProps> = ({ regions }) => {
   const convertUkrainianToIds = (places: string[]): string[] => {
      const ukrainianToEnglishIdMap = {
         "Черкаська": 'cherkasy',
         "Чернігівська": 'chernihiv',
         "Чернівецька": 'chernivtsi',
         "Крим": 'crimea',
         "Дніпропетровська": 'dnipropetrovsk',
         "Донецька": 'donetsk',
         "Івано-Франківська": 'ivano-frankivsk',
         "Харківська": 'kharkiv',
         "Херсонська": 'kherson',
         "Хмельницька": 'khmelnytskyi',
         "Кіровоградська": 'kirovohrad',
         "Київська": 'kyiv',
         "Київ": 'kyiv-city',
         "Луганська": 'luhansk',
         "Львівська": 'lviv',
         "Миколаївська": 'mykolaiv',
         "Одеська": 'odessa',
         "Полтавська": 'poltava',
         "Рівненська": 'rivne',
         "Сумська": 'sumy',
         "Тернопільська": 'ternopil',
         "Вінницька": 'vinnytsia',
         "Волинська": 'volyn',
         "Закарпатська": 'zakarpattia',
         "Запорізька": 'zaporizhia',
         "Житомирська": 'zhytomyr',
      };

      return places.map(place => {
         for (const [ukrName, engId] of Object.entries(ukrainianToEnglishIdMap)) {
            if (place.includes(ukrName)) {
               return engId;
            }
         }
         return '';
      });
   };

   const Ids = convertUkrainianToIds(regions);

   console.log(Ids);

   useEffect(() => {
      const paths = document.querySelectorAll<SVGPathElement>('svg path');

      paths.forEach((path: SVGPathElement) => {
         path.style.fill = 'rgb(234, 236, 239)';
         path.style.stroke = 'white';
         path.style.strokeWidth = '2';

         Ids.forEach(engId => {
            if (path.id.toLowerCase() === engId) {
               path.style.fill = 'rgb(13, 110, 253)';
            }
         });
      });
   }, [regions]);

   return (
      <CustomUkraineMapWrapper>
         <Ukraine />
      </CustomUkraineMapWrapper>
   );
};

export default CustomUkraineMap;
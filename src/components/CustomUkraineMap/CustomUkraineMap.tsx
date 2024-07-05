import React, { FC, useEffect, useState, useRef } from 'react';
import { CustomUkraineMapWrapper, ButtonContainer } from './CustomUkraineMap.styled';
import { ReactComponent as Ukraine } from '@svg-maps/ukraine/ukraine.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

interface CustomUkraineMapProps {
   regions: string[];
}

const CustomUkraineMap: FC<CustomUkraineMapProps> = ({ regions }) => {
   const [isMapVisible, setIsMapVisible] = useState(false);
   const mapRef = useRef<SVGSVGElement>(null);

   const convertUkrainianToIds = (places: string[]): string[] => {
      const ukrainianToEnglishIdMap = {
         "черкаськ": 'cherkasy',
         "чернігівськ": 'chernihiv',
         "чернівецьк": 'chernivtsi',
         "крим": 'crimea',
         "дніпропетровськ": 'dnipropetrovsk',
         "донецьк": 'donetsk',
         "івано-Франківськ": 'ivano-frankivsk',
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

      return places.map(place => {
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
      if (isMapVisible && mapRef.current) {
         const paths = mapRef.current.querySelectorAll<SVGPathElement>('path');

         paths.forEach((path: SVGPathElement) => {
            path.style.fill = 'rgb(234, 236, 239)';
            path.style.stroke = 'white';
            path.style.strokeWidth = '2';

            Ids.forEach(engId => {
               if (path.id === engId) {
                  path.style.fill = 'rgb(13, 110, 253)';
               }
            });
         });
      }
   }, [isMapVisible, regions]);

   const handleMap = () => {
      setIsMapVisible(state => !state);
   };

   return (
      <CustomUkraineMapWrapper>
         <ButtonContainer>
            <Button variant="primary" onClick={handleMap} style={{ position: 'absolute'}}>
               <FontAwesomeIcon icon={isMapVisible ? faXmark : faMapLocationDot}/>
            </Button>
         </ButtonContainer>
         {isMapVisible && <Ukraine ref={mapRef} />}
      </CustomUkraineMapWrapper>
   );
};

export default CustomUkraineMap;

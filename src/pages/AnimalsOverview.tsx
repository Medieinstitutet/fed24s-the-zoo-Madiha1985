import { useEffect, useState } from 'react';
import styled from 'styled-components';
import animalService from '../services/animalService';
import type { IAnimal } from '../models/IAnimal';
import AnimalCard from '../components/animals/AnimalCard'
import Loader from '../components/common/Loader';

const Container = styled.section`
  padding: 2rem;
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;
export default function AnimalsOverview(){
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animalService.getAnimals()
      .then(data => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <Container>
      {animals.map(animal => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </Container>
  );
};



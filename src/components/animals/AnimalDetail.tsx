import { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import animalService from '../../services/animalService';
import type { IAnimal } from '../../models/IAnimal';
import Loader from '../common/Loader';
import styled from 'styled-components';
import fallbackImg from "../../assets/fallbackimage.jpg";
import fullImg from "../../assets/full.jpg";
import soonImg from "../../assets/hungry.webp";
import hungryImg from "../../assets/hungrycat.jpg";
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
`;

const Img = styled.img`
  max-width: 100%;
  border-radius: 8px;
`;

const Name = styled.h1``;

const Description = styled.p`
  max-width: 600px;
`;
const FeedingStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; 
  margin-top: 1rem;
`;
const FeedButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1rem;
  color: #333;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const MotionContainer = motion(Container);
const MotionFeedButton = motion(FeedButton);
const MotionBackLink = motion(BackLink);

const getFeedingLevel = (lastFed: string) => {
  const hoursSinceFed =
    (Date.now() - new Date(lastFed).getTime()) / (1000 * 60 * 60);
  if (hoursSinceFed < 3) return 'full';
  if (hoursSinceFed < 4) return 'soon';
  return 'hungry';
};

export default function AnimalDetail(){
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [canFeed, setCanFeed] = useState(false);
  const [feedingLevel, setFeedingLevel] = useState<'full' | 'soon' | 'hungry'>('full');

  useEffect(() => {
    if (id) {
     const storedAnimal= localStorage.getItem(`animal_${id}`);
     if(storedAnimal){
      try{
      const parsed = JSON.parse(storedAnimal);
      setAnimal(parsed);
      updateFeedStatus(parsed.lastFed);
      setLoading(false);}catch(err){
        console.error("failed to parse animal from localStorage",err);
        setLoading(false);
      }

     } else{
          animalService.getAnimalById(+id)
          .then(data=>{
            setAnimal(data);
            updateFeedStatus(data.lastFed);
            localStorage.setItem(`animal_${id}`,JSON.stringify(data));
            setLoading(false);
          })
        .catch(() => setLoading(false));
    }
  }

  }, [id]);


useEffect(() => {
  if (!animal) return;

  const interval = setInterval(() => {
    updateFeedStatus(animal.lastFed);
  }, 60 * 1000);

  return () => clearInterval(interval);
}, [animal?.lastFed]);

   const updateFeedStatus = (lastFed: string) => {
    const lastFedTime = new Date(lastFed).getTime();
  const hoursSinceFed = (Date.now() - lastFedTime) / (1000 * 60 * 60);

  console.log("Hours since fed:", hoursSinceFed);
  setCanFeed(hoursSinceFed >= 4);
  setFeedingLevel(getFeedingLevel(lastFed));
  };

  
const handleFeed = () => {
    if (!animal) return;
    const updated = {
      ...animal,
      isFed: true,
      lastFed: new Date().toISOString(),
    };
      console.log("Feeding animal:", updated);
    setAnimal(updated);
    localStorage.setItem(`animal_${animal.id}`, JSON.stringify(updated));
    updateFeedStatus(updated.lastFed);
  };

  if (loading) return <Loader />;

  if (!animal) return <Container>Animal not found</Container>;
  return (
    <MotionContainer   initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}>
      <MotionBackLink to="/animals" 
      whileHover={{ scale: 1.1, color: '#004d00' }}
  transition={{ type: 'spring', stiffness: 300 }}
      >← Back to Animals</MotionBackLink>
      <Name>{animal.name}</Name>
      <Img src={animal.imageUrl} alt={animal.name || 'Animal image'}  onError={(e)=>{
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = fallbackImg;
      }}/>
      <Description>{animal.longDescription}</Description>
       <p>Last fed: {new Date(animal.lastFed).toLocaleString()}</p>
    
<FeedingStatusWrapper>
<motion.img
  src={
    feedingLevel === 'full'
      ? fullImg
      : feedingLevel === 'soon'
      ? soonImg
      : hungryImg
  }
  alt={feedingLevel}
  style={{ width: '80px', height: '80px', objectFit: 'contain', marginTop: '1rem' }}
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
      <MotionFeedButton onClick={handleFeed} disabled={!canFeed}
       whileHover={{ scale: canFeed ? 1.05 : 1 }}
  whileTap={{ scale: canFeed ? 0.95 : 1 }}
      >
        {canFeed ? 'Feed Animal 🍽️' : 'Already Fed'}
      </MotionFeedButton>
      </FeedingStatusWrapper>
    </MotionContainer>
  );
};



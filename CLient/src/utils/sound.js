import { Howl } from 'howler';

const popSound = new Howl({
  src: ['/sounds/pop.mp3'],
  volume: 0.5,
  preload: true
});

export const playPopSound = () => {
  try {
    popSound.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
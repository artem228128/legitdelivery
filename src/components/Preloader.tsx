import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  0% {
    opacity: 1;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const morphing = keyframes`
  0% { 
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: rotate(0deg) scale(1);
  }
  25% { 
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: rotate(90deg) scale(1.1);
  }
  50% { 
    border-radius: 50% 30% 60% 40% / 40% 70% 40% 50%;
    transform: rotate(180deg) scale(1);
  }
  75% { 
    border-radius: 40% 70% 30% 60% / 60% 40% 70% 30%;
    transform: rotate(270deg) scale(0.9);
  }
  100% { 
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: rotate(360deg) scale(1);
  }
`;

const float = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  33% { 
    transform: translateY(-20px) rotate(120deg);
  }
  66% { 
    transform: translateY(-10px) rotate(240deg);
  }
`;

const pulse = keyframes`
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
`;

const slideInOut = keyframes`
  0% { 
    transform: translateX(-100px);
    opacity: 0;
  }
  50% { 
    transform: translateX(0);
    opacity: 1;
  }
  100% { 
    transform: translateX(100px);
    opacity: 0;
  }
`;

const wave = keyframes`
  0%, 100% { 
    transform: scaleY(1);
  }
  50% { 
    transform: scaleY(1.5);
  }
`;

const PreloaderWrapper = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${props => !props.$isVisible ? fadeOut : 'none'} 0.8s ease-in-out forwards;
  overflow: hidden;
`;

const PreloaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  position: relative;
`;

const LogoContainer = styled.div`
  position: relative;
  z-index: 2;
`;

const Logo = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  color: #000;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: -0.05em;
  animation: ${pulse} 3s ease-in-out infinite;
  text-transform: uppercase;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #000;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const AnimationContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MorphingShape = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #000 0%, #333 50%, #000 100%);
  animation: ${morphing} 4s ease-in-out infinite;
  position: absolute;
`;

const FloatingDots = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Dot = styled.div<{ $delay: number; $size: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: #000;
  border-radius: 50%;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  
  &:nth-child(1) {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &:nth-child(2) {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  
  &:nth-child(3) {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &:nth-child(4) {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
`;

const LoadingText = styled.div`
  color: #000;
  font-size: 1.2rem;
  font-weight: 500;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent);
    animation: ${slideInOut} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ProgressContainer = styled.div`
  width: 200px;
  height: 2px;
  background: #e9ecef;
  border-radius: 1px;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 480px) {
    width: 150px;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  height: 100%;
  gap: 2px;
`;

const ProgressSegment = styled.div<{ $delay: number }>`
  flex: 1;
  background: #000;
  transform: scaleY(0);
  transform-origin: center;
  animation: ${wave} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const GridDot = styled.div<{ $x: number; $y: number; $delay: number }>`
  position: absolute;
  width: 2px;
  height: 2px;
  background: #dee2e6;
  border-radius: 50%;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  animation: ${pulse} 4s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

interface PreloaderProps {
  isVisible: boolean;
  progress?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ isVisible, progress = 0 }) => {
  if (!isVisible && progress === 100) {
    return null;
  }

  // Generate grid dots
  const gridDots = [];
  for (let i = 0; i < 50; i++) {
    gridDots.push(
      <GridDot
        key={i}
        $x={Math.random() * 100}
        $y={Math.random() * 100}
        $delay={Math.random() * 2}
      />
    );
  }

  return (
    <PreloaderWrapper $isVisible={isVisible}>
      <BackgroundElements>
        {gridDots}
      </BackgroundElements>
      
      <PreloaderContent>
        <LogoContainer>
          <Logo>LegitDelivery</Logo>
        </LogoContainer>
        
        <AnimationContainer>
          <MorphingShape />
          <FloatingDots>
            <Dot $delay={0} $size={8} />
            <Dot $delay={0.5} $size={6} />
            <Dot $delay={1} $size={8} />
            <Dot $delay={1.5} $size={6} />
          </FloatingDots>
        </AnimationContainer>
        
        <LoadingText>Loading Experience</LoadingText>
        
        <ProgressContainer>
          <ProgressBar>
            {Array.from({ length: 20 }).map((_, i) => (
              <ProgressSegment key={i} $delay={i * 0.1} />
            ))}
          </ProgressBar>
        </ProgressContainer>
      </PreloaderContent>
    </PreloaderWrapper>
  );
};

export default Preloader; 
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { products } from '../data/products';
import Collections from '../components/Collections';
import CategoriesMasonryBlock from '../components/CategoriesMasonryBlock';
import Preloader from '../components/Preloader';

const PopularShowMoreButton = styled.button`
  background: var(--primary-yellow, #FFD700);
  color: var(--text-dark, #222);
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 24px auto 0 auto;
  
  &:hover {
    background: #FFE55C;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
  &:active {
    transform: translateY(0);
  }
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid #fff3;
  border-top: 3px solid var(--text-dark, #222);
  border-radius: 50%;
  animation: spin 0.35s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

// Hero Section
const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  background: #000;
`;

const HeroVideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const VideoBg = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  z-index: 1;
  background-size: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 20px;
  animation: ${fadeInUp} 1s ease-out;
  position: relative;
  z-index: 3;
  
  h1 {
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: black;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 12px 30px;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
  animation: ${fadeInUp} 1s ease-out 0.5s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: 900;
    color: #FFD700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 0.3rem;
    
    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
  
  .label {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
  
  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .number, .label {
      margin: 0;
    }
  }
`;

// Categories & Brands Section
const CategoriesSection = styled.section<{ $isVisible?: boolean }>`
  padding: 0;
  background: none;
  position: static;
  opacity: 1;
  transform: none;
  transition: none;
  overflow: visible;
`;

const CategoriesGrid = styled.div`
  display: block;
  background: none;
  box-shadow: none;
  max-width: none;
  margin: 0;
  position: static;
`;

const CategoryCard = styled(Link)<{ $delay?: number; $isVisible?: boolean }>`
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'scale(1)' : 'scale(0.9)'};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: ${(props) => props.$delay || 0}s;
  height: 320px;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-20px) scale(1.02);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 215, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 0 40px rgba(255, 215, 0, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    height: 280px;
    border-radius: 16px;
    
    &:hover {
      transform: translateY(-10px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    height: 220px;
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-8px) scale(1.01);
    }
  }
`;

const CategoryImageContainer = styled.div<{ $gradient?: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${CategoryCard}:hover & img {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4));
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const CategoryInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  background: linear-gradient(to top, 
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.7) 50%,
    rgba(0,0,0,0.3) 80%,
    rgba(0,0,0,0) 100%);
  z-index: 3;
  backdrop-filter: blur(5px);
  
  h3 {
    color: white;
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
    text-shadow: 
      2px 2px 4px rgba(0,0,0,0.5),
      0 0 20px rgba(255, 215, 0, 0.3);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #FFD700, #FFA500);
      transition: width 0.3s ease;
      border-radius: 1px;
    }
  }
  
  ${CategoryCard}:hover & h3::after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    
    h3 {
      font-size: 1.4rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    
    h3 {
      font-size: 1.2rem;
      letter-spacing: 0.3px;
    }
  }
`;

// Scrolling Strip Section
const ScrollingStrip = styled.div`
  width: 100%;
  height: 80px;
  background: #000;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    height: 60px;
  }
  
  @media (max-width: 480px) {
    height: 50px;
  }
`;

const ScrollingContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: url('/images/scrollimg.png') repeat-x;
  background-size: auto 100%;
  animation: scroll-left 20s linear infinite;
  width: 200%;
  
  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

// Popular Products Section
const PopularSection = styled.section<{ $isVisible?: boolean }>`
  background: #fff;
  padding: 80px 0 60px 0;
  position: relative;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 1s ease-out, transform 1s ease-out;
  z-index: 2;
  @media (max-width: 768px) {
    padding: 60px 0 40px 0;
  }
`;

const ScrollIndicator = styled.div`
  display: none;
  animation: ${fadeInUp} 0.8s ease-out 0.3s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding: 0 20px;
    
    .indicator-text {
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }
    
    .swipe-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
      
      &::after {
        content: '←→';
        color: #333;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    gap: 20px;
    padding: 0 20px;
    margin: 0 0 40px;
    
    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* Add padding to first and last items */
    &::before {
      content: '';
      flex-shrink: 0;
      width: 1px;
    }
    
    &::after {
      content: '';
      flex-shrink: 0;
      width: 1px;
    }
  }
`;

const ProductCard = styled.div<{ $delay?: number }>`
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 1px 8px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${(props) => props.$delay || 0}s;
  animation-fill-mode: both;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #45B7D1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 10px 20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 280px;
    margin-right: 0;
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-6px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    width: 260px;
    border-radius: 18px;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 170px;
  }
`;

const HitBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 2;
  box-shadow: 
    0 4px 12px rgba(255, 107, 107, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 
        0 4px 12px rgba(255, 107, 107, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 
        0 6px 16px rgba(255, 107, 107, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }
  
  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    font-size: 0.7rem;
  }
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 160px;
  object-fit: contain;
  background: transparent;
  transition: transform 0.3s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 480px) {
    max-height: 110px;
  }
`;

const BuyButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #222;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 16px;
  padding: 14px 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #FFA500 0%, #FFD700 100%);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 8px 25px rgba(255, 215, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.01);
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 0;
    border-radius: 14px;
  }
`;

const ProductInfo = styled.div`
  padding: 16px 20px 18px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(240, 240, 240, 0.8);
  min-height: 120px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #2c3e50;
    line-height: 1.3;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: #7f8c8d;
    margin-bottom: 12px;
    font-size: 0.95rem;
    line-height: 1.4;
    font-weight: 500;
  }
  
  .price {
    font-size: 1.25rem;
    font-weight: 900;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    text-shadow: 0 2px 4px rgba(255, 215, 0, 0.2);
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px 16px;
    min-height: 100px;
    
    h3 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
    
    .price {
      font-size: 1.15rem;
    }
  }
`;

const ViewAllButton = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: fit-content;
  margin: 0 auto;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #000;
  padding: 18px 36px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  animation: ${fadeInUp} 0.8s ease-out 0.6s;
  animation-fill-mode: both;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent);
    transition: left 0.6s ease;
  }
  
  &::after {
    content: '→';
    position: absolute;
    right: 18px;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    font-size: 1.3rem;
    font-weight: 300;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.1) 100%);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    &::before {
      left: 100%;
    }
    
    &::after {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
    border-radius: 14px;
    
    &::after {
      right: 16px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 0.95rem;
    border-radius: 12px;
    letter-spacing: 1px;
    
    &::after {
      right: 14px;
      font-size: 1.2rem;
    }
  }
`;

const CategoriesDivider = styled.div`
  margin: 40px 0;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out 0.4s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    margin: 30px 0;
  }
  
  @media (max-width: 480px) {
    margin: 20px 0;
  }
`;

const BrandsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
`;

const BrandCard = styled(Link)<{ $delay?: number; $isVisible?: boolean }>`
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  text-decoration: none;
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(-30px)'};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: ${(props) => props.$delay || 0}s;
  
  &:hover {
    transform: translateY(-5px) translateX(0);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    color: #007bff;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    font-size: 1.1rem;
  }
`;

// Stats Section
const StatsSection = styled.section`
  position: relative;
  min-height: 440px;
  padding: 100px 20px 100px 20px;
  background: url('/images/whywe.jpg') center/cover no-repeat;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.65);
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 3;
  }

  @media (max-width: 768px) {
    min-height: 320px;
    padding: 60px 16px;
    background-attachment: scroll;
  }
  @media (max-width: 600px) {
    min-height: 220px;
    padding: 40px 12px;
    background-attachment: scroll;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const StatCard = styled.div<{ $delay?: number }>`
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${(props) => props.$delay || 0}s;
  animation-fill-mode: both;
  
  .number {
    font-size: 4rem;
    font-weight: 900;
    color: #FFD700;
    margin-bottom: 10px;
    
    @media (max-width: 768px) {
      font-size: 3rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2.5rem;
    }
  }
  
  .label {
    font-size: 1.2rem;
    opacity: 0.9;
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

// FAQ Section
const FAQSection = styled.section<{ $isVisible?: boolean }>`
  padding: 40px 20px;
  background: #ffffff;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 1s ease-out, transform 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div<{ $delay?: number; $isVisible?: boolean }>`
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: ${(props) => props.$delay || 0}s;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: none;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  position: relative;
  
  &:hover {
    background: linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%);
    color: #007bff;
  }
  
  &::after {
    content: '+';
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    font-weight: 300;
    color: #666;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    color: #007bff;
  }
  
  @media (max-width: 480px) {
    padding: 15px 20px;
    font-size: 1rem;
    
    &::after {
      right: 20px;
    }
  }
`;

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
  padding: ${props => props.$isOpen ? '25px' : '0 25px'};
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  border-top: 1px solid #f0f0f0;
  
  p {
    margin: 0;
    color: #555;
    line-height: 1.7;
    font-size: 1rem;
    white-space: pre-line;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.$isOpen ? '20px' : '0 20px'};
  }
`;

const AboutSection = styled.section<{ $isVisible?: boolean }>`
  padding: 80px 20px;
  background: #f8f9fa;
  position: relative;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 1s ease-out, transform 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const AboutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const AboutContent = styled.div<{ $delay?: number; $isVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${(props) => props.$delay || 0}s;
  animation-fill-mode: both;
  
  h2 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 20px;
    color: #1a1a1a;
    animation: ${fadeInUp} 0.8s ease-out;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    background: none;
    -webkit-background-clip: initial;
    -webkit-text-fill-color: initial;
    background-clip: initial;
    
    @media (max-width: 768px) {
      font-size: 2.8rem;
      margin-bottom: 15px;
    }
    
    @media (max-width: 480px) {
      font-size: 2.2rem;
      margin-bottom: 10px;
    }
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 25px;
    font-weight: 500;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: 15px;
    }
  }
  
  strong {
    color: #333;
    font-weight: 700;
  }
  
  em {
    font-style: italic;
    color: #666;
  }
`;

const AboutTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.8s ease-out;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  background: none;
  -webkit-background-clip: initial;
  -webkit-text-fill-color: initial;
  background-clip: initial;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
`;

const AboutText = styled.div`
  p {
    margin-bottom: 15px;
  }
  
  p:last-child {
    margin-bottom: 0;
  }
`;



const AboutCommunity = styled.div`
  margin-top: 30px;
  p {
    font-size: 1.1rem;
    color: #555;
    line-height: 1.8;
    font-weight: 500;
    margin-bottom: 15px;
  }
  
  p:last-child {
    margin-bottom: 0;
  }
  
  strong {
    color: #333;
    font-weight: 700;
  }
`;

const AboutImage = styled.div<{ $delay?: number; $isVisible?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: ${fadeInUp} 0.8s ease-out 0.4s;
  animation-delay: ${(props) => props.$delay || 0}s;
  animation-fill-mode: both;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 480px) {
    height: 300px;
  }
`;

const SectionTitle = styled.h2<{ $color?: string; $isCategories?: boolean }>`
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  margin-bottom: 80px;
  color: ${props => props.$isCategories ? '#ffffff' : '#1a1a1a'};
  animation: ${fadeInUp} 0.8s ease-out;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  position: relative;
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 60px;
  }
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
`;

const categories = [
  { 
    name: 'Кросівки', 
    image: '/images/sneakers.PNG',
    link: '/catalog?category=sneakers'
  },
  { 
    name: 'Сумки', 
    image: '/images/bag.jpg',
    link: '/catalog?category=bags'
  },
  { 
    name: 'Аксесуари', 
    image: '/images/jewellery.png',
    link: '/catalog?category=accessories'
  },
  { 
    name: 'Футболки', 
    image: '/images/tshirt.jpg',
    link: '/catalog?category=tshirts'
  },
  { 
    name: 'Верхній одяг', 
    image: '/images/jaket.png',
    link: '/catalog?category=outerwear'
  },
  { 
    name: 'Худі/Світшоти', 
    image: '/images/hoodie.png',
    link: '/catalog?category=hoodies'
  },
];

const brands = [
  { name: 'Nike', link: '/catalog?brand=Nike' },
  { name: 'Adidas', link: '/catalog?brand=Adidas' },
  { name: 'Air Jordan', link: '/catalog?brand=Air Jordan' },
  { name: 'New Balance', link: '/catalog?brand=New Balance' },
  { name: 'Yeezy', link: '/catalog?brand=Yeezy' },
  { name: 'Off-White', link: '/catalog?brand=Off-White' },
];

const faqData = [
  {
    question: 'Як обрати правильний розмір?',
    answer: 'Скористайтеся нашою розмірною сіткою, яка є на сторінці кожного товару. Для точності рекомендуємо виміряти стопу, як це правильно зробити можна дізнатися <a href="/size-guide" style="color: var(--primary-blue); text-decoration: none;">тут</a>. Порівняйте із таблицею, щоб підібрати ідеальний розмір.'
  },
  {
    question: 'Як я можу оплатити замовлення?',
    answer: 'Ми працюємо за умовами часткової передоплати — 30% від суми замовлення сплачується на банківську картку, ФОП або у криптовалюті. Решту суми можна оплатити при отриманні на відділенні Нової пошти. Також можна внести повну оплату одразу.'
  },
  {
    question: 'Чи можна замовити в іншу країну?',
    answer: 'Так, ми надсилаємо замовлення за кордон. Напишіть нам у Telegram/Direct — і ми уточнимо деталі міжнародної доставки.'
  },
  {
    question: 'Як здійснюється доставка по Україні?',
    answer: 'Ми працюємо з "Новою поштою". Доставка займає 1–3 робочі дні. Після відправлення ви отримаєте SMS із трек-номером, щоб відстежити посилку.'
  },
  {
    question: 'Чому ціни можуть змінюватись в залежності від розміру?',
    answer: 'Деякі лімітовані моделі мають різну закупівельну ціну в залежності від пропозицій в Америці, вони постійно змінюються — це впливає на кінцеву вартість.'
  }
];

const HomePage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [popularLoading, setPopularLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const productsGridRef = useRef<HTMLDivElement>(null);
  const popularSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get popular products from custom sneakers (first 8 products)
  const customSneakers = products.filter(product => 
    product.id.includes('custom_') || product.id.includes('CUSTOM')
  );
  
  console.log('Всего товаров:', products.length);
  console.log('Кастомных товаров:', customSneakers.length);
  console.log('Кастомные товары:', customSneakers.map(p => ({ id: p.id, name: p.name })));
  
  const popularProducts = customSneakers.length > 0 
    ? customSneakers.slice(0, 8) 
    : products.slice(0, 6);

  // --- Новая логика для показа только 3 товаров на десктопе/планшете ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visiblePopularProducts = isMobile || showAllPopular
    ? popularProducts
    : popularProducts.slice(0, 3);

  // Preloader logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe sections
    if (popularSectionRef.current) {
      popularSectionRef.current.id = 'popular-section';
      observer.observe(popularSectionRef.current);
    }
    if (faqSectionRef.current) {
      faqSectionRef.current.id = 'faq-section';
      observer.observe(faqSectionRef.current);
    }
    if (aboutSectionRef.current) {
      aboutSectionRef.current.id = 'about-section';
      observer.observe(aboutSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Ensure video plays
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Set video source directly as fallback
      video.src = '/images/bg.mp4';
      
      const playVideo = async () => {
        try {
          await video.play();
          console.log('Video is playing');
        } catch (error) {
          console.log('Autoplay prevented:', error);
          // Fallback: try to play on user interaction
          const playOnInteraction = () => {
            video.play();
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
          };
          document.addEventListener('click', playOnInteraction);
          document.addEventListener('touchstart', playOnInteraction);
        }
      };

      video.addEventListener('loadeddata', playVideo);
      video.load(); // Force reload

      return () => {
        video.removeEventListener('loadeddata', playVideo);
      };
    }
  }, []);

  // Set initial scroll position on mobile
  useEffect(() => {
    const setInitialScrollPosition = () => {
      if (window.innerWidth <= 768 && productsGridRef.current) {
        // Calculate position for 3rd product (index 2)
        const productWidth = 240; // width of each product card
        const gap = 20; // gap between products
        const scrollPosition = (productWidth + gap) * 2; // 2 because we want 3rd position (index 2)
        
        productsGridRef.current.scrollLeft = scrollPosition;
      }
    };

    setInitialScrollPosition();
    
    // Re-set position on window resize
    const handleResize = () => {
      setInitialScrollPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Preloader isVisible={isLoading} progress={loadingProgress} />
      <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroVideoContainer>
          <VideoBg 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            preload="metadata"
            poster=""
            onLoadedData={() => console.log('Video loaded')}
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/images/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </VideoBg>
        </HeroVideoContainer>
        <HeroOverlay />
        <HeroContent>
          <h1>LegitDelivery</h1>
          <p>Тут починається твоя історія стилю.</p>
          <HeroButton to="/catalog">Почати покупки</HeroButton>
          <HeroStats>
            <StatItem>
              <div className="number">1400+</div>
              <div className="label">моделей</div>
            </StatItem>
            <StatItem>
              <div className="number">500+</div>
              <div className="label">відгуків</div>
            </StatItem>
            <StatItem>
              <div className="number">100%</div>
              <div className="label">authentic</div>
            </StatItem>
          </HeroStats>
        </HeroContent>
      </HeroSection>

      {/* Scrolling Strip */}
      <ScrollingStrip>
        <ScrollingContent />
      </ScrollingStrip>

      {/* Popular Products Section */}
      <PopularSection ref={popularSectionRef} $isVisible={isVisible['popular-section']}>
        <SectionTitle>ПОПУЛЯРНІ МОДЕЛІ</SectionTitle>
        <ScrollIndicator>
          <div className="indicator-text">Свайп для перегляду</div>
          <div className="swipe-icon"></div>
        </ScrollIndicator>
        <ProductsGrid ref={productsGridRef}>
          {visiblePopularProducts.map((product, index) => (
            <ProductCard key={product.id} $delay={index * 0.1}>
              <ProductImageContainer>
                {product.isHit && <HitBadge>HIT</HitBadge>}
                <ProductImage src={product.image} alt={product.name} />
              </ProductImageContainer>
              <ProductInfo>
                <h3>{product.name}</h3>
                <p>{product.brand}</p>
                <div className="price">₴{product.price}</div>
                <BuyButton onClick={() => window.location.href = `/product/${product.id}`}>Купити</BuyButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
        {/* Кнопка 'Завантажити ще' только если не мобилка и товаров больше 3 */}
        {!isMobile && popularProducts.length > 3 && (
          !showAllPopular ? (
            <PopularShowMoreButton onClick={() => {
              setPopularLoading(true);
              setTimeout(() => {
                setShowAllPopular(true);
                setPopularLoading(false);
              }, 350);
            }} disabled={popularLoading}>
              {popularLoading && <Spinner />}
              Завантажити ще
            </PopularShowMoreButton>
          ) : (
            <PopularShowMoreButton onClick={() => {
              setPopularLoading(true);
              setTimeout(() => {
                setShowAllPopular(false);
                setPopularLoading(false);
              }, 350);
            }} disabled={popularLoading}>
              {popularLoading && <Spinner />}
              Сховати
            </PopularShowMoreButton>
          )
        )}
        {isMobile && (
          <ViewAllButton to="/catalog">Весь каталог</ViewAllButton>
        )}
      </PopularSection>

      {/* Categories Section */}
      <CategoriesMasonryBlock />

      {/* Collections Section */}
      <Collections />

      {/* About Us Section */}
      <AboutSection ref={aboutSectionRef} $isVisible={isVisible['about-section']}>
        <AboutContainer>
          <AboutContent $delay={0} $isVisible={isVisible['about-section']}>
            <AboutTitle>Про нас</AboutTitle>
                         <AboutText>
               <p>
                 Ласкаво просимо до <strong>legitdelivery.ua</strong> — сервісу, де довіра, стиль і якість об'єднуються в одному місці. Ми створили платформу, яка допомагає отримати оригінальні кросівки та одяг без ризиків, обману та сумнівів. Наш головний принцип — <em>тільки легіт, тільки справжнє</em>.
               </p>
               <p>
                 У світі, де репліки заполонили ринок, ми — за чесність. Ми співпрацюємо з перевіреними ресейлерами, магазинами та платформами, ретельно перевіряємо кожну пару й кожну позицію, перш ніж вона потрапить до вас.
               </p>
               <p>
                 <strong>legitdelivery.ua</strong> — це більше, ніж доставка. Це сервіс, який стоїть за вами. Наша мета — зробити снікерхед-культуру чистішою, прозорішою та доступнішою в Україні.
               </p>
             </AboutText>
            <AboutCommunity>
              <p>
                Якщо ти не просто купуєш речі, а формуєш імідж — <strong>legitdelivery.ua</strong> створений саме для тебе.
              </p>
            </AboutCommunity>
          </AboutContent>
          <AboutImage $delay={0.6} $isVisible={isVisible['about-section']}>
            <img src="/images/aboutus.JPG" alt="Legitdelivery About" />
          </AboutImage>
        </AboutContainer>
      </AboutSection>

      {/* Stats Section */}
      <StatsSection>
        <SectionTitle style={{ 
          color: 'white', 
          background: 'none',
          WebkitBackgroundClip: 'initial',
          WebkitTextFillColor: 'initial',
          backgroundClip: 'initial'
        }}>ЧОМУ <span style={{ color: '#FFD700' }}>LEGIT</span><span style={{ color: 'white' }}>DELIVERY?</span></SectionTitle>
        <StatsGrid>
          <StatCard $delay={0}>
            <div className="number">2000+</div>
            <div className="label">моделей продали за 4 роки</div>
          </StatCard>
          <StatCard $delay={0.2}>
            <div className="number">10/10</div>
            <div className="label">клієнтів задоволені нашим обслуговуванням</div>
          </StatCard>
          <StatCard $delay={0.4}>
            <div className="number">100%</div>
            <div className="label">authentic</div>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* FAQ Section */}
      <FAQSection ref={faqSectionRef} $isVisible={isVisible['faq-section']}>
        <SectionTitle>ВІДПОВІДІ НА ПИТАННЯ</SectionTitle>
        <FAQContainer>
                      {faqData.map((item, index) => (
              <FAQItem key={index} $delay={index * 0.1} $isVisible={isVisible['faq-section']}>
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                {item.question}
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQ === index}>
                <p dangerouslySetInnerHTML={{ __html: item.answer }} />
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQContainer>
      </FAQSection>
    </Container>
    </>
  );
};

export default HomePage; 
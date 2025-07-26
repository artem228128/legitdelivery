import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Analytics } from "@vercel/analytics/react";
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DeliveryPage from './pages/DeliveryPage';
import WarrantyPage from './pages/WarrantyPage';
import UserAgreementPage from './pages/UserAgreementPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SizeGuidePage from './pages/SizeGuidePage';
import TrackingPage from './pages/TrackingPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './context/CartContext';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    color: #333333;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Bebas Neue', 'Mont Heavy', Arial, sans-serif;
    font-weight: 700;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  :root {
    --primary-yellow: #FFD700;
    --primary-blue: #1E90FF;
    --text-dark: #333333;
    --text-light: #666666;
    --bg-light: #F8F9FA;
    --border-light: #E0E0E0;
    --success-green: #28A745;
    --hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 0;
  > *:not(:first-child) {
    padding-top: 80px;
  }
`;

function App() {
  return (
    <CartProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <ScrollToTop />
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/payment-delivery" element={<DeliveryPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/user-agreement" element={<UserAgreementPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/size-guide" element={<SizeGuidePage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
        <Analytics />
      </Router>
    </CartProvider>
  );
}

export default App;

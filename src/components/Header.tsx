import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const HeaderContainer = styled.header<{ $isHomePage: boolean }>`
  background: ${props => props.$isHomePage 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${props => props.$isHomePage 
    ? 'none' 
    : '0 2px 20px rgba(0, 0, 0, 0.1)'};
  position: ${props => props.$isHomePage ? 'absolute' : 'sticky'};
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: ${props => props.$isHomePage 
    ? 'none' 
    : '1px solid rgba(0, 0, 0, 0.05)'};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)<{ $isHomePage: boolean }>`
  font-size: 2rem;
  font-weight: 900;
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  text-decoration: none;
  letter-spacing: -1px;
  
  span {
    color: var(--primary-yellow);
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isHomePage: boolean }>`
  font-weight: 500;
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-yellow);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input<{ $isHomePage: boolean }>`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid ${props => props.$isHomePage 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(44, 62, 80, 0.2)'};
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  background: ${props => props.$isHomePage 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: var(--primary-yellow);
  }
  
  &::placeholder {
    color: ${props => props.$isHomePage 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(44, 62, 80, 0.6)'};
  }
`;

const SearchIcon = styled(Search)<{ $isHomePage: boolean }>`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  width: 20px;
  height: 20px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button<{ $isHomePage: boolean }>`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  position: relative;
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.$isHomePage 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(44, 62, 80, 0.1)'};
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-yellow);
  color: var(--text-dark);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 20px;
    z-index: 999;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 15px 0;
  color: white;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: var(--primary-yellow);
  }
`;

const MobileSearchContainer = styled.div`
  margin-top: 20px;
  position: relative;
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  
  &:focus {
    border-color: var(--primary-yellow);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const CatalogDropdownWrapper = styled.div`
  position: relative;
`;

const CatalogDropdownButton = styled.button<{ $isHomePage: boolean }>`
  background: none;
  border: none;
  font: inherit;
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s;
  &:hover {
    color: var(--primary-yellow);
  }
`;

const DropdownMenu = styled.ul<{ open: boolean; $isHomePage: boolean }>`
  display: ${props => props.open ? 'block' : 'none'};
  position: absolute;
  top: 120%;
  left: 0;
  min-width: 180px;
  background: ${props => props.$isHomePage ? 'rgba(30,30,30,0.98)' : 'white'};
  color: ${props => props.$isHomePage ? 'white' : '#2c3e50'};
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  border-radius: 12px;
  padding: 12px 0;
  z-index: 1001;
  list-style: none;
  margin: 0;
  animation: fadeIn 0.2s;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownItem = styled.li`
  padding: 10px 24px 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--primary-yellow);
    color: #222;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  
  const isHomePage = location.pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogHideTimeout, setCatalogHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const handleCatalogMouseEnter = () => {
    if (catalogHideTimeout) {
      clearTimeout(catalogHideTimeout);
      setCatalogHideTimeout(null);
    }
    setIsCatalogOpen(true);
  };

  const handleCatalogMouseLeave = () => {
    const timeout = setTimeout(() => setIsCatalogOpen(false), 250);
    setCatalogHideTimeout(timeout);
  };

  // Закрытие по клику вне меню
  useEffect(() => {
    if (!isCatalogOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isCatalogOpen]);

  const brands = [
    { name: 'Усі моделі', url: '/catalog' },
    { name: 'Adidas', url: '/catalog?brand=Adidas' },
    { name: 'Air Jordan', url: '/catalog?brand=Air Jordan' },
    { name: 'Gucci', url: '/catalog?brand=Gucci' },
    { name: 'New Balance', url: '/catalog?brand=New Balance' },
    { name: 'Nike', url: '/catalog?brand=Nike' },
    { name: 'Off-White', url: '/catalog?brand=Off-White' },
    { name: 'Yeezy', url: '/catalog?brand=Yeezy' },
  ];

  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);

  return (
    <HeaderContainer $isHomePage={isHomePage}>
      <HeaderContent>
        <Logo to="/" $isHomePage={isHomePage}>
          Legit<span>Delivery</span>
        </Logo>
        
        <Navigation>
          <NavLink to="/" $isHomePage={isHomePage}>Головна</NavLink>
          <CatalogDropdownWrapper
            ref={catalogRef}
            onMouseEnter={handleCatalogMouseEnter}
            onMouseLeave={handleCatalogMouseLeave}
          >
            <CatalogDropdownButton
              $isHomePage={isHomePage}
              onClick={e => {
                e.preventDefault();
                setIsCatalogOpen(v => !v);
              }}
              aria-haspopup="true"
              aria-expanded={isCatalogOpen}
            >
              Каталог
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </CatalogDropdownButton>
            <DropdownMenu open={isCatalogOpen} $isHomePage={isHomePage}>
              {brands.map(b => (
                <DropdownItem key={b.name} onClick={() => { setIsCatalogOpen(false); navigate(b.url); }}>
                  {b.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </CatalogDropdownWrapper>
          <NavLink to="/size-guide" $isHomePage={isHomePage}>Розмір</NavLink>
          <NavLink to="/about" $isHomePage={isHomePage}>Про нас</NavLink>
          <NavLink to="/contact" $isHomePage={isHomePage}>Контакти</NavLink>
        </Navigation>
        
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Пошук товарів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              $isHomePage={isHomePage}
            />
            <SearchIcon $isHomePage={isHomePage} />
          </form>
        </SearchContainer>
        
        <RightSection>
          <IconButton as={Link} to="/cart" $isHomePage={isHomePage}>
            <ShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <CartBadge>{getTotalItems()}</CartBadge>
            )}
          </IconButton>
          
          <MobileMenuButton onClick={toggleMenu} $isHomePage={isHomePage}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </RightSection>
      </HeaderContent>
      
              <MobileMenu isOpen={isMenuOpen}>
          <MobileNavLink to="/" onClick={closeMenu}>Головна</MobileNavLink>
          <div onClick={() => setIsMobileCatalogOpen(v => !v)} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'15px 0',color:'white',fontWeight:500,borderBottom:'1px solid rgba(255,255,255,0.2)'}}>
            Каталог
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {isMobileCatalogOpen && (
            <div style={{
              background:'rgba(30,30,30,0.98)',
              borderRadius:12,
              margin:'0 0 10px 0',
              boxShadow:'0 4px 16px rgba(0,0,0,0.18)',
              padding:'8px 0',
              animation:'fadeInMobileBrands 0.2s',
              transition:'background 0.2s',
            }}>
              {brands.map((b, i) => (
                <MobileNavLink
                  key={b.name}
                  to={b.url}
                  onClick={closeMenu}
                  style={{
                    color: i === 0 ? 'var(--primary-yellow)' : 'white',
                    paddingLeft:24,
                    fontWeight: i === 0 ? 700 : 500,
                    background: 'none',
                    border:'none',
                    fontSize:'1.05rem',
                    borderRadius:8,
                    margin:'2px 0',
                    transition:'background 0.2s, color 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  {b.name}
                </MobileNavLink>
              ))}
              <style>{`
                @keyframes fadeInMobileBrands {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          )}
          <MobileNavLink to="/size-guide" onClick={closeMenu}>Розмір</MobileNavLink>
          <MobileNavLink to="/about" onClick={closeMenu}>Про нас</MobileNavLink>
          <MobileNavLink to="/contact" onClick={closeMenu}>Контакти</MobileNavLink>
        
        <MobileSearchContainer>
          <form onSubmit={handleSearch}>
            <MobileSearchInput
              type="text"
              placeholder="Пошук товарів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon $isHomePage={isHomePage} />
          </form>
        </MobileSearchContainer>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header; 
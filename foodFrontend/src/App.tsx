import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import FoodGrid from './components/FoodGrid';
import PurposeMenu from './components/PurposeMenu';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import CartPage, { CartItem } from './pages/CartPage';
import { Food, mockFoods } from './data/mockFoods';
import axios from 'axios';

type Page = 'main' | 'cart';
type SortOption = 'default' | 'calories-asc' | 'protein-desc' | 'sugar-asc';

type AuthModalMode = 'login' | 'signup' | null;

export default function App() {

  const [foods, setFoods] = useState<Food[]>([]); // 진짜 DB 데이터를 담을 바구니

  useEffect(() => {
    // 앱이 켜지자마자 스프링 부트에 데이터 요청!
    axios.get('http://localhost:8080/api/foods')
        .then(response => {
          console.log("통신 성공 데이터:", response.data);

          // 프론트엔드 이름(name, brand 등)에 맞게 백엔드 데이터(foodName, manufacturer 등) 짝맞추기
          const realData = response.data.map((item: any) => ({
            id: item.foodId,
            name: item.foodName,
            brand: item.manufacturer,
            category: item.majorCategoryCode,
            calories: item.calories,
            protein: item.protein || 0,
            sugar: item.sugar || 0,
            carbs: item.carbohydrate || 0,
            fat: item.fat || 0,
            servingSize: item.servingSize,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&auto=format', // 임시 이미지
            price: 0
          }));

          setFoods(realData); // 짝맞춘 진짜 데이터를 바구니에 쏙!
        })
        .catch(error => {
          console.error("통신 에러 발생:", error);
        });
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [page, setPage] = useState<Page>('main');

  // ── Search & Filters ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '그릭 요거트',
    '고단백 식품',
  ]);
  const [minProtein, setMinProtein] = useState(0);
  const [maxSugar, setMaxSugar] = useState(50);
  const [maxCalories, setMaxCalories] = useState(600);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // ── Purpose quick-filter ────────────────────────────────────────────────────
  const [activePurpose, setActivePurpose] = useState<string | null>(null);

  // ── Wishlist & Cart ─────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState<Set<number>>(() => new Set([3, 4, 13]));
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearch = (term: string) => {
    setSearchQuery(term);
    if (term.trim()) {
      setRecentSearches((prev) => [term, ...prev.filter((t) => t !== term)].slice(0, 5));
    }
  };

  const handleRemoveRecentSearch = (term: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  };

  const handleResetFilters = () => {
    setMinProtein(0);
    setMaxSugar(50);
    setMaxCalories(600);
    setSortBy('default');
    setActivePurpose(null);
  };

  const handleSelectPurpose = (id: string) => {
    if (activePurpose === id) {
      handleResetFilters();
      return;
    }
    setActivePurpose(id);
    setMinProtein(0);
    setMaxSugar(50);
    setMaxCalories(600);
    setSortBy('default');
    switch (id) {
      case 'fitness':
        setMinProtein(15);
        break;
      case 'diet':
        setMaxCalories(300);
        setSortBy('calories-asc');
        break;
      case 'sugar':
        setMaxSugar(5);
        setSortBy('sugar-asc');
        break;
      case 'protein':
        setMinProtein(20);
        setSortBy('protein-desc');
        break;
      case 'clean':
        setMaxSugar(10);
        setMinProtein(5);
        break;
      case 'lowfat':
        setMaxCalories(200);
        setSortBy('calories-asc');
        break;
    }
  };

  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (foodId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.food.id !== foodId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.food.id === foodId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveFromCart = (foodId: number) => {
    setCartItems((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  // ── Derived state ────────────────────────────────────────────────────────────
  const cartFoodIds = useMemo(() => new Set(cartItems.map((i) => i.food.id)), [cartItems]);

  const filteredAndSortedFoods = useMemo(() => {
    const filtered = foods.filter((food) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !food.name.toLowerCase().includes(q) &&
          !food.brand.toLowerCase().includes(q) &&
          !food.category.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (food.protein < minProtein) return false;
      if (food.sugar > maxSugar) return false;
      if (food.calories > maxCalories) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'calories-asc': return a.calories - b.calories;
        case 'protein-desc': return b.protein - a.protein;
        case 'sugar-asc': return a.sugar - b.sugar;
        default: return a.id - b.id;
      }
    });
  }, [searchQuery, minProtein, maxSugar, maxCalories, sortBy]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full flex flex-col bg-[#F4F8F5]">
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        cartCount={cartItems.length}
        isLoggedIn={isLoggedIn}
        onLogin={() => setAuthModal('login')}
        onSignup={() => setAuthModal('signup')}
        onLogout={() => { setIsLoggedIn(false); setUserName(''); setUserEmail(''); }}
        userName={userName}
        userEmail={userEmail}
      />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={(name) => {
            setUserName(name);
            setUserEmail(`${name.toLowerCase()}@nutripick.kr`);
            setIsLoggedIn(true);
            setAuthModal(null);
          }}
          onSwitchMode={(m) => setAuthModal(m)}
        />
      )}

      <main className="flex-1" id="main-content">
        {page === 'main' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              recentSearches={recentSearches}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              onClearRecentSearches={() => setRecentSearches([])}
            />

            <PurposeMenu activePurpose={activePurpose} onSelect={handleSelectPurpose} />

            <div className="max-w-7xl mx-auto px-10 pt-4 pb-10 flex gap-10 items-start">
              <FilterSidebar
                minProtein={minProtein}
                onMinProteinChange={setMinProtein}
                maxSugar={maxSugar}
                onMaxSugarChange={setMaxSugar}
                maxCalories={maxCalories}
                onMaxCaloriesChange={setMaxCalories}
                onReset={handleResetFilters}
              />
              <FoodGrid
                foods={filteredAndSortedFoods}
                wishlist={wishlist}
                cartFoodIds={cartFoodIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </>
        )}

        {page === 'cart' && (
          <CartPage
            cartItems={cartItems}
            wishlist={wishlist}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigateToMain={() => setPage('main')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import FoodGrid from './components/FoodGrid';
import PurposeMenu from './components/PurposeMenu';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import CartPage, { CartItem } from './pages/CartPage';
import { Food } from './data/mockFoods';
import FoodDetailPage from './pages/FoodDetailPage';
import ComparePage from './pages/ComparePage';
import axios from 'axios';

type Page = 'main' | 'cart' | 'detail' | 'compare';
type SortOption = 'default' | 'calories-asc' | 'protein-desc' | 'sugar-asc';

type AuthModalMode = 'login' | 'signup' | null;

export default function App() {


  // ── Auth ─────────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [nickname, setNickname] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [page, setPage] = useState<Page>('main');

  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  const handleFoodClick = (id: number) => {
    setSelectedFoodId(id);
    setPage('detail');
  };

  // ── Search & Filters ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : []; // 저장된 게 있으면 쓰고, 없으면 빈 배열
  });

  const [minProtein, setMinProtein] = useState(0);
  const [maxSugar, setMaxSugar] = useState(50);
  const [maxCalories, setMaxCalories] = useState(600);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // ── Purpose quick-filter ────────────────────────────────────────────────────
  const [activePurpose, setActivePurpose] = useState<string | null>(null);

  // ── Wishlist & Cart ─────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState<Set<number>>(() => new Set([3, 4, 13]));
  const [cartItems, setCartItems] = useState<CartItem[]>([]);


  const [foods, setFoods] = useState<Food[]>([]); // 진짜 DB 데이터를 담을 바구니

  const [compareIds, setCompareIds] = useState<Set<number>>(new Set());

  const handleToggleCompare = (id: number) => {
    setCompareIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }

      return next;
    });
  };

  const handleGoToCompare = () => {
    setPage('compare');
  };

  const handleChangeTargets = () => {
    setPage('main');
  };

  useEffect(() => {
    axios.get('http://localhost:8080/api/foods')
        .then(response => {
          console.log("백엔드 원본 데이터:", response.data);

          const realData = response.data.map((item: any) => ({
            id: item.foodId,
            name: item.foodName,
            brand: item.manufacturer || '제조사 모름',
            category: item.majorCategoryCode || '기타',
            calories: item.calories || 0,
            protein: item.protein || 0,
            sugar: item.sugar || 0,
            carbs: item.carbohydrate || 0,
            fat: item.fat || 0,
            servingSize: item.servingSize || '1회 제공량',
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&auto=format',
            price: Math.floor(Math.random() * 51) * 500 + 5000
          }));

          console.log("리액트용으로 번역된 데이터:", realData);
          setFoods(realData); // 번역된 진짜 데이터를 바구니에 쏙!
        })
        .catch(error => {
          console.error("통신 에러 발생:", error);
        });
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedName = localStorage.getItem('nickname');
    const savedEmail = localStorage.getItem('userEmail');

    if(savedToken && savedName){
      setIsLoggedIn(true);
      setNickname(savedName);
      setUserEmail(savedEmail || '');
    }
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearch = async (term: string) => {
    setSearchQuery(term);

    // 🌟 존재하지 않는 setSelectedCategory 대신, 만들어두신 필터 초기화 함수 사용!
    handleResetFilters();

    if (term.trim()) {
      // 최근 검색어 저장
      setRecentSearches((prev) => [term, ...prev.filter((t) => t !== term)].slice(0, 5));

      try {
        const response = await axios.get(`http://localhost:8080/api/foods/search?keyword=${term}`);

        // 검색 결과도 반드시 처음처럼 번역기를 돌려줌
        const formattedSearchData = response.data.map((item: any) => ({
          id: item.foodId,
          name: item.foodName,
          brand: item.manufacturer || '제조사 모름',
          category: item.majorCategoryCode || '기타',
          calories: item.calories || 0,
          protein: item.protein || 0,
          sugar: item.sugar || 0,
          carbs: item.carbohydrate || 0,
          fat: item.fat || 0,
          servingSize: item.servingSize || '1회 제공량',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&auto=format',
          price: Math.floor(Math.random() * 51) * 500 + 5000
        }));

        setFoods(formattedSearchData); // 번역된 안전한 데이터

      } catch (error) {
        console.error("검색 데이터를 불러오는데 실패했습니다.", error);
        alert("검색 중 오류가 발생했습니다.");
      }
    } else {
      try {
        const response = await axios.get(`http://localhost:8080/api/foods`);

        // 빈칸 검색 시 전체 목록을 가져올 때도 번역기
        const formattedAllData = response.data.map((item: any) => ({
          id: item.foodId,
          name: item.foodName,
          brand: item.manufacturer || '제조사 모름',
          category: item.majorCategoryCode || '기타',
          calories: item.calories || 0,
          protein: item.protein || 0,
          sugar: item.sugar || 0,
          carbs: item.carbohydrate || 0,
          fat: item.fat || 0,
          servingSize: item.servingSize || '1회 제공량',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&auto=format',
          price: Math.floor(Math.random() * 51) * 500 + 5000
        }));

        setFoods(formattedAllData);

      } catch (error) {
        console.error(error);
      }
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

        const safeName = food.name || '';
        const safeBrand = food.brand || '';
        const safeCategory = food.category || '';

        if (
          !safeName.toLowerCase().includes(q) &&
          !safeBrand.toLowerCase().includes(q) &&
          !safeCategory.toLowerCase().includes(q)
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
  }, [foods, searchQuery, minProtein, maxSugar, maxCalories, sortBy]);

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
        onLogout={() => {
          setIsLoggedIn(false);
          setNickname('');
          setUserEmail('');

          localStorage.removeItem('accessToken');
          localStorage.removeItem('nickname');
          localStorage.removeItem('userEmail');
        }}
        nickname={nickname}
        userEmail={userEmail}
      />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={(name) => {
            setNickname(name);
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

                  compareIds={compareIds}
                  onToggleCompare={handleToggleCompare}

                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}

                  sortBy={sortBy}
                  onSortChange={setSortBy}

                  onFoodClick={handleFoodClick}
              />
            </div>
            {compareIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                  <button
                      onClick={handleGoToCompare}
                      disabled={compareIds.size < 2}
                      className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    선택한 제품 {compareIds.size}개 비교하기
                  </button>
                </div>
            )}
          </>
        )}

        {page === 'cart' && (
            <CartPage
                cartItems={cartItems}
                wishlist={wishlist}
                foods={foods}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onNavigateToMain={() => setPage('main')}
            />
        )}

        {page === 'detail' && selectedFoodId !== null && (() => {
          const food = foods.find((f) => f.id === selectedFoodId);

          if (!food) {
            return (
                <div className="p-10 text-center">
                  식품 정보를 찾을 수 없습니다.
                  <button
                      onClick={() => setPage('main')}
                      className="ml-4"
                  >
                    목록으로 돌아가기
                  </button>
                </div>
            );
          }

          return (
              <FoodDetailPage
                  food={food}
                  isWishlisted={wishlist.has(food.id)}
                  isInCart={cartFoodIds.has(food.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onBack={() => setPage('main')}
                  allFoods={foods}
                  onFoodClick={handleFoodClick}
              />
          );
        })()}

        {page === 'compare' && (
            <ComparePage
                foods={foods}
                compareIds={compareIds}
                onBack={() => setPage('main')}
                onChangeTargets={handleChangeTargets}
                wishlist={wishlist}
                cartFoodIds={cartFoodIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onFoodClick={handleFoodClick}
            />
        )}
      </main>

      <Footer />
    </div>
  );
}

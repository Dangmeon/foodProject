import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import FoodGrid from './components/FoodGrid';
import PurposeMenu from './components/PurposeMenu';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import CartPage, { CartItem } from './pages/CartPage';
import { Food } from '@/type/mockFoods';
import FoodDetailPage from './pages/FoodDetailPage';
import ComparePage from './pages/ComparePage';
import axios from 'axios';
import {FoodDetail} from "@/type/foodDetail.ts";

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

  const [foodDetail, setFoodDetail] = useState<FoodDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 15;

  const handleFoodClick = async (id: number) => {
    setSelectedFoodId(id);
    setPage('detail');

    setDetailLoading(true);
    setDetailError(null);

    try {
      const response = await axios.get<FoodDetail>(
          `http://localhost:8080/api/foods/${id}`
      );

      setFoodDetail(response.data);

    } catch (error) {
      console.error('상세 조회 실패:', error);
      setDetailError('식품 상세정보를 불러오지 못했습니다.');

    } finally {
      setDetailLoading(false);
    }
  };

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
    const fetchFoods = async () => {
      try {
        let url: string;

        if (searchQuery.trim()) {
          url =
              `http://localhost:8080/api/foods/search` +
              `?keyword=${encodeURIComponent(searchQuery)}` +
              `&page=${currentPage}` +
              `&size=${pageSize}`;
        } else {
          url =
              `http://localhost:8080/api/foods` +
              `?page=${currentPage}` +
              `&size=${pageSize}`;
        }

        const response = await axios.get(url);

        const realData = response.data.content.map((item: any) => ({
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

          imageUrl:
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&auto=format',

          price:
              Math.floor(Math.random() * 51) * 500 + 5000,
        }));

        setFoods(realData);

        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);

      } catch (error) {
        console.error('식품 목록 조회 실패:', error);
      }
    };

    fetchFoods();
  }, [currentPage, searchQuery]);

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
  const handleSearch = (term: string) => {
    const keyword = term.trim();

    setSearchQuery(keyword);
    setCurrentPage(0);

    handleResetFilters();

    if (keyword) {
      setRecentSearches((prev) =>
          [
            keyword,
            ...prev.filter((t) => t !== keyword),
          ].slice(0, 5)
      );
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

              <PurposeMenu activePurpose={activePurpose} onSelect={handleSelectPurpose}/>

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

                <div className="flex-1">

                  <FoodGrid
                      foods={filteredAndSortedFoods}
                      totalElements={totalElements}

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

                  <div className="flex justify-center items-center gap-2 mt-8">

                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={currentPage === 0}
                        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
                    >
                      이전
                    </button>

                    <span className="px-4 text-sm text-gray-600">
    {currentPage + 1} / {totalPages}
  </span>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages - 1)
                            )
                        }
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
                    >
                      다음
                    </button>

                  </div>
                </div>

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

        {page === 'detail' && detailLoading && (
            <div className="p-10 text-center">
              상세 정보를 불러오는 중입니다...
            </div>
        )}

        {page === 'detail' && detailError && (
            <div className="p-10 text-center">
              <p className="mb-4">{detailError}</p>

              <button
                  onClick={() => setPage('main')}
                  className="px-4 py-2 rounded-lg bg-[#2A7A4B] text-white"
              >
                목록으로 돌아가기
              </button>
            </div>
        )}

        {page === 'detail' &&
            !detailLoading &&
            !detailError &&
            foodDetail && (
                <FoodDetailPage
                    food={foodDetail}
                    listFood={
                        foods.find(
                            (item) =>
                                item.id ===
                                foodDetail.foodId,
                        ) ?? null
                    }
                    isWishlisted={wishlist.has(
                        foodDetail.foodId,
                    )}
                    isInCart={cartFoodIds.has(
                        foodDetail.foodId,
                    )}
                    onToggleWishlist={
                      handleToggleWishlist
                    }
                    onAddToCart={handleAddToCart}
                    onBack={() =>
                        setPage('main')
                    }
                    allFoods={foods}
                    onFoodClick={handleFoodClick}
                />
            )}

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

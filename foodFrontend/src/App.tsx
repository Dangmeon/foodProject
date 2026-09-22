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
import { FoodDetail } from '@/type/foodDetail.ts';

type Page = 'main' | 'cart' | 'detail' | 'compare';
type SortOption =
    | 'default'
    | 'calories-asc'
    | 'protein-desc'
    | 'sugar-asc';

type AuthModalMode = 'login' | 'signup' | null;

export default function App() {
  // ── Auth ────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [nickname, setNickname] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // ── Navigation ──────────────────────────────────────────────────────────
  const [page, setPage] = useState<Page>('main');
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  // ── Search & Filters ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const [minProtein, setMinProtein] = useState(0);
  const [maxSugar, setMaxSugar] = useState(50);
  const [maxCalories, setMaxCalories] = useState(600);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // ── Purpose quick-filter ────────────────────────────────────────────────
  const [activePurpose, setActivePurpose] = useState<string | null>(null);

  // ── Wishlist & Cart ─────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ── Food list ───────────────────────────────────────────────────────────
  const [foods, setFoods] = useState<Food[]>([]);

  const [foodDetail, setFoodDetail] = useState<FoodDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 15;

  // ── Compare ─────────────────────────────────────────────────────────────
  const [compareIds, setCompareIds] = useState<Set<number>>(new Set());

  // ── 새로고침 시 로그인 상태 복원 ──────────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedName = localStorage.getItem('nickname');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedToken && savedName) {
      setIsLoggedIn(true);
      setNickname(savedName);
      setUserEmail(savedEmail || '');
    }
  }, []);

  // ── 로그인 상태일 때 찜 목록 조회 ─────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      setWishlist(new Set());
      return;
    }

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setWishlist(new Set());
          return;
        }

        const response = await axios.get(
            'http://localhost:8080/api/wishlist',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        const ids = new Set<number>(
            response.data.map(
                (item: { foodId: number }) => item.foodId
            )
        );

        setWishlist(ids);

      } catch (error) {
        console.error('찜 목록 조회 실패:', error);
      }
    };

    fetchWishlist();
  }, [isLoggedIn]);

  // ── 식품 검색 / 필터 / 정렬 / 페이지네이션 ────────────────────────────
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
          params.append('keyword', searchQuery.trim());
        }

        if (minProtein > 0) {
          params.append('minProtein', String(minProtein));
        }

        if (maxSugar < 50) {
          params.append('maxSugar', String(maxSugar));
        }

        if (maxCalories < 600) {
          params.append('maxCalories', String(maxCalories));
        }

        params.append('page', String(currentPage));
        params.append('size', String(pageSize));

        switch (sortBy) {
          case 'calories-asc':
            params.append('sort', 'calories,asc');
            break;

          case 'protein-desc':
            params.append('sort', 'protein,desc');
            break;

          case 'sugar-asc':
            params.append('sort', 'sugar,asc');
            break;

          default:
            break;
        }

        const response = await axios.get(
            `http://localhost:8080/api/foods/search?${params.toString()}`
        );

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
        console.error('식품 조회 실패:', error);
      }
    };

    fetchFoods();

  }, [
    currentPage,
    searchQuery,
    minProtein,
    maxSugar,
    maxCalories,
    sortBy,
  ]);

  // ── Handlers ────────────────────────────────────────────────────────────

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
    setRecentSearches((prev) =>
        prev.filter((t) => t !== term)
    );
  };

  const handleResetFilters = () => {
    setMinProtein(0);
    setMaxSugar(50);
    setMaxCalories(600);
    setSortBy('default');
    setActivePurpose(null);
    setCurrentPage(0);
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

  // ── Wishlist 추가 / 삭제 ────────────────────────────────────────────────
  const handleToggleWishlist = async (foodId: number) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setAuthModal('login');
        return;
      }

      const isWishlisted = wishlist.has(foodId);

      if (isWishlisted) {
        await axios.delete(
            `http://localhost:8080/api/wishlist/${foodId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        setWishlist((prev) => {
          const next = new Set(prev);
          next.delete(foodId);
          return next;
        });

      } else {
        await axios.post(
            `http://localhost:8080/api/wishlist/${foodId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        setWishlist((prev) => {
          const next = new Set(prev);
          next.add(foodId);
          return next;
        });
      }

    } catch (error) {
      console.error('찜 변경 실패:', error);
    }
  };

  const handleAddToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find(
          (item) => item.food.id === food.id
      );

      if (existing) {
        return prev.map((item) =>
            item.food.id === food.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
      }

      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (
      foodId: number,
      quantity: number
  ) => {
    if (quantity <= 0) {
      setCartItems((prev) =>
          prev.filter((item) => item.food.id !== foodId)
      );
    } else {
      setCartItems((prev) =>
          prev.map((item) =>
              item.food.id === foodId
                  ? { ...item, quantity }
                  : item
          )
      );
    }
  };

  const handleRemoveFromCart = (foodId: number) => {
    setCartItems((prev) =>
        prev.filter((item) => item.food.id !== foodId)
    );
  };

  // ── Derived state ───────────────────────────────────────────────────────
  const cartFoodIds = useMemo(
      () => new Set(cartItems.map((i) => i.food.id)),
      [cartItems]
  );

  // ── Render ──────────────────────────────────────────────────────────────
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
              setWishlist(new Set());

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
                  setUserEmail(
                      localStorage.getItem('userEmail') || ''
                  );
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
                    onClearRecentSearches={() =>
                        setRecentSearches([])
                    }
                />

                <PurposeMenu
                    activePurpose={activePurpose}
                    onSelect={handleSelectPurpose}
                />

                <div className="max-w-7xl mx-auto px-10 pt-4 pb-10 flex gap-10 items-start">
                  <FilterSidebar
                      minProtein={minProtein}
                      onMinProteinChange={(value) => {
                        setMinProtein(value);
                        setCurrentPage(0);
                      }}
                      maxSugar={maxSugar}
                      onMaxSugarChange={(value) => {
                        setMaxSugar(value);
                        setCurrentPage(0);
                      }}
                      maxCalories={maxCalories}
                      onMaxCaloriesChange={(value) => {
                        setMaxCalories(value);
                        setCurrentPage(0);
                      }}
                      onReset={handleResetFilters}
                  />

                  <div className="flex-1">
                    <FoodGrid
                        foods={foods}
                        totalElements={totalElements}
                        wishlist={wishlist}
                        cartFoodIds={cartFoodIds}
                        compareIds={compareIds}
                        onToggleCompare={handleToggleCompare}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        sortBy={sortBy}
                        onSortChange={(value) => {
                          setSortBy(value);
                          setCurrentPage(0);
                        }}
                        onFoodClick={handleFoodClick}
                    />

                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                          onClick={() =>
                              setCurrentPage((prev) =>
                                  Math.max(prev - 1, 0)
                              )
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
                                  Math.min(
                                      prev + 1,
                                      totalPages - 1
                                  )
                              )
                          }
                          disabled={
                              currentPage >= totalPages - 1
                          }
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
                                  item.id === foodDetail.foodId
                          ) ?? null
                      }
                      isWishlisted={wishlist.has(
                          foodDetail.foodId
                      )}
                      isInCart={cartFoodIds.has(
                          foodDetail.foodId
                      )}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                      onBack={() => setPage('main')}
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
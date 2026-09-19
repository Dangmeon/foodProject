export interface Food {
  id: number;
  name: string;
  brand: string;
  category: string;
  calories: number;
  protein: number;
  sugar: number;
  carbs: number;
  fat: number;
  sodium: number;
  servingSize: string;
  imageUrl: string;
  price: number;
}

export const CATEGORIES = ['가공식품', '유제품', '음료', '스낵', '건강식품', '곡류'] as const;

export const TRENDING_SEARCHES = [
  '고단백 식품',
  '저칼로리 스낵',
  '그릭 요거트',
  '단백질 쉐이크',
  '저당 음료',
];

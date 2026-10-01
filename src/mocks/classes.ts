import type { CraftClass } from "@/types";

export const craftClasses: readonly CraftClass[] = [
  {
    id: "c-pottery",
    name: "도자기 만들기",
    craftType: "도자기",
    description: "물레 대신 손으로 흙을 빚는 핸드빌딩으로 나만의 찻잔을 만듭니다. 초벌·재벌 후 약 4주 뒤 받아 볼 수 있습니다.",
    price: 65000,
    durationMinutes: 150,
    capacity: 8,
  },
  {
    id: "c-bojagi",
    name: "보자기 만들기",
    craftType: "보자기",
    description: "전통 쌈솔 바느질을 배우며 작은 조각보 컵받침 두 장을 완성합니다. 바느질이 처음이어도 괜찮습니다.",
    price: 48000,
    durationMinutes: 120,
    capacity: 6,
  },
  {
    id: "c-najeon",
    name: "나전 키링 만들기",
    craftType: "나전칠기",
    description: "자개를 자르고 붙여 옻칠 키링을 완성합니다. 자개 고르기부터 마감까지 모두 직접 해 봅니다.",
    price: 55000,
    durationMinutes: 90,
    capacity: 10,
  },
  {
    id: "c-wood-spoon",
    name: "나무 숟가락 깎기",
    craftType: "목공예",
    description: "조각칼로 벚나무를 깎아 손에 맞는 숟가락을 만듭니다. 오일 마감까지 마치고 가져갑니다.",
    price: 52000,
    durationMinutes: 180,
    capacity: 4,
  },
];

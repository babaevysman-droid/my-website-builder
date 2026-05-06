export const pricingPlans = [
  {
    id: "demo",
    name: "DEMO (Проба)",
    price: "0",
    amount: 0,
    features: [
      { text: "Токены: 3 шт. (разово)", checked: true },
      { text: "Только просмотр", checked: true },
      { text: "Свой домен", checked: false },
      { text: "ZIP-архив", checked: false },
    ],
    buttonText: "ВЫБРАТЬ",
    isPopular: false,
  },
  {
    id: "flight",
    name: "FLIGHT (Бизнес)",
    price: "199",
    amount: 199,
    features: [
      { text: "Токены: 150 шт. / мес", checked: true },
      { text: "Онлайн 24/7", checked: true },
      { text: "Свой домен", checked: true },
      { text: "ZIP-архив", checked: false },
    ],
    buttonText: "ВЫБРАТЬ",
    isPopular: true,
  },
  {
    id: "hunter",
    name: "HUNTER (Хищник)",
    price: "399",
    amount: 399,
    features: [
      { text: "Токены: БЕЗЛИМИТ", checked: true },
      { text: "Онлайн 24/7", checked: true },
      { text: "Свой домен", checked: true },
      { text: "ZIP-архив", checked: true },
    ],
    buttonText: "ВЫБРАТЬ",
    isPopular: false,
  },
];
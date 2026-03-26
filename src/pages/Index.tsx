import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

const BIG_MAC_IMG = "https://cdn.poehali.dev/projects/cfdbccbc-0f1e-4798-93e8-7e749b1aa63e/files/0e1c34cd-146c-4291-a67f-0c10ba843427.jpg";
const FRIES_IMG = "https://cdn.poehali.dev/projects/cfdbccbc-0f1e-4798-93e8-7e749b1aa63e/files/66743514-301c-4bfc-a63a-2a271fe91b81.jpg";
const MCFLURRY_IMG = "https://cdn.poehali.dev/projects/cfdbccbc-0f1e-4798-93e8-7e749b1aa63e/files/f0200a37-3ce9-457d-9f74-bcff3a8430e0.jpg";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  emoji: string;
  popular?: boolean;
}

interface CartItem extends MenuItem {
  qty: number;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Биг Мок", description: "Легендарный двойной бургер с говядиной, специальным соусом и хрустящим салатом", price: 289, image: BIG_MAC_IMG, category: "Бургеры", emoji: "🍔", popular: true },
  { id: 2, name: "МокЧикен", description: "Сочная куриная котлета с майонезом и листьями салата в мягкой булочке", price: 249, image: BIG_MAC_IMG, category: "Бургеры", emoji: "🍗" },
  { id: 3, name: "Роял Чизбургер", description: "Бургер с двойной сырной котлетой и пикантными маринованными огурчиками", price: 319, image: BIG_MAC_IMG, category: "Бургеры", emoji: "🧀", popular: true },
  { id: 4, name: "Картошка Фри", description: "Золотистая хрустящая картошка, обжаренная до идеальной корочки", price: 129, image: FRIES_IMG, category: "Картошка", emoji: "🍟", popular: true },
  { id: 5, name: "Картошка Фри большая", description: "Большая порция хрустящей картошки для настоящих фанатов", price: 169, image: FRIES_IMG, category: "Картошка", emoji: "🍟" },
  { id: 6, name: "Кола", description: "Освежающая Coca-Cola со льдом, идеально дополняет любой бургер", price: 99, image: MCFLURRY_IMG, category: "Напитки", emoji: "🥤" },
  { id: 7, name: "Молочный Коктейль", description: "Густой сливочный коктейль с ванилью, клубникой или шоколадом", price: 179, image: MCFLURRY_IMG, category: "Напитки", emoji: "🥛", popular: true },
  { id: 8, name: "Апельсиновый сок", description: "Свежевыжатый апельсиновый сок без добавок — чистая витаминная бомба", price: 149, image: MCFLURRY_IMG, category: "Напитки", emoji: "🍊" },
  { id: 9, name: "Мок Флури Орео", description: "Мягкое мороженое с кусочками печенья Орео и шоколадным соусом", price: 199, image: MCFLURRY_IMG, category: "Десерты", emoji: "🍦", popular: true },
  { id: 10, name: "Мок Флури Карамель", description: "Нежное ванильное мороженое с карамельным топпингом — объедение!", price: 199, image: MCFLURRY_IMG, category: "Десерты", emoji: "🍨" },
  { id: 11, name: "Яблочный Пирожок", description: "Хрустящий пирожок с нежной яблочной начинкой и корицей", price: 89, image: MCFLURRY_IMG, category: "Десерты", emoji: "🥧" },
  { id: 12, name: "Нагетсы 6 шт", description: "Сочные куриные нагетсы в хрустящей панировке с соусом на выбор", price: 219, image: BIG_MAC_IMG, category: "Нагетсы", emoji: "🍗", popular: true },
  { id: 13, name: "Нагетсы 9 шт", description: "Большая порция нагетсов — хватит на всю компанию!", price: 299, image: BIG_MAC_IMG, category: "Нагетсы", emoji: "🍗" },
  { id: 14, name: "Нагетсы 20 шт", description: "Мега-порция для вечеринки! 20 сочных нагетсов с 3 соусами", price: 549, image: BIG_MAC_IMG, category: "Нагетсы", emoji: "🍗" },
];

const CATEGORIES = ["Все", "Бургеры", "Картошка", "Напитки", "Десерты", "Нагетсы"];

type Page = "home" | "menu" | "delivery";

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filtered = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchCat = category === "Все" || item.category === category;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  function addToCart(item: MenuItem) {
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 600);
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing && existing.qty > 1) return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => c.id !== id);
    });
  }

  function handleOrder() {
    setCart([]);
    setCartOpen(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  }

  const navItems: { id: Page; label: string; emoji: string }[] = [
    { id: "home", label: "Главная", emoji: "🏠" },
    { id: "menu", label: "Меню", emoji: "🍔" },
    { id: "delivery", label: "Доставка", emoji: "🛵" },
  ];

  return (
    <div className="min-h-screen font-nunito" style={{ background: "#FFF9EE" }}>
      {/* NAVBAR */}
      <nav style={{ background: "#DA291C" }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="flex items-center gap-2 hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-black shadow-md font-fredoka" style={{ background: "#FFC72C", color: "#DA291C" }}>
              M
            </div>
            <span className="text-white font-black text-xl tracking-tight font-fredoka">МокДоналдс</span>
          </button>

          <div className="hidden md:flex gap-1">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105"
                style={{
                  background: page === n.id ? "#FFC72C" : "rgba(255,255,255,0.15)",
                  color: page === n.id ? "#DA291C" : "white"
                }}
              >
                {n.emoji} {n.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: "#FFC72C", color: "#27251F" }}
          >
            <Icon name="ShoppingCart" size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                style={{ background: "#27251F", color: "#FFC72C" }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex border-t border-red-700">
          {navItems.map(n => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className="flex-1 py-2 text-xs font-bold transition-all"
              style={{
                background: page === n.id ? "#FFC72C" : "transparent",
                color: page === n.id ? "#DA291C" : "white"
              }}
            >
              <div>{n.emoji}</div>
              <div>{n.label}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* SUCCESS TOAST */}
      {orderSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="px-6 py-4 rounded-2xl shadow-2xl font-bold text-lg flex items-center gap-3"
            style={{ background: "#FFC72C", color: "#27251F" }}>
            <span className="text-2xl">🎉</span>
            Заказ оформлен! Везём с любовью!
          </div>
        </div>
      )}

      {/* =================== HOME PAGE =================== */}
      {page === "home" && (
        <div>
          {/* Hero */}
          <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #DA291C 0%, #C41E10 50%, #FF6B00 100%)" }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute text-6xl"
                  style={{ left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%` }}>
                  {["🍔", "🍟", "🥤", "🍦"][i % 4]}
                </div>
              ))}
            </div>
            <div className="relative max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-white animate-fade-in">
                <div className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                  style={{ background: "#FFC72C", color: "#DA291C" }}>
                  🔥 Горячее предложение дня!
                </div>
                <h1 className="font-fredoka text-5xl md:text-7xl leading-tight mb-4 drop-shadow-lg">
                  Вкусно.<br />Быстро.<br />
                  <span style={{ color: "#FFC72C" }}>Весело!</span>
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-md font-semibold">
                  Любимые бургеры, хрустящая картошка и нагетсы — всё, что нужно для отличного настроения!
                </p>
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={() => setPage("menu")}
                    className="px-8 py-4 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                    style={{ background: "#FFC72C", color: "#DA291C" }}
                  >
                    🍔 Смотреть меню
                  </button>
                  <button
                    onClick={() => setPage("delivery")}
                    className="px-8 py-4 rounded-full font-black text-lg border-2 border-white transition-all hover:bg-white hover:text-red-700 hover:scale-105"
                    style={{ color: "white" }}
                  >
                    🛵 Заказать доставку
                  </button>
                </div>
              </div>
              <div className="flex-1 flex justify-center animate-scale-in">
                <div className="relative w-72 h-72">
                  <div className="absolute inset-0 rounded-full opacity-30 blur-3xl" style={{ background: "#FFC72C" }} />
                  <img src={BIG_MAC_IMG} alt="Биг Мок" className="relative w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-yellow-400" />
                  <div className="absolute -top-4 -right-4 font-black text-sm px-3 py-2 rounded-full shadow-lg"
                    style={{ background: "#FFC72C", color: "#DA291C" }}>
                    ХИТ! 🔥
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Shortcut */}
          <section className="py-12 max-w-6xl mx-auto px-4">
            <h2 className="font-fredoka text-3xl md:text-4xl mb-8 text-center" style={{ color: "#27251F" }}>
              Что хочешь сегодня? 😋
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { cat: "Бургеры", emoji: "🍔", color: "#DA291C" },
                { cat: "Картошка", emoji: "🍟", color: "#FF6B00" },
                { cat: "Напитки", emoji: "🥤", color: "#0066CC" },
                { cat: "Десерты", emoji: "🍦", color: "#E91E8C" },
                { cat: "Нагетсы", emoji: "🍗", color: "#c4960a" },
              ].map((c) => (
                <button
                  key={c.cat}
                  onClick={() => { setCategory(c.cat); setPage("menu"); }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  style={{ background: c.color }}
                >
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="text-sm">{c.cat}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Popular */}
          <section className="py-12" style={{ background: "#27251F" }}>
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="font-fredoka text-3xl md:text-4xl mb-8 text-center" style={{ color: "#FFC72C" }}>
                ⭐ Самые популярные
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MENU_ITEMS.filter(i => i.popular).map((item) => (
                  <div key={item.id}
                    className="rounded-2xl overflow-hidden shadow-xl transition-all hover:scale-105 hover:-rotate-1 duration-300"
                    style={{ background: "#FFF9EE" }}>
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-black"
                        style={{ background: "#DA291C", color: "white" }}>
                        ⭐ ХИТ
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-base" style={{ color: "#27251F" }}>{item.emoji} {item.name}</h3>
                        <span className="font-black text-lg" style={{ color: "#DA291C" }}>{item.price} ₽</span>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                        style={{ background: "#FFC72C", color: "#27251F" }}
                      >
                        + В корзину
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Banner */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto rounded-3xl p-10 text-center shadow-2xl"
              style={{ background: "linear-gradient(135deg, #FFC72C, #FF6B00)" }}>
              <div className="text-5xl mb-4">🛵</div>
              <h2 className="font-fredoka text-3xl md:text-5xl mb-4" style={{ color: "#27251F" }}>
                Доставка за 30 минут!
              </h2>
              <p className="text-lg mb-6 font-semibold" style={{ color: "#27251F" }}>
                Бесплатно при заказе от 500 ₽ — горячее приедет прямо к вашей двери!
              </p>
              <button
                onClick={() => setPage("delivery")}
                className="px-8 py-4 rounded-full font-black text-lg transition-all hover:scale-105 shadow-lg"
                style={{ background: "#DA291C", color: "white" }}
              >
                Узнать подробнее →
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =================== MENU PAGE =================== */}
      {page === "menu" && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="font-fredoka text-4xl md:text-5xl mb-6 text-center" style={{ color: "#DA291C" }}>
            🍔 Наше Меню
          </h1>

          {/* Search */}
          <div className="relative mb-6 max-w-lg mx-auto">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Найти блюдо..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-base font-semibold outline-none transition-all"
              style={{ border: "2px solid #FFC72C", background: "white", color: "#27251F" }}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all hover:scale-105"
                style={{
                  background: category === cat ? "#DA291C" : "#FFC72C",
                  color: category === cat ? "white" : "#27251F",
                  flexShrink: 0
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold opacity-60">Ничего не найдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 animate-fade-in"
                  style={{ background: "white", animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    {item.popular && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black"
                        style={{ background: "#DA291C", color: "white" }}>⭐ Хит</div>
                    )}
                    <div className="absolute top-3 right-3 text-2xl">{item.emoji}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-lg mb-1" style={{ color: "#27251F" }}>{item.name}</h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "#666" }}>{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-2xl" style={{ color: "#DA291C" }}>{item.price} ₽</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        style={{
                          background: addedId === item.id ? "#27251F" : "#FFC72C",
                          color: addedId === item.id ? "#FFC72C" : "#27251F"
                        }}
                      >
                        {addedId === item.id ? "✓ Добавлено!" : "+ В корзину"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================== DELIVERY PAGE =================== */}
      {page === "delivery" && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="font-fredoka text-4xl md:text-5xl mb-4 text-center" style={{ color: "#DA291C" }}>
            🛵 Доставка
          </h1>
          <p className="text-center text-lg mb-12 font-semibold" style={{ color: "#666" }}>
            Горячо, быстро и без лишних хлопот — прямо к вашей двери!
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "Clock", title: "30 минут", desc: "Среднее время доставки по городу", color: "#DA291C", bg: "#FFF0EE" },
              { icon: "Truck", title: "От 500 ₽", desc: "Бесплатная доставка при заказе от 500 рублей", color: "#FFC72C", bg: "#FFFAEE" },
              { icon: "MapPin", title: "Весь город", desc: "Доставляем в любую точку — ни один угол не пропустим!", color: "#FF6B00", bg: "#FFF5EE" },
            ].map(c => (
              <div key={c.title} className="rounded-2xl p-6 text-center shadow-md transition-all hover:scale-105" style={{ background: c.bg }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow"
                  style={{ background: c.color }}>
                  <Icon name={c.icon as "Clock" | "Truck" | "MapPin"} size={28} className="text-white" />
                </div>
                <h3 className="font-black text-xl mb-2" style={{ color: "#27251F" }}>{c.title}</h3>
                <p className="text-sm font-semibold" style={{ color: "#666" }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Order Form */}
          <div className="rounded-3xl p-8 shadow-2xl" style={{ background: "white" }}>
            <h2 className="font-fredoka text-2xl mb-6" style={{ color: "#DA291C" }}>📋 Оформить заказ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Ваше имя", placeholder: "Введите имя", type: "text" },
                { label: "Телефон", placeholder: "+7 (___) ___-__-__", type: "tel" },
                { label: "Адрес доставки", placeholder: "Улица, дом, квартира", type: "text" },
                { label: "Подъезд / этаж", placeholder: "Подъезд 2, этаж 5", type: "text" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-bold mb-2" style={{ color: "#27251F" }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl outline-none font-semibold transition-all"
                    style={{ border: "2px solid #FFC72C", color: "#27251F" }}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: "#27251F" }}>Комментарий к заказу</label>
                <textarea
                  placeholder="Особые пожелания, время доставки..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none font-semibold resize-none transition-all"
                  style={{ border: "2px solid #FFC72C", color: "#27251F" }}
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl flex items-center justify-between" style={{ background: "#FFF9EE" }}>
              <div>
                <div className="font-bold text-sm" style={{ color: "#999" }}>Товаров в корзине:</div>
                <div className="font-black text-xl" style={{ color: "#DA291C" }}>{totalItems > 0 ? `${totalItems} шт. — ${totalPrice} ₽` : "Корзина пуста"}</div>
              </div>
              {totalItems === 0 && (
                <button
                  onClick={() => setPage("menu")}
                  className="px-5 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: "#FFC72C", color: "#27251F" }}
                >
                  Перейти в меню →
                </button>
              )}
            </div>

            <button
              onClick={() => totalItems > 0 && handleOrder()}
              className="w-full mt-5 py-4 rounded-2xl font-black text-lg transition-all shadow-lg"
              style={{
                background: totalItems > 0 ? "#DA291C" : "#ccc",
                color: "white",
                cursor: totalItems > 0 ? "pointer" : "not-allowed",
                transform: "scale(1)"
              }}
            >
              {totalItems > 0 ? `🛵 Оформить заказ — ${totalPrice} ₽` : "Добавьте товары в корзину"}
            </button>
          </div>

          {/* Steps */}
          <div className="mt-12">
            <h2 className="font-fredoka text-2xl mb-6 text-center" style={{ color: "#27251F" }}>Как это работает?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: "1", text: "Выбираете блюда из меню", emoji: "🍔" },
                { step: "2", text: "Добавляете в корзину", emoji: "🛒" },
                { step: "3", text: "Оформляете заказ и платите", emoji: "💳" },
                { step: "4", text: "Ждёте — везём за 30 минут!", emoji: "🛵" },
              ].map(s => (
                <div key={s.step} className="text-center p-5 rounded-2xl shadow-md" style={{ background: "white" }}>
                  <div className="w-10 h-10 rounded-full font-black text-lg flex items-center justify-center mx-auto mb-3"
                    style={{ background: "#DA291C", color: "white" }}>{s.step}</div>
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <p className="text-sm font-bold" style={{ color: "#27251F" }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================== CART SIDEBAR =================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md flex flex-col shadow-2xl animate-slide-up" style={{ background: "white" }}>
            <div className="p-5 flex items-center justify-between" style={{ background: "#DA291C" }}>
              <h2 className="font-fredoka text-2xl text-white">🛒 Корзина</h2>
              <button onClick={() => setCartOpen(false)} className="text-white hover:scale-110 transition-transform">
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-xl font-black" style={{ color: "#ccc" }}>Корзина пуста</p>
                  <button
                    onClick={() => { setCartOpen(false); setPage("menu"); }}
                    className="mt-6 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    style={{ background: "#FFC72C", color: "#27251F" }}
                  >
                    Перейти в меню →
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center p-3 rounded-2xl" style={{ background: "#FFF9EE" }}>
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm truncate" style={{ color: "#27251F" }}>{item.emoji} {item.name}</p>
                      <p className="font-bold text-sm" style={{ color: "#DA291C" }}>{item.price} ₽ × {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full font-black flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "#DA291C", color: "white" }}>−</button>
                      <span className="font-black text-base w-4 text-center" style={{ color: "#27251F" }}>{item.qty}</span>
                      <button onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full font-black flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "#FFC72C", color: "#27251F" }}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg" style={{ color: "#27251F" }}>Итого:</span>
                  <span className="font-black text-2xl" style={{ color: "#DA291C" }}>{totalPrice} ₽</span>
                </div>
                {totalPrice < 500 && (
                  <div className="text-center text-sm font-semibold p-3 rounded-xl" style={{ background: "#FFF9EE", color: "#FF6B00" }}>
                    🎁 До бесплатной доставки: {500 - totalPrice} ₽
                  </div>
                )}
                <button
                  onClick={handleOrder}
                  className="w-full py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ background: "#DA291C", color: "white" }}
                >
                  Оформить заказ 🛵
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 py-8 text-center font-semibold" style={{ background: "#27251F", color: "rgba(255,255,255,0.5)" }}>
        <div className="font-fredoka text-2xl mb-2" style={{ color: "#FFC72C" }}>МокДоналдс</div>
        <p className="text-sm">🍔 Вкусно · Быстро · Весело · © 2026</p>
      </footer>
    </div>
  );
}

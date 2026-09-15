import React, { useState } from 'react';
import "./Footer.css";
import Logo from "../../assets/images/akat.png";
import Inst from "../../assets/images/Instagram.svg";
import Tik from "../../assets/images/Tiktok.svg";
import Tg from "../../assets/images/Telegram.svg";
import { TELEGRAM_API_URL, TELEGRAM_CHAT_ID } from "./telegramconfig";

const cities = [
    "Костанай", "Лондон","Павлодар", "Коста-Рика", "Париж", "Берлин", "Мадрид", "Рим", "Амстердам", "Стокгольм", "Вена", 
    "Прага", "Будапешт", "Варшава", "Афины", "Хельсинки", "Копенгаген", "Брюссель", 
    "Дублин", "Лиссабон", "Бухарест", "Белград", "София", "Вильнюс", "Рига", "Таллин", 
    "Бишкек", "Астана", "Тбилиси", "Душанбе", "Пекин", "Токио", "Сеул", "Шанхай", 
    "Гонконг", "Сингапур", "Дубай", "Бангкок", "Нью-Дели", "Тегеран", "Стамбул", "Анкара",
    "Санкт-Петербург", "Казань", "Новосибирск", "Екатеринбург", "Ростов-на-Дону", 
    "Самара", "Нижний Новгород", "Челябинск", "Омск", "Волгоград", "Алматы", "Минск", 
    "Баку", "Ереван", "Ташкент", "Ашхабад", "Коломбо", "Хошимин", "Тайбэй", "Макка"
];

const Footer = () => {
  // Состояния для полей формы
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка заполнения полей
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, заполните имя и телефон");
      return;
    }
    
    // Проверка конфигурации Telegram
    if (!TELEGRAM_API_URL || !TELEGRAM_CHAT_ID) {
      setError("Ошибка конфигурации Telegram. Проверьте настройки.");
      console.error("Telegram конфигурация отсутствует", { 
        API_URL: TELEGRAM_API_URL, 
        CHAT_ID: TELEGRAM_CHAT_ID 
      });
      return;
    }
    
    // Подготовка сообщения для Telegram
    const message = `
🔔 Новая заявка с сайта!
👤 Имя: ${name}
📞 Телефон: +7${phone}
✉️ Email: ${email || "Не указан"}
    `;
    
    try {
      setLoading(true);
      setError("");
      
      // Отправка данных в Telegram
      const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML"
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка HTTP: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.ok) {
        // Если отправка успешна
        setSuccess(true);
        // Очистка полей
        setName("");
        setPhone("");
        setEmail("");
        
        // Сбросить сообщение об успехе через 5 секунд
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(`Ошибка API Telegram: ${data.description || "Неизвестная ошибка"}`);
      }
    } catch (err) {
      console.error("Ошибка отправки в Telegram:", err);
      setError(`Ошибка: ${err.message || "Проверьте соединение и настройки"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="main-content"></main>
      
      <section className="global-users">
        <h2>Пользователи со всего мира !</h2>
        <p>ВМЕСТЕ C <span className="red">AKATSUKI </span>COURSES</p>
        <div className="cities-slider-wrapper">
          <div className="cities-slider">
            {[...cities, ...cities].map((city, index) => (
              <span key={index}>{city}  • </span>
            ))}
          </div>
        </div>

        <div className="cities-slider-wrapper">
          <div className="cities-sliderr">
            {[...cities, ...cities].map((city, index) => (
              <span key={index}>{city} • </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-form">
          <h2>Остались вопросы?</h2>
          <p>
            Если вы хотите больше узнать о <span>Akatsuki</span> Courses или не
            знаете, какую программу выбрать, оставляйте заявку
          </p>
          
          {success && (
            <div className="success-message">
              Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Имя" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <div className="input-group">
              <select disabled>
                <option value="kz">🇰🇿 +7</option>
              </select>
              <input 
                type="text" 
                placeholder="Телефон" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            
            <input 
              type="email" 
              placeholder="Электронная почта" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <button type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </form>
        </div>

        <div className="footer-top">
          <div className="footer-logo">
            <img src={Logo} alt="Akatsuki Course" />
            <p>Akatsuki Courses</p>
          </div>
          <div className="footer-contacts">
            <p>📞 8 705 615 4317</p>
            <p> info@akatsukicourses.kz</p>
          </div>
          <div className="footer-socials">
            <a href="https://www.instagram.com/yanealdik/"><img src={Inst} alt="Instagram" /></a>
            <a href="#"><img src={Tik} alt="Tiktok" /></a>
            <a href="#"><img src={Tg} alt="Telegram" /></a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Akatsuki Courses. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
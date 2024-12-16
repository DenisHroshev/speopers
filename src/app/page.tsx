"use client";

import Image from "next/image";

export default function Home() {
  return (
      <div style={containerStyle}>
        <div style={backgroundGalleryStyle}>
          <div style={loopingGalleryStyle}>
            {/* Зображення у галереї */}
            <Image src="/images/operation1.jpg" alt="Operation 1" width={600} height={400} style={imageStyle} />
            <Image src="/images/operation2.jpg" alt="Operation 2" width={600} height={400} style={imageStyle} />
            <Image src="/images/operation3.jpg" alt="Operation 3" width={600} height={400} style={imageStyle} />
            <Image src="/images/operation4.jpg" alt="Operation 4" width={600} height={400} style={imageStyle} />
            {/*<Image src="/images/operation5.jpg" alt="Operation 5" width={600} height={400} style={imageStyle} />*/}

            {/* Копія зображень для безперервного скролу */}
            <Image src="/images/operation1.jpg" alt="Operation 1" width={600} height={400} style={imageStyle} />
            <Image src="/images/operation2.jpg" alt="Operation 2" width={600} height={400} style={imageStyle} />
            <Image src="/images/operation3.jpg" alt="Operation 3" width={600} height={400} style={imageStyle} />
            <Image src="/images/operation4.jpg" alt="Operation 4" width={600} height={400} style={imageStyle} />
            {/*<Image src="/images/operation5.jpg" alt="Operation 5" width={600} height={400} style={imageStyle} />*/}
          </div>
        </div>

        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>Працюємо для людей!</h1>
          <p style={textStyle}>
            Рятувальні операції — це комплекс дій, спрямованих на забезпечення безпеки та надання допомоги людям у надзвичайних ситуаціях.
            Ми працюємо цілодобово, щоб захищати життя і здоров'я населення, боротися з природними та техногенними катастрофами.
          </p>
          <p style={authTextStyle}>Для роботи необхідно авторизуватись.</p>
        </div>

        {/* CSS анімація для безперервного скролу зображень */}
        <style jsx>{`
          @keyframes scrollLoop {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
  );
}

// Стилі для компонента
const containerStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#F0F0F0",
  height: "100vh", // Обмежуємо висоту контейнера до 100vh
  overflow: "hidden",
};


const backgroundGalleryStyle = {
  position: "fixed",
  top: "60px", // Починаємо під хедером
  left: 0,
  width: "100vw",
  height: "calc(100vh - 60px)", // Віднімаємо висоту хедера
  overflow: "hidden",
  zIndex: -1,
};

const loopingGalleryStyle = {
  display: "flex",
  animation: "scrollLoop 20s linear infinite",
};

const imageStyle = {
  width: "600px",
  height: "100vh",
  objectFit: "cover",
  opacity: 0.4, // Прозорість для кращої читабельності тексту
};

const contentContainerStyle = {
  position: "relative",
  zIndex: 1,
  maxWidth: "800px",
  textAlign: "center",
  padding: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Напівпрозорий фон для кращої читабельності тексту
  borderRadius: "12px",
};

const titleStyle = {
  color: "#FFA500",
  fontSize: "48px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const textStyle = {
  fontSize: "18px",
  marginBottom: "20px",
  lineHeight: "1.6",
};

const authTextStyle = {
  fontSize: "16px",
  color: "#FFA500",
  fontWeight: "bold",
};

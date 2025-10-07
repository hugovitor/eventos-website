import React, { useEffect, useState } from 'react';

interface FontLoaderProps {
  fonts: string[];
  children: React.ReactNode;
}

export const FontLoader: React.FC<FontLoaderProps> = ({ fonts, children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Carrega as fontes do Google Fonts
        const fontPromises = fonts.map(font => {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          
          return new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve; // Continue mesmo se uma fonte falhar
          });
        });

        await Promise.all(fontPromises);
        
        // Aguarda um pouco para as fontes serem aplicadas
        setTimeout(() => setFontsLoaded(true), 100);
      } catch (error) {
        console.warn('Erro ao carregar fontes:', error);
        setFontsLoaded(true); // Continue mesmo com erro
      }
    };

    loadFonts();
  }, [fonts]);

  return (
    <div className={`transition-opacity duration-300 ${fontsLoaded ? 'opacity-100' : 'opacity-80'}`}>
      {children}
    </div>
  );
};
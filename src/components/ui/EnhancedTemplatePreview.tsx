import React from 'react';
import type { TemplateTheme } from '../../types/templates';
import { Calendar, MapPin, Users, Gift, Camera, Clock, Sparkles } from 'lucide-react';

interface EnhancedTemplatePreviewProps {
  template: TemplateTheme;
  customization?: {
    templateId: string;
    designOverrides?: {
      colorScheme?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
      };
      typography?: {
        headingFont?: string;
        bodyFont?: string;
        headingSize?: string;
        bodySize?: string;
      };
    };
    layoutOverrides?: {
      spacing?: string;
      borderRadius?: string;
    };
  };
  eventData?: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  mode?: 'desktop' | 'mobile';
  showFullPage?: boolean;
  realTimeUpdates?: boolean;
  className?: string;
}

export const EnhancedTemplatePreview: React.FC<EnhancedTemplatePreviewProps> = ({
  template,
  customization = {},
  eventData,
  mode = 'desktop',
  showFullPage = false,
  className = ''
}) => {
  // Mesclar configurações com customizações em tempo real
  const mergedColors = {
    primary: customization.designOverrides?.colorScheme?.primary || template.design.colorScheme.primary,
    secondary: customization.designOverrides?.colorScheme?.secondary || template.design.colorScheme.secondary,
    accent: customization.designOverrides?.colorScheme?.accent || template.design.colorScheme.accent,
    background: customization.designOverrides?.colorScheme?.background || template.design.colorScheme.background,
    text: customization.designOverrides?.colorScheme?.text || template.design.colorScheme.text
  };
  
  const mergedTypography = {
    headingFont: customization.designOverrides?.typography?.headingFont || template.design.typography.headingFont,
    bodyFont: customization.designOverrides?.typography?.bodyFont || template.design.typography.bodyFont,
    titleSize: template.design.typography.sizes.title,
    bodySize: template.design.typography.sizes.body
  };

  // Dados dinâmicos para preview
  const previewData = {
    title: eventData?.title || 'Meu Evento Especial',
    type: eventData?.type || 'birthday',
    description: eventData?.description || 'Venha celebrar conosco este momento único e especial. Será uma festa inesquecível com muita alegria, música e momentos especiais para toda a família!',
    event_date: eventData?.event_date || '2024-12-31T20:00:00',
    location: eventData?.location || 'Salão de Festas Paradise - Rua das Flores, 123'
  };

  const getEventEmoji = (type: string) => {
    switch (type) {
      case 'wedding': return '💒';
      case 'corporate': return '🏢';
      case 'party': return '🎉';
      default: return '🎂';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data a definir';
    }
  };

  const containerClass = mode === 'mobile' 
    ? 'w-full max-w-sm mx-auto' 
    : 'w-full max-w-4xl mx-auto';

  // Estilos CSS dinâmicos para fontes
  const dynamicStyles = `
    @import url('https://fonts.googleapis.com/css2?family=${mergedTypography.headingFont?.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=${mergedTypography.bodyFont?.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');
    
    .preview-heading-font {
      font-family: '${mergedTypography.headingFont}', serif !important;
      font-size: ${mergedTypography.titleSize} !important;
      line-height: 1.2 !important;
    }
    
    .preview-body-font {
      font-family: '${mergedTypography.bodyFont}', sans-serif !important;
      font-size: ${mergedTypography.bodySize} !important;
      line-height: 1.6 !important;
    }
    
    .preview-gradient {
      background: linear-gradient(135deg, ${mergedColors.primary} 0%, ${mergedColors.secondary} 100%) !important;
    }
    
    .preview-text-color {
      color: ${mergedColors.text} !important;
    }
    
    .preview-accent-color {
      color: ${mergedColors.accent} !important;
    }
  `;

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Injetar estilos dinâmicos */}
      <style>{dynamicStyles}</style>
      
      <div 
        className="border rounded-xl overflow-hidden shadow-xl bg-white"
        style={{ 
          minHeight: showFullPage ? '800px' : '500px',
          backgroundColor: mergedColors.background
        }}
      >
        {/* Hero Section */}
        <div 
          className="relative h-80 flex items-center justify-center preview-gradient"
          style={{
            background: `linear-gradient(135deg, ${mergedColors.primary}, ${mergedColors.secondary})`
          }}
        >
          {/* Overlay com padrão */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>
          
          {/* Conteúdo Hero */}
          <div className="relative z-10 text-center text-white px-6 max-w-2xl">
            <div className="text-6xl mb-4">
              {getEventEmoji(previewData.type)}
            </div>
            <h1 className="preview-heading-font text-4xl md:text-5xl font-bold mb-4">
              {previewData.title}
            </h1>
            <p className="preview-body-font text-lg md:text-xl opacity-90 mb-6">
              {previewData.description}
            </p>
            
            {/* Info Cards */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="preview-body-font text-sm">{formatDate(previewData.event_date)}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="preview-body-font text-sm">{previewData.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8" style={{ backgroundColor: mergedColors.background }}>
          
          {/* Layout baseado no tipo do template */}
          {template.layout.type === 'single-column' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <SingleColumnContent template={template} previewData={previewData} mergedColors={mergedColors} />
            </div>
          )}
          
          {template.layout.type === 'two-column' && (
            <div className="grid md:grid-cols-2 gap-8">
              <TwoColumnContent template={template} previewData={previewData} mergedColors={mergedColors} />
            </div>
          )}
          
          {template.layout.type === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GridContent template={template} previewData={previewData} mergedColors={mergedColors} />
            </div>
          )}
          
          {template.layout.type === 'masonry' && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <MasonryContent template={template} previewData={previewData} mergedColors={mergedColors} />
            </div>
          )}
          
          {template.layout.type === 'timeline' && (
            <div className="max-w-4xl mx-auto">
              <TimelineContent template={template} previewData={previewData} mergedColors={mergedColors} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-6 text-center preview-body-font"
          style={{ 
            backgroundColor: mergedColors.primary,
            color: 'white'
          }}
        >
          <p className="text-sm opacity-90">
            Confirme sua presença e faça parte deste momento especial! 💖
          </p>
        </div>
      </div>
    </div>
  );
};

// Componentes de layout específicos
interface LayoutContentProps {
  template: TemplateTheme;
  previewData: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  mergedColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const SingleColumnContent: React.FC<LayoutContentProps> = ({ previewData, mergedColors }) => (
  <>
    <div className="text-center space-y-4">
      <h2 className="preview-heading-font text-3xl font-bold preview-text-color">
        Sobre o Evento
      </h2>
      <p className="preview-body-font text-lg preview-text-color">
        {previewData.description}
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${mergedColors.primary}15` }}>
        <Users className="w-8 h-8 mx-auto mb-3 preview-accent-color" />
        <h3 className="preview-heading-font font-semibold preview-text-color">Convidados</h3>
        <p className="preview-body-font text-sm preview-text-color">Família e amigos</p>
      </div>
      <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${mergedColors.primary}15` }}>
        <Gift className="w-8 h-8 mx-auto mb-3 preview-accent-color" />
        <h3 className="preview-heading-font font-semibold preview-text-color">Presentes</h3>
        <p className="preview-body-font text-sm preview-text-color">Lista disponível</p>
      </div>
      <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${mergedColors.primary}15` }}>
        <Camera className="w-8 h-8 mx-auto mb-3 preview-accent-color" />
        <h3 className="preview-heading-font font-semibold preview-text-color">Fotos</h3>
        <p className="preview-body-font text-sm preview-text-color">Galeria de momentos</p>
      </div>
    </div>
  </>
);

const TwoColumnContent: React.FC<LayoutContentProps> = ({ previewData, mergedColors }) => (
  <>
    <div className="space-y-6">
      <h2 className="preview-heading-font text-3xl font-bold" style={{ color: mergedColors.text }}>
        Detalhes do Evento
      </h2>
      <p className="preview-body-font" style={{ color: mergedColors.text }}>
        {previewData.description}
      </p>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 preview-accent-color" />
          <span className="preview-body-font preview-text-color">20:00 - 02:00</span>
        </div>
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 preview-accent-color" />
          <span className="preview-body-font preview-text-color">50 convidados</span>
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <h2 className="preview-heading-font text-3xl font-bold preview-text-color">
        Localização
      </h2>
      <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
        <MapPin className="w-12 h-12 text-gray-400" />
      </div>
      <p className="preview-body-font text-sm preview-text-color">
        {previewData.location}
      </p>
    </div>
  </>
);

const GridContent: React.FC<LayoutContentProps> = ({ mergedColors }) => (
  <>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="p-6 rounded-lg" style={{ backgroundColor: `${mergedColors.primary}10` }}>
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: mergedColors.primary }}>
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h3 className="preview-heading-font font-semibold text-center preview-text-color">
          Seção {i}
        </h3>
        <p className="preview-body-font text-sm text-center preview-text-color mt-2">
          Conteúdo da seção {i}
        </p>
      </div>
    ))}
  </>
);

const MasonryContent: React.FC<LayoutContentProps> = ({ mergedColors }) => (
  <>
    {[1, 2, 3, 4, 5].map(i => (
      <div 
        key={i} 
        className="break-inside-avoid p-6 rounded-lg mb-6" 
        style={{ 
          backgroundColor: `${mergedColors.primary}10`,
          height: `${150 + (i * 50)}px`
        }}
      >
        <h3 className="preview-heading-font font-semibold preview-text-color">
          Card {i}
        </h3>
        <p className="preview-body-font text-sm preview-text-color mt-2">
          Conteúdo dinâmico com altura variável para criar o efeito masonry.
        </p>
      </div>
    ))}
  </>
);

const TimelineContent: React.FC<LayoutContentProps> = ({ mergedColors }) => (
  <div className="relative">
    <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ backgroundColor: mergedColors.primary }}></div>
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="relative flex items-center mb-8">
        <div 
          className="w-4 h-4 rounded-full border-4 border-white shadow-lg"
          style={{ backgroundColor: mergedColors.primary }}
        ></div>
        <div className="ml-8 p-6 rounded-lg flex-1" style={{ backgroundColor: `${mergedColors.primary}10` }}>
          <h3 className="preview-heading-font font-semibold preview-text-color">
            Momento {i}
          </h3>
          <p className="preview-body-font text-sm preview-text-color mt-2">
            Descrição do momento {i} na timeline do evento.
          </p>
        </div>
      </div>
    ))}
  </div>
);
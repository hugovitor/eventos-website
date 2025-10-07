import React from 'react';
import type { TemplateTheme, CustomizationOptions } from '../../types/templates';
import { Calendar, MapPin, Users, Gift, Camera, Clock } from 'lucide-react';

interface TemplatePreviewProps {
  template: TemplateTheme;
  customization?: CustomizationOptions;
  eventData?: {
    title: string;
    type: string;
    description: string;
    event_date: string;
    location: string;
  };
  mode?: 'desktop' | 'mobile';
  showFullPage?: boolean;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  customization = {},
  eventData,
  mode = 'desktop',
  showFullPage = false,
  className = ''
}) => {
  // Mesclar configurações do template com customizações
  const mergedColors = {
    ...template.design.colorScheme,
    ...customization.designOverrides?.colorScheme
  };
  
  const mergedTypography = {
    ...template.design.typography,
    ...customization.designOverrides?.typography
  };
  
  const mergedLayout = {
    ...template.layout,
    ...customization.layoutOverrides
  };

  // Dados padrão para preview
  const previewData = {
    title: eventData?.title || 'Meu Evento Especial',
    type: eventData?.type || 'birthday',
    description: eventData?.description || 'Venha celebrar conosco este momento único e especial. Será uma festa inesquecível!',
    event_date: eventData?.event_date || '2024-12-31',
    location: eventData?.location || 'Salão de Festas Paradise'
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
        day: 'numeric'
      });
    } catch {
      return 'Data a definir';
    }
  };

  const containerClass = mode === 'mobile' 
    ? 'w-full max-w-sm mx-auto' 
    : 'w-full';

  const aspectRatio = mode === 'mobile' ? '9/16' : '16/9';
  const minHeight = showFullPage ? '600px' : '400px';

  return (
    <div className={`${containerClass} ${className}`}>
      <div 
        className="border rounded-lg overflow-hidden shadow-lg"
        style={{ 
          aspectRatio: showFullPage ? 'auto' : aspectRatio,
          minHeight,
          fontFamily: mergedTypography.bodyFont
        }}
      >
        {/* Hero Section */}
        <div 
          className="relative h-64 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${mergedColors.primary}, ${mergedColors.secondary})`,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)',
            backgroundSize: '20px 20px'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative text-center text-white z-10 p-6">
            <div className="text-4xl mb-4">
              {getEventEmoji(previewData.type)}
            </div>
            <h1 
              className="text-2xl md:text-4xl font-bold mb-2"
              style={{ 
                fontFamily: mergedTypography.headingFont,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {previewData.title}
            </h1>
            <p className="text-lg opacity-90">
              {formatDate(previewData.event_date)}
            </p>
          </div>
        </div>

        {/* Content Sections - Layout based on template type */}
        <div 
          className={`p-6 ${
            mergedLayout.type === 'two-column' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' :
            mergedLayout.type === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' :
            mergedLayout.type === 'masonry' ? 'columns-1 md:columns-2 gap-6' :
            'space-y-6'
          }`}
          style={{ backgroundColor: mergedColors.background }}
        >
          
          {/* About Section */}
          <div 
            className={`p-4 rounded-lg ${mergedLayout.type === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
            style={{ backgroundColor: mergedColors.surface }}
          >
            <h2 
              className="text-xl font-semibold mb-3 flex items-center"
              style={{ 
                color: mergedColors.primary,
                fontFamily: mergedTypography.headingFont
              }}
            >
              <Users className="w-5 h-5 mr-2" />
              Sobre o Evento
            </h2>
            <p style={{ color: mergedColors.text }}>
              {previewData.description}
            </p>
          </div>

          {/* Event Details */}
          <div 
            className={`p-4 rounded-lg ${mergedLayout.type === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
            style={{ backgroundColor: mergedColors.surface }}
          >
            <h2 
              className="text-xl font-semibold mb-3 flex items-center"
              style={{ 
                color: mergedColors.primary,
                fontFamily: mergedTypography.headingFont
              }}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Detalhes
            </h2>
            <div className="space-y-2">
              <div className="flex items-center" style={{ color: mergedColors.text }}>
                <Clock className="w-4 h-4 mr-2" style={{ color: mergedColors.accent }} />
                <span>19:00 - 23:00</span>
              </div>
              <div className="flex items-center" style={{ color: mergedColors.text }}>
                <MapPin className="w-4 h-4 mr-2" style={{ color: mergedColors.accent }} />
                <span>{previewData.location}</span>
              </div>
            </div>
          </div>

          {/* Gallery Preview */}
          <div 
            className={`p-4 rounded-lg ${mergedLayout.type === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
            style={{ backgroundColor: mergedColors.surface }}
          >
            <h2 
              className="text-xl font-semibold mb-3 flex items-center"
              style={{ 
                color: mergedColors.primary,
                fontFamily: mergedTypography.headingFont
              }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Galeria
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="aspect-square rounded"
                  style={{ backgroundColor: mergedColors.muted }}
                />
              ))}
            </div>
          </div>

          {/* RSVP Section */}
          <div 
            className={`p-4 rounded-lg ${mergedLayout.type === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
            style={{ backgroundColor: mergedColors.surface }}
          >
            <h2 
              className="text-xl font-semibold mb-3 flex items-center"
              style={{ 
                color: mergedColors.primary,
                fontFamily: mergedTypography.headingFont
              }}
            >
              <Gift className="w-5 h-5 mr-2" />
              Confirmação
            </h2>
            <button 
              className="w-full py-2 px-4 rounded font-medium transition-colors"
              style={{ 
                backgroundColor: mergedColors.accent,
                color: 'white'
              }}
            >
              Confirmar Presença
            </button>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-4 text-center text-sm"
          style={{ 
            backgroundColor: mergedColors.primary,
            color: 'white'
          }}
        >
          <p style={{ fontFamily: mergedTypography.decorativeFont }}>
            Feito com ❤️ para você
          </p>
        </div>
      </div>
    </div>
  );
};
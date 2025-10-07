import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import type { TemplateTheme } from '../../types/templates';
import {
  Palette,
  Wand2,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Shuffle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface ThemeColor {
  name: string;
  value: string;
  variable: string;
  description: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

interface AdvancedTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColor[];
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    colored: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    scale: number;
    unit: string;
  };
  typography: {
    scale: number;
    lineHeight: number;
  };
  animations: {
    duration: string;
    easing: string;
  };
  effects: {
    blur: boolean;
    glass: boolean;
    neon: boolean;
    gradient: boolean;
  };
}

const predefinedThemes: AdvancedTheme[] = [
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Futurista com cores neon e efeitos brilhantes',
    colors: [
      { name: 'Neon Pink', value: '#FF0080', variable: '--primary', description: 'Cor primária vibrante', category: 'primary' },
      { name: 'Electric Blue', value: '#00D4FF', variable: '--secondary', description: 'Azul elétrico', category: 'secondary' },
      { name: 'Neon Green', value: '#39FF14', variable: '--accent', description: 'Verde neon', category: 'accent' },
      { name: 'Dark Purple', value: '#1A0B2E', variable: '--background', description: 'Fundo escuro', category: 'neutral' },
      { name: 'Bright White', value: '#FFFFFF', variable: '--text', description: 'Texto principal', category: 'neutral' }
    ],
    gradients: {
      primary: 'linear-gradient(135deg, #FF0080, #7928CA)',
      secondary: 'linear-gradient(135deg, #00D4FF, #0099CC)',
      accent: 'linear-gradient(135deg, #39FF14, #2ECC71)'
    },
    shadows: {
      small: '0 2px 8px rgba(255, 0, 128, 0.3)',
      medium: '0 8px 24px rgba(255, 0, 128, 0.4)',
      large: '0 16px 40px rgba(255, 0, 128, 0.5)',
      colored: '0 0 20px rgba(255, 0, 128, 0.8)'
    },
    borderRadius: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
    spacing: { scale: 1.2, unit: 'rem' },
    typography: { scale: 1.1, lineHeight: 1.5 },
    animations: { duration: '0.3s', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    effects: { blur: true, glass: true, neon: true, gradient: true }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Elegante com tons dourados e pretos sofisticados',
    colors: [
      { name: 'Rich Gold', value: '#D4AF37', variable: '--primary', description: 'Dourado luxuoso', category: 'primary' },
      { name: 'Deep Black', value: '#1C1C1C', variable: '--secondary', description: 'Preto profundo', category: 'secondary' },
      { name: 'Champagne', value: '#F7E7CE', variable: '--accent', description: 'Champagne suave', category: 'accent' },
      { name: 'Cream', value: '#FDF6E3', variable: '--background', description: 'Fundo cremoso', category: 'neutral' },
      { name: 'Charcoal', value: '#2C2C2C', variable: '--text', description: 'Texto escuro', category: 'neutral' }
    ],
    gradients: {
      primary: 'linear-gradient(135deg, #D4AF37, #FFD700)',
      secondary: 'linear-gradient(135deg, #1C1C1C, #4A4A4A)',
      accent: 'linear-gradient(135deg, #F7E7CE, #E6D7B8)'
    },
    shadows: {
      small: '0 2px 8px rgba(212, 175, 55, 0.2)',
      medium: '0 8px 24px rgba(212, 175, 55, 0.3)',
      large: '0 16px 40px rgba(212, 175, 55, 0.4)',
      colored: '0 0 30px rgba(212, 175, 55, 0.6)'
    },
    borderRadius: { sm: '2px', md: '6px', lg: '12px', xl: '20px' },
    spacing: { scale: 1.0, unit: 'rem' },
    typography: { scale: 1.0, lineHeight: 1.6 },
    animations: { duration: '0.4s', easing: 'ease-in-out' },
    effects: { blur: false, glass: false, neon: false, gradient: true }
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Inspirado no oceano com tons azuis e verdes aquáticos',
    colors: [
      { name: 'Deep Ocean', value: '#006994', variable: '--primary', description: 'Azul oceano profundo', category: 'primary' },
      { name: 'Wave Blue', value: '#4FC3F7', variable: '--secondary', description: 'Azul das ondas', category: 'secondary' },
      { name: 'Sea Foam', value: '#81C784', variable: '--accent', description: 'Verde espuma do mar', category: 'accent' },
      { name: 'Sandy Beach', value: '#F5F5DC', variable: '--background', description: 'Areia da praia', category: 'neutral' },
      { name: 'Deep Blue', value: '#1565C0', variable: '--text', description: 'Azul profundo', category: 'neutral' }
    ],
    gradients: {
      primary: 'linear-gradient(135deg, #006994, #0277BD)',
      secondary: 'linear-gradient(135deg, #4FC3F7, #29B6F6)',
      accent: 'linear-gradient(135deg, #81C784, #66BB6A)'
    },
    shadows: {
      small: '0 2px 8px rgba(0, 105, 148, 0.2)',
      medium: '0 8px 24px rgba(0, 105, 148, 0.3)',
      large: '0 16px 40px rgba(0, 105, 148, 0.4)',
      colored: '0 0 25px rgba(79, 195, 247, 0.5)'
    },
    borderRadius: { sm: '6px', md: '12px', lg: '18px', xl: '28px' },
    spacing: { scale: 1.1, unit: 'rem' },
    typography: { scale: 1.05, lineHeight: 1.7 },
    animations: { duration: '0.5s', easing: 'ease-out' },
    effects: { blur: true, glass: true, neon: false, gradient: true }
  }
];

export const AdvancedThemeSystem: React.FC<{
  selectedTemplate?: TemplateTheme;
  onThemeApply: (theme: AdvancedTheme) => void;
  className?: string;
}> = ({ selectedTemplate: _selectedTemplate, onThemeApply, className = '' }) => {
  const [activeTheme, setActiveTheme] = useState<AdvancedTheme>(predefinedThemes[0]);
  const [showPreview, setShowPreview] = useState(true);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Gerar tema automaticamente baseado em uma cor
  const generateThemeFromColor = async (baseColor: string) => {
    setIsGenerating(true);
    
    // Simular processo de geração de IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedTheme: AdvancedTheme = {
      id: `generated-${Date.now()}`,
      name: 'Tema Gerado por IA',
      description: `Tema criado automaticamente baseado na cor ${baseColor}`,
      colors: [
        { name: 'Base Color', value: baseColor, variable: '--primary', description: 'Cor base escolhida', category: 'primary' },
        { name: 'Complementary', value: getComplementaryColor(baseColor), variable: '--secondary', description: 'Cor complementar', category: 'secondary' },
        { name: 'Analogous', value: getAnalogousColor(baseColor), variable: '--accent', description: 'Cor análoga', category: 'accent' },
        { name: 'Light', value: lightenColor(baseColor, 0.9), variable: '--background', description: 'Versão clara', category: 'neutral' },
        { name: 'Dark', value: darkenColor(baseColor, 0.8), variable: '--text', description: 'Versão escura', category: 'neutral' }
      ],
      gradients: {
        primary: `linear-gradient(135deg, ${baseColor}, ${lightenColor(baseColor, 0.3)})`,
        secondary: `linear-gradient(135deg, ${getComplementaryColor(baseColor)}, ${lightenColor(getComplementaryColor(baseColor), 0.3)})`,
        accent: `linear-gradient(135deg, ${getAnalogousColor(baseColor)}, ${lightenColor(getAnalogousColor(baseColor), 0.3)})`
      },
      shadows: {
        small: `0 2px 8px ${hexToRgba(baseColor, 0.2)}`,
        medium: `0 8px 24px ${hexToRgba(baseColor, 0.3)}`,
        large: `0 16px 40px ${hexToRgba(baseColor, 0.4)}`,
        colored: `0 0 20px ${hexToRgba(baseColor, 0.6)}`
      },
      borderRadius: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
      spacing: { scale: 1.0, unit: 'rem' },
      typography: { scale: 1.0, lineHeight: 1.6 },
      animations: { duration: '0.3s', easing: 'ease-in-out' },
      effects: { blur: false, glass: false, neon: false, gradient: true }
    };
    
    setActiveTheme(generatedTheme);
    setActiveTheme(generatedTheme);
    setIsGenerating(false);
  };

  // Funções de manipulação de cores
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getComplementaryColor = (hex: string): string => {
    const r = 255 - parseInt(hex.slice(1, 3), 16);
    const g = 255 - parseInt(hex.slice(3, 5), 16);
    const b = 255 - parseInt(hex.slice(5, 7), 16);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getAnalogousColor = (hex: string): string => {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 30);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30);
    const b = parseInt(hex.slice(5, 7), 16);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const lightenColor = (hex: string, factor: number): string => {
    const r = Math.min(255, Math.floor(parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const darkenColor = (hex: string, factor: number): string => {
    const r = Math.max(0, Math.floor(parseInt(hex.slice(1, 3), 16) * factor));
    const g = Math.max(0, Math.floor(parseInt(hex.slice(3, 5), 16) * factor));
    const b = Math.max(0, Math.floor(parseInt(hex.slice(5, 7), 16) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedColor(type);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportTheme = () => {
    const themeData = JSON.stringify(activeTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const randomizeTheme = () => {
    const randomTheme = predefinedThemes[Math.floor(Math.random() * predefinedThemes.length)];
    setActiveTheme(randomTheme);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                Sistema de Temas Avançado
              </h2>
              <p className="text-gray-600">
                Crie e aplique temas dinâmicos com cores, gradientes e efeitos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Ocultar' : 'Mostrar'} Preview</span>
              </Button>
              <Button
                variant="outline"
                onClick={randomizeTheme}
                className="flex items-center space-x-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>Aleatório</span>
              </Button>
              <Button
                onClick={() => onThemeApply(activeTheme)}
                className="flex items-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Aplicar Tema</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Theme Gallery */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Temas Predefinidos</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predefinedThemes.map((theme) => (
                  <motion.div
                    key={theme.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      activeTheme.id === theme.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTheme(theme)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{theme.name}</h4>
                      {activeTheme.id === theme.id && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                    <div className="flex space-x-2">
                      {theme.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Color Generator */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center">
                <Wand2 className="w-4 h-4 mr-2" />
                Gerador de Tema com IA
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cor Base</label>
                  <Input
                    type="color"
                    onChange={(e) => generateThemeFromColor(e.target.value)}
                    className="w-full h-12"
                    disabled={isGenerating}
                  />
                </div>
                <Button
                  onClick={() => generateThemeFromColor('#' + Math.floor(Math.random()*16777215).toString(16))}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Tema Aleatório</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Editor de Tema</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportTheme}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Exportar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Compartilhar</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                
                {/* Theme Info */}
                <div>
                  <Input
                    value={activeTheme.name}
                    onChange={(e) => setActiveTheme({...activeTheme, name: e.target.value})}
                    className="font-medium text-lg"
                    placeholder="Nome do tema"
                  />
                  <textarea
                    value={activeTheme.description}
                    onChange={(e) => setActiveTheme({...activeTheme, description: e.target.value})}
                    className="w-full mt-2 p-2 border rounded text-sm resize-none"
                    rows={2}
                    placeholder="Descrição do tema"
                  />
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium mb-3">Cores</h4>
                  <div className="space-y-3">
                    {activeTheme.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={color.value}
                          onChange={(e) => {
                            const newColors = [...activeTheme.colors];
                            newColors[index] = {...color, value: e.target.value};
                            setActiveTheme({...activeTheme, colors: newColors});
                          }}
                          className="w-12 h-8"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{color.name}</div>
                          <div className="text-xs text-gray-500">{color.value}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(color.value, color.name)}
                          className="p-1"
                        >
                          {copiedColor === color.name ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effects */}
                <div>
                  <h4 className="font-medium mb-3">Efeitos</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(activeTheme.effects).map(([effect, enabled]) => (
                      <label key={effect} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setActiveTheme({
                            ...activeTheme,
                            effects: {...activeTheme.effects, [effect]: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{effect}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Preview ao Vivo</h3>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-lg overflow-hidden border"
                  style={{
                    background: activeTheme.gradients.primary,
                    boxShadow: activeTheme.shadows.large
                  }}
                >
                  {/* Preview Content */}
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Meu Evento Especial</h3>
                    <p className="opacity-90 mb-4">
                      Preview do tema aplicado ao seu evento
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        className="p-3 rounded"
                        style={{ 
                          backgroundColor: activeTheme.colors[1].value,
                          boxShadow: activeTheme.shadows.small
                        }}
                      >
                        <div className="text-sm font-medium">Data</div>
                        <div className="text-xs">31/12/2024</div>
                      </div>
                      <div 
                        className="p-3 rounded"
                        style={{ 
                          backgroundColor: activeTheme.colors[2].value,
                          boxShadow: activeTheme.shadows.small
                        }}
                      >
                        <div className="text-sm font-medium">Local</div>
                        <div className="text-xs">Salão Paradise</div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="p-4"
                    style={{ backgroundColor: activeTheme.colors[3].value }}
                  >
                    <div className="flex justify-between items-center">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: activeTheme.colors[4].value }}
                      >
                        Confirme sua presença
                      </div>
                      <motion.button
                        className="px-4 py-2 rounded text-white text-sm font-medium"
                        style={{ 
                          background: activeTheme.gradients.accent,
                          boxShadow: activeTheme.effects.neon ? activeTheme.shadows.colored : activeTheme.shadows.medium
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        RSVP
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Theme Details */}
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gradientes:</span>
                    <span className="font-medium">{Object.keys(activeTheme.gradients).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efeitos ativos:</span>
                    <span className="font-medium">
                      {Object.values(activeTheme.effects).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Animação:</span>
                    <span className="font-medium">{activeTheme.animations.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
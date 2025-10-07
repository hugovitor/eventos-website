import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { AdvancedThemeSystem } from './AdvancedThemeSystem';
import { RealtimeCollaboration } from './RealtimeCollaboration';
import { AdvancedAnalytics } from './AdvancedAnalytics';
// import { SmartNotificationCenter } from './SmartNotificationCenter';
import { UniversalIntegrationHub } from './UniversalIntegrationHub';
import {
  Sparkles,
  Palette,
  Users,
  BarChart3,
  Bell,
  Zap,
  ArrowRight,
  Star,
  Crown,
  Rocket,
  Heart,
  Shield,
  Award,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface DemoSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  component: React.ReactNode;
}

const demoSections: DemoSection[] = [
  {
    id: 'themes',
    title: 'Sistema de Temas Avançado',
    description: 'Criação e personalização de temas com IA, cores dinâmicas e efeitos visuais',
    icon: <Palette className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Gerador de temas com IA',
      'Cores complementares automáticas',
      'Preview em tempo real',
      'Efeitos visuais avançados',
      'Exportação de temas',
      'Biblioteca de gradientes'
    ],
    component: <AdvancedThemeSystem selectedTemplate={undefined} onThemeApply={() => {}} />
  },
  {
    id: 'collaboration',
    title: 'Colaboração em Tempo Real',
    description: 'Trabalhe em equipe com chat, videochamadas e sincronização ao vivo',
    icon: <Users className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Chat da equipe integrado',
      'Videochamadas HD',
      'Atividade em tempo real',
      'Controle de permissões',
      'Histórico de alterações',
      'Notificações inteligentes'
    ],
    component: (
      <RealtimeCollaboration
        eventId="demo-event"
        currentUser={{
          id: 'demo-user',
          name: 'Usuário Demo',
          avatar: 'https://picsum.photos/100/100?random=12',
          email: 'demo@exemplo.com',
          role: 'owner',
          status: 'online',
          lastSeen: new Date()
        }}
        onInviteUser={() => {}}
      />
    )
  },
  {
    id: 'analytics',
    title: 'Analytics e Insights',
    description: 'Métricas avançadas, relatórios detalhados e recomendações inteligentes',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Métricas em tempo real',
      'Análise de dispositivos',
      'Distribuição geográfica',
      'Funis de conversão',
      'Recomendações IA',
      'Relatórios exportáveis'
    ],
    component: <AdvancedAnalytics eventId="demo-event" />
  },
  {
    id: 'notifications',
    title: 'Notificações Inteligentes',
    description: 'Sistema automático de notificações multi-canal com regras personalizáveis',
    icon: <Bell className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Regras automatizadas',
      'Multi-canal (Email, SMS, Push)',
      'Templates personalizados',
      'Horário silencioso',
      'Analytics de entrega',
      'Webhooks avançados'
    ],
    component: <div className="p-4 text-center text-gray-500">Componente SmartNotificationCenter não disponível</div>
  },
  {
    id: 'integrations',
    title: 'Hub de Integrações',
    description: 'Conecte com 50+ serviços populares de forma simples e segura',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    features: [
      'Stripe para pagamentos',
      'Google Calendar sync',
      'WhatsApp Business',
      'Instagram automático',
      'Mailchimp marketing',
      'Spotify playlists'
    ],
    component: <UniversalIntegrationHub eventId="demo-event" />
  }
];

export const ComprehensiveSystemDemo: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stats = [
    { label: 'Funcionalidades', value: '150+', icon: <Star className="w-5 h-5" /> },
    { label: 'Integrações', value: '50+', icon: <Zap className="w-5 h-5" /> },
    { label: 'Templates', value: '25+', icon: <Palette className="w-5 h-5" /> },
    { label: 'Usuários Ativos', value: '10K+', icon: <Users className="w-5 h-5" /> }
  ];

  const achievements = [
    { icon: <Crown className="w-6 h-6 text-yellow-500" />, title: 'Sistema Premium', desc: 'Funcionalidades profissionais' },
    { icon: <Rocket className="w-6 h-6 text-blue-500" />, title: 'Performance', desc: 'Carregamento ultra-rápido' },
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Segurança', desc: 'Dados protegidos' },
    { icon: <Award className="w-6 h-6 text-purple-500" />, title: 'Qualidade', desc: 'Código premium' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${className}`}>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Sistema de Eventos
              <br />
              <span className="text-4xl md:text-5xl">Revolucionário</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              A plataforma mais avançada para criação de eventos, com inteligência artificial, 
              colaboração em tempo real, analytics profissionais e integrações poderosas.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setActiveSection('themes')}
              >
                Explorar Funcionalidades
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsFullscreen(true)}
              >
                Demo Completa
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeSection === 'overview'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>
            {demoSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.icon}
                <span>{section.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Overview */}
        {activeSection === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            
            {/* Features Grid */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                Funcionalidades Revolucionárias
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center text-white mb-4`}>
                          {section.icon}
                        </div>
                        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-gray-600">{section.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {section.features.length > 4 && (
                            <li className="text-sm text-gray-500">
                              +{section.features.length - 4} recursos adicionais
                            </li>
                          )}
                        </ul>
                        <Button 
                          className="w-full mt-4 group-hover:bg-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSection(section.id);
                          }}
                        >
                          Explorar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                Por que Escolher Nosso Sistema
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center p-6 rounded-2xl border hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-center mb-4">
                      {achievement.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm">{achievement.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  Pronto para Criar Eventos Incríveis?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Junte-se a milhares de organizadores que já estão criando experiências memoráveis
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Começar Gratuitamente
                    <Rocket className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Agendar Demo
                    <Calendar className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Individual Sections */}
        {demoSections.map((section) => (
          activeSection === section.id && (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Section Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                  <div className="text-white">
                    {section.icon}
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.description}</p>
              </div>

              {/* Features List */}
              <Card className="mb-8">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Recursos Disponíveis</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Component Demo */}
              <div className="bg-white rounded-2xl border overflow-hidden">
                {section.component}
              </div>
            </motion.div>
          )
        ))}
      </div>

      {/* Fullscreen Demo Modal */}
      {isFullscreen && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="min-h-screen p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Demo Completa</h2>
              <Button
                variant="outline"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Fechar Demo
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-6">
                {activeSection === 'overview' ? (
                  <AdvancedThemeSystem selectedTemplate={undefined} onThemeApply={() => {}} />
                ) : (
                  demoSections.find(s => s.id === activeSection)?.component
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
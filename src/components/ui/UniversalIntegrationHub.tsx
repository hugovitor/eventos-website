import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import {
  Zap,
  Link,
  Settings,
  Check,
  X,
  Plus,
  RefreshCw,
  Download,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  Camera,
  Music,
  MapPin,
  Webhook,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'social' | 'communication' | 'calendar' | 'analytics' | 'storage' | 'other';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: React.ReactNode;
  features: string[];
  setupComplexity: 'easy' | 'medium' | 'advanced';
  webhookUrl?: string;
  apiKey?: string;
  lastSync?: Date;
  syncStatus?: 'success' | 'error' | 'syncing';
  config?: Record<string, unknown>;
}

interface WebhookEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  response?: string;
}

const availableIntegrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Processamento de pagamentos seguro e confiável',
    category: 'payment',
    status: 'connected',
    icon: <CreditCard className="w-6 h-6" />,
    features: ['Pagamentos online', 'Assinaturas', 'Webhooks', 'Dashboard'],
    setupComplexity: 'medium',
    lastSync: new Date(Date.now() - 300000)
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sincronize eventos com Google Calendar',
    category: 'calendar',
    status: 'connected',
    icon: <Calendar className="w-6 h-6" />,
    features: ['Sync bidirecional', 'Lembretes', 'Convites', 'Recurring events'],
    setupComplexity: 'easy',
    lastSync: new Date(Date.now() - 600000)
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Envie convites e atualizações via WhatsApp',
    category: 'communication',
    status: 'disconnected',
    icon: <MessageSquare className="w-6 h-6" />,
    features: ['Mensagens automáticas', 'Templates', 'Grupos', 'Status'],
    setupComplexity: 'medium'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Compartilhe e promova seus eventos no Instagram',
    category: 'social',
    status: 'error',
    icon: <Camera className="w-6 h-6" />,
    features: ['Auto-post', 'Stories', 'Hashtags', 'Analytics'],
    setupComplexity: 'easy'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Marketing por email profissional',
    category: 'communication',
    status: 'connected',
    icon: <Mail className="w-6 h-6" />,
    features: ['Email campaigns', 'Automação', 'Segmentação', 'Analytics'],
    setupComplexity: 'medium',
    lastSync: new Date(Date.now() - 900000)
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Crie playlists colaborativas para eventos',
    category: 'other',
    status: 'disconnected',
    icon: <Music className="w-6 h-6" />,
    features: ['Playlists', 'Colaboração', 'Player embed', 'Mood analysis'],
    setupComplexity: 'easy'
  },
  {
    id: 'uber',
    name: 'Uber',
    description: 'Facilite o transporte para seus convidados',
    category: 'other',
    status: 'disconnected',
    icon: <MapPin className="w-6 h-6" />,
    features: ['Códigos promocionais', 'Estimativas', 'Tracking', 'Group rides'],
    setupComplexity: 'advanced'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Analytics avançado para páginas de evento',
    category: 'analytics',
    status: 'pending',
    icon: <Globe className="w-6 h-6" />,
    features: ['Tracking avançado', 'Conversões', 'Funis', 'Real-time'],
    setupComplexity: 'medium'
  }
];

export const UniversalIntegrationHub: React.FC<{
  eventId: string;
  className?: string;
}> = ({ eventId, className = '' }) => {
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([
    {
      id: '1',
      event: 'payment.succeeded',
      payload: { amount: 150, customer: 'john@example.com' },
      timestamp: new Date(Date.now() - 1800000),
      status: 'success',
      response: '{"status": "processed"}'
    },
    {
      id: '2',
      event: 'rsvp.created',
      payload: { guestId: '123', eventId, status: 'confirmed' },
      timestamp: new Date(Date.now() - 3600000),
      status: 'success'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'logs'>('integrations');

  const categories = [
    { id: 'all', label: 'Todas', count: integrations.length },
    { id: 'payment', label: 'Pagamentos', count: integrations.filter(i => i.category === 'payment').length },
    { id: 'social', label: 'Social', count: integrations.filter(i => i.category === 'social').length },
    { id: 'communication', label: 'Comunicação', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'calendar', label: 'Calendário', count: integrations.filter(i => i.category === 'calendar').length },
    { id: 'analytics', label: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { id: 'other', label: 'Outros', count: integrations.filter(i => i.category === 'other').length }
  ];

  // Simular eventos de webhook em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const events = ['payment.succeeded', 'rsvp.created', 'guest.updated', 'email.sent'];
        const newEvent: WebhookEvent = {
          id: Date.now().toString(),
          event: events[Math.floor(Math.random() * events.length)],
          payload: { 
            eventId,
            timestamp: new Date(),
            data: `random_${Math.random().toString(36).substr(2, 9)}`
          },
          timestamp: new Date(),
          status: Math.random() > 0.2 ? 'success' : 'failed'
        };
        setWebhookEvents(prev => [newEvent, ...prev.slice(0, 19)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [eventId]);

  const connectIntegration = async (integration: Integration) => {
    setIsConnecting(true);
    
    // Simular processo de conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev.map(i => 
      i.id === integration.id 
        ? { 
            ...i, 
            status: 'connected', 
            lastSync: new Date(),
            apiKey: apiKey || undefined,
            webhookUrl: webhookUrl || undefined
          }
        : i
    ));
    
    setIsConnecting(false);
    setShowSetupModal(false);
    setApiKey('');
    setWebhookUrl('');
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, status: 'disconnected', lastSync: undefined } : i
    ));
  };

  const retryIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, status: 'pending', lastSync: new Date() } : i
    ));
    
    // Simular retry
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId ? { ...i, status: 'connected' } : i
      ));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <X className="w-4 h-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;
  const pendingCount = integrations.filter(i => i.status === 'pending').length;

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Zap className="w-6 h-6 mr-2" />
                Hub de Integrações Universal
              </h2>
              <p className="text-gray-600">
                Conecte seu evento com as melhores ferramentas e serviços
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {/* Refresh integrations */}}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </Button>
              <Button
                onClick={() => setShowSetupModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Integração</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Link className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conectadas</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Erro</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            {[
              { id: 'integrations', label: 'Integrações', icon: <Link className="w-4 h-4" /> },
              { id: 'webhooks', label: 'Webhooks', icon: <Webhook className="w-4 h-4" /> },
              { id: 'logs', label: 'Logs', icon: <Database className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'integrations' | 'webhooks' | 'logs')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          
          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>

              {/* Integrations Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {getStatusIcon(integration.status)}
                            <span className="capitalize">{integration.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Complexidade:</span>
                        <span className={`font-medium capitalize ${getComplexityColor(integration.setupComplexity)}`}>
                          {integration.setupComplexity}
                        </span>
                      </div>
                      {integration.lastSync && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Último sync:</span>
                          <span className="font-medium">
                            {integration.lastSync.toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {integration.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                          +{integration.features.length - 3} mais
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {integration.status === 'disconnected' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedIntegration(integration);
                            setShowSetupModal(true);
                          }}
                          className="flex-1"
                        >
                          Conectar
                        </Button>
                      )}
                      
                      {integration.status === 'connected' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => disconnectIntegration(integration.id)}
                            className="flex-1"
                          >
                            Desconectar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIntegration(integration);
                              setShowSetupModal(true);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {integration.status === 'error' && (
                        <Button
                          size="sm"
                          onClick={() => retryIntegration(integration.id)}
                          className="flex-1"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Tentar Novamente
                        </Button>
                      )}
                      
                      {integration.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="flex-1"
                        >
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              
              {/* Webhook Configuration */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Configuração de Webhooks</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">URL do Webhook</label>
                      <Input
                        placeholder="https://seu-site.com/webhook"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Eventos</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['rsvp.created', 'rsvp.updated', 'payment.succeeded', 'guest.updated'].map(event => (
                          <label key={event} className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button>Salvar Configuração</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Webhook Events */}
              <div className="space-y-3">
                <h3 className="font-semibold">Eventos Recentes</h3>
                {webhookEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {event.event}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'success' ? 'bg-green-100 text-green-800' :
                            event.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {event.timestamp.toLocaleString()}
                        </div>
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-blue-600">
                            Ver payload
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                            {JSON.stringify(event.payload, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Logs de Integração</h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Logs
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[
                  { time: '14:32:15', level: 'INFO', message: 'Stripe webhook received successfully', integration: 'Stripe' },
                  { time: '14:30:42', level: 'ERROR', message: 'Instagram API rate limit exceeded', integration: 'Instagram' },
                  { time: '14:28:33', level: 'INFO', message: 'Google Calendar sync completed', integration: 'Google Calendar' },
                  { time: '14:25:18', level: 'WARN', message: 'WhatsApp template approval pending', integration: 'WhatsApp' },
                  { time: '14:22:07', level: 'INFO', message: 'Mailchimp campaign sent to 156 subscribers', integration: 'Mailchimp' }
                ].map((log, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-gray-500 font-mono">{log.time}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                      log.level === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {log.level}
                    </span>
                    <span className="flex-1">{log.message}</span>
                    <span className="text-gray-500">{log.integration}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetupModal && selectedIntegration && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                {selectedIntegration.icon}
                <span className="ml-2">Configurar {selectedIntegration.name}</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Key className="w-4 h-4 inline mr-1" />
                    API Key
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Cole sua API key aqui"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {selectedIntegration.setupComplexity !== 'easy' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Webhook className="w-4 h-4 inline mr-1" />
                      Webhook URL (Opcional)
                    </label>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://seu-webhook.com/endpoint"
                    />
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Recursos Disponíveis:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {selectedIntegration.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-3 h-3 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedIntegration.setupComplexity === 'advanced' && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-yellow-800 font-medium">Configuração Avançada</p>
                        <p className="text-yellow-700 text-sm">
                          Esta integração requer configurações adicionais. Consulte a documentação para mais detalhes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSetupModal(false);
                    setSelectedIntegration(null);
                    setApiKey('');
                    setWebhookUrl('');
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => connectIntegration(selectedIntegration)}
                  disabled={isConnecting || !apiKey}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      {selectedIntegration.status === 'connected' ? 'Atualizar' : 'Conectar'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
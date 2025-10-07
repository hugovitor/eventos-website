import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import {
  Bell,
  BellRing,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Send,
  Settings,
  Plus,
  X,
  Check,
  CheckCircle,
  Zap,
  Eye,
  Volume2,
  Vibrate,
  Users
} from 'lucide-react';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'rsvp' | 'reminder' | 'update' | 'milestone' | 'deadline' | 'custom';
  condition: {
    type: 'time_before' | 'count_reached' | 'date_specific' | 'behavior';
    value: string | number;
    comparison?: 'equals' | 'greater' | 'less';
  };
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  recipients: 'all' | 'confirmed' | 'pending' | 'hosts' | 'custom';
  customRecipients?: string[];
  template: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  frequency?: 'once' | 'daily' | 'weekly';
}

interface NotificationHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  sentAt: Date;
  channel: string;
  recipients: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  status: 'sent' | 'failed' | 'scheduled';
}

interface NotificationSettings {
  globalEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  channels: {
    email: { enabled: boolean; frequency: 'immediate' | 'hourly' | 'daily' };
    sms: { enabled: boolean; frequency: 'immediate' | 'hourly' | 'daily' };
    push: { enabled: boolean; frequency: 'immediate' | 'hourly' | 'daily' };
    in_app: { enabled: boolean; frequency: 'immediate' | 'hourly' | 'daily' };
  };
  preferences: {
    sound: boolean;
    vibration: boolean;
    preview: boolean;
    grouping: boolean;
  };
}

const defaultNotificationRules: NotificationRule[] = [
  {
    id: '1',
    name: 'Lembrete 7 dias antes',
    description: 'Envia lembrete uma semana antes do evento',
    trigger: 'reminder',
    condition: { type: 'time_before', value: 7 },
    channels: ['email', 'push'],
    recipients: 'confirmed',
    template: 'reminder_7_days',
    isActive: true,
    priority: 'medium'
  },
  {
    id: '2',
    name: 'Confirmação de RSVP',
    description: 'Agradece confirmação de presença',
    trigger: 'rsvp',
    condition: { type: 'behavior', value: 'confirmed' },
    channels: ['email', 'sms'],
    recipients: 'all',
    template: 'rsvp_confirmation',
    isActive: true,
    priority: 'high'
  },
  {
    id: '3',
    name: 'Meta de 100 confirmações',
    description: 'Celebra quando atingir 100 RSVPs',
    trigger: 'milestone',
    condition: { type: 'count_reached', value: 100, comparison: 'equals' },
    channels: ['email', 'push', 'in_app'],
    recipients: 'hosts',
    template: 'milestone_100',
    isActive: true,
    priority: 'high'
  }
];

export const SmartNotificationCenter: React.FC<{
  eventId: string;
  className?: string;
}> = ({ className = '' }) => {
  const [rules, setRules] = useState<NotificationRule[]>(defaultNotificationRules);
  const [history, setHistory] = useState<NotificationHistory[]>([
    {
      id: '1',
      ruleId: '1',
      ruleName: 'Lembrete 7 dias antes',
      sentAt: new Date(Date.now() - 86400000),
      channel: 'email',
      recipients: 156,
      deliveryRate: 98.7,
      openRate: 72.4,
      clickRate: 45.2,
      status: 'sent'
    },
    {
      id: '2',
      ruleId: '2',
      ruleName: 'Confirmação de RSVP',
      sentAt: new Date(Date.now() - 3600000),
      channel: 'sms',
      recipients: 23,
      deliveryRate: 100,
      openRate: 95.6,
      clickRate: 0,
      status: 'sent'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    globalEnabled: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    channels: {
      email: { enabled: true, frequency: 'immediate' },
      sms: { enabled: true, frequency: 'immediate' },
      push: { enabled: true, frequency: 'immediate' },
      in_app: { enabled: true, frequency: 'immediate' }
    },
    preferences: {
      sound: true,
      vibration: true,
      preview: true,
      grouping: false
    }
  });

  const [activeTab, setActiveTab] = useState<'rules' | 'history' | 'settings'>('rules');
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    name: '',
    description: '',
    trigger: 'reminder',
    channels: ['email'],
    recipients: 'all',
    priority: 'medium',
    isActive: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Simular notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: NotificationHistory = {
          id: Date.now().toString(),
          ruleId: rules[Math.floor(Math.random() * rules.length)].id,
          ruleName: rules[Math.floor(Math.random() * rules.length)].name,
          sentAt: new Date(),
          channel: ['email', 'sms', 'push'][Math.floor(Math.random() * 3)],
          recipients: Math.floor(Math.random() * 100) + 10,
          deliveryRate: 95 + Math.random() * 5,
          openRate: 60 + Math.random() * 30,
          clickRate: 20 + Math.random() * 40,
          status: 'sent'
        };
        setHistory(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [rules]);

  const createRule = () => {
    if (!newRule.name || !newRule.description) return;

    const rule: NotificationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      trigger: newRule.trigger || 'reminder',
      condition: { type: 'time_before', value: 1 },
      channels: newRule.channels || ['email'],
      recipients: newRule.recipients || 'all',
      template: 'default',
      isActive: newRule.isActive || true,
      priority: newRule.priority || 'medium'
    };

    setRules(prev => [...prev, rule]);
    setNewRule({});
    setShowCreateRule(false);
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Smartphone className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredHistory = history.filter(notification => {
    const matchesSearch = notification.ruleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = filterChannel === 'all' || notification.channel === filterChannel;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const totalSent = history.reduce((sum, n) => sum + n.recipients, 0);
  const avgDeliveryRate = history.reduce((sum, n) => sum + n.deliveryRate, 0) / history.length;
  const avgOpenRate = history.reduce((sum, n) => sum + n.openRate, 0) / history.length;

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <BellRing className="w-6 h-6 mr-2" />
                Central de Notificações Inteligente
              </h2>
              <p className="text-gray-600">
                Gerencie notificações automáticas e personalizadas
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  settings.globalEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {settings.globalEnabled ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <Button
                onClick={() => setShowCreateRule(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Regra</span>
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
                <p className="text-sm font-medium text-gray-600">Total Enviado</p>
                <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
              </div>
              <Send className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Entrega</p>
                <p className="text-2xl font-bold">{avgDeliveryRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Abertura</p>
                <p className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regras Ativas</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.isActive).length}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            {[
              { id: 'rules', label: 'Regras', icon: <Settings className="w-4 h-4" /> },
              { id: 'history', label: 'Histórico', icon: <Clock className="w-4 h-4" /> },
              { id: 'settings', label: 'Configurações', icon: <Bell className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'rules' | 'history' | 'settings')}
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
          
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {rules.map((rule) => (
                <motion.div
                  key={rule.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                          {rule.priority}
                        </span>
                        <div className="flex space-x-1">
                          {rule.channels.map(channel => (
                            <div key={channel} className="p-1 bg-gray-100 rounded">
                              {getChannelIcon(channel)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Trigger: {rule.trigger}</span>
                        <span>Destinatários: {rule.recipients}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {rule.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar notificações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">Todos os canais</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">Todos os status</option>
                  <option value="sent">Enviado</option>
                  <option value="failed">Falhou</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>

              {/* History List */}
              <div className="space-y-3">
                {filteredHistory.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(notification.channel)}
                          <h4 className="font-medium">{notification.ruleName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                            notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                          <span>Enviado: {notification.sentAt.toLocaleString()}</span>
                          <span>Destinatários: {notification.recipients}</span>
                          <span>Entrega: {notification.deliveryRate.toFixed(1)}%</span>
                          <span>Abertura: {notification.openRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Global Settings */}
              <div>
                <h3 className="font-semibold mb-4">Configurações Globais</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span>Notificações Ativas</span>
                    <button
                      onClick={() => setSettings(prev => ({...prev, globalEnabled: !prev.globalEnabled}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.globalEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.globalEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span>Horário Silencioso</span>
                    <button
                      onClick={() => setSettings(prev => ({
                        ...prev, 
                        quietHours: {...prev.quietHours, enabled: !prev.quietHours.enabled}
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>

                  {settings.quietHours.enabled && (
                    <div className="flex items-center space-x-4 ml-4">
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          quietHours: {...prev.quietHours, start: e.target.value}
                        }))}
                        className="w-32"
                      />
                      <span>até</span>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          quietHours: {...prev.quietHours, end: e.target.value}
                        }))}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Channel Settings */}
              <div>
                <h3 className="font-semibold mb-4">Canais de Notificação</h3>
                <div className="space-y-4">
                  {Object.entries(settings.channels).map(([channel, config]) => (
                    <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(channel)}
                        <span className="font-medium capitalize">{channel}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select
                          value={config.frequency}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            channels: {
                              ...prev.channels,
                              [channel]: {...config, frequency: e.target.value as 'immediate' | 'hourly' | 'daily'}
                            }
                          }))}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          <option value="immediate">Imediato</option>
                          <option value="hourly">A cada hora</option>
                          <option value="daily">Diário</option>
                        </select>
                        <button
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            channels: {
                              ...prev.channels,
                              [channel]: {...config, enabled: !config.enabled}
                            }
                          }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="font-semibold mb-4">Preferências</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.preferences).map(([pref, enabled]) => (
                    <label key={pref} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        {pref === 'sound' && <Volume2 className="w-4 h-4" />}
                        {pref === 'vibration' && <Vibrate className="w-4 h-4" />}
                        {pref === 'preview' && <Eye className="w-4 h-4" />}
                        {pref === 'grouping' && <Users className="w-4 h-4" />}
                        <span className="capitalize">{pref}</span>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          preferences: {...prev.preferences, [pref]: !enabled}
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Rule Modal */}
      <AnimatePresence>
        {showCreateRule && (
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
              <h3 className="text-lg font-semibold mb-4">Criar Nova Regra</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Regra</label>
                  <Input
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule(prev => ({...prev, name: e.target.value}))}
                    placeholder="Ex: Lembrete 24h antes"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={newRule.description || ''}
                    onChange={(e) => setNewRule(prev => ({...prev, description: e.target.value}))}
                    className="w-full p-2 border rounded-lg resize-none"
                    rows={3}
                    placeholder="Descreva quando e como esta notificação será enviada"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trigger</label>
                    <select
                      value={newRule.trigger || 'reminder'}
                      onChange={(e) => setNewRule(prev => ({...prev, trigger: e.target.value as 'reminder' | 'rsvp' | 'update' | 'milestone' | 'deadline'}))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="reminder">Lembrete</option>
                      <option value="rsvp">RSVP</option>
                      <option value="update">Atualização</option>
                      <option value="milestone">Marco</option>
                      <option value="deadline">Prazo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Prioridade</label>
                    <select
                      value={newRule.priority || 'medium'}
                      onChange={(e) => setNewRule(prev => ({...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent'}))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Canais</label>
                  <div className="flex flex-wrap gap-2">
                    {['email', 'sms', 'push', 'in_app'].map(channel => (
                      <label key={channel} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newRule.channels?.includes(channel as 'email' | 'sms' | 'push' | 'in_app') || false}
                          onChange={(e) => {
                            const channels = newRule.channels || [];
                            setNewRule(prev => ({
                              ...prev,
                              channels: e.target.checked
                                ? [...channels, channel as 'email' | 'sms' | 'push' | 'in_app']
                                : channels.filter(c => c !== channel)
                            }));
                          }}
                        />
                        <span className="capitalize">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateRule(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={createRule}
                  disabled={!newRule.name || !newRule.description}
                >
                  Criar Regra
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
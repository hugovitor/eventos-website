import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import {
  Users,
  UserPlus,
  MessageCircle,
  Eye,
  Edit3,
  Crown,
  Clock,
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  PhoneOff,
  Zap,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

interface CollaboratorStatus {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  currentAction?: string;
  cursorPosition?: { x: number; y: number };
}

interface RealtimeActivity {
  id: string;
  userId: string;
  userName: string;
  action: 'edit' | 'comment' | 'view' | 'join' | 'leave' | 'share';
  target: string;
  details: string;
  timestamp: Date;
}

interface VideoCallState {
  isActive: boolean;
  participants: CollaboratorStatus[];
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'notification';
}

export const RealtimeCollaboration: React.FC<{
  eventId: string;
  currentUser: CollaboratorStatus;
  onInviteUser: (email: string, role: string) => void;
  className?: string;
}> = ({ currentUser, onInviteUser, className = '' }) => {
  const [collaborators] = useState<CollaboratorStatus[]>([
    {
      id: '1',
      name: 'Ana Silva',
      avatar: 'https://picsum.photos/100/100?random=10',
      email: 'ana@exemplo.com',
      role: 'editor',
      status: 'online',
      lastSeen: new Date(),
      currentAction: 'Editando convite'
    },
    {
      id: '2',
      name: 'Carlos Santos',
      avatar: 'https://picsum.photos/100/100?random=11',
      email: 'carlos@exemplo.com',
      role: 'viewer',
      status: 'away',
      lastSeen: new Date(Date.now() - 300000),
      currentAction: 'Visualizando lista de convidados'
    }
  ]);

  const [activities, setActivities] = useState<RealtimeActivity[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Ana Silva',
      action: 'edit',
      target: 'Template Design',
      details: 'Alterou as cores do tema',
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      userId: '2',
      userName: 'Carlos Santos',
      action: 'comment',
      target: 'Lista de Convidados',
      details: 'Adicionou comentário sobre buffet',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const [videoCall, setVideoCall] = useState<VideoCallState>({
    isActive: false,
    participants: [],
    isAudioEnabled: true,
    isVideoEnabled: true,
    isScreenSharing: false
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Ana Silva',
      message: 'Olá! Que tal trocarmos a cor principal para dourado?',
      timestamp: new Date(Date.now() - 600000),
      type: 'text'
    },
    {
      id: '2',
      userId: 'system',
      userName: 'Sistema',
      message: 'Carlos Santos entrou na colaboração',
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [isConnected] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simular conexão WebSocket
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular atividade aleatória
      if (Math.random() > 0.8) {
        const actions = ['edit', 'view', 'comment'] as const;
        const targets = ['Template', 'Lista de Convidados', 'Configurações', 'Presentes'];
        const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
        
        const newActivity: RealtimeActivity = {
          id: Date.now().toString(),
          userId: randomCollaborator.id,
          userName: randomCollaborator.name,
          action: actions[Math.floor(Math.random() * actions.length)],
          target: targets[Math.floor(Math.random() * targets.length)],
          details: 'Ação em tempo real',
          timestamp: new Date()
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [collaborators]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const startVideoCall = () => {
    setVideoCall(prev => ({
      ...prev,
      isActive: true,
      participants: [currentUser, ...collaborators.filter(c => c.status === 'online')]
    }));
  };

  const endVideoCall = () => {
    setVideoCall(prev => ({
      ...prev,
      isActive: false,
      participants: []
    }));
  };

  const toggleAudio = () => {
    setVideoCall(prev => ({
      ...prev,
      isAudioEnabled: !prev.isAudioEnabled
    }));
  };

  const toggleVideo = () => {
    setVideoCall(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
  };

  const toggleScreenShare = () => {
    setVideoCall(prev => ({
      ...prev,
      isScreenSharing: !prev.isScreenSharing
    }));
  };

  const handleInvite = () => {
    if (inviteEmail) {
      onInviteUser(inviteEmail, inviteRole);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'editor': return <Edit3 className="w-3 h-3 text-blue-500" />;
      default: return <Eye className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Status Bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {collaborators.filter(c => c.status === 'online').length} online
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!videoCall.isActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startVideoCall}
                  className="flex items-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Videochamada</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={videoCall.isAudioEnabled ? "outline" : "secondary"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {videoCall.isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={videoCall.isVideoEnabled ? "outline" : "secondary"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {videoCall.isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={videoCall.isScreenSharing ? "primary" : "outline"}
                    size="sm"
                    onClick={toggleScreenShare}
                  >
                    <ScreenShare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={endVideoCall}
                  >
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Convidar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Collaborators Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Colaboradores ({collaborators.length + 1})
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                
                {/* Current User */}
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor('online')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{currentUser.name} (Você)</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      {getRoleIcon(currentUser.role)}
                      <span className="capitalize">{currentUser.role}</span>
                    </div>
                  </div>
                </div>

                {/* Other Collaborators */}
                {collaborators.map((collaborator) => (
                  <motion.div
                    key={collaborator.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="relative">
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{collaborator.name}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        {getRoleIcon(collaborator.role)}
                        <span className="capitalize">{collaborator.role}</span>
                      </div>
                      {collaborator.currentAction && (
                        <div className="text-xs text-blue-600 mt-1">
                          {collaborator.currentAction}
                        </div>
                      )}
                    </div>
                    {collaborator.status === 'online' && (
                      <div className="text-green-500">
                        <Zap className="w-3 h-3" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Atividades Recentes
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {activity.action === 'edit' && <Edit3 className="w-3 h-3 text-blue-500" />}
                      {activity.action === 'comment' && <MessageCircle className="w-3 h-3 text-green-500" />}
                      {activity.action === 'view' && <Eye className="w-3 h-3 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{activity.userName}</span>
                        <span className="text-gray-600"> {activity.details}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.target} • {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Panel */}
        <div className="lg:col-span-2">
          <Card className="h-96 flex flex-col">
            <CardHeader>
              <h3 className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat da Equipe
              </h3>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              
              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.type === 'system' 
                        ? 'bg-gray-100 text-gray-600 text-sm text-center w-full'
                        : message.userId === currentUser.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.type !== 'system' && message.userId !== currentUser.id && (
                        <div className="text-xs font-medium mb-1">{message.userName}</div>
                      )}
                      <div className="text-sm">{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.userId === currentUser.id ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {videoCall.isActive && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Videochamada da Equipe</h3>
                <Button variant="secondary" onClick={endVideoCall}>
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Encerrar
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {videoCall.participants.map((participant) => (
                  <div key={participant.id} className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {participant.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant={videoCall.isAudioEnabled ? "outline" : "secondary"}
                  onClick={toggleAudio}
                >
                  {videoCall.isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={videoCall.isVideoEnabled ? "outline" : "secondary"}
                  onClick={toggleVideo}
                >
                  {videoCall.isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={videoCall.isScreenSharing ? "primary" : "outline"}
                  onClick={toggleScreenShare}
                >
                  <ScreenShare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Convidar Colaborador</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colaborador@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Função</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="viewer">Visualizador</option>
                    <option value="editor">Editor</option>
                    <option value="owner">Proprietário</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  Enviar Convite
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
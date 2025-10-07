import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Eye,
  Share2,
  Download,
  Target,
  Award
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  rsvpRate: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  shareCount: number;
  downloadCount: number;
}

interface DeviceStats {
  mobile: number;
  desktop: number;
  tablet: number;
}

interface GeographicData {
  country: string;
  city: string;
  views: number;
  percentage: number;
}

interface TimeBasedData {
  hour: number;
  views: number;
  rsvps: number;
}

interface RealtimeMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

export const AdvancedAnalytics: React.FC<{
  eventId: string;
  className?: string;
}> = ({ className = '' }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 2847,
    uniqueVisitors: 1832,
    rsvpRate: 68.4,
    conversionRate: 42.1,
    avgTimeOnPage: 185,
    bounceRate: 24.7,
    shareCount: 156,
    downloadCount: 89
  });

  const [deviceStats] = useState<DeviceStats>({
    mobile: 65.4,
    desktop: 28.1,
    tablet: 6.5
  });

  const [geographicData] = useState<GeographicData[]>([
    { country: 'Brasil', city: 'São Paulo', views: 1245, percentage: 43.7 },
    { country: 'Brasil', city: 'Rio de Janeiro', views: 568, percentage: 20.0 },
    { country: 'Brasil', city: 'Belo Horizonte', views: 284, percentage: 10.0 },
    { country: 'Brasil', city: 'Porto Alegre', views: 198, percentage: 7.0 },
    { country: 'Portugal', city: 'Lisboa', views: 156, percentage: 5.5 }
  ]);

  const [hourlyData] = useState<TimeBasedData[]>([
    { hour: 8, views: 45, rsvps: 12 },
    { hour: 9, views: 78, rsvps: 23 },
    { hour: 10, views: 156, rsvps: 45 },
    { hour: 11, views: 234, rsvps: 67 },
    { hour: 12, views: 298, rsvps: 89 },
    { hour: 13, views: 345, rsvps: 98 },
    { hour: 14, views: 289, rsvps: 76 },
    { hour: 15, views: 234, rsvps: 65 },
    { hour: 16, views: 198, rsvps: 54 },
    { hour: 17, views: 167, rsvps: 43 },
    { hour: 18, views: 234, rsvps: 67 },
    { hour: 19, views: 298, rsvps: 89 },
    { hour: 20, views: 356, rsvps: 112 },
    { hour: 21, views: 289, rsvps: 87 },
    { hour: 22, views: 178, rsvps: 45 },
    { hour: 23, views: 89, rsvps: 23 }
  ]);

  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([
    {
      label: 'Visitantes Online',
      value: 23,
      change: 12.5,
      trend: 'up',
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'RSVPs Hoje',
      value: 47,
      change: 8.3,
      trend: 'up',
      icon: <Users className="w-4 h-4" />
    },
    {
      label: 'Compartilhamentos',
      value: 15,
      change: -2.1,
      trend: 'down',
      icon: <Share2 className="w-4 h-4" />
    },
    {
      label: 'Taxa de Conversão',
      value: 42.1,
      change: 3.2,
      trend: 'up',
      icon: <Target className="w-4 h-4" />
    }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isRealtime, setIsRealtime] = useState(true);

  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setRealtimeMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 3) - 1,
        change: (Math.random() - 0.5) * 20
      })));

      setAnalytics(prev => ({
        ...prev,
        totalViews: prev.totalViews + Math.floor(Math.random() * 5),
        uniqueVisitors: prev.uniqueVisitors + Math.floor(Math.random() * 3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealtime]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getMaxValue = (data: TimeBasedData[], key: 'views' | 'rsvps'): number => {
    return Math.max(...data.map(d => d[key]));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Analytics Avançado
              </h2>
              <p className="text-gray-600">
                Insights detalhados sobre o desempenho do seu evento
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Tempo Real:</label>
                <button
                  onClick={() => setIsRealtime(!isRealtime)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isRealtime ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isRealtime ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {realtimeMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500">
                    {metric.icon}
                  </div>
                  <div className={`flex items-center text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 mr-1 ${
                      metric.trend === 'down' ? 'transform rotate-180' : ''
                    }`} />
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{formatNumber(metric.value)}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Métricas Principais</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Visualizações</span>
                <span className="text-2xl font-bold">{formatNumber(analytics.totalViews)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Visitantes Únicos</span>
                <span className="text-2xl font-bold">{formatNumber(analytics.uniqueVisitors)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de RSVP</span>
                <span className="text-2xl font-bold text-green-600">{analytics.rsvpRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Conversão</span>
                <span className="text-2xl font-bold text-blue-600">{analytics.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tempo Médio na Página</span>
                <span className="text-2xl font-bold">{formatDuration(analytics.avgTimeOnPage)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Rejeição</span>
                <span className="text-2xl font-bold text-orange-600">{analytics.bounceRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Distribuição por Dispositivo</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>Mobile</span>
                </div>
                <span className="font-semibold">{deviceStats.mobile}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${deviceStats.mobile}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-green-500" />
                  <span>Desktop</span>
                </div>
                <span className="font-semibold">{deviceStats.desktop}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${deviceStats.desktop}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tablet className="w-4 h-4 text-purple-500" />
                  <span>Tablet</span>
                </div>
                <span className="font-semibold">{deviceStats.tablet}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${deviceStats.tablet}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Atividade por Hora</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Visualizações</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">RSVPs</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between space-x-1">
              {hourlyData.map((data, index) => {
                const viewHeight = (data.views / getMaxValue(hourlyData, 'views')) * 100;
                const rsvpHeight = (data.rsvps / getMaxValue(hourlyData, 'rsvps')) * 100;
                
                return (
                  <div key={data.hour} className="flex-1 flex items-end space-x-1">
                    <motion.div
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${viewHeight}%`, width: '45%' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${viewHeight}%` }}
                      transition={{ delay: index * 0.05 }}
                      title={`${data.hour}h: ${data.views} visualizações`}
                    />
                    <motion.div
                      className="bg-green-500 rounded-t"
                      style={{ height: `${rsvpHeight}%`, width: '45%' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${rsvpHeight}%` }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      title={`${data.hour}h: ${data.rsvps} RSVPs`}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6">
              {hourlyData.filter((_, i) => i % 4 === 0).map(data => (
                <span key={data.hour}>{data.hour}h</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Distribuição Geográfica
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {geographicData.map((location, index) => (
              <motion.div
                key={`${location.country}-${location.city}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{location.city}</span>
                    <span className="text-gray-500">{location.country}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(location.views)}</div>
                    <div className="text-sm text-gray-500">{location.percentage}%</div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${location.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Insights e Recomendações
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-800">Excelente Performance</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Sua taxa de RSVP está 28% acima da média. Continue compartilhando!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-800">Otimização Mobile</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    65% dos acessos são mobile. Certifique-se que tudo funciona bem em smartphones.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-medium text-orange-800">Horário de Pico</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    20h é seu horário de maior atividade. Programe posts para esse horário.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <Share2 className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-purple-800">Potencial de Crescimento</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Apenas 15 compartilhamentos hoje. Adicione incentivos para aumentar o alcance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const ConfirmEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Obter os parâmetros da URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (type === 'signup' && (token || accessToken)) {
          // Verificar o token de confirmação
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token || '',
            type: 'signup',
          });

          if (error && accessToken && refreshToken) {
            // Tentar com access token se OTP falhar
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              throw sessionError;
            }
          } else if (error) {
            throw error;
          }

          setStatus('success');
          setMessage('Email confirmado com sucesso! Você será redirecionado para o login.');
          
          // Redirecionar após 3 segundos
          setTimeout(() => {
            navigate('/login?confirmed=true');
          }, 3000);
        } else {
          throw new Error('Parâmetros de confirmação inválidos');
        }
      } catch (error: unknown) {
        console.error('Erro na confirmação:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Erro ao confirmar email. Tente novamente.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">
            {status === 'loading' && 'Confirmando Email...'}
            {status === 'success' && 'Email Confirmado!'}
            {status === 'error' && 'Erro na Confirmação'}
          </h1>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-gray-600">Processando confirmação...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <p className="text-gray-600">{message}</p>
              <div className="text-sm text-gray-500">
                Redirecionando automaticamente...
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-12 h-12 text-red-600" />
              <p className="text-gray-600">{message}</p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
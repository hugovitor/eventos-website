import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { addNotification, NotificationContainer } = useNotification();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar se chegou da confirmação de email
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('confirmed') === 'true') {
      addNotification({
        type: 'success',
        title: 'Email confirmado com sucesso!',
        message: 'Agora você pode fazer login com sua conta.'
      });
    }
  }, [addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(getErrorMessage(error));
        }
      } else {
        const { error } = await signUp(email, password, { full_name: fullName });
        if (error) {
          setError(getErrorMessage(error));
        } else {
          // Sucesso no cadastro
          setError('');
          addNotification({
            type: 'success',
            title: 'Cadastro realizado com sucesso!',
            message: 'Verifique seu email para confirmar a conta antes de fazer login.'
          });
        }
      }
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: { code?: string; message?: string }) => {
    switch (error.code) {
      case 'over_email_send_rate_limit':
        return 'Muitas tentativas de envio de email. Aguarde alguns minutos antes de tentar novamente.';
      case 'email_not_confirmed':
        return 'Email não confirmado. Verifique sua caixa de entrada e spam.';
      case 'invalid_credentials':
        return 'Email ou senha incorretos.';
      case 'weak_password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'email_already_exists':
        return 'Este email já está cadastrado. Tente fazer login.';
      case 'signup_disabled':
        return 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.';
      default:
        return error.message || 'Erro desconhecido. Tente novamente.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <NotificationContainer />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de eventos personalizados
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              {isLogin ? 'Login' : 'Cadastro'}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <Input
                  label="Nome completo"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
              
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </Button>
            </form>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin 
                  ? 'Não tem conta? Cadastre-se' 
                  : 'Já tem conta? Faça login'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { supabase, type Guest, type Event } from '../../lib/supabase';
import {
  Check, 
  Users, 
  Calendar, 
  Clock, 
  ChefHat,
  Heart,
  UserPlus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';interface RSVPFormProps {
  event: Event;
  token?: string; // Para confirmação sem login
  onSuccess?: (guest: Guest) => void;
  className?: string;
}

export const EnhancedRSVPForm: React.FC<RSVPFormProps> = ({
  event,
  token,
  onSuccess,
  className = ''
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingGuest, setExistingGuest] = useState<Guest | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    will_attend_ceremony: true,
    will_attend_reception: true,
    plus_one: false,
    plus_one_name: '',
    dietary_restrictions: '',
    plus_one_dietary_restrictions: '',
    special_requests: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkExistingRSVP = useCallback(async () => {
    if (!token) return;

    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('confirmation_token', token)
        .eq('event_id', event.id)
        .single();

      if (data && !error) {
        setExistingGuest(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          will_attend_ceremony: data.will_attend_ceremony ?? true,
          will_attend_reception: data.will_attend_reception ?? true,
          plus_one: data.plus_one || false,
          plus_one_name: data.plus_one_name || '',
          dietary_restrictions: data.dietary_restrictions || '',
          plus_one_dietary_restrictions: data.plus_one_dietary_restrictions || '',
          special_requests: data.special_requests || '',
          message: '' // message não existe no tipo Guest, removendo
        });
        if (data.confirmed) {
          setSubmitted(true);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar RSVP existente:', error);
    }
  }, [token, event.id]);

  useEffect(() => {
    if (token && event.id) {
      checkExistingRSVP();
    }
  }, [token, event.id, checkExistingRSVP]);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (stepNumber === 3 && formData.plus_one && !formData.plus_one_name.trim()) {
      newErrors.plus_one_name = 'Nome do acompanhante é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      const guestData = {
        event_id: event.id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || null,
        confirmed: true,
        confirmation_date: new Date().toISOString(),
        will_attend_ceremony: formData.will_attend_ceremony,
        will_attend_reception: formData.will_attend_reception,
        plus_one: formData.plus_one,
        plus_one_name: formData.plus_one ? formData.plus_one_name : null,
        dietary_restrictions: formData.dietary_restrictions || null,
        plus_one_dietary_restrictions: formData.plus_one ? formData.plus_one_dietary_restrictions : null,
        special_requests: formData.special_requests || null,
        message: formData.message || null,
        confirmation_token: token || crypto.randomUUID(),
        last_updated: new Date().toISOString()
      };

      let result;
      
      if (existingGuest) {
        // Atualizar existente
        result = await supabase
          .from('guests')
          .update(guestData)
          .eq('id', existingGuest.id)
          .select()
          .single();
      } else {
        // Criar novo
        result = await supabase
          .from('guests')
          .insert(guestData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setSubmitted(true);
      onSuccess?.(result.data);
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      setErrors({ submit: 'Erro ao confirmar presença. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md mx-auto ${className}`}
      >
        <Card>
          <CardContent className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmação Recebida!
            </h3>
            <p className="text-gray-600 mb-6">
              Obrigado por confirmar sua presença. Estamos ansiosos para celebrar com você!
            </p>
            
            {/* Resumo da confirmação */}
            <div className="text-left space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  {formData.name}
                  {formData.plus_one && formData.plus_one_name && ` + ${formData.plus_one_name}`}
                </span>
              </div>
              
              {event.ceremony_time && formData.will_attend_ceremony && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">Cerimônia às {event.ceremony_time}</span>
                </div>
              )}
              
              {event.reception_time && formData.will_attend_reception && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">Recepção às {event.reception_time}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-md mx-auto ${className}`}
    >
      <Card>
        <CardHeader>
          <div className="text-center">
            <h3 className="text-2xl font-bold" style={{ color: event.primary_color }}>
              Confirmar Presença
            </h3>
            <p className="text-gray-600 mt-2">{event.title}</p>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Informações</span>
                <span>Presença</span>
                <span>Acompanhante</span>
                <span>Extras</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: event.primary_color,
                    width: `${(step / 4) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Informações Básicas */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    placeholder="Seu nome completo"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    placeholder="seu@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirmação de Presença */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-gray-900">Você irá participar de:</h4>
                
                {event.ceremony_time && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium">Cerimônia</p>
                        <p className="text-sm text-gray-500">às {event.ceremony_time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        will_attend_ceremony: !formData.will_attend_ceremony 
                      })}
                      className={`p-2 rounded-full transition-colors ${
                        formData.will_attend_ceremony 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {event.reception_time && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium">Recepção</p>
                        <p className="text-sm text-gray-500">às {event.reception_time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        will_attend_reception: !formData.will_attend_reception 
                      })}
                      className={`p-2 rounded-full transition-colors ${
                        formData.will_attend_reception 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {(!formData.will_attend_ceremony && !formData.will_attend_reception) && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                      <p className="text-sm text-amber-800">
                        Você não poderá participar de nenhuma parte do evento?
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Acompanhante */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-gray-900">Acompanhante</h4>
                
                {event.allow_plus_one ? (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <UserPlus className="w-5 h-5 mr-3 text-gray-500" />
                        <span>Levar acompanhante?</span>
                      </div>
                      <button
                        onClick={() => setFormData({ 
                          ...formData, 
                          plus_one: !formData.plus_one,
                          plus_one_name: !formData.plus_one ? '' : formData.plus_one_name
                        })}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          formData.plus_one 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {formData.plus_one ? 'Sim' : 'Não'}
                      </button>
                    </div>

                    {formData.plus_one && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Acompanhante *
                        </label>
                        <Input
                          value={formData.plus_one_name}
                          onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                          error={errors.plus_one_name}
                          placeholder="Nome do acompanhante"
                          className="w-full"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 border rounded-lg text-center">
                    <p className="text-sm text-gray-600">
                      Este evento não permite acompanhantes
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Informações Extras */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-gray-900">Informações Adicionais</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <ChefHat className="w-4 h-4 inline mr-1" />
                    Restrições Alimentares
                  </label>
                  <Input
                    value={formData.dietary_restrictions}
                    onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                    placeholder="Ex: Vegetariano, alergia a frutos do mar..."
                    className="w-full"
                  />
                </div>

                {formData.plus_one && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restrições do Acompanhante
                    </label>
                    <Input
                      value={formData.plus_one_dietary_restrictions}
                      onChange={(e) => setFormData({ ...formData, plus_one_dietary_restrictions: e.target.value })}
                      placeholder="Restrições alimentares do acompanhante"
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solicitações Especiais
                  </label>
                  <textarea
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    placeholder="Cadeira especial, necessidades de acessibilidade..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Mensagem para os Noivos
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Deixe uma mensagem carinhosa..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Voltar
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  style={{ backgroundColor: event.primary_color }}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ backgroundColor: event.primary_color }}
                >
                  {loading ? 'Confirmando...' : 'Confirmar Presença'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
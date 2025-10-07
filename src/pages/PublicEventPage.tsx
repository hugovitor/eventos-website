import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, type Event, type Guest, type Gift } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { PhotoGallery } from '../components/ui/PhotoGallery';
import { useEventPhotos } from '../hooks/useEventPhotos';
import { Calendar, MapPin, Gift as GiftIcon, Users, Heart } from 'lucide-react';

export const PublicEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
    plus_one: false
  });
  const [showGuestForm, setShowGuestForm] = useState(false);
  
  // Hook para carregar fotos reais do banco
  const { photos: eventPhotos } = useEventPhotos(eventId || '');

  const fetchEventData = useCallback(async () => {
    try {
      // Buscar dados do evento
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('is_public', true)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Buscar convidados confirmados
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .eq('confirmed', true);

      if (guestsError) throw guestsError;
      setGuests(guestsData || []);

      // Buscar lista de presentes
      const { data: giftsData, error: giftsError } = await supabase
        .from('gifts')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (giftsError) throw giftsError;
      setGifts(giftsData || []);
    } catch (error) {
      console.error('Erro ao buscar dados do evento:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId, fetchEventData]);

  const handleGuestConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    try {
      const { error } = await supabase
        .from('guests')
        .insert([
          {
            ...guestForm,
            event_id: eventId,
            confirmed: true
          }
        ]);

      if (error) throw error;

      setGuestForm({ name: '', email: '', phone: '', plus_one: false });
      setShowGuestForm(false);
      fetchEventData(); // Recarregar dados
      alert('Presença confirmada com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      alert('Erro ao confirmar presença. Tente novamente.');
    }
  };

  const handleGiftReservation = async (giftId: string, guestName: string) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({
          reserved_by: guestName,
          reserved_at: new Date().toISOString()
        })
        .eq('id', giftId);

      if (error) throw error;

      fetchEventData(); // Recarregar dados
      alert('Presente reservado com sucesso!');
    } catch (error) {
      console.error('Erro ao reservar presente:', error);
      alert('Erro ao reservar presente. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Evento não encontrado
          </h1>
          <p className="text-gray-600">
            O evento que você está procurando não existe ou não está público.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${event.primary_color}20 0%, ${event.secondary_color}20 100%)` 
      }}
    >
      {/* Hero Section */}
      <div 
        className="relative py-20 px-4"
        style={{
          background: `linear-gradient(135deg, ${event.primary_color} 0%, ${event.secondary_color} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          {event.cover_image && (
            <img
              src={event.cover_image}
              alt="Capa do evento"
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white"
            />
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {event.title}
          </h1>
          
          {event.description && (
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {event.description}
            </p>
          )}

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-lg">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              {new Date(event.event_date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            {event.location && (
              <div className="flex items-center">
                <MapPin className="h-6 w-6 mr-2" />
                {event.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
        
        {/* Confirmar Presença */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-3" style={{ color: event.primary_color }} />
              <h2 className="text-2xl font-bold">Confirmar Presença</h2>
            </div>
          </CardHeader>
          <CardContent>
            {!showGuestForm ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">
                  Confirme sua presença para este evento especial!
                </p>
                <Button 
                  onClick={() => setShowGuestForm(true)}
                  style={{ backgroundColor: event.primary_color }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Confirmar Presença
                </Button>
              </div>
            ) : (
              <form onSubmit={handleGuestConfirmation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome completo *"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <Input
                  label="Telefone"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="plus_one"
                    checked={guestForm.plus_one}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, plus_one: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="plus_one" className="text-sm text-gray-700">
                    Vou levar acompanhante (+1)
                  </label>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit"
                    style={{ backgroundColor: event.primary_color }}
                  >
                    Confirmar
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowGuestForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Lista de Convidados */}
        {guests.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Quem vai estar lá</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{guest.name}</p>
                      {guest.plus_one && (
                        <p className="text-sm text-gray-500">+ acompanhante</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Presentes */}
        {gifts.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <GiftIcon className="h-6 w-6 mr-3" style={{ color: event.primary_color }} />
                <h2 className="text-2xl font-bold">Lista de Presentes</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                  <Card key={gift.id} className="overflow-hidden">
                    {gift.image && (
                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{gift.name}</h3>
                      {gift.description && (
                        <p className="text-gray-600 text-sm mb-3">{gift.description}</p>
                      )}
                      {gift.price && (
                        <p className="text-lg font-bold mb-3" style={{ color: event.primary_color }}>
                          R$ {gift.price.toFixed(2)}
                        </p>
                      )}
                      
                      {gift.reserved_by ? (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500">
                            Reservado por {gift.reserved_by}
                          </span>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          style={{ backgroundColor: event.primary_color }}
                          onClick={() => {
                            const guestName = prompt('Digite seu nome para reservar este presente:');
                            if (guestName) {
                              handleGiftReservation(gift.id, guestName);
                            }
                          }}
                        >
                          Reservar Presente
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Galeria de Fotos */}
        <PhotoGallery
          eventId={event.id}
          isPublic={true}
          photos={eventPhotos}
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-gray-400">
            Página criada com ❤️ para {event.title}
          </p>
        </div>
      </footer>
    </div>
  );
};
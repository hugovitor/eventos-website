import React from 'react';

export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Teste do Tailwind CSS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Card 1</h2>
            <p className="text-gray-600">Este é um teste para verificar se o Tailwind CSS está funcionando corretamente.</p>
          </div>
          
          <div className="bg-blue-500 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-semibold mb-4">Card 2</h2>
            <p>Card com fundo azul para testar as cores.</p>
          </div>
          
          <div className="bg-green-500 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-semibold mb-4">Card 3</h2>
            <p>Card com fundo verde para testar mais cores.</p>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Botão Primário
          </button>
          
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors ml-4">
            Botão Secundário
          </button>
        </div>
        
        <div className="mt-8 p-4 border-l-4 border-yellow-400 bg-yellow-50">
          <p className="text-yellow-800">
            <strong>Aviso:</strong> Se você está vendo estilos aplicados nesta página, o Tailwind CSS está funcionando corretamente!
          </p>
        </div>
      </div>
    </div>
  );
};
#!/bin/bash

# Script para aplicar migração do Template System
# Use este script para aplicar a migração via CLI do Supabase

echo "🚀 Aplicando migração do Template System..."

# Verificar se supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado. Instale com:"
    echo "npm install -g supabase"
    echo "ou siga as instruções em: https://supabase.com/docs/reference/cli/installing"
    exit 1
fi

# Verificar se estamos em um projeto Supabase
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Este não parece ser um projeto Supabase inicializado."
    echo "Execute: supabase init"
    exit 1
fi

# Aplicar migração
echo "📁 Aplicando migração..."
supabase db push --db-url $SUPABASE_DB_URL

if [ $? -eq 0 ]; then
    echo "✅ Migração aplicada com sucesso!"
    echo "🎉 Agora você pode usar todas as funcionalidades de template."
else
    echo "❌ Erro ao aplicar migração. Verifique suas credenciais e tente novamente."
    echo "💡 Alternativamente, use o SQL Editor no dashboard do Supabase."
fi
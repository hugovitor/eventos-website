@echo off
echo 🚀 Aplicando migração do Template System...

REM Verificar se supabase CLI está instalado
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI não encontrado. Instale com:
    echo npm install -g supabase
    echo ou siga as instruções em: https://supabase.com/docs/reference/cli/installing
    exit /b 1
)

REM Verificar se estamos em um projeto Supabase
if not exist "supabase\config.toml" (
    echo ❌ Este não parece ser um projeto Supabase inicializado.
    echo Execute: supabase init
    exit /b 1
)

REM Aplicar migração
echo 📁 Aplicando migração...
supabase db push --db-url %SUPABASE_DB_URL%

if %errorlevel% equ 0 (
    echo ✅ Migração aplicada com sucesso!
    echo 🎉 Agora você pode usar todas as funcionalidades de template.
) else (
    echo ❌ Erro ao aplicar migração. Verifique suas credenciais e tente novamente.
    echo 💡 Alternativamente, use o SQL Editor no dashboard do Supabase.
)

pause
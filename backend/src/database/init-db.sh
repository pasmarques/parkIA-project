#!/bin/sh
set -e

# ==========================================
# Script de Inicialização de Banco de Dados
# ==========================================

echo "Iniciando setup do banco de dados..."

# 1. Detecção de Ambiente
# ------------------------
if [ "$NODE_ENV" = "production" ]; then
  echo "🌍 Modo: PRODUÇÃO"
  MIGRATE_CMD="npm run migrate:prod"
  SEED_CMD="npm run seed:prod"
else
  echo "🛠️  Modo: DESENVOLVIMENTO/TESTE"
  MIGRATE_CMD="npm run migrate"
  SEED_CMD="npm run seed"
fi

# 2. Aguarda Banco de Dados (Retry Logic)
# ---------------------------------------
MAX_RETRIES=30
RETRY_COUNT=0

echo "⏳ Aguardando banco de dados ficar disponível..."
until $MIGRATE_CMD > /dev/null 2>&1; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "❌ Erro: Banco de dados indisponível após $MAX_RETRIES tentativas."
    echo "   Verifique se o container do Postgres está rodando e as credenciais estão corretas."
    exit 1
  fi
  
  echo "   ...tentativa $RETRY_COUNT/$MAX_RETRIES falhou. Tentando novamente em 2s..."
  sleep 2
done

# 3. Execução Real das Migrations (com logs visíveis agora)
# ---------------------------------------------------------
echo "Conexão estabelecida! Rodando migrações..."
$MIGRATE_CMD

# 4. Execução dos Seeds (Opcional, não falha o script se der erro)
# ---------------------------------------------------------------
echo "Rodando seeds..."
$SEED_CMD || echo "⚠️  Aviso: Seeds falharam ou já foram aplicados. Continuando..."

echo "Inicialização do banco concluída com sucesso!"

# 5. Executa o comando passado como argumento (Inicia a App)
# ----------------------------------------------------------
if [ $# -gt 0 ]; then
  echo "🚀 Iniciando aplicação: $@"
  exec "$@"
fi

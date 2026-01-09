# ParkIA - Sistema de Gerenciamento de Estacionamentos

O **ParkIA** é uma solução completa para gerenciamento de estacionamentos, composta por um backend robusto em NestJS e um frontend moderno em React.

## 🚀 Demonstração Online

Você pode acessar a aplicação rodando em produção aqui:
👉 **[Acessar ParkIA - Demo Online](https://park-ia-project-ai01ip5x8-pedrivis-projects.vercel.app/)**

### ⚠️ Observação Importante (Limitações do Servidor Gratuito)

O backend desta aplicação está hospedado no plano gratuito do **Render**. Devido às políticas deste plano, o serviço entra em modo de suspensão (dormência) após **15 minutos de inatividade**.

**Impacto para o usuário:**
- O primeiro acesso (login ou carregamento de dados) pode levar de **50 segundos a 1 minuto** para ser processado.
- Esse fenômeno é conhecido como **"Cold Start"** (Inicialização a Frio).
- Após o servidor "acordar", a performance volta ao normal e o sistema responde rapidamente.

Se o carregamento inicial parecer lento, por favor, aguarde um momento. ☕

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js para aplicações escaláveis.
- **TypeORM**: ORM para interação com banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Containerização.

### Frontend
- **React**: Biblioteca para interfaces de usuário.
- **TypeScript**: Tipagem estática para maior segurança.
- **Tailwind CSS**: Estilização utilitária.
- **shadcn/ui**: Componentes de UI acessíveis e modernos.
- **TanStack Query**: Gerenciamento de estado do servidor e cache.

---

## 🐳 Como Rodar Localmente (Via Docker)

A maneira mais simples de testar a aplicação é utilizando o Docker Compose. Isso subirá o banco de dados, o backend e o frontend automaticamente.

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/parkia.git
   cd parkia
   ```

2. **Execute a aplicação:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse:**
   - **Frontend:** [http://localhost](http://localhost)
   - **Backend API:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
   - **Documentação API (Swagger):** [http://localhost:3000/api](http://localhost:3000/api)

> **Nota:** O build inicial pode levar alguns minutos. O frontend estará disponível na porta 80 e o backend na porta 3000.

---

## 💻 Como Rodar Manualmente (Sem Docker)

Se preferir rodar cada serviço individualmente:

### 1. Banco de Dados
Certifique-se de ter um PostgreSQL rodando e configure as variáveis de ambiente no arquivo `.env` do backend.

### 2. Backend
```bash
cd backend
npm install
# Configure o .env com suas credenciais do banco
npm run start:dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deploy (Guia de Implantação)

### Backend (Render.com)
O backend está hospedado no Render, que oferece suporte nativo a Node.js e PostgreSQL.
1. Crie um Web Service conectado ao repositório.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start:prod`
4. Defina as variáveis de ambiente (`DB_HOST`, `DB_PASSWORD`, etc).

### Frontend (Vercel)
O frontend está hospedado na Vercel.
1. Importe o projeto do GitHub.
2. Defina a variável de ambiente `VITE_API_URL` apontando para a URL do backend no Render.
3. O deploy é automático.

---

## 📄 Documentação Técnica

Para detalhes aprofundados sobre as decisões arquiteturais, consulte os READMEs específicos:
- [Documentação do Backend](./backend/README.md)
- [Documentação do Frontend](./frontend/README.md)

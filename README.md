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
   - **Frontend:** [http://localhost:8080](http://localhost:8080)
   - **Backend API:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
   - **Documentação API (Swagger):** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
     > 💡 **Dica:** Para verificar **exemplos de uso da API**, esquemas de dados e realizar testes, utilize a documentação interativa do Swagger.

> **Nota:** O build inicial pode levar alguns minutos. O frontend estará disponível na porta 8080 e o backend na porta 3000.

---

## 💻 Como Rodar Manualmente (Sem Docker)

Se preferir rodar cada serviço individualmente (ambiente de desenvolvimento):

### 1. Banco de Dados
Certifique-se de ter um PostgreSQL rodando em sua máquina. Crie um banco de dados chamado `parkia_db`.

### 2. Backend
1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz da pasta `backend` com a conexão do banco:
    ```env
    DATABASE_URL=postgres://seu_usuario:sua_senha@localhost:5432/parkia_db
    PORT=3000
    ```
4.  Execute as migrações (criar tabelas) e seeds (dados iniciais):
    ```bash
    npm run migration:run
    npm run seed
    ```
5.  Inicie o servidor:
    ```bash
    npm run start:dev
    ```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Acessando a Aplicação
Após iniciar os serviços, você pode acessar:

- **Frontend:** [http://localhost:5173](http://localhost:5173) (ou a porta indicada no terminal)
- **API:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Documentação Swagger:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
  > 💡 **Dica:** Utilize o Swagger para visualizar **exemplos de requisições**, respostas e testar os endpoints da API.

---

## 📄 Documentação Técnica

Para detalhes aprofundados sobre as decisões arquiteturais, consulte os READMEs específicos:
- [Documentação do Backend](./backend/README.md)
- [Documentação do Frontend](./frontend/README.md)

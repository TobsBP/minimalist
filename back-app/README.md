# Minimalist Store — Backend

API REST desenvolvida em Spring Boot para o e-commerce Minimalist Store.
Este serviço expõe endpoints JSON consumidos pelo frontend.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Spring Boot 3.4 |
| Linguagem | Java 21 |
| Banco de dados | PostgreSQL 16 |
| ORM | Spring Data JPA (Hibernate) |
| Segurança | Spring Security + JWT |
| OAuth2 | Spring Security OAuth2 Client (Google) |
| Build | Maven |
| Ambiente local | Docker + Docker Compose |

---

## Pré-requisitos

- [Java 21+](https://adoptium.net/)
- [Docker](https://www.docker.com/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) (recomendado ou vscode ou outra IDE compativel)

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/TobsBP/minimalist.git
cd back-app
```

### 2. Suba o banco de dados

```bash
docker-compose up -d
```

Isso irá criar um container PostgreSQL com:

- **Host:** localhost
- **Porta:** 5432
- **Banco:** minimalist_store
- **Usuário:** postgres
- **Senha:** postgres

### 3. Rode o projeto

Pela IDE: clique em **Run** na classe `BackAppApplication.java`

Ou pelo terminal:

```bash
./mvnw spring-boot:run
```

Necessario criar uma .env

``` exemplo
DB_URL=url
DB_USERNAME=username
DB_PASSWORD=password
```

A API estará disponível em:

```
http://localhost:8080
```

---

## Estrutura do projeto

```
src/main/java/com/minimalist/backapp/
├── config/        # Configurações (Security, CORS, JWT)
├── auth/          # Autenticação (login, registro, OAuth2)
├── user/          # Usuários
├── product/       # Produtos e categorias
├── cart/          # Carrinho de compras
├── order/         # Pedidos
└── common/        # Exceções, DTOs base, paginação
```

---

## Módulos planejados

- [x] Configuração inicial do projeto
- [x] Docker Compose com PostgreSQL
- [x] Autenticação com JWT
- [x] CRUD de produtos com filtros
- [ ] Carrinho de compras
- [ ] Pedidos e checkout
- [ ] Login com Google (OAuth2) (opcional, menor prioridade)

---

## Endpoints disponíveis

A API se comunica via JSON e usa autenticação JWT para as rotas protegidas. Todas as chamadas autenticadas devem incluir o cabeçalho:

```http
Authorization: Bearer <token>
```

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/user/register` | Registra um novo usuário |
| POST | `/user/login` | Faz login e retorna token JWT |

Exemplo `POST /user/register`:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "USER",
  "cpf": "123.456.789-00",
  "dateOfBirth": "1990-01-01",
  "phone": "+5511999999999",
  "address": "Rua Exemplo, 123",
  "nationality": "BR"
}
```

Exemplo `POST /user/login`:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| GET | `/user` | Lista usuários (requer autenticação) |
| DELETE | `/user/delete` | Deleta um usuário por ID (requer autenticação) |

Exemplo `DELETE /user/delete`:
```json
{
  "id": "uuid-do-usuario"
}
```

### Produtos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/{id}` | Busca produto por ID |
| POST | `/products` | Cria produto (requer autenticação) |
| DELETE | `/products/{id}` | Remove produto por ID (requer autenticação) |

Exemplo `POST /products`:
```json
{
  "name": "Camiseta Minimalista",
  "material": "Algodão",
  "price": 99.90,
  "imageUrl": "https://example.com/image.jpg",
  "category": "CLOTHING"
}
```

### Carrinho
| Método | Rota | Descrição |
|---|---|---|
| GET | `/cart` | Retorna o carrinho do usuário autenticado |
| POST | `/cart/items` | Adiciona item ao carrinho |
| PUT | `/cart/items/{itemId}` | Atualiza quantidade de um item no carrinho |
| DELETE | `/cart/items/{itemId}` | Remove item do carrinho |
| DELETE | `/cart` | Limpa o carrinho do usuário |

Exemplo `POST /cart/items`:
```json
{
  "productId": 1,
  "quantity": 2
}
```

Exemplo `PUT /cart/items/{itemId}`:
```json
{
  "quantity": 3
}
```

### Pedidos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/orders/checkout` | Finaliza pedido do carrinho do usuário autenticado |
| GET | `/orders` | Lista pedidos do usuário autenticado |
| GET | `/orders/{id}` | Detalha pedido por ID do usuário autenticado |
| PATCH | `/orders/{id}/cancel` | Cancela pedido por ID do usuário autenticado |

Exemplo `POST /orders/checkout`:
```json
{
  "shippingAddress": "Rua Exemplo, 123, São Paulo, SP"
}
```

---

## Segurança e acesso
- `/user/register` e `/user/login` são públicos.
- `/products` e `/products/{id}` podem ser acessados sem autenticação.
- As demais rotas exigem token JWT válido.

## Integração com o Frontend

Este backend expõe apenas rotas REST em JSON — não há renderização de HTML.
O frontend deve enviar requisições para `http://localhost:8080` em desenvolvimento.

CORS está habilitado para todas as origens em desenvolvimento. Em produção, configure a URL do frontend.

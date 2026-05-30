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
- [ ] Autenticação com JWT
- [ ] CRUD de produtos com filtros
- [ ] Carrinho de compras
- [ ] Pedidos e checkout
- [ ] Login com Google (OAuth2) (opcional, menor prioridade)

---

## Endpoints disponíveis

> Documentação completa será adicionada conforme os módulos forem implementados.

### Produtos (Devemos adicionar mais rotas depois, principalmente as de autenticação)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/{id}` | Busca produto por ID |
| POST | `/products` | Cria produto |

---

## Integração com o Frontend

Este backend expõe apenas rotas REST em JSON — não há renderização de HTML.
O grupo de frontend deve configurar as requisições para `http://localhost:8080` em desenvolvimento.

CORS está habilitado para todas as origens em desenvolvimento. Em produção, configurar a URL do frontend.
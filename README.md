# Grupo Boticário

Olá, sou o Gabriel dos Santos Gonçalves e essa é um projeto  **de teste** do **Grupo Boticário**. Basicamente, é um crud envolvendo **revendedores** e **pedidos**.


# Tecnologias

Principais tecnologias utilizadas:

 - TypeScript
 - Node.js
 - MongoDB
 - Mongoose
 - Express.js
 - TDD (com Jest)
 - JWT

# Rotas
	POST /users
	BODY
	    name: required
	    document: required (cpf)
	    email: required
	    password: required
	RETURNS
	    user


	POST /auth
	BODY
	    email: required
	    password: required
	RETURNS
	    token


	GET /users/:document/cashback
	HEADERS
	    X-Authorization: token
	RETURNS
	    cashback


	GET /orders
	HEADERS
	    X-Authorization: token
	RETURNS
	    orders


	POST /orders
	BODY
	    price: required
	    document: required (cpf)
	    date: optional
	HEADERS
	    X-Authorization: token
	RETURNS
	    order


	PUT /orders
	BODY
	    id: required
	    document: optional (cpf)
	    price: optional
	    date: optional
	HEADERS
	    X-Authorization: token
	RETURNS
	    order
	    updated


	DELETE /orders/:id
	HEADERS
	    X-Authorization: token
	RETURNS
	    -






## Testes

> **Em progresso:** até o momento, os testes cobrem **96.9%** da aplicação.

Resultados do **coverage** geral:
![a imagem mostra os testes realizados na aplicação](https://i.imgur.com/jLNanGy.png)


**Resumo**

    ---------------------|----------|----------|----------|----------|-------------------|
	File                 |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
	---------------------|----------|----------|----------|----------|-------------------|
	All files            |     96.9 |    83.19 |    98.31 |    96.72 |                   |
	 src                 |      100 |      100 |      100 |      100 |                   |
	  app.ts             |      100 |      100 |      100 |      100 |                   |
	 src/__tests__/utils |      100 |      100 |      100 |      100 |                   |
	  chance.ts          |      100 |      100 |      100 |      100 |                   |
	  normalize.ts       |      100 |      100 |      100 |      100 |                   |
	  request.ts         |      100 |      100 |      100 |      100 |                   |
	 src/config          |      100 |      100 |      100 |      100 |                   |
	  env.ts             |      100 |      100 |      100 |      100 |                   |
	 src/controllers     |      100 |    90.24 |      100 |      100 |                   |
	  auth.ts            |      100 |      100 |      100 |      100 |                   |
	  orders.ts          |      100 |    85.19 |      100 |      100 |      80,89,98,109 |
	  users.ts           |      100 |      100 |      100 |      100 |                   |
	 src/helpers         |    92.31 |    73.68 |    92.86 |    92.31 |                   |
	  cashback.ts        |      100 |      100 |      100 |      100 |                   |
	  database.ts        |      100 |    85.71 |      100 |      100 |                40 |
	  encryption.ts      |      100 |      100 |      100 |      100 |                   |
	  request-error.ts   |    66.67 |       50 |    66.67 |    66.67 |       3,4,5,26,36 |
	  validate.ts        |      100 |       80 |      100 |      100 |             17,29 |
	 src/middlewares     |    87.76 |       75 |      100 |    86.67 |                   |
	  error.ts           |      100 |      100 |      100 |      100 |                   |
	  is-auth.ts         |    84.62 |    71.43 |      100 |    83.33 | 10,14,23,38,52,60 |
	 src/models          |      100 |    92.86 |      100 |      100 |                   |
	  order.ts           |      100 |    88.89 |      100 |      100 |                93 |
	  user.ts            |      100 |      100 |      100 |      100 |                   |
	 src/routes          |      100 |      100 |      100 |      100 |                   |
	  auth.ts            |      100 |      100 |      100 |      100 |                   |
	  orders.ts          |      100 |      100 |      100 |      100 |                   |
	  users.ts           |      100 |      100 |      100 |      100 |                   |
	 src/schemas         |      100 |      100 |      100 |      100 |                   |
	  auth.ts            |      100 |      100 |      100 |      100 |                   |
	  orders.ts          |      100 |      100 |      100 |      100 |                   |
	  users.ts           |      100 |      100 |      100 |      100 |                   |
	---------------------|----------|----------|----------|----------|-------------------|
	Test Suites: 8 passed, 8 total
	Tests:       46 passed, 46 total
	Snapshots:   0 total
	Time:        8.934s



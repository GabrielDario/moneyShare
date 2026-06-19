# 💸 Divisor de Despesas Coletivas 

Um sistema web simples, leve e responsivo para divisão e fechamento de contas de viagens, eventos ou despesas mensais entre duas ou mais pessoas. O projeto foi desenvolvido com foco em performance pura, utilizando recursos nativos do ecossistema front-end sem a necessidade de instalar frameworks ou dependências externas.

---

## 🚀 Funcionalidades

* **Autenticação Local:** Sistema de Login e Cadastro de usuários persistido no navegador.
* **Gestão de Salas / Eventos:** Criação de grupos específicos (ex: "Viagem Praia", "Contas da Casa") onde o criador é inserido automaticamente.
* **Gestão de Participantes:** Permite adicionar múltiplos integrantes a uma sala ativa através do nome ou e-mail.
* **Lançamento de Despesas:** Formulário dinâmico contendo descrição, valor e seleção de quem efetuou o pagamento.
* **Algoritmo de Compensação de Saldos (Core):** Calcula o gasto total, a fatia justa de cada um e gera a matriz mínima de transferências financeiras necessários para o fechamento ("Quem deve quanto para quem").

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica das páginas de login, dashboard e salas.
* **CSS3 Vanilla:** Estilização moderna baseada em variáveis CSS (`:root`), Flexbox e CSS Grid para total responsividade em dispositivos móveis e desktops.
* **JavaScript Puro (ES6+):** Lógica de manipulação de DOM, gerenciamento de estado e implementação do algoritmo de partilha.
* **Web Storage API (LocalStorage):** Persistência de dados local, simulando um banco de dados relacional.

---

## 💻 Instalação e Execução

Como o projeto utiliza apenas tecnologias nativas do navegador (*Client-Side Engine*), a execução é extremamente simples:

1. Baixe ou clone os arquivos do projeto para uma pasta em seu computador.
2. Certifique-se de manter todos os arquivos na mesma pasta raiz:

├── css/
│   └── style.css        (Estilização global e responsiva)
├── js/
│   ├── database.js     (Gerenciamento do localStorage e algoritmo)
│   ├── login.js         (Lógica da tela de login)
│   ├── dashboard.js     (Lógica do dashboard)
│   └── room.js          (Lógica interna da sala)
├── login.html           (Tela de Login / Cadastro)
├── dashboard.html       (Tela de listagem de salas)
└── room.html            (Tela interna da sala e fechamento de contas)
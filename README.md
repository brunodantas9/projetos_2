# 🚀 Guia de Entrega: Instalação e Execução do Projeto

Olá colega querido que vai rodar o código, fiz esse readme com muito carinho então siga todos os passos bem passo a passo igual ta explicando, vai dar certo, tem que dar certo, se der certo ganha um pão de queijo da lindinha


---

## 🔍 1. Verificando o que já está instalado
Antes de começar, vamos ver se a máquina já tem o que precisamos.
Abra o **Terminal** (ou PowerShell) e digite os comandos abaixo um por um:

1.  **Verificar Python:** Digite `python --version`. 
    *   *Deve aparecer algo como Python 3.12.x.*
2.  **Verificar Node:** Digite `node -v`. 
    *   *Deve aparecer algo como v20.x.x.*
3.  **Verificar UV:** Digite `uv --version`.
    *   *Se der erro, instale agora com:* `pip install uv`

---

## 📥 2. Pegando o Código (GitHub)
No terminal, vá para a pasta onde deseja salvar o projeto (ex: Área de Trabalho) e digite:
```bash
git clone https://github.com/brunodantas9/projetos_2.git
cd projetos_2
```

---

## 🗄️ 3. Configurando os Bancos de Dados (Passo a Passo)

### A. No MySQL (Para dados da Escola)
1.  Abra o **MySQL Workbench**.
2.  Clique na sua conexão local (geralmente chamada de `Local instance MySQL80`).
3.  No topo, clique no ícone que parece um **Raio com um arquivo** (ou vá em `File > New Query Tab`).
4.  No campo de texto, digite: 
    ```sql
    CREATE DATABASE db_escola;
    ```
5.  Clique no ícone do **Raio (Execute)** para criar.

### B. No PostgreSQL (Para dados da Biblioteca)
1.  Abra o **pgAdmin 4**.
2.  No menu da esquerda, abra `Servers` > `PostgreSQL 16` (ou sua versão).
3.  Clique com o botão direito em `Databases`.
4.  Selecione `Create` > `Database...`.
5.  No campo "Database", escreva `db_biblioteca` e clique em **Save**.

---

## 🔑 4. Ajustando as Senhas (IMPORTANTE)
Como cada computador pode ter uma senha de banco diferente, você **precisa** conferir a sua:

1.  Abra o projeto no VS Code.
2.  Vá na pasta `backend/core/` e abra o arquivo `settings.py`.
3.  Desça até encontrar a seção `DATABASES`.
4.  **Mude o campo 'PASSWORD'** do MySQL (default) e do PostgreSQL (biblioteca) para a senha que VOCÊ definiu no seu computador.
    *   *Exemplo:* Se sua senha for `admin123`, mude lá.

---

## ⚙️ 5. Rodando o Backend (Django)

1.  No terminal, entre na pasta do backend: `cd backend`
2.  Instale tudo com: `uv sync`
3.  Ative o ambiente virtual:
    *   Windows: `.venv\Scripts\activate`
    *   Linux/Mac: `source .venv/bin/activate`
4.  **Crie as tabelas:**
    ```bash
    python manage.py migrate
    python manage.py migrate --database=biblioteca
    ```
5.  **Coloque os dados iniciais (Seed):**
    ```bash
    python seed_biblioteca.py
    python seed_disciplinas.py
    ```
6.  **Ligue o servidor:**
    ```bash
    python manage.py runserver
    ```

---

## 💻 6. Rodando o Frontend (React)

1.  Abra um **NOVO terminal** na pasta principal do projeto.
2.  Entre na pasta do frontend: `cd frontend`
3.  Instale tudo: `npm install`
4.  Ligue o sistema: `npm run dev`
5.  Abra o navegador em: `http://localhost:5173`

---

## 🆘 Teve erro? 
*   **Erro de Senha:** Volte ao passo 4 e garanta que a senha no `settings.py` é a mesma do seu MySQL/Postgres.
*   **Porta ocupada:** Se o banco não conectar, verifique se o MySQL Server está "Running" no Workbench.

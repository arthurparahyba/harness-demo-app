# harness-demo-app

API REST simples em Node.js (Express) para testar pipelines de CI/CD no [Harness.io](https://harness.io).

## Endpoints

| Método | Rota          | Descrição                         |
|--------|---------------|-----------------------------------|
| GET    | `/`           | Boas-vindas e versão              |
| GET    | `/health`     | Health check (usado no k8s)       |
| GET    | `/version`    | Versão da aplicação               |
| GET    | `/tasks`      | Lista tarefas (em memória)        |
| POST   | `/tasks`      | Cria tarefa `{ "title": "..." }`  |
| PATCH  | `/tasks/:id`  | Atualiza `title` e/ou `done`      |
| DELETE | `/tasks/:id`  | Remove tarefa                     |

## Rodando localmente

```bash
npm install
npm test          # testes + cobertura
npm start         # http://localhost:3000
```

Com Docker:

```bash
docker build -t harness-demo-app .
docker run -p 3000:3000 harness-demo-app
```

## Estrutura

```
src/              código da aplicação
test/             testes (Jest + Supertest)
Dockerfile        imagem de produção (multi-stage)
.harness/         pipeline de CI do Harness
k8s/              manifestos Kubernetes para o Harness CD
```

## Configurando no Harness

1. **Connector do GitHub** – em *Project Settings › Connectors*, crie um connector GitHub
   com identificador `github_connector` (ou ajuste `connectorRef` no pipeline).
2. **Importar o pipeline** – em *Pipelines › Create › Import from Git*, aponte para
   `.harness/pipeline.yaml` deste repositório. Ajuste `projectIdentifier` e
   `orgIdentifier` se o seu projeto não for o `default_project`/`default`.
3. **Rodar** – execute escolhendo a branch `main`. O estágio roda na infraestrutura
   *Harness Cloud* (não precisa de delegate), instala dependências, executa os testes e
   publica o relatório JUnit na aba *Tests*.
4. **(Opcional) Imagem Docker** – crie um connector do Docker Hub com identificador
   `dockerhub_connector`, defina `docker_repo` (ex.: `seuusuario/harness-demo-app`) e rode
   com `push_image = true`.
5. **(Opcional) Deploy (CD)** – crie um *Service* Kubernetes usando os manifestos da pasta
   `k8s/` (`values.yaml` já referencia `<+artifacts.primary.image>`), um *Environment*
   e uma *Infrastructure* apontando para o seu cluster, e adicione um estágio *Deploy*
   com *Rolling Deployment*.

### Dica para testar falhas

Para ver o pipeline quebrar, altere uma asserção em `test/app.test.js`, faça commit e
rode de novo — o Harness mostra exatamente qual teste falhou na aba *Tests*.

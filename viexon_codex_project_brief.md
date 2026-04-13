# Viexon-app — Documento de alinhamento para o Codex

## Objetivo deste documento

Este documento existe para alinhar o entendimento do projeto **Viexon-app** antes de qualquer implementação.

A intenção é explicar com clareza:

- o que é o produto
- qual problema ele resolve
- qual é o escopo atual
- quais são os perfis de usuário
- como funciona a lógica principal do sistema
- quais são as regras de negócio mais importantes
- quais tecnologias são obrigatórias
- como o projeto deve ser pensado por etapas
- o que **não** deve ser feito neste momento

Este material é apenas de **contexto e entendimento do projeto**.

**Importante:** neste momento, não deve ser criado código, componente, schema, migration, API, tela ou estrutura técnica final. O objetivo agora é apenas entendimento correto do sistema.

---

## 1. Visão geral do produto

O **Viexon-app** é uma plataforma premium conectada a uma landing page, criada para organizar e profissionalizar uma operação comercial focada em:

- atacado
- consignado
- catálogo
- pedidos
- estoque
- clientes
- financeiro
- operação comercial de revendedoras

O produto não deve ser interpretado como apenas um app ou apenas um ERP.

Ele é um **ecossistema digital** composto por:

1. **Landing page / website público**
2. **Acesso para revendedoras**
3. **Acesso para clientes**
4. **Sistema operacional da revendedora**
5. **Catálogo e compras do cliente vinculadas à revendedora**

A proposta do produto é unir experiência premium, operação comercial e controle de negócio em um fluxo único.

---

## 2. Problema que o produto resolve

O projeto nasce para resolver dores típicas de operações que vendem por atacado e consignado, especialmente quando há uso intenso de WhatsApp, controle manual, planilhas e processos descentralizados.

As principais dores que o sistema deve resolver são:

- dificuldade para controlar estoque com precisão
- dificuldade para registrar pedidos com agilidade
- falhas no controle de consignado
- dificuldade para acompanhar devoluções, vendas e acertos
- falta de integração entre catálogo, pedidos, estoque e financeiro
- operação comercial espalhada entre equipe, revendedoras e clientes
- pouca visibilidade sobre clientes, histórico e desempenho de vendas

O Viexon deve funcionar como o centro da operação.

---

## 3. Posicionamento do produto

O produto deve ter posicionamento **premium**, moderno e tecnológico.

A experiência visual e de marca deve transmitir:

- sofisticação
- confiança
- organização
- tecnologia
- aparência elegante
- valor percebido alto

A plataforma não deve parecer um sistema genérico, improvisado ou excessivamente administrativo.

Ela deve passar a sensação de um produto refinado, comercial e profissional.

---

## 4. Estrutura macro do ecossistema

O projeto deve ser entendido como um ecossistema com duas portas principais de entrada:

### 4.1 Website / Landing page

É a entrada pública do produto.

Funções esperadas desta camada:

- apresentar a marca
- apresentar o produto
- gerar confiança
- servir como porta de entrada para cadastro e login
- direcionar corretamente cada perfil de usuário

### 4.2 Escolha de perfil na entrada

Ao acessar o website, o usuário deve encontrar duas opções de cadastro:

- **Criar conta como cliente**
- **Criar conta como revendedora**

Essa distinção é essencial porque define o comportamento do sistema a partir daquele momento.

---

## 5. Perfis principais de usuário

O sistema deve ser pensado inicialmente com estes perfis:

### 5.1 Revendedora

É quem opera seu próprio ambiente dentro da plataforma.

A revendedora terá acesso ao sistema da sua operação, incluindo futuramente funcionalidades como:

- gerenciamento de clientes
- catálogo vinculado à sua operação
- pedidos
- estoque
- consignado
- financeiro
- acompanhamento de compras dos seus clientes

### 5.2 Cliente

É quem acessa o catálogo e realiza compras.

O cliente **não entra em um sistema global**.

Ele precisa estar vinculado a uma revendedora específica.

Essa vinculação ocorre no momento do cadastro.

### 5.3 Administração interna

Embora ainda não seja o foco deste documento em profundidade, existe também a necessidade futura de perfis administrativos, como por exemplo:

- admin
- equipe interna
- financeiro
- gerente

Esses perfis podem existir depois, mas a compreensão central agora deve ficar em **revendedora** e **cliente**.

---

## 6. Regra principal do negócio

Esta é a regra mais importante do projeto e deve ser entendida como base estrutural do Viexon.

### Regra central

Quando o usuário escolhe criar conta como **cliente**, ele deve selecionar a **revendedora** à qual está vinculado.

A partir disso:

- esse cliente passa a pertencer ao contexto daquela revendedora
- o catálogo exibido para ele deve estar ligado àquela revendedora
- toda compra realizada por esse cliente deve entrar somente no sistema daquela revendedora
- seus pedidos, histórico e relacionamento comercial devem existir dentro desse vínculo
- ele não deve enxergar ou interagir com dados de outras revendedoras

Em outras palavras:

**cada revendedora possui seu próprio ambiente lógico dentro do sistema, e os clientes vinculados a ela operam apenas dentro desse ambiente.**

---

## 7. Interpretação correta da arquitetura lógica

O Viexon deve ser pensado como uma plataforma com lógica de separação por revendedora.

Não significa necessariamente criar um sistema físico separado para cada revendedora.

Mas significa que, do ponto de vista de regras e dados:

- cada revendedora possui seu próprio contexto
- os clientes pertencem a esse contexto
- pedidos pertencem a esse contexto
- catálogo pertence a esse contexto
- operações futuras como consignado, estoque e financeiro também pertencem a esse contexto

A interpretação correta é a de um sistema com **isolamento lógico por revendedora**.

Esse isolamento é parte central da arquitetura do projeto.

---

## 8. Fluxo principal do produto

### 8.1 Entrada pública

O usuário acessa o website do Viexon.

### 8.2 Escolha de perfil

Ele escolhe entre:

- criar conta como cliente
- criar conta como revendedora

### 8.3 Fluxo da revendedora

Se o usuário se cadastra como revendedora:

- cria sua conta
- entra no seu ambiente de sistema
- passa a ter seu próprio contexto operacional

### 8.4 Fluxo do cliente

Se o usuário se cadastra como cliente:

- cria sua conta
- escolhe a revendedora à qual está vinculado
- entra no catálogo vinculado àquela revendedora
- ao comprar, o pedido deve ser enviado somente para o sistema daquela revendedora

Esse fluxo deve ser entendido como regra-base do produto.

---

## 9. Escopo funcional amplo do projeto

O escopo total do Viexon vai além da landing page.

A visão completa do produto inclui módulos como:

- dashboard
- produtos
- clientes
- estoque
- pedidos
- pedido rápido
- consignado
- visita do dia
- acerto rápido
- financeiro
- relatórios
- usuários
- API docs

Além disso, existe também o lado público/comercial:

- homepage
- landing page
- cadastro
- login
- entrada por perfil
- catálogo para clientes

Portanto, o produto tem duas grandes frentes:

1. **frente pública/comercial**
2. **frente operacional/sistêmica**

---

## 10. O que deve ser considerado prioridade agora

Apesar da visão completa ser ampla, a etapa inicial do projeto deve priorizar entendimento destas camadas:

### Camada 1 — Marca e entrada

- homepage
- landing page
- apresentação do produto
- experiência premium
- entrada clara por perfil

### Camada 2 — Autenticação e vínculo

- cadastro de revendedora
- cadastro de cliente
- login
- vínculo obrigatório do cliente com revendedora

### Camada 3 — Estrutura conceitual do sistema

- entendimento de que a revendedora tem seu próprio contexto
- entendimento de que o cliente compra dentro do contexto da revendedora
- entendimento de que futuramente pedidos, catálogo, estoque e financeiro respeitam esse vínculo

---

## 11. Stack obrigatória do projeto

Estas decisões já estão definidas e devem ser respeitadas.

### 11.1 Integrações obrigatórias

O projeto está em conexão com:

- **Vercel**
- **Supabase**

Tudo deve ser pensado de forma compatível com essas duas ferramentas.

### 11.2 Restrição obrigatória

**Não usar Prisma.**

Essa restrição deve ser considerada fixa.

Ou seja:

- não planejar arquitetura baseada em Prisma
- não assumir uso de ORM Prisma
- não estruturar raciocínio técnico dependendo de Prisma

### 11.3 Interpretação técnica esperada

Sem entrar em implementação, o sistema deve ser entendido como um projeto que precisa se encaixar naturalmente em uma arquitetura moderna baseada em:

- frontend e hospedagem compatíveis com Vercel
- banco, autenticação e políticas compatíveis com Supabase
- modelagem pensada diretamente para o banco e para a camada de acesso adequada
- separação de dados por contexto de revendedora

---

## 12. Direção técnica conceitual

Mesmo sem programar agora, o entendimento técnico esperado é o seguinte:

- existe uma aplicação principal conectada ao Supabase
- existe autenticação por perfil
- existe separação lógica entre os ambientes das revendedoras
- o cliente pertence a uma revendedora específica
- o catálogo do cliente deve refletir esse vínculo
- os pedidos do cliente devem cair no sistema da revendedora correspondente
- a plataforma inteira deve crescer de forma escalável dentro da stack Vercel + Supabase

---

## 13. Módulos funcionais futuros do sistema da revendedora

Estes módulos devem ser entendidos como parte da visão do produto, mesmo que não sejam construídos agora.

### 13.1 Produtos

Gestão de itens, cadastro, catálogo, variações e exibição comercial.

### 13.2 Clientes

Cadastro e gestão dos clientes vinculados à revendedora.

### 13.3 Estoque

Controle de entradas, saídas, reservas, disponibilidade e futuramente baixa correta por pedido ou consignado.

### 13.4 Pedidos

Fluxo de orçamento, pedido, separação, acompanhamento e histórico.

### 13.5 Pedido rápido

Fluxo operacional pensado para agilidade comercial.

### 13.6 Consignado

Um dos módulos centrais do produto, cobrindo remessa, devolução, venda e acerto.

### 13.7 Financeiro

Contas a receber, pagamentos, vencimentos, controle comercial e visão financeira.

### 13.8 Relatórios

Métricas de operação, vendas, clientes, giro e desempenho.

---

## 14. Direção do catálogo para cliente

O catálogo do cliente não deve ser tratado como uma loja pública genérica e desvinculada.

Ele faz parte do ecossistema comercial da revendedora.

Isso significa que o catálogo precisa respeitar o vínculo entre cliente e revendedora.

O raciocínio correto é:

- o cliente entra por uma experiência controlada
- ele pertence a uma revendedora
- ele navega dentro daquele contexto
- a compra deve alimentar o ambiente daquela revendedora

O catálogo, portanto, não é um módulo isolado: ele é uma extensão comercial do sistema da revendedora.

---

## 15. Importância do isolamento de dados

Esse projeto depende de uma separação de dados segura e consistente.

O entendimento esperado é:

- uma revendedora não pode acessar dados de outra
- um cliente não pode acessar dados fora do vínculo dele
- pedidos devem ser corretamente associados
- o sistema precisa nascer com essa preocupação estrutural

Esse ponto é fundamental porque a confiança da plataforma depende disso.

---

## 16. Identidade visual e direção de experiência

O Viexon deve transmitir uma identidade premium.

### Direção visual desejada

- moderno
- tecnológico
- refinado
- elegante
- sofisticado
- feminino premium sem parecer infantil
- maduro e luxuoso

### Dark mode

Inspirado em:

- fundo escuro profundo
- azul elétrico
- ciano
- brilho sutil
- alto contraste

### Light mode

Deve ser:

- claro e sofisticado
- premium
- elegante
- delicado sem ser frágil
- luxuoso e comercial

Essa direção impacta principalmente a landing page e toda a percepção de valor do produto.

---

## 17. Papel do website no ecossistema

O website não é apenas uma página institucional.

Ele cumpre múltiplos papéis:

- apresentar a marca
- transmitir confiança
- comunicar o posicionamento premium
- orientar o usuário
- separar o fluxo entre cliente e revendedora
- ser o primeiro passo da jornada no sistema

Por isso, website e sistema não devem ser tratados como projetos desconectados.

Eles fazem parte do mesmo produto.

---

## 18. Etapas conceituais do projeto

A leitura correta do projeto neste momento deve seguir esta ordem:

### Etapa 1 — Entender o produto

Compreender que o Viexon é uma plataforma premium que une landing page, catálogo, revendedoras e sistema operacional.

### Etapa 2 — Entender os perfis

Compreender que existem pelo menos dois fluxos principais:

- revendedora
- cliente

### Etapa 3 — Entender a regra central

Compreender que o cliente se vincula a uma revendedora no cadastro e passa a operar exclusivamente dentro desse contexto.

### Etapa 4 — Entender a arquitetura lógica

Compreender que existe isolamento lógico por revendedora.

### Etapa 5 — Entender a stack obrigatória

Compreender que tudo deve ser compatível com Vercel e Supabase, sem Prisma.

### Etapa 6 — Entender a evolução futura

Compreender que o sistema deve evoluir para incluir módulos completos de operação comercial e gestão.

---

## 19. O que não deve ser feito agora

Neste momento, o Codex não deve:

- criar código
- criar componentes
- criar páginas
- gerar schema definitivo
- gerar migrations
- criar banco
- estruturar API
- criar autenticação
- implementar catálogo
- implementar sistema da revendedora

Também não deve assumir detalhes técnicos ainda não definidos como se fossem decisões finais.

O foco agora é apenas consolidar entendimento e contexto do projeto.

---

## 20. Como o projeto deve ser interpretado daqui para frente

Sempre que o projeto Viexon-app for analisado, o raciocínio-base deve ser este:

- trata-se de um ecossistema completo, não apenas uma landing page e não apenas um sistema interno
- a entrada pública e o sistema fazem parte da mesma arquitetura de produto
- existem fluxos diferentes para cliente e revendedora
- o cliente se vincula a uma revendedora no cadastro
- cada revendedora possui seu próprio contexto operacional
- as compras do cliente devem ir apenas para a revendedora associada
- tudo precisa nascer compatível com Vercel + Supabase
- Prisma está proibido
- o produto precisa manter uma identidade premium, elegante e tecnológica

---

## 21. Resumo executivo final

O **Viexon-app** é uma plataforma premium conectada a uma landing page, pensada para organizar e escalar uma operação de atacado e consignado.

O sistema possui dois fluxos principais de entrada:

- cadastro como revendedora
- cadastro como cliente

A revendedora acessa seu próprio sistema.

O cliente acessa um catálogo, mas obrigatoriamente vinculado a uma revendedora escolhida no cadastro.

Toda compra do cliente deve ser direcionada apenas ao sistema da revendedora associada.

A arquitetura lógica do produto depende de isolamento por revendedora, autenticação por perfil e integração total entre website, catálogo e sistema.

Toda a evolução do projeto deve respeitar a stack obrigatória:

- Vercel
- Supabase
- sem Prisma

Neste momento, o objetivo não é implementar, mas garantir que o entendimento do projeto esteja completamente correto antes de qualquer decisão técnica ou construção.

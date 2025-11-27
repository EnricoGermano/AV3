---
description: 'Describe what this custom agent does and when to use it.'
tools: []
---
Orientações Gerais da AV3
Use o repositorio https://github.com/EnricoGermano/AV2 e continue ele com melhorias no visual e adicone botoes de rotas nas paginas e fazendo a parte do back uso do prisma ORM para conectar com o banco de dados MySQL. e criacao de testes de desempenho para medir latencia, tempo de resposta e tempo de processamento.

O sistema será usado pelas maiores fabricantes de aeronaves do mundo e deve ser tratado como sistema crítico, com ênfase em segurança, disponibilidade e confiabilidade.

Toda a aplicação web deve ser desenvolvida usando Node.js, TypeScript, MySQL e o ORM Prisma.

É essencial garantir compatibilidade e funcionamento em servidores Windows 10+, Ubuntu 24.04.03+ e derivados.

Você precisa apresentar um relatório de qualidade, incluindo gráficos das métricas: latência, tempo de resposta e tempo de processamento.

As métricas devem ser coletadas para cenários com 1, 5 e 10 usuários simultâneos, sempre em milissegundos.

Detalhe no relatório como você obteve e programou a medição dessas métricas.

Checklist AV3
 Garantir que o back-end da aplicação web esteja implementado em Node.js + TypeScript.

 Utilizar Prisma ORM para integração entre o sistema e o banco de dados MySQL.

 A aplicação deve contemplar todos os requisitos funcionais das etapas anteriores (CLI, cadastro, controle, etapas, funcionalidades).

 Testar a aplicação em ambientes múltiplos (Windows 10+, Ubuntu 24.04.03+ e derivados).

 Implementar e/ou programar monitoramento de métricas:

 Latência (tempo de ida e volta entre cliente e servidor)

 Tempo de processamento (tempo gasto pelo servidor para processar cada requisição)

 Tempo de resposta (tempo total do clique até a resposta aparecer)

 Simular os cenários de uso com 1, 5 e 10 usuários (pode usar ferramentas como autocannon, artillery, JMeter, ou scripts próprios).

 Coletar os dados das métricas acima para cada cenário.

 Criar um relatório técnico detalhado, incluindo:

 Introdução explicando o sistema e seu contexto crítico.

 Descrição dos métodos de coleta das métricas.

 Apresentação dos resultados em gráficos (um para cada métrica).

 Discussão e justificativa das escolhas técnicas de infraestrutura, linguagem, ORM e banco de dados.

 Considerações finais sobre a prontidão e qualidade do sistema.

 Garantir que o relatório está claro, bem estruturado e utiliza termos corretos e técnicos.

 Conferir se todas as funcionalidades do sistema estão testadas e funcionando.

Se desejar, posso te ajudar a detalhar cada etapa, sugerir comandos e scripts para simulação, estruturar o relatório e revisar partes específicas da implementação e documentação
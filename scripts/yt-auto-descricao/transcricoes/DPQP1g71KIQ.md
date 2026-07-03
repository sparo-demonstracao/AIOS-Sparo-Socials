[00:00:00] O Antigravity atualizou para a versão 2.0 e a maior mudança foram os subagentes de IA,
[00:00:04] que agora o Antigravity consegue usar para cumprir uma tarefa que você pedir para ele.
[00:00:08] Antes, quando você pedia para o Antigravity criar uma automação, um aplicativo ou um sistema,
[00:00:12] ele só tinha uma janela de chat para poder conversar com inteligência artificial.
[00:00:16] E nesse vídeo você vai ver tudo o que você precisa saber para extrair o máximo dessa nova funcionalidade.
[00:00:21] Então a gente vai ver como invocar subagentes e para que usar eles e quando usar e quando não usar.
[00:00:27] Então, sem enrolação, bora para o que interessa.
[00:00:29] Mas antes de começar, eu queria só pedir para você deixar um like e se inscrever no canal,
[00:00:33] que me ajuda muito a trazer novos vídeos como esse.
[00:00:35] Então, primeiro eu queria mostrar o anti-gravity usando os subagentes na prática,
[00:00:39] para depois a gente entender a teoria e por que usar eles e qual a diferença de usar subagentes ou não usar.
[00:00:44] Então, eu tenho esse aplicativo que organiza minhas finanças pessoais.
[00:00:47] E claro, esses dados são todos fictícios, só para demonstração nesse vídeo.
[00:00:51] Mas, o que esse aplicativo faz é categorizar as minhas transações pessoais.
[00:00:55] Então ele vê o que foi destinado a, por exemplo, compras, o que foi alimentação, o que foi edição de vídeo, moradia, combustível, outros, transporte, saúde, lazer, assinaturas e por aí vai.
[00:01:06] Então o que esse aplicativo faz, ele pega o meu extrato bancário, todas as transações que eu fiz esse mês e classifica categorizando cada uma dessas transações.
[00:01:13] Então o que foi assinatura, o que foi alimentação, o que foi uma compra, o que foi transporte e por aí vai.
[00:01:20] Então saúde, combustível, então aqui por exemplo ele viu que é um alto posto com nome cruzado, então ele classificou como combustível.
[00:01:28] Então drogaria moderna ele classificou como saúde, casa do pão fresco ele classificou como alimentação e por aí vai.
[00:01:34] E o que a gente vai fazer nesse vídeo é usar os subagentes para testar várias abordagens diferentes para classificar essas transações.
[00:01:41] Então porque a gente poderia classificar elas usando inteligência artificial, então simplesmente enviar,
[00:01:46] Ah, eu fiz essa compra no débito nessa loja, Vans barra Shopping.
[00:01:50] Em qual dessas categorias, compra, transporte, investimento, transferência, alimentação,
[00:01:55] essa compra específica se enquadra?
[00:01:57] Então, ele vai usar a inteligência artificial para analisar o que é a loja Vans no barra Shopping
[00:02:02] e ele classificou como compras.
[00:02:03] Mas a gente poderia testar outras abordagens.
[00:02:06] Então, ao invés de enviar para uma inteligência artificial,
[00:02:08] a gente vai fazer uma busca em tempo real no Google com o nome dessa marca.
[00:02:11] Então, a gente vai pesquisar no Google Vans barra Shopping
[00:02:14] e a partir desses sites que forem mostrados, a gente vai usar a inteligência artificial
[00:02:18] para analisar qual a categoria dessa empresa.
[00:02:21] Então, se é uma empresa de alimentação, transporte, saúde e por aí vai.
[00:02:24] Então, a gente pode usar simplesmente inteligência artificial e enviar para elas
[00:02:28] e com base no conhecimento desse modelo, ele vai definir qual a categoria dessa transação
[00:02:33] ou dessa empresa em específico.
[00:02:35] Ou então, a gente poderia usar uma mescla de inteligência artificial com busca em tempo real no Google
[00:02:40] para deixar essa pesquisa ainda mais completa.
[00:02:43] Ou então a gente poderia criar um código que analisa com base no nome.
[00:02:46] Então se tem posto, é combustível, se tem drogaria ou farmácia, é saúde, se tem pão, vai ser alimentação e por aí vai.
[00:02:55] Então dessa forma, usando o código, a gente conseguiria fazer toda essa classificação de graça,
[00:03:00] sem precisar estar pagando para usar um modelo ou sem precisar estar pagando para usar a API do Google para fazer buscas em tempo real.
[00:03:06] Então, o que eu vou pedir é para o Antigravity executar cinco subagentes rodando em paralelo
[00:03:11] para fazer essas classificações de várias maneiras diferentes.
[00:03:14] E a partir do resultado que esses subagentes entregarem, a gente vai alterar esse aplicativo
[00:03:19] para essa melhor versão possível.
[00:03:21] Então, o que eu vou pedir para o Antigravity vai ser, use cinco subagentes para testar
[00:03:25] cinco diferentes abordagens de classificação das transações nesse app.
[00:03:28] Vou fazer os testes posteriormente e analisar qual trouxe o resultado mais assertivo
[00:03:32] segundo o gabarito que criei.
[00:03:34] Então, eu mesmo analisei as transações manualmente e criei um gabarito.
[00:03:38] E com base nesse gabarito, a gente vai analisar qual dessas abordagens trouxe o melhor resultado.
[00:03:43] Então, o primeiro subagente vai usar código para fazer essa classificação.
[00:03:47] Então, dessa forma, a gente não vai ter nenhum custo para classificar essas transações.
[00:03:51] O segundo subagente vai usar a inteligência artificial Cloud para fazer essa classificação.
[00:03:55] O terceiro vai usar outra inteligência artificial, o Gemini.
[00:03:59] A quarta vai usar uma outra inteligência artificial, o ChatGPT.
[00:04:02] E o quinto subagente vai usar uma mescla entre inteligência artificial e busca em tempo real no Google.
[00:04:08] Então, a gente vai usar uma busca em tempo real no Google usando a SERP API.
[00:04:11] E a SERP API é a ferramenta oficial do Google para fazer essa busca em tempo real.
[00:04:16] Então, a gente vai fazer uma busca em tempo real no Google buscando o CNPJ ou o nome fantasia dessas empresas
[00:04:21] para ter uma ideia mais precisa do que essa empresa se trata.
[00:04:24] E vou só dar um espaço.
[00:04:26] E dessa forma, a gente vai conseguir testar essas cinco abordagens diferentes.
[00:04:31] Usando código, inteligência artificial ou fazendo busca em tempo real na internet
[00:04:35] Vou enviar esse pedido
[00:04:37] E o Antigraphy agora vai criar 5 sub-agentes para testar essas 5 abordagens diferentes ao mesmo tempo
[00:04:43] E a gente vai conseguir ver ele fazendo em tempo real na nossa frente
[00:04:46] Então nesse momento ele está criando os 5 agentes diferentes
[00:04:50] Então agente de busca na web, agente do chat EPT, Gemini, Cloud e por aí vai
[00:04:54] Ele vai criar o código que torna essa automação possível
[00:04:57] E a gente vai testar no final essas 5 abordagens
[00:05:00] Então, criei um plano de implementação detalhado para a execução das 5 abordagens
[00:05:05] de classificação.
[00:05:06] Você pode acessar e revisar o plano completo bem aqui.
[00:05:09] Então vamos dar uma olhada nesse plano de implementação e esse plano detalha o uso
[00:05:13] de 5 subagentes em paralelo para criar e refinar 5 abordagens de classificação para as transações
[00:05:17] de extrato.
[00:05:18] Então os subagentes serão disparados em paralelo, cada um receberá as instruções
[00:05:22] específicas para sua estratégia e implementará um script em JavaScript executável que carrega
[00:05:28] os dados e executa a lógica correspondente.
[00:05:30] Então, o que ele está falando é que cada um desses
[00:05:31] subagentes vai criar o código
[00:05:33] que torna essa automação possível.
[00:05:36] E é exatamente o que a gente quer.
[00:05:37] Então, depois, quando a gente analisar o que
[00:05:39] cada um desses subagentes fez, a gente vai simplesmente
[00:05:42] conseguir dizer, o resultado melhor
[00:05:43] foi do subagente 5. Quero implementar
[00:05:46] ele nesse aplicativo. Então, ele vai pegar
[00:05:47] esse script, esse código, que um
[00:05:49] desses subagentes criou, no caso, o quinto subagente
[00:05:52] e vai implementar ele dentro do
[00:05:53] aplicativo. Então, a gente vai estar testando
[00:05:55] cinco abordagens diferentes ao mesmo tempo.
[00:05:58] E o grande poder desses sub-agentes não é nem conseguir executar em paralelo várias tarefas.
[00:06:03] Isso a gente já conseguia abrindo vários chats ao mesmo tempo dentro do Anti-Gravity.
[00:06:07] A questão é que esse nosso chat principal vai ter um contexto do que cada um desses sub-agentes fez.
[00:06:12] Então é como se a gente tivesse cinco abas abertas ao mesmo tempo aqui no Anti-Gravity,
[00:06:16] mas esse nosso chat principal vai conseguir entender o que cada um desses outros chats,
[00:06:22] todos esses outros agentes fizeram.
[00:06:24] E a gente vai ver isso mais no detalhe depois que ele entregar o resultado.
[00:06:27] Então, a gente vai ver por que usar subagentes, quando usar e quando não usar eles.
[00:06:31] Então, tudo com mais detalhe ainda nesse vídeo.
[00:06:33] Mas vamos dar um sinal verde para aprovação desse plano de implementação.
[00:06:37] E é exatamente o que a gente quer.
[00:06:38] Então, vai criar um subagente que vai criar regras com código local.
[00:06:42] Então, ele não vai usar inteligência artificial,
[00:06:44] simplesmente código para classificar essas transações.
[00:06:46] O segundo vai usar a inteligência artificial da Antropic, o Cloud,
[00:06:51] para fazer essa classificação.
[00:06:52] O terceiro vai usar o Gemini e a do Google.
[00:06:54] O quarto vai usar o ChatGPT, que é a inteligência artificial da OpenAI.
[00:06:58] E o quinto vai fazer busca em tempo real na internet.
[00:07:00] Então, vai pesquisar essas empresas no Google.
[00:07:02] E é o que, na minha opinião, vai trazer o melhor resultado, mas ele também é mais caro.
[00:07:06] Mas vamos ver isso na prática.
[00:07:07] Então, vou dar um sinal verde e aprovar esse plano de implementação.
[00:07:12] Plano aprovado.
[00:07:14] E agora, ele vai executar os cinco subagentes, criar esses códigos e testar o resultado final.
[00:07:19] Então, como você pode ver, ele criou uma lista de tarefas do que ele precisa fazer
[00:07:25] E ele executou, no caso ele chama de invocar 5 subagentes em paralelo
[00:07:30] Para testar cada uma dessas abordagens
[00:07:32] Então ele invocou o subagente que vai fazer a busca usando a SERP e a API do Google
[00:07:36] Um que vai usar o chat GPT, outro o Gemini, outro o Cloud
[00:07:39] E outro simplesmente um código
[00:07:41] E você consegue ver que tem alguns subagentes que estão rodando
[00:07:45] Então você consegue ver que está carregando, é porque ele está executando algo
[00:07:48] E quando tem essa bola azul, então, no caso, esse ícone do terminal com esse ponto azul piscando,
[00:07:54] significa que ele está aguardando alguma autorização nossa.
[00:07:57] Então, a gente precisa autorizar esse subagente a fazer algo.
[00:08:00] Então, eu vou clicar em um desses subagentes, o classificador com o código,
[00:08:04] e ele está esperando a nossa autorização para executar esse comando no terminal.
[00:08:07] A gente consegue voltar no nosso chat principal, bem aqui, abrir um outro subagente, autorizar,
[00:08:13] e vou autorizar todos esses subagentes.
[00:08:16] Então, agora o chat GPT, SERP API, e dessa forma a gente consegue ter vários subagentes trabalhando em paralelo nessa única conversa.
[00:08:28] E a grande questão de ter vários subagentes trabalhando em paralelo não é nem a velocidade,
[00:08:33] porque antes a gente já conseguiria fazer isso iniciando vários chats e fazendo pedidos diferentes.
[00:08:38] Então, crie um script para testar SERP API, para fazer uma busca em tempo real no Google e classificar essas minhas transações,
[00:08:44] a gente abriria um outro chat e pediria um outro comando para ele,
[00:08:49] então use código para fazer essa classificação e por aí vai.
[00:08:53] Mas o nosso chat principal, então no caso esse nosso chat,
[00:08:57] não teria o contexto e não saberia o que cada um desses subagentes fez.
[00:09:00] Então se a gente pedisse para ele no final dessa análise
[00:09:03] testar as diferentes abordagens e qual trouxe o melhor resultado,
[00:09:07] ele não saberia o que cada um desses outros chats fez,
[00:09:10] qual foi o pedido que a gente fez e qual o resultado ele entregou.
[00:09:13] Então, o primeiro grande ponto de usar subagentes é que a gente consegue manter o contexto.
[00:09:18] Então, esse nosso chat tem um contexto do que cada um desses subagentes está fazendo.
[00:09:22] O que a gente pediu para eles e qual o resultado final ele entregou.
[00:09:25] Mas aí você deve estar se perguntando,
[00:09:27] tá bom, mas se a gente quisesse manter o contexto,
[00:09:29] era só a gente pedir cada uma dessas alterações uma por vez.
[00:09:33] Então, primeiro a gente ia pedir aqui no chat para ele testar a abordagem da SERP API.
[00:09:37] Quando ele entregasse o resultado, a gente ia pedir para ele testar uma nova abordagem usando o código.
[00:09:41] Quando ele terminasse, pediria uma nova abordagem usando o Gemini
[00:09:44] E não só demoraria muito mais, como poluiria a nossa janela de contexto dessa conversa
[00:09:50] Então a janela de contexto é o quanto essa inteligência artificial que a gente está conversando bem aqui
[00:09:54] Que no caso é o Gemini 3.5 Flash
[00:09:56] Tem de memória sobre o que a gente já conversou com ele nesse chat
[00:10:00] Mas a janela de contexto é uma memória de curto prazo
[00:10:03] Que a inteligência artificial guarda sobre o que a gente estava conversando com ela
[00:10:06] Vai chegar em algum momento aqui, depois que a gente fizesse os cinco testes
[00:10:10] ela já teria esquecido o que a gente conversou no início desse chat.
[00:10:13] Então, quais foram os primeiros pedidos que a gente fez para ela?
[00:10:16] Porque é limitado esse contexto que ela tem.
[00:10:18] Ela conseguiria armazenar cerca de um milhão de caracteres,
[00:10:20] ou 100 mil palavras, algo em torno disso.
[00:10:23] Mas quando a gente passasse dessas 100 mil palavras que ela consegue armazenar,
[00:10:27] ela começaria a esquecer o que a gente conversou inicialmente.
[00:10:30] Mas quando a gente pede para ele executar usando subagentes,
[00:10:33] ele mantém a janela de contexto desses outros chats,
[00:10:36] que ele abriu esses outros subagentes, de uma forma mais resumida.
[00:10:39] Então, ele sabe o que a gente pediu para esse subagente, o resultado final que ele entregou,
[00:10:43] mas ele não fica armazenando tudo o que estava no meio dessa conversa.
[00:10:46] Então, dessa forma, a gente consegue fazer pedidos para essa inteligência artificial
[00:10:50] que a gente está usando dentro do anti-gravity, sem poluir essa nossa janela de contexto.
[00:10:54] Então, a gente consegue usar o subagente para fazer tarefas tanto mais rápido,
[00:10:58] quanto sem poluir a janela de contexto dessa nossa conversa que a gente está tendo.
[00:11:02] E esse é o grande poder dos subagentes do anti-gravity.
[00:11:04] E na Masterclass de Anti-Gravity e Cloud Code, a gente vai ter um módulo só explicando no detalhe
[00:11:09] todas essas novas funcionalidades que o Anti-Gravity 2.0 trouxeram.
[00:11:13] Mas vamos ver o resultado final que ele entregou.
[00:11:15] Então o benchmark consolidado foi finalizado e integrado com sucesso absoluto.
[00:11:19] Os resultados obtidos, então o Cloud Opus 4.7 teve 100% de assertividade em 3.30 segundos.
[00:11:26] GPT 5.5, 100% de assertividade em 3.77 e por aí vai.
[00:11:30] Mas ele está falando que esses modelos tiveram 100% de assertividade e não sei com base no quê.
[00:11:35] Ele provavelmente extraiu daquele aplicativo que a gente tem, o Monerix,
[00:11:39] no caso, esse aplicativo, algumas transações e fez ele mesmo os testes.
[00:11:43] Mas eu tenho o gabarito completo dessas transações.
[00:11:45] Então, eu mesmo classifiquei elas manualmente,
[00:11:48] para a gente ter um gabarito e conseguir analisar de uma forma mais precisa o resultado final que elas entregaram.
[00:11:52] Então, o que eu vou fazer para ele é enviar esse gabarito e explicar para ele.
[00:11:56] Na verdade eu quero que essa análise seja baseada nesse gabarito
[00:12:00] Que eu mesmo criei
[00:12:02] E vou enviar
[00:12:03] E agora sim ele vai usar esses scripts
[00:12:07] Scripts nada mais são que automações
[00:12:09] Então ele criou uma automação que usa esse modelo, o Cloud Opus 4.7
[00:12:13] Para classificar essas transações
[00:12:15] Então ele criou um código que faz essa classificação de forma automática
[00:12:19] E o que ele vai precisar fazer agora é simplesmente usar esse mesmo código
[00:12:22] Para reanalisar todas as transações
[00:12:24] todas essas transações que eu enviei, e ele vai dar uma nota para cada um dessas automações,
[00:12:29] desses scripts, com base no meu gabarito.
[00:12:31] Então, desenhei um novo plano de implementação, adaptando os testes para o seu novo gabarito,
[00:12:35] contendo 16 categorias com emojis, estruturando a conversão automática do extrato que você enviou.
[00:12:40] Vou aprovar. Plano aprovado.
[00:12:44] E agora sim, ele vai analisar esses scripts com base no nosso gabarito.
[00:12:48] E assim que a gente tiver um resultado de qual trouxe o melhor resultado,
[00:12:51] tudo que a gente precisa fazer é para pedir para ele implementar essa automação
[00:12:54] ou esse script que ele criou dentro do nosso aplicativo.
[00:12:58] E dessa forma, toda transação que chegar na nossa conta,
[00:13:01] nesse caso na conta da Nubank, vai ser classificada usando essa automação,
[00:13:05] esse script que foi criado.
[00:13:07] Então, autorizar.
[00:13:11] Então, ele de novo invocou os cinco subagentes,
[00:13:14] e é assim que ele chama, invocar.
[00:13:16] Invocou cinco subagentes, reconfigurando eles para o meu novo gabarito.
[00:13:20] Então você consegue ver bem aqui que ele invocou os 5 subagentes de novo
[00:13:24] Para reclassificar essas 140 transações com base nessas 16 categorias que a gente tem
[00:13:30] Então de uma forma resumida o que ele está fazendo é enviando essas 140 transações
[00:13:34] Para esses diferentes scripts que foram criados, essas diferentes automações que foram criadas
[00:13:39] E a gente vai conseguir ver o resultado final que cada um desses subagentes trouxe bem aqui nesse chat
[00:13:44] Então mantendo o contexto de todas essas outras conversas que a gente teve
[00:13:48] Então, se eu perguntar agora o que o subagente 2 fez, qual foi o pedido que eu fiz para ele,
[00:13:52] qual foi o resultado final que ele entregou, ele vai ter essas informações salvas no contexto
[00:13:57] dessa conversa que a gente está tendo.
[00:13:58] E vamos dar uma olhada no resultado que ele entregou.
[00:14:00] Então, os cinco agentes foram processados e esse foi o resultado que a gente recebeu.
[00:14:05] Então, os resultados reais foram que a busca na web teve 100% de assertividade usando busca no Google,
[00:14:11] Gemini 3.1 Pro, 91,47%, Opus 4.7, 80%, código local, 77%, e o GPT teve um desempenho abaixo do código local.
[00:14:22] E ele aparentemente criou um dashboard para a gente visualizar o resultado de cada uma delas.
[00:14:27] Então aqui a gente tem a abordagem vencedora, busca no Google, com a SERP API mais Gemini 3.1 Pro.
[00:14:33] teve 100% de assertividade, o custo consumido foi de R$0,35 para analisar essas 140 transações,
[00:14:42] 3.1 Pro custou R$0,16, Opus 4.7 R$0,42, código local foi de graça, não teve custo,
[00:14:50] e o GPT 5.5 custou R$0,28.
[00:14:53] E se a gente quisesse agora, por exemplo, implementar alguma dessas abordagens,
[00:14:57] como por exemplo a abordagem 5, que fez busca no Google usando o SERP API
[00:15:00] e usou o Gemini 3.1 Pro para ler essas páginas do Google,
[00:15:04] seria só a gente pedir no chat do nosso T-Gravity.
[00:15:07] Então, a gente poderia simplesmente pedir para ele,
[00:15:09] perfeito, agora quero usar a abordagem 5 no aplicativo Monerix.
[00:15:12] E dessa forma, ele mudaria a lógica do nosso aplicativo.
[00:15:16] Então, a gente consegue acessar o aplicativo original bem aqui.
[00:15:19] Ele alteraria a lógica de classificação das transações
[00:15:22] para essa que a gente decidiu que traz o melhor resultado.
[00:15:26] E esse é só um exemplo de como você pode usar os subagentes
[00:15:29] para fazer uma tarefa que demoraria horas em alguns minutos.
[00:15:32] Mas o mais importante disso é que a gente está mantendo a janela de contexto do nosso chat,
[00:15:37] da inteligência artificial que a gente está conversando.
[00:15:39] Então, dessa forma, ela sabe exatamente o que cada uma dessas abordagens testou
[00:15:43] e qual trouxe o melhor resultado.
[00:15:45] E esse aplicativo, o Monerix, é um aplicativo que a gente criou na Masterclass de Antigravity,
[00:15:49] que é o meu curso completo, que vai te levar do básico até o avançado
[00:15:53] e vai te permitir criar qualquer automação, site, aplicativo ou sistema completo para a empresa
[00:15:58] usando anti-gravity e cloud code. Lá a gente criou do zero exatamente esse aplicativo. Então
[00:16:03] você vai poder criar no passo a passo, junto comigo, um aplicativo como esse. E não só isso,
[00:16:07] mas você também vai ganhar acesso à comunidade paga dos alunos, onde você pode tirar dúvida,
[00:16:11] fazer networking ou participar de projetos valendo dinheiro todo mês. Então, se você quiser aprender
[00:16:16] a criar um aplicativo como esse ou qualquer automação, site ou sistema completo, é o
[00:16:21] primeiro link da descrição. Se você tiver ficado com alguma dúvida, deixe nos comentários ou entre
[00:16:25] eu te sigo pelo chat da nossa comunidade grátis. É o segundo link da descrição.
[00:16:29] Então, se eu não te vi na comunidade, até o próximo vídeo.
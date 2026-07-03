[00:00:00] Nesse vídeo, você vai aprender a fazer com que os aplicativos e as automações criadas
[00:00:03] no Antigravity rodem 24 horas por dia, independente do seu computador estar ligado ou não.
[00:00:08] E a gente também vai ver como mudar o domínio, ou seja, a URL que você usa para acessar
[00:00:12] esse aplicativo, tudo usando só a Hosting.
[00:00:14] E depois de ter feito as configurações que a gente vai ver nesse vídeo, você vai conseguir
[00:00:18] publicar qualquer aplicativo ou automação em menos de um minuto, simplesmente pedindo
[00:00:22] para o Antigravity publicar esse aplicativo para mim.
[00:00:25] Antes de começar, eu queria só pedir para você deixar um like e se inscrever no canal
[00:00:28] para me ajudar a trazer mais vídeos como esse.
[00:00:30] Bora começar.
[00:00:31] Por exemplo, a gente tem esse aplicativo, e se a gente for ver a URL dele, é localhost,
[00:00:36] o que significa que esse aplicativo está rodando localmente no meu computador.
[00:00:39] E o problema disso é que se você digitar essa URL no seu navegador,
[00:00:43] você não vai conseguir usar esse aplicativo, não vai conseguir acessar ele.
[00:00:46] E não só isso, mas se eu fechar o meu anti-gravity, nem eu vou conseguir acessar mais esse aplicativo,
[00:00:51] ele vai ficar offline.
[00:00:52] Então o que a gente quer fazer é rodar esse aplicativo 24 horas por dia,
[00:00:55] Mesmo que o meu computador esteja desligado
[00:00:57] E a gente também quer adicionar uma URL
[00:01:00] Trocar o domínio para que qualquer pessoa consiga acessar
[00:01:03] Usando esse domínio em específico
[00:01:04] Essa URL link em específico
[00:01:07] Para ficar mais fácil de entender
[00:01:08] Quando a gente cria um aplicativo dentro do Antigravity
[00:01:10] Todos os arquivos e os códigos desse aplicativo são salvos no nosso computador
[00:01:15] O problema disso é que para esse aplicativo estar funcionando
[00:01:17] O nosso computador tem que estar necessariamente ligado
[00:01:20] E quando um usuário acessar esse aplicativo
[00:01:22] Ele vai usar o poder de processamento do nosso computador
[00:01:25] para cumprir as tarefas que esse usuário está querendo.
[00:01:27] E o que a gente quer fazer aqui é enviar todo esse código,
[00:01:30] todos esses arquivos que o Antigravity criou,
[00:01:33] para um outro computador, que a gente vai alugar da Hostinger.
[00:01:36] E esse computador roda 24 horas por dia
[00:01:38] com uma conexão de internet bem melhor que a nossa de casa.
[00:01:41] E para que o Antigravity consiga enviar esses arquivos do nosso projeto
[00:01:44] que estão salvos no nosso computador para o computador da Hostinger,
[00:01:47] a gente vai usar duas ferramentas que vão automatizar esse processo,
[00:01:51] para que a gente não precise enviar esse código manualmente.
[00:01:53] E essas duas ferramentas são o GitHub e a Qlify.
[00:01:57] E não precisa se assustar, tudo o que está acontecendo aqui, a gente está enviando os arquivos do nosso projeto para o GitHub
[00:02:02] e todos esses arquivos vão estar salvos lá.
[00:02:05] E a Qlify vai fazer a conexão entre o GitHub e o nosso PC da Hostinger.
[00:02:10] E toda vez que a gente fizer uma alteração no nosso GitHub, nesse projeto do GitHub,
[00:02:14] ele vai enviar essas mudanças para o nosso computador da Hostinger.
[00:02:17] Então toda vez que a gente fizer uma atualização no aplicativo, é só a gente enviar para o GitHub
[00:02:21] e a Qlify vai enviar esses arquivos do GitHub para a Hostinger para atualizar esse aplicativo para a gente.
[00:02:27] Primeiro a gente vai configurar o nosso PC da Hostinger e vai custar R$35,00 por mês
[00:02:32] e o GitHub e a Qlify são 100% gratuitos.
[00:02:35] Na verdade a Qlify não é grátis, ela vem inclusa no plano da Hostinger
[00:02:39] e você também vai ganhar um domínio grátis nesse plano de R$35,00 por mês.
[00:02:43] Se você clicar no terceiro link da descrição, você vai cair nessa página
[00:02:46] e é aqui que a gente consegue alugar um computador para a gente hospedar as nossas automações
[00:02:51] e os nossos aplicativos.
[00:02:52] E esse computador que a gente aluga, o termo técnico e o nome é VPS,
[00:02:57] mas nada mais é que um computador que você consegue alugar.
[00:03:00] E você vai ver que tem alguns planos diferentes e cada um desses planos
[00:03:03] te dá acesso a um computador melhor ou pior.
[00:03:05] Então, por exemplo, o KVM2 te dá acesso a um computador com 8 GB de RAM,
[00:03:09] 100 GB de armazenamento, 8 TB de internet e o plano KVM1 te dá acesso a um computador inferior.
[00:03:14] E eu recomendo que você comece pelo plano KVM2.
[00:03:17] Esse plano KVM1 pode ser um pouco limitado dependendo da aplicação que você esteja criando
[00:03:22] ou da quantidade de automações que você está rodando dentro desse servidor.
[00:03:25] E levando em consideração que você vai ganhar 2 meses grátis assinando o plano do KVM2,
[00:03:29] eles vão sair praticamente o mesmo preço.
[00:03:31] Então eu vou escolher esse plano.
[00:03:33] Logo de cara eu vou adicionar o cupom de desconto SPARO10,
[00:03:37] que vai te dar acesso ao maior desconto disponível na Hostinger.
[00:03:41] No período, eu recomendo você deixar pelo menos 12 meses, porque como você consegue ver,
[00:03:45] no plano de 12 meses, a gente vai pagar R$35,00 por mês durante esse primeiro ano.
[00:03:50] E quando a gente renovar, ele vai ser renovado para R$80,00 por mês.
[00:03:54] Mas se a gente escolher o plano de um mês, a gente vai pagar R$54,99 no primeiro mês
[00:03:59] e a partir do segundo mês, a gente já vai começar a pagar R$90,00 por mês.
[00:04:03] Então, recomendo fortemente que você escolha pelo menos o plano de 12 meses.
[00:04:07] E além disso, o plano de 12 meses ou de 24 meses te dá um domínio grátis.
[00:04:11] E antes de continuar, só confere se a localização do seu servidor está realmente no Brasil.
[00:04:16] E logo abaixo, onde você escolhe o sistema operacional, você vai selecionar OS com painel e Qlify.
[00:04:22] E dessa forma, a Hostinger já vai instalar a Qlify, que é esse aplicativo que a gente estava vendo dentro da sua VPS.
[00:04:28] E agora a gente já pode continuar.
[00:04:31] Depois é só adicionar um endereço, uma forma de pagamento.
[00:04:34] E assim que você finalizar o pagamento, a Hostinger vai abrir essa tela para você, que é o painel da Hostinger.
[00:04:39] Na página inicial, que é onde a gente está, a gente consegue ver os domínios que a gente tem,
[00:04:44] as VPS que a gente tem, que são os computadores, como a gente estava vendo.
[00:04:47] E aqui em cima você consegue ver que a gente consegue resgatar um domínio .cloud grátis,
[00:04:52] que a gente ganhou quando a gente comprou essa VPS.
[00:04:54] E você também consegue ver as VPS que você tem, clicando aqui do lado em VPS.
[00:04:59] E agora que o nosso PC da Hostinger já está configurado, a gente vai configurar a nossa Qlify.
[00:05:04] Você vai clicar em Gerenciar, para gerenciar esse computador.
[00:05:07] E aqui embaixo você consegue ver quantos porcento do poder de processamento do seu computador está sendo usado,
[00:05:13] quanto de armazenamento a gente já gastou, quanto de internet a gente já usou e por aí vai.
[00:05:17] Mas o que a gente vai fazer é configurar a nossa Qlify.
[00:05:20] Tudo que você precisa fazer é gerenciar painel, que vai abrir o aplicativo da Qlify para você.
[00:05:24] Você vai criar uma conta, vai preencher as informações e criar conta.
[00:05:28] Bem-vindo a Qlify e vamos começar.
[00:05:30] A gente vai escolher essa máquina e a gente já pode criar nosso primeiro projeto e ir para o dashboard.
[00:05:36] Agora o que a gente precisa fazer é conectar o nosso GitHub ao nosso Qlify,
[00:05:40] para que a Qlify consiga fazer exatamente o que a gente estava vendo.
[00:05:43] Ele vai buscar o arquivo no nosso GitHub e enviar para o nosso PC que a gente está alugando da Hostinger.
[00:05:48] E toda vez que a gente fizer uma alteração no GitHub, a Qlify que vai atualizar o nosso aplicativo dentro do PC da Hostinger.
[00:05:55] E para conectar o GitHub na Qlify, você vai vir em Dashboard, vai selecionar um projeto e você já vai vir com o primeiro projeto criado.
[00:06:03] Você vai adicionar um recurso, vai escolher o GitHub, adicionar o aplicativo do GitHub bem aqui em cima.
[00:06:08] Eu vou só alterar o nome desse aplicativo para Meu GitHub App.
[00:06:12] Continuar.
[00:06:13] E agora a gente vai vincular a nossa conta, clicando em Registrar agora.
[00:06:16] E a minha conta já está conectada, mas caso você não tenha uma conta do GitHub ainda,
[00:06:20] você vai conseguir criar uma bem aqui e criar o aplicativo do GitHub.
[00:06:24] Instalar repositórios do GitHub.
[00:06:26] Continuar.
[00:06:27] Você vai aceitar tudo.
[00:06:29] E agora já está tudo configurado.
[00:06:31] A gente já pode salvar.
[00:06:31] e o nosso GitHub está conectado à nossa Qlify.
[00:06:34] Agora a Qlify consegue extrair os arquivos do GitHub e enviar para a nossa VPS,
[00:06:40] que no caso é o computador da Hostinger que a gente está alugando.
[00:06:42] Agora que a gente já configurou todas essas ferramentas, o último passo é dentro do Antigravity.
[00:06:47] Agora o que a gente vai fazer é conectar o MCP da Qlify no nosso Antigravity
[00:06:51] para que o Antigravity consiga controlar a nossa conta do Qlify por nós.
[00:06:56] Então quando a gente pedir para o Antigravity publicar um aplicativo pela gente,
[00:06:59] Ele vai entrar na nossa conta do Qlify e vai fazer toda a configuração pela gente
[00:07:03] E dessa forma ele vai fazer tudo sozinho
[00:07:05] Então eu vou conectar o servidor MCP
[00:07:08] É só você clicar nos três pontos aqui em cima, servidores MCP
[00:07:11] E a Qlify não tem um MCP nativo, mas a gente consegue conectar qualquer MCP clicando bem aqui em cima
[00:07:17] Então administrar, servidores MCP
[00:07:20] E como você pode ver, eu já tenho o MCP não nativo do Firecrawl e o MCP não nativo do N8n
[00:07:25] O que a gente vai fazer agora é conectar mais um MCP, que vai ser o do Qlify
[00:07:29] Se você digitar Qlify MCP no Google, vai ser a primeira opção.
[00:07:33] Só clicar, e se a gente rolar para baixo, bem aqui em cima, bem aqui embaixo,
[00:07:38] vai ter uma explicação de como configurar esse MCP.
[00:07:41] E para conectar o MCP da Qlify, tudo que você precisa fazer é vir no agente e falar para ele.
[00:07:46] Adicione esse servidor MCP no meu Antigravity.
[00:07:50] E vou colar esse código.
[00:07:53] E eu vou deixar esse código disponível na nossa comunidade grátis.
[00:07:56] É o segundo link da descrição.
[00:07:57] É só você acessar a comunidade e pesquisar pelo post com o mesmo título desse vídeo.
[00:08:02] Só você copiar o título desse vídeo e pesquisar dentro da comunidade e vai ter um post.
[00:08:06] Dentro desse post vai ter um arquivo de texto que vai ter exatamente o prompt que eu estou
[00:08:10] enviando agora.
[00:08:11] Só você copiar o prompt e enviar para o seu Antigravity.
[00:08:13] Mas para o Antigravity conseguir controlar a nossa conta da Qlify, a gente tem que alterar
[00:08:17] a chave de acesso, o token de acesso, e a URL base bem aqui embaixo.
[00:08:22] E para a gente conseguir nosso token de acesso, a gente vai vir no nosso painel da Qlify,
[00:08:27] e tokens no painel lateral, tokens de API, e a API vai vir desabilitada por padrão no
[00:08:32] seu Qlify, é só você ir em configurações e habilitar a API bem aqui, salvar clicando
[00:08:37] bem aqui, e agora a gente pode voltar em chaves e tokens, tokens de API, e a gente só precisa
[00:08:43] dar um nome, mcp-antgravity, você pode dar o nome que você quiser.
[00:08:49] Nas permissões você vai botar root para dar acesso para tudo, e aí o Antgravity vai
[00:08:53] conseguir fazer qualquer coisa dentro da nossa Qlify e criar.
[00:08:57] Agora é só você copiar esse token que ele gerou, e esse 1 barra no início faz parte
[00:09:01] do token, tem que copiar tudo, e eu vou colar essa chave bem aqui.
[00:09:05] E sua URL base é a URL que você usa para acessar a Qlify, até a primeira barra.
[00:09:10] E quando você copiar do seu navegador, ele já vai vir com esse http:// e sua URL base,
[00:09:17] mas caso por algum motivo não venha, adiciona esse http:// antes.
[00:09:22] E só para garantir, porque da primeira vez que eu fiz isso, o meu anti-gravity não sabia em qual pasta ficavam os servidores MCP,
[00:09:29] eu vou enviar para ele bem aqui, para garantir que ele vai fazer isso corretamente.
[00:09:32] Então vou avisar para ele, meus servidores MCP ficam nessa pasta.
[00:09:37] E eu vou abrir a pasta onde ele fica, e é só você clicar aqui, ver configuração crua, e essa é a pasta.
[00:09:42] mcp-config.json, mas é só você arrastar e enviar para a gente.
[00:09:46] Então meus servidores MCP ficam nessa pasta, e ele vai ver qual a pasta e vai fazer a alteração na pasta certa.
[00:09:51] E se a gente enviar, ele vai alterar esse arquivo adicionando mais um servidor MCP, que é o servidor MCP da Qlify.
[00:10:00] Vou autorizar e aqui a gente tem o servidor do N8n, aqui do FireCrawl e ele vai adicionar bem aqui abaixo agora o da Qlify.
[00:10:08] Exatamente o que ele fez bem aqui.
[00:10:10] E pronto, o servidor MCP da Qlify foi adicionado com sucesso ao seu arquivo.
[00:10:14] Vou aceitar as mudanças, se a gente vier de novo em servidores MCP, gerenciar servidores e atualizar bem aqui em cima, agora a gente tem mais um servidor MCP, dessa vez da Qlify.
[00:10:27] E agora, se a gente pedir para o nosso Antigravity publicar um projeto para a gente, ele já conseguiria fazer.
[00:10:33] Mas para que ele faça sempre da forma certa, eu criei um arquivo que está bem aqui em cima, em customizações, workflows, e esse é o arquivo que eu criei, publicar app.
[00:10:43] E esse documento que eu criei explica para o Antigravity, no passo a passo, como ele deve publicar esse aplicativo.
[00:10:49] Então o primeiro passo ele vai sincronizar com o GitHub, o segundo ele vai criar uma aplicação no Qlify,
[00:10:54] depois vai configurar o DNS para a gente conseguir adicionar uma URL específica e por aí vai.
[00:10:59] E eu também vou deixar esse arquivo disponível na nossa comunidade grátis, também vai estar no post associado a esse vídeo.
[00:11:05] E caso você não saiba o que o Workflows e as regras fazem, eu expliquei isso no último vídeo aqui do canal.
[00:11:10] No mesmo vídeo que eu explico o que são os servidores MCP.
[00:11:13] Mas o que você vai fazer é adicionar um novo workflow global, vai dar um nome para ele,
[00:11:18] Enter, e vai adicionar a descrição e o conteúdo que eu vou deixar disponível no post da comunidade grátis.
[00:11:24] Você vai copiar a descrição, colar bem aqui, copiar o conteúdo, e colar bem aqui.
[00:11:33] E como você pode ver, tem uma bola branca aqui em cima, significa que esse arquivo não está salvo,
[00:11:36] é só você apertar Ctrl S e a bola branca sumiu.
[00:11:39] Significa que esse arquivo está salvo
[00:11:41] E finalmente está tudo configurado
[00:11:44] Essa configuração toda que a gente fez no vídeo
[00:11:46] Você só vai precisar fazer uma vez
[00:11:47] E agora toda vez que você quiser publicar um aplicativo
[00:11:50] É só você vir no chat e falar
[00:11:52] Publique esse aplicativo seguindo o passo a passo do
[00:11:55] E se você digitar barra
[00:11:57] Você vai conseguir ver todos os workflows que você tem disponíveis
[00:12:01] São prompts prontos para o Antigravity usar
[00:12:03] E eu vou selecionar o workflow que a gente acabou de criar
[00:12:05] Mas ele é idêntico ao publicar app
[00:12:07] Então, seguindo o passo a passo do work test, e se eu enviar, ele vai seguir todo aquele passo a passo e vai usar o MCP da Qlify para fazer toda a configuração para a gente.
[00:12:17] E é exatamente o que a gente vai fazer agora na prática.
[00:12:20] E agora você vai ver o passo a passo de como publicar qualquer aplicativo depois que você tiver feito essa configuração.
[00:12:25] Então, vou abrir o projeto que eu quero configurar, e esse é o projeto FloraCare, que é exatamente esse aplicativo que a gente viu no início do vídeo.
[00:12:32] Ele está como localhost, mas a gente vai publicar ele na nossa VPS, no nosso computador da Hostinger e também vai adicionar um domínio.
[00:12:40] E esses arquivos estão no nosso computador, mas como a gente viu no início do vídeo, a gente quer enviar do nosso computador para o GitHub e a partir do GitHub a Qlify vai fazer todo o resto.
[00:12:49] E para publicar um projeto no GitHub é só você vir em Source Control, aqui do lado, e eu desinstalei o Git do meu computador para a gente fazer o passo a passo juntos.
[00:12:57] Você vai abrir, vai clicar nessa primeira opção laranja aqui em cima, e ele está baixando no meu computador, vai abrir, executar, próximo, próximo, só sair apertando próximo, não precisa configurar nada.
[00:13:12] Pode manter a configuração padrão que vem mesmo, use Vim, deixar Git decidir, próximo, e é só ir seguindo com as opções padrão mesmo, e instalar.
[00:13:21] Finalizar
[00:13:23] E pode fechar essa tela que o Git abriu
[00:13:26] E se a gente vier agora no nosso Antigravity
[00:13:29] E clicar em Reload
[00:13:31] Atualizar, vem aqui
[00:13:32] Agora você vai conseguir publicar todo o seu projeto no GitHub com um clique
[00:13:36] E agora se a gente clicar em Publicar no GitHub
[00:13:39] Ele vai perguntar se você quer que esse seja um repositório público
[00:13:42] Ou seja, todas as pessoas que entrarem na sua conta do GitHub
[00:13:45] Vão conseguir visualizar todo o código da sua aplicação
[00:13:49] Talvez você queira fazer isso mesmo
[00:13:51] ou então você pode deixar privado.
[00:13:52] No meu caso, eu vou deixar esse repositório privado.
[00:13:55] Ok, e está publicando no GitHub.
[00:13:59] E foi publicado no seu repositório do GitHub.
[00:14:03] A gente consegue abrir clicando bem aqui.
[00:14:06] E todos os arquivos desse nosso projeto estão salvos no GitHub.
[00:14:10] Você consegue ver tudo o que ele adicionou bem aqui.
[00:14:12] Esses são todos os arquivos.
[00:14:14] E você consegue visualizar no GitHub vindo em Main
[00:14:16] e abrindo no GitHub clicando bem aqui.
[00:14:21] E esse é o nosso repositório.
[00:14:23] Todos os arquivos desse nosso projeto, desse nosso aplicativo, estão salvos agora no nosso GitHub.
[00:14:28] Foram enviados seis minutos atrás.
[00:14:30] Se a gente abrir, a gente consegue ver tudo o que existe dentro desse aplicativo, todos os códigos.
[00:14:35] E agora que esse nosso projeto está no GitHub, para a gente publicar ele,
[00:14:39] a gente só precisa vir no nosso Antigravity e pedir bem aqui.
[00:14:43] Publique esse app usando o passo a passo do...
[00:14:47] barra e selecionar o workflow que a gente criou agora há pouco.
[00:14:50] Que no caso foi o WorkTest
[00:14:52] E para mim o Publicarep é idêntico ao WorkTest
[00:14:54] Mas vou usar esse mesmo que a gente acabou de criar
[00:14:56] Enviar
[00:14:57] E agora ele vai buscar onde esse aplicativo está salvo no nosso GitHub
[00:15:01] E vai fazer todo o envio para a VPS automaticamente
[00:15:04] Então ele está usando as ferramentas da Qlify
[00:15:07] Ele verificou que não tem o arquivo do AcreFile no projeto
[00:15:11] Ele vai criar ele
[00:15:12] Vai verificar o repositório do Git
[00:15:16] E deploy do FloraCare concluído com sucesso
[00:15:21] O aplicativo está online e uma URL temporária
[00:15:23] Então o aplicativo FloraCare foi implantado com sucesso no Qlify
[00:15:27] E essa é a URL que agora qualquer pessoa do mundo consegue acessar esse aplicativo a partir desse link
[00:15:32] Vamos abrir ele
[00:15:33] E é exatamente esse link
[00:15:36] Se a gente atualizar essa página
[00:15:37] Agora qualquer pessoa consegue acessar esse aplicativo a partir dessa URL
[00:15:41] Mas a gente quer mudar essa URL, quer escolher qual a gente vai usar
[00:15:44] E ele já nos mostra os próximos passos para configurar o domínio e exatamente o que a gente vai fazer agora.
[00:15:49] A gente vai vir no painel da Hostinger, página inicial, e você consegue resgatar o seu domínio que você ganhou grátis depois que assinou a VPS.
[00:15:57] Mas eu já tenho dois domínios aqui, eu vou usar eles.
[00:16:00] Depois que você resgatar o seu domínio, eles vão aparecer bem aqui, onde esses meus domínios estão aparecendo.
[00:16:05] Eu vou gerenciar, DNS, e a gente vai adicionar um registro de DNS.
[00:16:10] E ele nos explica como a gente tem que configurar.
[00:16:12] Então, registro tipo A, e está tipo A.
[00:16:15] No nome, o subdomínio desejado.
[00:16:18] Ele dá um exemplo app ou arroba para a raiz.
[00:16:20] E o que ele está dizendo nesse nome é que se a gente quiser usar essa URL,
[00:16:25] esparotest.cloud, para acessar esse aplicativo, a gente tem que deixar no nome arroba,
[00:16:29] para direcionar o domínio principal para esse aplicativo.
[00:16:33] Mas, por exemplo, se a gente quisesse botar app.esparotest.cloud,
[00:16:37] A gente adicionaria no nome app
[00:16:40] Ou então se a gente quisesse flora.sparotest.cloud
[00:16:44] A gente adicionaria flora bem aqui
[00:16:46] Aponta para
[00:16:47] E esse é o IP da nossa VPS, do nosso computador
[00:16:51] Da Hostinger
[00:16:52] E adicionar registro
[00:16:54] Confirmar
[00:16:57] E registro o DNS criado com sucesso
[00:16:59] E o último passo que a gente precisa fazer é vir na nossa Qlify
[00:17:03] Dashboard
[00:17:05] Vou abrir o projeto
[00:17:07] abrir a aplicação, FloraCare
[00:17:09] e a gente tem que alterar esse domínio
[00:17:11] para o domínio que a gente quer usar.
[00:17:13] E vou alterar esse domínio para
[00:17:14] sparotest.cloud
[00:17:17] Mas ao invés de HTTP
[00:17:18] a gente quer deixar HTTPS
[00:17:20] e a diferença é que se você deixar HTTP
[00:17:23] sem o S, o seu aplicativo
[00:17:25] vai mostrar que ele não é seguro.
[00:17:27] Exatamente como está aparecendo aqui na Qlify.
[00:17:29] Mas os sites que são em
[00:17:30] HTTPS tem
[00:17:33] esse cadeado mostrando que a conexão
[00:17:35] é segura. E as informações, como o número de cartão de crédito, permanecem privadas
[00:17:39] quando são enviadas para esse site. E é isso que a gente quer. Vou salvar, redeploy
[00:17:44] bem aqui e, assim que finalizar, nosso aplicativo vai estar hospedado na VPS, no computador
[00:17:51] da Hostinger e também com um domínio próprio. E, finalizado, e agora, se a gente abrir
[00:17:59] essa URL, esparotest.cloud
[00:18:03] e esse nosso aplicativo vai estar rodando lá, independente do nosso computador estar ligado
[00:18:07] ou não. E por exemplo, eu tenho um outro domínio que é o esparo.com.br
[00:18:11] então se eu quisesse que fosse flora.esparo.com.br
[00:18:14] no nome eu adicionaria flora, aponta para
[00:18:19] tem que ser a IP da VPS que o AntiGravity nos entregou
[00:18:23] que é essa IP, mas você também conseguiria
[00:18:27] encontrar vindo em VPS, gerenciar e sweeper. Vai estar bem aqui embaixo, mas eu vou colar
[00:18:34] aqui, adicionar registro, confirmar e registra o DNS criado com sucesso. Vou vir no Qlify,
[00:18:41] alterar o domínio para esse domínio que a gente acabou de criar, flora.sparo.com.br,
[00:18:48] Salvar, redeploy, finalizado.
[00:18:53] E agora se a gente abrir, flora.esparo.com.br, a gente vai acessar esse site.
[00:19:00] Poderia ser, por exemplo, app.esparo.com.br, você cria um aplicativo para uma empresa em específico
[00:19:06] e você bota no mesmo domínio que ela usa, só com o app antes.
[00:19:10] E eu sei que pode parecer intimidador toda essa configuração que a gente fez nesse vídeo,
[00:19:15] mas você só vai precisar fazer isso uma vez.
[00:19:17] E depois que você tiver feito uma vez isso, você vai conseguir publicar qualquer aplicativo em dois minutos.
[00:19:23] Se for levar em consideração o tempo para adicionar o domínio também, três minutos.
[00:19:27] E agora que você tiver feito esse passo a passo, você pode ir além, por exemplo, ir na Qlify, projetos,
[00:19:34] adicionar recurso a um projeto específico e a gente consegue adicionar, por exemplo, o Umami.
[00:19:40] E esse recurso da Umami vai nos permitir ter uma análise de quantas pessoas entraram no site,
[00:19:46] o tempo que elas passaram, de onde elas estão acessando, literalmente um analytics completo
[00:19:51] para o seu aplicativo.
[00:19:52] E se você quiser aprender como fazer isso e muito mais, no primeiro link da descrição
[00:19:57] vocês vão encontrar a Masterclass de Antigravity.
[00:20:00] E nessa Masterclass você vai encontrar tudo o que você precisa para extrair o máximo
[00:20:04] do Antigravity.
[00:20:05] E o mais legal dessa Masterclass é que ela vai te dar acesso à comunidade paga dos alunos.
[00:20:10] E eu estou reformulando toda essa comunidade para que ela seja a melhor comunidade de antigravity
[00:20:16] do mundo.
[00:20:17] A gente vai compartilhar projetos, você pode tirar dúvidas, vão ter desafios valendo
[00:20:21] dinheiro, então não deixa de conferir.
[00:20:24] Ao invés de passar tempo no Instagram, investe seu tempo dentro dessa comunidade.
[00:20:28] Tenho certeza que vai ser muito melhor.
[00:20:30] Se esse vídeo tiver te ajudado, deixa um like e um comentário que vai me dizer que
[00:20:34] vocês querem ver mais vídeos como esse.
[00:20:36] E se eu não te ver na comunidade, até o próximo vídeo.
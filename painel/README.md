# Painel do AIOS

O frontend do seu AIOS. Mostra, num lugar só, **tudo que o AIOS faz por você**: quais
automações existem, se estão ligadas, quando rodaram pela última vez, o resultado da
última execução (logs e resumos), as conexões e as decisões. E deixa você **acionar** o
que dá pra acionar — sempre com confirmação.

## Como abrir

Dois cliques em **`abrir-painel.cmd`**. Ele sobe o servidor e abre o navegador em
`http://127.0.0.1:4317`.

- **`abrir-painel.cmd`** — abre com uma janelinha minimizada (o servidor). Feche a janela pra parar.
- **`abrir-painel-oculto.vbs`** — abre sem nenhuma janela (servidor em segundo plano).
- **`parar-painel.cmd`** — para o painel quando estiver rodando oculto.

Precisa só do **Node.js** instalado (você já tem). Zero dependências, nada de `npm install`.

## O que dá pra fazer pelo painel

Toda ação pede **confirmação** antes de rodar:

| Ação | O que faz | Risco |
|---|---|---|
| 🌅 Rodar resumo agora | Dispara o Resumo Matinal na hora | Nenhum (só lê e mostra) |
| 📸 Preparar post do Instagram | Você envia o vídeo do Reels e recebe título, legenda e 3 capas pra copiar/baixar | Nenhum (não publica) |
| 💬 Rascunhar Skool | Lê a comunidade e rascunha respostas | Nenhum (não publica) |
| ⏻ Ligar / desligar | Pausa ou reativa uma automação agendada | Reversível |
| 👁 Ver resumo / logs / rascunhos | Abre o último resultado | Nenhum (leitura) |
| 🤝 Ver parcerias | Página `/parcerias.html` com todas as propostas, ordenáveis por **relevância da empresa** ou por **data** | Nenhum (leitura) |

## Como ele sabe das coisas

Tudo é lido **ao vivo** do seu próprio sistema — nada é inventado:

- **Status (ligada/desligada, última vez, resultado)** → Agendador de Tarefas do Windows (`lib/status.ps1`)
- **Resumos e rascunhos** → os JSON que as automações gravam em `C:\tmp\`
- **Logs** → os arquivos de log de cada automação
- **Conexões / decisões / capacidades** → `connections.md`, `decisions/log.md`, as skills

## Onde mexer

- **`lib/registro.js`** — a lista de automações. Pra ensinar uma capacidade nova ao
  painel, é só adicionar um objeto aqui (com onde ficam o log e a saída).
- **`lib/coletor.js`** — lê o estado do disco e do Agendador (só leitura).
- **`lib/acoes.js`** — a allowlist do que pode ser executado. Nada fora daqui roda.
- **`public/`** — a cara do painel (HTML/CSS/JS).

## Segurança

- Escuta só em `127.0.0.1` (sua máquina). Ninguém de fora acessa.
- O navegador nunca manda caminho de arquivo nem comando: só o **id** de uma ação
  conhecida. O servidor resolve o resto pela allowlist.

## Futuro (quando for virar web app pra acessar do celular)

Trocar `AIOS_HOST` pra `0.0.0.0` e colocar atrás de autenticação. A base já está pronta
pra isso — o front fala com o back por uma API HTTP comum.

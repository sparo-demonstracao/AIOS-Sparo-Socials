# AIS-OS Intake

This is the source-of-truth file for your AIOS. Fill it in by typing, voice-pasting (Wispr Flow / OS dictation), or running `/onboard` for a guided conversation. Whichever mode, this file is what `/onboard` reads to scaffold your Day-1 setup.

**Hard cap: 7 questions.** Each answerable in under 60 seconds. Don't overthink — you can edit and re-run `/onboard` any time.

---

## Q1 — Who are you, what do you sell, who do you sell it to?

Identity, offer, ICP. One paragraph each is fine.

```
Identidade: Enzo Barbato. Tenho um canal no YouTube sobre automação, onde ensino como usar
Claude Code e Antigravity para criar automações, sites, aplicativos e sistemas para empresas.
Também tenho uma agência de automação chamada Sparo Automações.

Oferta: Curso completo de Antigravity e Claude Code que ensina qualquer pessoa — mesmo sem
saber programar, sem escrever uma linha de código — a criar automações, sites, aplicativos e
sistemas para empresa. Vendido a R$ 400,00. Ofereço o curso em todos os vídeos do YouTube.

ICP: Pessoas que querem aprender a criar automações e automatizar um processo específico.
Vai de donos de pequenas e médias empresas (querem mais produtividade, menos erro humano,
substituir funções por IA) a quem quer montar a própria agência de automação ou automatizar
um processo da empresa onde trabalha. Público leigo em programação — nunca criaram nada com
código. Empresas grandes não são o foco (preferem contratar em vez de aprender).
```

---

## Q2 — Paste 1-2 things you've written recently. Don't edit them.

An email, a LinkedIn post, a DM, a doc — anything that sounds like you when you're not trying. **Paste verbatim.** Do not type these mid-conversation with Claude — chat-shaped samples are worse than no samples (voice contamination).

```
Sample 1 — Aniversário rápido pro primo (WhatsApp):

Markinnnn
FELIZ ANIVERSÁRIOOO!! Que seja um ano abençoado, de muita felicidade, amor e saúde na sua
vida e que papai do céu continue nos abençoando!! Amo você e desculpa não ter mandado ontem
kkkkkk eu lembrei antes de ontem e hoje, mas ontem nem vi a data
Te amo meu brabo!!!
E po, final de semana que vem bora pra itaipava??
```

```
Sample 2 — Email de parceria (Mauricio / Hostinger):

Fala Mauricio, tudo certo?

Eu tentei na última semana, e hoje também, sacar o valor da comissão pelo painel da Hostinger
e o botão não está funcionando. Vou anexar um print pra você entender qual botão estou
tentando usar pra fazer o saque.

Será que você consegue me ajudar por gentileza?

Forte abraço,
Enzo Barbatto

---

Boa tarde Mauricio, como você tá?

Tenho interesse em fazer esse conteúdo sim, o que acha de fazermos um conteúdo nesse mês (para
ser postado até o dia 28) e o próximo 30 dias depois (28 de Abril)?

Acredito que dessa forma vai parecer mais uma recomendação pessoal e não uma propaganda em si,
e por conta disso acredito que vamos conseguir converter mais.

Estou para gravar um vídeo onde vou desenvolver um projeto do zero até a hospedagem, e posso
oferecer a VPS da Hostinger como opção profissional de deploy. Faria sentido para vocês?

Além disso, recebi o pagamento do segundo vídeo pro youtube que fizemos parceria mas, pra ser
bem sincero, ainda não entrei em contato com a equipe de pagamento das comissões, mas vou
fazer isso agora mesmo e dou um feedback pra você.

Agradeço o interesse na parceria Mauricio,
Forte Abraço!
```

---

## Q3 — What are your 2-3 biggest priorities for the next 90 days?

Quarterly priorities. Not yearly aspirations. Things that, if not done by July, would make you say "I wasted Q2."

```
1. Vender mais de R$ 70.000/mês com o curso (até fim de setembro/2026)
2. Ser constante no YouTube: 8 vídeos por mês
3. Começar o Instagram (do zero)
4. Ativar a Sparo Automações (hoje parada por foco no infoproduto) e ter 5 clientes recorrentes
5. Começar a vender com tráfego pago
```

---

## Q4 — Where does revenue actually land, and where is it tracked?

Multiple answers OK. Stripe? Skool? GoHighLevel? QuickBooks? A spreadsheet?

```
Receita: Kiwify (vendas do curso) + YouTube Studio (receita do canal).
Acompanhamento: Dashboard da Kiwify.
```

---

## Q5 — Where do you talk to customers, your team, and the outside world day-to-day?

Email (which one — Gmail / Outlook)? Slack? Teams? DMs (Skool / Discord / iMessage)? Phone?

```
Gmail, WhatsApp, comunidade no Skool e comentários dos vídeos do YouTube.
```

---

## Q6 — Where do meeting recordings, notes, and important docs live?

Granola? Otter? Fireflies? Google Drive? Notion? Dropbox? A folder on your desktop you keep meaning to organize?

```
Notion: roteiros, conteúdo do curso, ideias de apps para criar, ideias de conteúdo.
Fireflies: gravações/transcrições de reunião (vazio por enquanto).
Google Drive: envio de arquivos para o editor de vídeo.
```

---

## Q7 — What's the one task that eats your week, and where do you currently track work?

The single biggest time-suck or recurring drudgery. Plus where tasks/projects live (ClickUp / Asana / Linear / Notion / a notebook).

```
Maior sugador de tempo: escolher os melhores vídeos para gravar e criar os roteiros — com base
nos vídeos antigos (para criar conexões entre os vídeos) e nas referências que admiro (YouTubers
gringos que me inspiram).

Gestão: vídeos a gravar no Notion; agenda no Google Calendar.
```

---

When this file is filled, run `/onboard` (or re-run it) and the wizard will scaffold your Day-1 file set: `context/`, `references/voice.md`, populated `connections.md`, and a filled `CLAUDE.md`.

# Template de descrição do YouTube (@EnzoSparo)

Padrão das descrições. **Só 3 partes mudam por vídeo:** resumo, capítulos e hashtags. O resto é
fixo e não pode ser alterado pela automação. Implementado em
`scripts/yt-auto-descricao/processar.py`.

## Bloco fixo — topo (nunca muda)

```
🎓MasterClass de Antigravity + Claude Code (Curso Completo do Básico ao Avançado): https://masterclass.sparo.com.br/

🌍Nossa comunidade Grátis: https://www.skool.com/comunidade-de-automacao-com-ia-8164
🌟Hospede suas automações e aplicativos na VPS da Hostinger (10% OFF usando o cupom SPARO10): https://hostinger.com/SPARO10

📞Minha Agência de Automação(Sparo Automações): https://sparo.com.br
🤝Trabalhe comigo: Entre em contato pelo chat da nossa comunidade grátis!

Antigravity Download: https://antigravity.google/download
```

## Partes variáveis (geradas da transcrição)

1. **Resumo** — 1 parágrafo (4-7 frases). Começa forte, fala em resultado concreto, tom do canal
   (PT-BR, informal-profissional, "você", frases curtas). Só o que foi dito no vídeo, sem inventar.
2. **Capítulos** — sob a linha `Neste tutorial, você aprenderá:`. 6-12 itens, formato `MM:SS - Título`
   (ou `H:MM:SS` se passar de 1h). **Primeiro obrigatoriamente `00:00`**, em ordem crescente, ≥10s
   entre cada (regra do YouTube pra renderizar capítulos: mínimo 3, primeiro em 0:00). Títulos curtos
   e que dão curiosidade.
3. **Hashtags** — 6 a 9. Fixas sempre: `#Antigravity #ClaudeCode #Automação #IA #SparoAutomacoes`.
   Mais 1-4 específicas do tema.

## Bloco fixo — rodapé (nunca muda)

```
Gostou do vídeo? Deixe seu like, inscreva-se no canal e ative o sininho para não perder nenhuma novidade sobre automação e inteligência artificial. Se tiver alguma dúvida, deixe nos comentários abaixo!
```

## Montagem final

```
<TOPO FIXO>

<RESUMO>

Neste tutorial, você aprenderá:
<CAPÍTULOS>

<HASHTAGS>

<RODAPÉ FIXO>
```

Limite do YouTube: 5000 caracteres (folgado). Sem `<` ou `>` (a API rejeita) — o script remove.

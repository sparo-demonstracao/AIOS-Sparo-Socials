# Deploy do site de descoberta no Railway + domínio acbarbatto.sparo.com.br

Pasta com tudo pronto: `index.html` (o site) + `server.js` (servidor estático) + `package.json`.
O banco continua no Supabase (projeto Lead-se, tabela `descoberta_respostas`) — não muda nada lá.

## 1. Subir no Railway (caminho CLI — o mais rápido)

```bash
npm i -g @railway/cli          # instala a CLI (1x só)
railway login                  # abre o navegador pra logar
cd "scripts/site-descoberta"   # entrar nesta pasta
railway init                   # cria um novo projeto Railway (dá um nome, ex: sparo-descoberta)
railway up                     # faz o deploy desta pasta
```

No fim, no painel do Railway, abra o serviço → **Settings → Networking → Generate Domain**
pra ele criar um domínio `*.up.railway.app` e confirmar que o site está no ar.

> Alternativa sem CLI: no painel do Railway → New Project → Deploy from GitHub repo
> (ou "Empty Project" e subir esta pasta). Se usar o repo do AIOS inteiro, defina
> **Root Directory = scripts/site-descoberta**.

## 2. Domínio acbarbatto.sparo.com.br

No Railway: serviço → **Settings → Networking → Custom Domain** → digite
`acbarbatto.sparo.com.br`. O Railway vai mostrar um **CNAME de destino** (algo como
`xxxxx.up.railway.app`). Copie esse valor.

No painel de DNS do `sparo.com.br`, crie um registro:

| Tipo  | Nome / Host  | Valor / Destino                 | TTL     |
|-------|--------------|---------------------------------|---------|
| CNAME | `acbarbatto` | (o destino que o Railway mostrou) | automático |

- É subdomínio, então CNAME funciona perfeitamente.
- O Railway emite o certificado HTTPS sozinho depois que o DNS propaga (alguns minutos a 1h).
- Quando propagar: `https://acbarbatto.sparo.com.br` abre o site, e o link pra tia vira
  `https://acbarbatto.sparo.com.br/?r=tia`.

## 3. Depois

- Avise o AIOS que subiu — ele verifica o domínio e o salvamento end-to-end.
- A função `perguntas` no Supabase pode ser apagada depois (não é mais usada pra servir o site).

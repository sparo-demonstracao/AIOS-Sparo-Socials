# Run-DailyBrief.ps1 — AIOS "Resumo Matinal" (versão interativa)
# Coleta WhatsApp (WAHA) + E-mail (Gmail/gws) + YouTube (comentários) das últimas 24h, COM o link
# de cada item. Manda o claude -p devolver JSON priorizado (na voz do Enzo) referenciando os itens
# por ID; resolve os links; grava aios-brief.json e abre o pop-up interativo (popup.ps1).

param([switch]$NoPopup, [switch]$Force)

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Proj        = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials"
$GwsCmd      = "C:\Users\canal\AppData\Roaming\npm\gws.cmd"
$GitBash     = "C:\Program Files\Git\bin\bash.exe"
$ClaudePosix = "/c/Users/canal/.local/bin/claude"
$LogFile     = "C:\tmp\aios-daily-brief.log"
$JsonOut     = "C:\tmp\aios-brief.json"
$ProgressFile= "C:\tmp\aios-brief-progress.log"
$PopupPs1    = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\daily-brief\popup.ps1"

function Log($msg){ try { Add-Content -Path $LogFile -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg) -Encoding utf8 } catch {} }
# Step(): igual ao Log, mas TAMBÉM acrescenta uma linha limpa (sem timestamp) no arquivo de progresso
# que a tela de carregamento (loading-brief.ps1) lê ao vivo — é o "log de verdade" que você vê na tela.
function Step($msg){ Log $msg; try { Add-Content -Path $ProgressFile -Value $msg -Encoding utf8 } catch {} }
function To-Posix($p){ $p=$p -replace '\\','/'; if($p -match '^([A-Za-z]):(.*)$'){ '/'+$matches[1].ToLower()+$matches[2] } else { $p } }
function Trunc($s,$n){ if($null -eq $s){return ""}; $s=[string]$s; if($s.Length -gt $n){ $s.Substring(0,$n)+[char]0x2026 } else { $s } }
function PhoneDigits($s){ $d = ([string]$s) -replace '\D',''; if($d.Length -ge 10){ $d } else { $null } }
# WAHA: o fromMe vem no TOPO da mensagem (m.fromMe); o m._data.fromMe costuma vir VAZIO. Ler na ordem certa
# é o que conserta a inversão de "quem falou" (Enzo vs. contato).
function MsgFromMe($m){ if($null -eq $m){return $false}; if($null -ne $m.fromMe){[bool]$m.fromMe} elseif($m._data -and $null -ne $m._data.fromMe){[bool]$m._data.fromMe} else {$false} }
function MsgBody($m){
  $b= if($m.body){[string]$m.body}elseif($m._data.body){[string]$m._data.body}else{""}
  if(-not $b){
    $ty= if($m.type){$m.type}elseif($m._data.type){$m._data.type}else{""}
    switch($ty){ 'ptt'{$b='[áudio]'} 'audio'{$b='[áudio]'} 'image'{$b='[imagem]'} 'video'{$b='[vídeo]'} 'document'{$b='[documento]'} 'sticker'{$b='[figurinha]'} 'location'{$b='[localização]'} default{$b=''} }
  }
  $b
}

# --- Guarda "uma vez por dia" -------------------------------------------------
# Sem -Force: se JÁ existe um resumo gerado HOJE, não recoleta — só reabre o pop-up
# com o resumo do dia. Assim os gatilhos das 7:55 e do logon (ligar o PC) não
# duplicam trabalho: o que vier primeiro coleta, o outro reaproveita. O botão
# "Rodar agora" do painel chama com -Force pra sempre buscar de novo.
if (-not $Force -and (Test-Path $JsonOut) -and ((Get-Item $JsonOut).LastWriteTime.Date -eq (Get-Date).Date)) {
  Log "Resumo de hoje já existe — reabrindo sem recoletar (use -Force pra atualizar)."
  if (-not $NoPopup) {
    try { . $PopupPs1; Show-BriefPopup ([System.IO.File]::ReadAllText($JsonOut, [System.Text.Encoding]::UTF8)) }
    catch { Log "Pop-up (reuso) ERRO: $($_.Exception.Message)" }
  }
  return
}

Log "===== Início do Resumo Matinal (interativo) ====="
# zera o arquivo de progresso (cada execução começa com a tela de logs limpa)
try { Remove-Item $ProgressFile -ErrorAction SilentlyContinue } catch {}
Step "🌅 Acordando o AIOS e abrindo suas caixas de entrada..."

$envMap=@{}
Get-Content (Join-Path $Proj ".env") | ForEach-Object { if($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$'){ $envMap[$matches[1]]=$matches[2].Trim() } }
# Janela de 7 DIAS: mostramos TUDO da última semana que ainda ESPERA resposta (não só as últimas 24h),
# pra nada escapar quando o Enzo passa 2-3 dias sem responder. Cada fonte tem seu filtro de "não respondido":
# WhatsApp = última msg é do contato; Gmail/Zoho = eu não respondi por último / não mandei resposta;
# YouTube = eu não respondi o comentário. Depois, na montagem, o que é de HOJE fica no topo e o que tem
# 2+ dias vai pro bloco "Pendentes da semana".
$sinceUnix=[DateTimeOffset]::UtcNow.AddDays(-7).ToUnixTimeSeconds()
$sinceUtc=(Get-Date).ToUniversalTime().AddDays(-7)

$linkMap=@{}
$waNumMap=@{}   # id do item WhatsApp -> número (pra montar o link com a resposta pré-digitada)
$tsMap=@{}      # id do item -> timestamp unix (segundos) -> ordena tudo cronologicamente (mais antigo no topo)
$ytMeta=@{}     # id do comentário YouTube -> @{ videoId } (pra agrupar por vídeo)
$ytTitles=@{}   # videoId -> título do vídeo (cabeçalho de cada grupo)

# ===================== WHATSAPP =====================
Step "📱 Lendo suas conversas no WhatsApp..."
$waItems=New-Object System.Collections.ArrayList
try {
  $hdr=@{ "X-Api-Key"=$envMap['WAHA_API_KEY'] }; $base=$envMap['WAHA_BASE_URL']
  $chats=Invoke-RestMethod -Uri "$base/api/default/chats?limit=100" -Headers $hdr -TimeoutSec 60
  foreach($c in @($chats | Where-Object { $_.timestamp -ge $sinceUnix } | Select-Object -First 60)){
    $nome= if($c.name){$c.name}else{$c.id.user}
    $tag = if($c.isGroup){"(grupo) $nome"}else{$nome}
    $num = if($c.id.server -eq 'c.us'){ $c.id.user } else { PhoneDigits $nome }
    $url = if($num){ "https://wa.me/$num" } else { "https://web.whatsapp.com/" }
    # Coleta a conversa dos DOIS lados (você + contato), em ordem cronológica, pra a IA ter CONTEXTO real
    # de quem disse o quê — sem isso ela inverte os papéis e perde o assunto da conversa.
    # WAHA WEBJS (CORE) é instável pro histórico: precisa de downloadMedia=false (senão estoura 500 baixando
    # mídia) e às vezes falha com 'waitForChatLoading' mesmo assim. Tentamos 2x; quando vem, dá a conversa
    # inteira (contexto real). Quando não vem, caímos na ÚLTIMA mensagem do chat — que SEMPRE existe e já traz
    # o fromMe certo. Assim, no pior caso, ainda mostramos 1 mensagem com o lado correto (sem inverter).
    $pairs=New-Object System.Collections.ArrayList
    $enc=[uri]::EscapeDataString($c.id._serialized)
    $msgs=$null
    for($try=1; $try -le 2 -and -not $msgs; $try++){
      try { $msgs=Invoke-RestMethod -Uri "$base/api/default/chats/$enc/messages?limit=40&downloadMedia=false" -Headers $hdr -TimeoutSec 40 }
      catch { $msgs=$null; if($try -lt 2){ Start-Sleep -Milliseconds 900 } }
    }
    if($msgs){
      foreach($m in @($msgs)){
        $b=MsgBody $m
        if(-not $b){ continue }
        $ts= if($m.timestamp){$m.timestamp}elseif($m._data.t){$m._data.t}else{0}
        [void]$pairs.Add([pscustomobject]@{ ts=[int64]$ts; fm=(MsgFromMe $m); b=[string]$b })
      }
    }
    if($pairs.Count -eq 0 -and $c.lastMessage){
      $lb=MsgBody $c.lastMessage
      if($lb){ [void]$pairs.Add([pscustomobject]@{ ts=[int64]$c.timestamp; fm=(MsgFromMe $c.lastMessage); b=[string]$lb }) }
    }
    if($pairs.Count -eq 0){ continue }
    # ordena por tempo e pega as últimas ~14 mensagens (contexto recente da thread, mesmo que parte seja de +24h)
    $ordered=@($pairs | Sort-Object ts | Select-Object -Last 14)
    if(-not @($ordered | Where-Object { $_.ts -ge $sinceUnix }).Count){ continue }   # nada nas últimas 24h: pula
    $lines=@(); foreach($p in $ordered){ $who= if($p.fm){"Você"}else{$nome}; $lines += ("{0}: {1}" -f $who,(Trunc $p.b 160)) }
    $transcript=$lines -join "`n"
    $aguardando=(-not [bool]$ordered[-1].fm)   # última mensagem é do contato => espera você responder
    if(-not $aguardando){ continue }           # você JÁ respondeu por último: não precisa mostrar
    $id="W$($waItems.Count+1)"; $linkMap[$id]=$url
    if($num){ $waNumMap[$id]=$num }
    $tsMap[$id]=[int64]$ordered[-1].ts   # última mensagem da conversa (pra ordenar cronologicamente)
    [void]$waItems.Add(@{ id=$id; nome=$tag; num=$num; url=$url; transcript=$transcript; aguardando=$aguardando })
    if($waItems.Count -ge 20){break}
  }
  Step "📱 WhatsApp: $($waItems.Count) conversa(s) esperando resposta (últimos 7 dias)"
} catch { Step "📱 WhatsApp indisponível agora (sigo com o resto)"; Log "WhatsApp ERRO: $($_.Exception.Message)" }

# ===================== E-MAIL (GMAIL) =====================
# "Não respondido" no Gmail = threads da INBOX dos últimos 7 dias cuja ÚLTIMA mensagem NÃO fui eu.
# Pego a lista da Inbox (7d) -> junto por thread (1 entrada por conversa, a mais recente no topo) ->
# pra cada thread, threads.get olha a ÚLTIMA mensagem: se o "From" for eu, já respondi -> pula.
# (Mesma regra do WhatsApp; NÃO uso "in:inbox" com espaço porque o gws/PS 5.1 quebra query com espaço —
#  uso labelIds em vez disso.)
$myGmail='agenciasparo@gmail.com'
Step "📧 Abrindo o Gmail e vendo o que ainda não foi respondido (últimos 7 dias)..."
$emItems=New-Object System.Collections.ArrayList
try {
  $listOut=& $GwsCmd gmail users messages list --params '{\"userId\":\"me\",\"q\":\"newer_than:7d\",\"labelIds\":[\"INBOX\"],\"maxResults\":120}' --format json 2>$null
  $list=($listOut | Out-String | ConvertFrom-Json)
  # gws devolve um JSON com .error quando a auth expira (exit 2). SEM isto, "0 e-mails" mascara
  # o login vencido e finge caixa vazia — foi o que aconteceu. Detecta e grita no log/tela.
  if($list.error){
    $ecode=$list.error.code; $emsg=[string]$list.error.message
    if($emsg -match 'invalid_grant|expired|revoked|auth'){
      Step "📧 Gmail SEM ACESSO — o login do gws expirou. Rode: gws auth login (veja references/gws-cli.md)"
    } else {
      Step "📧 Gmail com erro ($ecode) — sigo com o resto"
    }
    Log "Gmail ERRO(API): $ecode $emsg"
  } else {
    # 1 entrada por thread, preservando a ordem (a API já vem do mais novo pro mais antigo)
    $threadOrder=New-Object System.Collections.ArrayList; $seenTh=@{}
    foreach($mid in @($list.messages)){
      $tid= if($mid.threadId){[string]$mid.threadId}else{[string]$mid.id}
      if(-not $tid -or $seenTh.ContainsKey($tid)){ continue }
      $seenTh[$tid]=$true; [void]$threadOrder.Add($tid)
    }
    foreach($tid in @($threadOrder | Select-Object -First 50)){
      try {
        $tp='{\"userId\":\"me\",\"id\":\"'+$tid+'\",\"format\":\"metadata\",\"metadataHeaders\":[\"From\",\"Subject\"]}'
        $tOut=& $GwsCmd gmail users threads get --params $tp --format json 2>$null
        $th=($tOut | Out-String | ConvertFrom-Json)
        $msgs=@($th.messages); if($msgs.Count -eq 0){ continue }
        $last=$msgs[$msgs.Count-1]   # última mensagem da conversa
        $lastFrom=($last.payload.headers | Where-Object {$_.name -eq 'From'} | Select-Object -First 1).value
        if($lastFrom -and ($lastFrom -match [regex]::Escape($myGmail))){ continue }   # eu respondi por último -> pula
        $subj=($last.payload.headers | Where-Object {$_.name -eq 'Subject'} | Select-Object -First 1).value
        $id="E$($emItems.Count+1)"; $linkMap[$id]="https://mail.google.com/mail/u/0/#all/$tid"
        $tsMap[$id]= if($last.internalDate){ [math]::Floor([int64]$last.internalDate/1000) } else { 0 }   # internalDate vem em ms
        [void]$emItems.Add(@{ id=$id; texto="De: $lastFrom | Assunto: $subj | Trecho: $(Trunc $last.snippet 140)"; url=$linkMap[$id] })
        if($emItems.Count -ge 30){break}
      } catch { Log "Gmail thread get falhou: $($_.Exception.Message)" }
    }
    Step "📧 Gmail: $($emItems.Count) conversa(s) sem resposta (últimos 7 dias)"
  }
} catch { Step "📧 Gmail indisponível agora (sigo com o resto)"; Log "Gmail ERRO: $($_.Exception.Message)" }

# ===================== E-MAIL ZOHO =====================
# Mesmo padrão do YouTube: OAuth refresh token no .env -> access token -> REST.
# Fica INERTE se o .env não tiver ZOHO_CLIENT_ID + ZOHO_REFRESH_TOKEN (nada quebra até configurar).
# Header do Zoho é "Zoho-oauthtoken <token>" (NÃO "Bearer"). receivedTime vem em epoch MILISSEGUNDOS (string).
$zoItems=New-Object System.Collections.ArrayList
if($envMap['ZOHO_CLIENT_ID'] -and $envMap['ZOHO_REFRESH_TOKEN']){
  Step "📧 Abrindo o Zoho Mail e vendo o que ainda não foi respondido (últimos 7 dias)..."
  try {
    $zAcctHost = if($envMap['ZOHO_ACCOUNTS_HOST']){$envMap['ZOHO_ACCOUNTS_HOST']}else{'https://accounts.zoho.com'}
    $zApiHost  = if($envMap['ZOHO_API_HOST'])     {$envMap['ZOHO_API_HOST']}     else{'https://mail.zoho.com'}
    $ztBody="refresh_token=$($envMap['ZOHO_REFRESH_TOKEN'])&client_id=$($envMap['ZOHO_CLIENT_ID'])&client_secret=$($envMap['ZOHO_CLIENT_SECRET'])&grant_type=refresh_token"
    $ztok=Invoke-RestMethod -Uri "$zAcctHost/oauth/v2/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $ztBody -TimeoutSec 30
    $zh=@{ Authorization="Zoho-oauthtoken $($ztok.access_token)" }
    # accountId: usa o do .env se setado, senão descobre na 1ª conta
    $zAccId=$envMap['ZOHO_ACCOUNT_ID']
    if(-not $zAccId){ $accs=Invoke-RestMethod -Uri "$zApiHost/api/accounts" -Headers $zh -TimeoutSec 30; $zAccId=@($accs.data)[0].accountId }
    # pastas: acha Inbox E Enviados de uma vez (a de Enviados serve pra saber o que JÁ respondi)
    $zFolder=$envMap['ZOHO_FOLDER_ID']; $zSentFolder=$null
    try { $fol=Invoke-RestMethod -Uri "$zApiHost/api/accounts/$zAccId/folders" -Headers $zh -TimeoutSec 30
          if(-not $zFolder){ $inbox=@($fol.data | Where-Object { $_.folderType -eq 'Inbox' -or $_.path -eq '/Inbox' } | Select-Object -First 1); if($inbox){ $zFolder=$inbox[0].folderId } }
          $sentF=@($fol.data | Where-Object { $_.folderType -eq 'Sent' -or $_.path -eq '/Sent' -or $_.folderName -match 'Sent|Enviad' } | Select-Object -First 1)
          if($sentF){ $zSentFolder=$sentF[0].folderId } } catch {}
    # extrai só o e-mail de um "Nome <email>" (ou o texto cru) em minúsculas
    function ZEmail($s){ $s=[string]$s; if($s -match '<([^>]+)>'){ $matches[1].Trim().ToLower() } else { $s.Trim().ToLower() } }
    # ENVIADOS (7d): mapa destinatário -> horário (ms) do e-mail que EU mandei mais recente pra ele
    $zSentTo=@{}
    if($zSentFolder){
      try {
        $zsUrl="$zApiHost/api/accounts/$zAccId/messages/view?limit=50&sortBy=date&sortorder=false&status=all&folderId=$zSentFolder"
        $zsent=Invoke-RestMethod -Uri $zsUrl -Headers $zh -TimeoutSec 40
        foreach($sm in @($zsent.data)){
          $sMs= if($sm.sentDateInGMT){[int64]$sm.sentDateInGMT}elseif($sm.receivedTime){[int64]$sm.receivedTime}else{0}
          if([math]::Floor($sMs/1000) -lt $sinceUnix){ continue }
          foreach($to in @($sm.toAddress)){ $addr=ZEmail $to; if($addr){ if(-not $zSentTo.ContainsKey($addr) -or $zSentTo[$addr] -lt $sMs){ $zSentTo[$addr]=$sMs } } }
        }
      } catch { Log "Zoho Enviados ERRO: $($_.Exception.Message)" }
    }
    # INBOX (7d): fica só com o que NÃO respondi (sem e-mail meu pra aquela pessoa DEPOIS de eu receber)
    $zUrl="$zApiHost/api/accounts/$zAccId/messages/view?limit=60&sortBy=date&sortorder=false&status=all"
    if($zFolder){ $zUrl += "&folderId=$zFolder" }
    $zmsgs=Invoke-RestMethod -Uri $zUrl -Headers $zh -TimeoutSec 40
    foreach($mm in @($zmsgs.data)){
      $recvMs= if($mm.receivedTime){[int64]$mm.receivedTime}elseif($mm.sentDateInGMT){[int64]$mm.sentDateInGMT}else{0}
      if([math]::Floor($recvMs/1000) -lt $sinceUnix){ continue }   # fora dos últimos 7 dias
      $from=[string]$mm.fromAddress; $fromAddr=ZEmail $from
      if($fromAddr -and $zSentTo.ContainsKey($fromAddr) -and $zSentTo[$fromAddr] -ge $recvMs){ continue }   # já respondi essa pessoa
      $subj=[string]$mm.subject; $snip=[string]$mm.summary
      $id="Z$($zoItems.Count+1)"
      $tsMap[$id]=[math]::Floor($recvMs/1000)   # receivedTime já calculado acima (ms)
      $linkMap[$id]= if($mm.folderId -and $mm.messageId){ "$zApiHost/zm/#mail/folder/$($mm.folderId)/$($mm.messageId)" } else { "$zApiHost/zm/#mail/view/folder/$zFolder" }
      [void]$zoItems.Add(@{ id=$id; texto="De: $from | Assunto: $subj | Trecho: $(Trunc $snip 140)"; url=$linkMap[$id] })
      if($zoItems.Count -ge 25){break}
    }
    Step "📧 Zoho: $($zoItems.Count) e-mail(s) sem resposta (últimos 7 dias)"
  } catch { Step "📧 Zoho indisponível agora (sigo com o resto)"; Log "Zoho ERRO: $($_.Exception.Message)" }
} else { Log "Zoho não configurado (.env sem ZOHO_CLIENT_ID/ZOHO_REFRESH_TOKEN) — pulando." }

# ===================== YOUTUBE =====================
Step "▶️ Vendo os comentários sem resposta no seu canal do YouTube..."
$ytItems=New-Object System.Collections.ArrayList
$MyChannel='UCifUfSNdly4yFOfzSDS2xog'
try {
  $tokBody="client_id=$($envMap['YOUTUBE_CLIENT_ID'])&client_secret=$($envMap['YOUTUBE_CLIENT_SECRET'])&refresh_token=$($envMap['YOUTUBE_REFRESH_TOKEN'])&grant_type=refresh_token"
  $tok=Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $tokBody -TimeoutSec 30
  $h=@{ Authorization="Bearer $($tok.access_token)" }
  # part=snippet,replies: as respostas (até 5 recentes) vêm juntas, pra saber se EU já respondi o comentário.
  $ct=Invoke-RestMethod -Uri "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&allThreadsRelatedToChannelId=$MyChannel&order=time&maxResults=100" -Headers $h -TimeoutSec 40
  foreach($it in $ct.items){
    $s=$it.snippet.topLevelComment.snippet
    # order=time (mais novo primeiro): assim que passar de 7 dias, pode parar
    if(([datetime]$s.publishedAt).ToUniversalTime() -lt $sinceUtc){ break }
    if(([string]$s.authorChannelId.value) -eq $MyChannel){ continue }   # comentário meu -> ignora
    # respondido = alguma resposta do MEU canal na thread
    $answered=$false
    foreach($r in @($it.replies.comments)){ if(([string]$r.snippet.authorChannelId.value) -eq $MyChannel){ $answered=$true; break } }
    if($answered){ continue }
    $id="Y$($ytItems.Count+1)"; $linkMap[$id]="https://www.youtube.com/watch?v=$($s.videoId)&lc=$($it.id)"
    $tsMap[$id]=[int64]([DateTimeOffset]([datetime]$s.publishedAt).ToUniversalTime()).ToUnixTimeSeconds()
    $ytMeta[$id]=@{ videoId=[string]$s.videoId }
    [void]$ytItems.Add(@{ id=$id; texto="@$($s.authorDisplayName): $(Trunc $s.textOriginal 200)"; url=$linkMap[$id] })
    if($ytItems.Count -ge 25){break}
  }
  # títulos dos vídeos (cabeçalho de cada grupo) — 1 chamada só, pros vídeos que têm comentário novo
  $vids=@($ytMeta.Values | ForEach-Object { $_.videoId } | Sort-Object -Unique)
  if($vids.Count -gt 0){
    try {
      $vresp=Invoke-RestMethod -Uri "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=$($vids -join ',')&maxResults=50" -Headers $h -TimeoutSec 40
      foreach($v in $vresp.items){ $ytTitles[[string]$v.id]=[string]$v.snippet.title }
    } catch { Log "YouTube titles ERRO: $($_.Exception.Message)" }
  }
  Step "▶️ YouTube: $($ytItems.Count) comentário(s) sem resposta (últimos 7 dias)"
} catch { Step "▶️ YouTube indisponível agora (sigo com o resto)"; Log "YouTube ERRO: $($_.Exception.Message)" }

# ===================== CÉREBRO (claude -> JSON) =====================
$hoje=(Get-Date).ToString("dd/MM/yyyy")
function ItemsBlock($arr){ if($arr.Count -eq 0){"(nada)"} else { ($arr | ForEach-Object { "$($_.id) | $($_.texto)" }) -join "`n" } }
# WhatsApp vem como um TRECHO de várias linhas por conversa ("Quem: mensagem"), pra a IA ler o contexto inteiro.
function WaBlock($arr){
  if($arr.Count -eq 0){ return "(nada)" }
  ($arr | ForEach-Object {
    $estado= if($_.aguardando){"(a última mensagem é do CONTATO — esperando você responder)"}else{"(você respondeu por último)"}
    "$($_.id) | $($_.nome) $estado`n$($_.transcript)"
  }) -join "`n----------`n"
}
$prompt=@"
Você é o AIOS do Enzo. Abaixo, itens dos ÚLTIMOS 7 DIAS que AINDA ESPERAM resposta do Enzo (WhatsApp,
DUAS caixas de e-mail — Gmail e Zoho —, e comentários do YouTube), cada um com um ID. Já foram filtrados:
tudo aqui é coisa que o Enzo recebeu e ainda NÃO respondeu. Trate o Enzo por "você" e use SEMPRE o ID
original do item. Comece com um "destaque" de 1 a 2 frases com o mais urgente/atrasado a responder.

WHATSAPP — todas as conversas abaixo estão ESPERANDO o Enzo responder (a última mensagem é do contato).
Cada uma vem como um TRECHO de várias linhas no formato "Quem: mensagem": "Você:" = mensagens que o ENZO
mandou; "<Nome>:" = mensagens do CONTATO. LEIA o trecho todo, entenda o ASSUNTO REAL e NUNCA inverta
quem disse o quê. Para CADA conversa escreva "texto" (resumo curto "quem — o que") e "rascunho" (a
resposta pronta pra enviar, NA VOZ do Enzo — PT-BR, "você", direta e cordial, em UMA mensagem só; vai
ser pré-preenchida no WhatsApp pro Enzo só dar Enter).

E-MAIL — há DUAS caixas, cada uma vira sua PRÓPRIA seção: "E-MAIL (Gmail)" (itens começam com E) e
"E-MAIL (Zoho)" (itens começam com Z). Em CADA caixa, separe em DOIS grupos:
 • "itens" = os que MERECEM atenção de verdade (cliente, aluno, parceria séria, cobrança, algo que pede
   ação). Para cada: "texto" no formato "De quem — assunto — (ação sugerida)".
 • "secundarios" = TODO o resto (divulgação, newsletter, notificação automática, promoção). NÃO jogue
   fora e NÃO resuma num contador: para CADA um escreva um "texto" de UMA linha curta ("De quem — assunto
   resumido") com o ID, pro Enzo dar uma olhada rápida se quiser.
 Se uma das caixas estiver vazia (marcada "(nada)"), NÃO crie a seção dela.

YOUTUBE — para CADA comentário que valha responder, escreva "texto" (resumo "quem — o que") e "rascunho"
(a SUGESTÃO de resposta na voz do Enzo: se for dúvida, responda de verdade; se for elogio, um
agradecimento curto e caloroso). Comentário sem nada pra responder pode ser ignorado.

RESPONDA APENAS COM JSON VÁLIDO (sem markdown, sem cercas ```), exatamente neste formato:
{"destaque":"...","secoes":[{"fonte":"WHATSAPP","itens":[{"id":"W1","texto":"...","rascunho":"..."}]},{"fonte":"E-MAIL (Gmail)","itens":[{"id":"E1","texto":"..."}],"secundarios":[{"id":"E2","texto":"De Fulano — assunto resumido"}]},{"fonte":"E-MAIL (Zoho)","itens":[{"id":"Z1","texto":"..."}],"secundarios":[{"id":"Z2","texto":"De Fulano — assunto resumido"}]},{"fonte":"YOUTUBE (comentários)","itens":[{"id":"Y1","texto":"...","rascunho":"..."}]}]}

DADOS:
[WHATSAPP] (cada conversa separada por uma linha de tracejado; TODAS esperando resposta)
$(WaBlock $waItems)

[E-MAIL — GMAIL]
$(ItemsBlock $emItems)

[E-MAIL — ZOHO]
$(ItemsBlock $zoItems)

[YOUTUBE]
$(ItemsBlock $ytItems)
"@

Step "🧠 Pedindo pro AIOS priorizar o seu dia (na sua voz)..."
$promptFile=Join-Path $env:TEMP "aios-brief-prompt.txt"
$claudeOut =Join-Path $env:TEMP "aios-brief-claude.txt"
[System.IO.File]::WriteAllText($promptFile,$prompt,(New-Object System.Text.UTF8Encoding($false)))
$obj=$null
try {
  $cmd="cd '$(To-Posix $Proj)' && cat '$(To-Posix $promptFile)' | '$ClaudePosix' -p > '$(To-Posix $claudeOut)' 2>/dev/null"
  & $GitBash -lc $cmd | Out-Null
  $raw=[System.IO.File]::ReadAllText($claudeOut,[System.Text.Encoding]::UTF8)
  $i=$raw.IndexOf('{'); $j=$raw.LastIndexOf('}')
  if($i -ge 0 -and $j -gt $i){ $obj = $raw.Substring($i,$j-$i+1) | ConvertFrom-Json }
  Log "claude JSON OK (destaque=$([bool]$obj.destaque), secoes=$($obj.secoes.Count))"
} catch { Log "claude/JSON ERRO: $($_.Exception.Message)" }

# ===================== monta o JSON final (resolve links + ORDENA cronológico) =====================
# Regra de ordem: mais ANTIGO no topo (asc por timestamp). O YouTube ainda é AGRUPADO por vídeo:
# cada grupo tem os comentários em ordem cronológica, e os grupos vêm do vídeo com o comentário
# mais antigo pro mais novo. tsMap[id] guarda o timestamp de cada item coletado.
function _Ts($k){ if($k -and $tsMap.ContainsKey($k)){ [int64]$tsMap[$k] } else { 0 } }
# monta os grupos por vídeo a partir de uma lista de itens (cada um com ._vid e ._ts)
function _AgrupaPorVideo($itens){
  $grupos=New-Object System.Collections.ArrayList
  if(@($itens).Count -eq 0){ return $grupos }
  $ord = @($itens) | Group-Object _vid | Sort-Object @{ Expression = { ($_.Group | Measure-Object _ts -Minimum).Minimum } }
  foreach($g in $ord){
    $vid=[string]$g.Name
    $title= if($vid -and $ytTitles.ContainsKey($vid)){ $ytTitles[$vid] } elseif($vid){ "Vídeo" } else { "Comentários" }
    $vurl= if($vid){ "https://www.youtube.com/watch?v=$vid" } else { $null }
    [void]$grupos.Add([pscustomobject]@{ video=$title; videoUrl=$vurl; itens=@($g.Group | Sort-Object _ts) })
  }
  $grupos
}

# --- Hoje vs. Pendentes da semana (2+ dias) ---------------------------------
# Cada item resolvido tem _ts. Se é de HOJE, fica na seção da sua fonte (bloco "Hoje"). Se tem 1+ dia,
# vai pro bloco cruzado "Pendentes da semana" (com etiqueta de fonte + "há N dias"), mantendo link/rascunho.
$today0=(Get-Date).Date
function _DaysAgo($ts){ if(-not $ts){ return 0 }; $d=[DateTimeOffset]::FromUnixTimeSeconds([int64]$ts).LocalDateTime.Date; [int][math]::Floor(($today0 - $d).TotalDays) }
function _AgeLabel($n){ if($n -le 0){ "" } elseif($n -eq 1){ "há 1 dia" } else { "há $n dias" } }
function _SrcEmoji($fonte){ if($fonte -match 'WHATS'){[char]::ConvertFromUtf32(0x1F4AC)} elseif($fonte -match 'MAIL'){[char]::ConvertFromUtf32(0x1F4E7)} elseif($fonte -match 'YOU'){[char]0x25B6} else {[char]0x2022} }
$pendAll=New-Object System.Collections.ArrayList
function _MkPend($fonte,$it){
  $lbl=_AgeLabel (_DaysAgo $it._ts)
  $tx="$(_SrcEmoji $fonte)  $([string]$it.texto)"; if($lbl){ $tx="$tx  ·  $lbl" }
  [pscustomobject]@{ texto=$tx; url=$it.url; rascunho=$it.rascunho; copiar=$it.copiar; _ts=$it._ts; _vid=$null }
}

$secoesOut=New-Object System.Collections.ArrayList
if($obj -and $obj.secoes){
  foreach($sec in $obj.secoes){
    $fonte=[string]$sec.fonte; $isWa=($fonte -match 'WHATS'); $isYt=($fonte -match 'YOU')
    $itensOut=New-Object System.Collections.ArrayList
    foreach($it in $sec.itens){
      $k= if($it.id){[string]$it.id}else{$null}
      $u=$null; if($k -and $linkMap.ContainsKey($k)){ $u=$linkMap[$k] }
      $rasc=[string]$it.rascunho; $copiar=$null
      if($isWa -and $rasc -and $k -and $waNumMap.ContainsKey($k)){
        # WhatsApp: o link abre a conversa com a resposta JÁ digitada (só dar Enter)
        $u="https://wa.me/$($waNumMap[$k])?text=" + [uri]::EscapeDataString($rasc)
      } elseif($isYt -and $rasc){
        # YouTube: a metade DIREITA do card copia a resposta; a ESQUERDA abre o comentário (link &lc=)
        $copiar=$rasc
      }
      $vid= if($isYt -and $k -and $ytMeta.ContainsKey($k)){ [string]$ytMeta[$k].videoId } else { $null }
      $itObj=[pscustomobject]@{ texto=[string]$it.texto; url=$u; rascunho=$rasc; copiar=$copiar; _ts=(_Ts $k); _vid=$vid }
      # 1+ dia => vai pro bloco cruzado "Pendentes da semana"; de hoje => fica na seção da fonte
      if((_DaysAgo $itObj._ts) -ge 1){ [void]$pendAll.Add((_MkPend $fonte $itObj)) } else { [void]$itensOut.Add($itObj) }
    }
    # E-mail: "secundários" (newsletter/promo) ficam no "ver mais" da própria caixa (não entram em pendentes)
    $secOut=New-Object System.Collections.ArrayList
    foreach($it in @($sec.secundarios)){
      if(-not $it){ continue }
      $k= if($it.id){[string]$it.id}else{$null}
      $u=$null; if($k -and $linkMap.ContainsKey($k)){ $u=$linkMap[$k] }
      [void]$secOut.Add([pscustomobject]@{ texto=[string]$it.texto; url=$u; rascunho=$null; copiar=$null; _ts=(_Ts $k) })
    }
    $secOutSorted=@($secOut | Sort-Object _ts)
    if($isYt){
      $grp=(_AgrupaPorVideo $itensOut)
      if(@($grp).Count -gt 0){ [void]$secoesOut.Add([pscustomobject]@{ fonte=$fonte; grupos=$grp; itens=@(); secundarios=$secOutSorted }) }
    } else {
      # só cria a seção "de hoje" se sobrou algo de hoje OU se há secundários pra "ver mais"
      if(@($itensOut).Count -gt 0 -or $secOutSorted.Count -gt 0){
        [void]$secoesOut.Add([pscustomobject]@{ fonte=$fonte; itens=@($itensOut | Sort-Object _ts); secundarios=$secOutSorted })
      }
    }
  }
  $destaque=[string]$obj.destaque
} else {
  $destaque="Não consegui priorizar com a IA agora — mostrando os itens crus."
  foreach($grp in @(@{f="WHATSAPP";a=$waItems;yt=$false},@{f="E-MAIL (Gmail)";a=$emItems;yt=$false},@{f="E-MAIL (Zoho)";a=$zoItems;yt=$false},@{f="YOUTUBE (comentários)";a=$ytItems;yt=$true})){
    $rows=New-Object System.Collections.ArrayList
    foreach($x in $grp.a){
      $tx= if($x.ContainsKey('texto')){$x.texto}else{ "$($x.nome): " + (Trunc (($x.transcript -replace "`r?`n",' | ')) 220) }
      $k=[string]$x.id
      $vid= if($grp.yt -and $k -and $ytMeta.ContainsKey($k)){ [string]$ytMeta[$k].videoId } else { $null }
      $row=[pscustomobject]@{ texto=$tx; url=$x.url; rascunho=$null; copiar=$null; _ts=(_Ts $k); _vid=$vid }
      if((_DaysAgo $row._ts) -ge 1){ [void]$pendAll.Add((_MkPend $grp.f $row)) } else { [void]$rows.Add($row) }
    }
    if($grp.yt){
      $g=(_AgrupaPorVideo $rows)
      if(@($g).Count -gt 0){ [void]$secoesOut.Add([pscustomobject]@{ fonte=$grp.f; grupos=$g; itens=@(); secundarios=@() }) }
    } else {
      $sorted=@($rows | Sort-Object _ts)
      if($sorted.Count -gt 0){ [void]$secoesOut.Add([pscustomobject]@{ fonte=$grp.f; itens=$sorted; secundarios=@() }) }
    }
  }
}
# bloco cruzado "Pendentes da semana" (2+ dias) — sempre por último, mais ANTIGO no topo (o mais atrasado)
if($pendAll.Count -gt 0){
  [void]$secoesOut.Add([pscustomobject]@{ fonte="PENDENTES DA SEMANA"; itens=@($pendAll | Sort-Object _ts); secundarios=@() })
}
$final=[pscustomobject]@{ data=$hoje; destaque=$destaque; secoes=$secoesOut }
$json=$final | ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText($JsonOut,$json,(New-Object System.Text.UTF8Encoding($false)))
Log "JSON gravado em $JsonOut"
Step "✨ Resumo pronto!"

# ===================== pop-up =====================
# -NoPopup: usado pelo Abrir-Matinal, que mostra o pop-up ele mesmo depois da tela de carregamento.
if($NoPopup){
  Log "NoPopup: não abro o pop-up (quem chamou mostra)"
} else {
  Log "Mostrando pop-up"
  try { . $PopupPs1; Show-BriefPopup $json } catch { Log "Pop-up ERRO: $($_.Exception.Message)" }
}
Log "===== Fim ====="

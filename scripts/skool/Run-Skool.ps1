# Run-Skool.ps1 — AIOS "Responder Skool" (read + draft, L2)
# Lê a atividade recente da comunidade no Skool (ator do Apify, SÓ LEITURA), manda o claude -p
# rascunhar uma resposta NA VOZ do Enzo pra cada item de membro que ainda não tem retorno, e abre
# um pop-up com os rascunhos + botão "Copiar". Quem posta é o Enzo (nada é publicado por aqui).
# Espelha a arquitetura do daily-brief (REST puro + claude via Git Bash + popup WPF).
# -NoPopup: não abre a janela; imprime os rascunhos em JSON (teste/calibração e modo headless).

param([switch]$NoPopup)
$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Proj        = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials"
$GitBash     = "C:\Program Files\Git\bin\bash.exe"
$ClaudePosix = "/c/Users/canal/.local/bin/claude"
$LogFile     = "C:\tmp\aios-skool.log"
$RawOut      = "C:\tmp\aios-skool-raw.json"
$JsonOut     = "C:\tmp\aios-skool.json"
$PopupPs1    = Join-Path $Proj "scripts\skool\skool-popup.ps1"
# perfil de voz específico do Skool (extraído das mensagens REAIS do Enzo — references/voz-skool.md);
# fallback: a amostra de voz geral. Arquivo LOCAL: não custa nada por rodada.
$VoiceFile   = Join-Path $Proj "references\voz-skool.md"
if(-not (Test-Path $VoiceFile)){ $VoiceFile = Join-Path $Proj "references\voice.md" }

# Quantos posts recentes buscar comentários (cada getComments ~US$ 0,005)
$MaxPostsComments = 8
# Incluir as DMs não lidas do chat (via Playwright; ~20s a mais por rodada)
$IncluirChat = $true

function Log($msg){ try { Add-Content -Path $LogFile -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg) -Encoding utf8 } catch {} }
function ConvertTo-Posix($p){ $p=$p -replace '\\','/'; if($p -match '^([A-Za-z]):(.*)$'){ '/'+$matches[1].ToLower()+$matches[2] } else { $p } }
function Trunc($s,$n){ if($null -eq $s){return ""}; $s=[string]$s; if($s.Length -gt $n){ $s.Substring(0,$n)+[char]0x2026 } else { $s } }
function Get-Prop($obj,[string[]]$names){ foreach($n in $names){ if($obj.PSObject.Properties.Name -contains $n -and $null -ne $obj.$n -and "$($obj.$n)" -ne ""){ return $obj.$n } }; return $null }
function Get-Author($obj){
  $a = $obj.author
  if($a -is [array]){ $a = $a[0] }   # resiliência a resposta degradada do ator
  if($a){
    if($a -is [string]){ if($a){ return $a } }
    else { $fn=$a.firstName; $ln=$a.lastName; if($fn -is [array]){ $fn=$fn[0] }; if($ln -is [array]){ $ln=$ln[0] }; $nm=(("{0} {1}" -f $fn,$ln).Trim()); if($nm){ return $nm }; if($a.name){ return [string]$a.name } }
  }
  return [string](Get-Prop $obj @('authorName','user','member','createdBy'))
}

Log "===== Início do Responder Skool ====="

# ---------- .env ----------
$envMap=@{}
Get-Content (Join-Path $Proj ".env") | ForEach-Object { if($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$'){ $envMap[$matches[1]]=$matches[2].Trim() } }
$token    = $envMap['APIFY_TOKEN']
$tokenBackup = $envMap['APIFY_TOKEN_BACKUP']   # conta reserva: entra sozinha se a principal ficar sem saldo
$slug     = $envMap['SKOOL_GROUP_SLUG']
# Múltiplas comunidades: SKOOL_GROUP_SLUGS=slug|Rótulo;slug2|Rótulo2  (fallback: SKOOL_GROUP_SLUG)
$grupos = New-Object System.Collections.ArrayList
if($envMap['SKOOL_GROUP_SLUGS']){
  foreach($par in ($envMap['SKOOL_GROUP_SLUGS'] -split ';')){
    $par = $par.Trim(); if(-not $par){ continue }
    $partes = $par -split '\|',2
    $gslug = $partes[0].Trim()
    $grot  = if($partes.Count -gt 1 -and $partes[1].Trim()){ $partes[1].Trim() } else { $gslug }
    if($gslug){ [void]$grupos.Add([pscustomobject]@{ slug=$gslug; rotulo=$grot }) }
  }
} elseif($slug){ [void]$grupos.Add([pscustomobject]@{ slug=$slug; rotulo="Skool" }) }
$cookies  = $envMap['SKOOL_COOKIES']
$email    = $envMap['SKOOL_EMAIL']
$password = $envMap['SKOOL_PASSWORD']
# escolhe a auth disponível: cookie tem prioridade; senão email+senha (o ator loga sozinho)
$useCookie = ($cookies -and $cookies -ne 'COLE_O_COOKIE_AQUI')
$usePass   = ($email -and $password -and $email -ne 'COLE_O_EMAIL_AQUI' -and $password -ne 'COLE_A_SENHA_AQUI')

# ---------- renovação automática do cookie (zero manutenção) ----------
# O cookie do Skool dura ~3,5 dias. Com SKOOL_EMAIL/SKOOL_PASSWORD no .env, o renovar-cookie.cjs
# loga sozinho e reescreve o SKOOL_COOKIES. Renovamos: (a) proativamente se a última renovação tem
# mais de 2 dias; (b) reativamente se a coleta voltar vazia (sintoma clássico de cookie vencido).
$RenovarCjs = Join-Path $Proj "scripts\skool\renovar-cookie.cjs"
$Marcador   = "C:\tmp\aios-skool-cookie-renovado.txt"
$script:jaRenovou = $false
function Renovar-CookieSkool([string]$motivo){
  if($script:jaRenovou){ return $false }
  if(-not $usePass){ Log "cookie: renovação automática indisponível — preencha SKOOL_EMAIL/SKOOL_PASSWORD no .env"; return $false }
  $script:jaRenovou = $true
  Log "cookie: renovando automaticamente ($motivo)…"
  try {
    $r = (& node $RenovarCjs 2>$null | Out-String).Trim() | ConvertFrom-Json
    if($r.ok){
      Log "cookie: renovado OK ($($r.cookies) cookies novos no .env)"
      Get-Content (Join-Path $Proj ".env") | ForEach-Object { if($_ -match '^\s*SKOOL_COOKIES\s*=\s*(.*)$'){ $script:cookies = $matches[1].Trim() } }
      $script:useCookie = $true
      return $true
    }
    Log "cookie: renovação FALHOU ($($r.error))"
  } catch { Log "cookie: renovação ERRO: $($_.Exception.Message)" }
  return $false
}
$cookieFresco = $false
try { if(Test-Path $Marcador){ $cookieFresco = ((Get-Date) - (Get-Item $Marcador).LastWriteTime).TotalDays -lt 2 } } catch {}
if(-not $cookieFresco){ [void](Renovar-CookieSkool "última renovação há 2+ dias (ou nunca)") }

# fecha a janela de "Buscando…" (lançada pelo botão do app matinal) pelo TÍTULO, quando terminar
function Stop-Loading { if(-not $NoPopup){ try { Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*Buscando Skool*' } | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue } } catch {} } }

function Show-Aviso($titulo,$msg){
  Stop-Loading
  $payload = @{ titulo=$titulo; itens=@(@{ autor="AIOS"; original=$msg; rascunho=""; url="" }) } | ConvertTo-Json -Depth 6
  if($NoPopup){ Write-Output $payload; return }
  try { . $PopupPs1; Show-SkoolPopup $payload } catch { Write-Host "$titulo`n$msg" }
}

if(-not $token -or $grupos.Count -eq 0){ Log "Faltam APIFY_TOKEN/SKOOL_GROUP_SLUG(S) no .env"; Show-Aviso "Configuração incompleta" "Falta APIFY_TOKEN ou SKOOL_GROUP_SLUGS no .env."; return }
if(-not $useCookie -and -not $usePass){
  Log "Sem auth do Skool (nem cookie nem email/senha)"
  Show-Aviso "Falta a autenticação do Skool" "Pra ler a comunidade, configure no .env UMA das duas: SKOOL_COOKIES (cookie de sessão) OU SKOOL_EMAIL + SKOOL_PASSWORD. Passo a passo em references/skool-apify.md."
  return
}

# ---------- chamada ao ator do Apify (run-sync) ----------
function Invoke-Skool([string]$gslug,[string]$action,$params){
  if($null -eq $params){ $params=@{} }
  $b = @{ action=$action; groupSlug=$gslug; params=$params }
  if($useCookie){ $b['cookies']=$cookies } else { $b['email']=$email; $b['password']=$password }
  $body = $b | ConvertTo-Json -Depth 6 -Compress
  $uri  = "https://api.apify.com/v2/acts/cristiantala~skool-all-in-one-api/run-sync-get-dataset-items?token=$($script:token)"
  try {
    Invoke-RestMethod -Uri $uri -Method POST -ContentType "application/json" -Body $body -TimeoutSec 180
  } catch {
    # conta principal sem saldo ("Monthly usage hard limit exceeded")? troca pro backup e refaz.
    $det = ""; try { $det = [string]$_.ErrorDetails.Message } catch {}
    if($det -match 'usage hard limit' -and $tokenBackup -and $script:token -ne $tokenBackup){
      Log "Apify: conta principal sem saldo — trocando pro token de BACKUP nesta rodada"
      $script:token = $tokenBackup
      $uri = "https://api.apify.com/v2/acts/cristiantala~skool-all-in-one-api/run-sync-get-dataset-items?token=$($script:token)"
      return Invoke-RestMethod -Uri $uri -Method POST -ContentType "application/json" -Body $body -TimeoutSec 180
    }
    throw
  }
}

# Invoke-RestMethod às vezes devolve o array de itens ANINHADO (1 elemento que é, ele mesmo, o array
# de N posts/comentários) — artefato de unrolling do PowerShell, não erro do servidor. Desempacota.
function Invoke-SkoolSafe([string]$gslug,[string]$action,$params){
  $r = @(Invoke-Skool $gslug $action $params)
  while($r.Count -eq 1 -and $r[0] -is [array]){ $r = @($r[0]) }
  return $r
}

# ---------- coleta ----------
$rawDump = New-Object System.Collections.ArrayList
$atividade = New-Object System.Collections.ArrayList

# Separa posts DE VERDADE de item de erro do ator: com cookie vencido o Apify não devolve
# lista vazia — devolve 1 item {success:false, errorCode:AUTH_ERROR, statusCode:401}.
function Select-PostsValidos($lista){
  @($lista | Where-Object { $_ -and -not ($_.PSObject.Properties.Name -contains 'success' -and -not $_.success) -and (Get-Prop $_ @('id','postId','uuid','post_id','title','content')) })
}

try {
  $totalPostsOk = 0
  foreach($g in $grupos){
    $posts = Invoke-SkoolSafe $g.slug "posts:list" @{ page = 1 }
    $postsOk = Select-PostsValidos $posts
    $erroAtor = @($posts | Where-Object { $_ -and $_.PSObject.Properties.Name -contains 'errorCode' })[0]
    if($erroAtor){ Log ("posts:list($($g.rotulo)) ERRO do ator: {0} — {1}" -f $erroAtor.errorCode, (Trunc $erroAtor.error 160)) }
    Log "posts:list($($g.rotulo)) -> $($postsOk.Count) posts válidos"

    # Sem posts válidos = quase sempre cookie vencido. Renova e tenta UMA vez de novo (o cookie
    # vale pra TODAS as comunidades, então a renovação só roda uma vez na rodada).
    if($postsOk.Count -eq 0 -and (Renovar-CookieSkool "posts:list($($g.rotulo)) sem posts válidos (cookie vencido?)")){
      $posts = Invoke-SkoolSafe $g.slug "posts:list" @{ page = 1 }
      $postsOk = Select-PostsValidos $posts
      Log "posts:list($($g.rotulo)) (após renovar) -> $($postsOk.Count) posts válidos"
    }
    $totalPostsOk += $postsOk.Count
    [void]$rawDump.Add(@{ action="posts:list"; grupo=$g.slug; data=$posts })

    $n = 0
    foreach($p in $postsOk){
      $postId   = Get-Prop $p @('id','postId','uuid','post_id')
      $autor    = Get-Author $p
      $titulo   = Get-Prop $p @('title')
      $conteudo = Get-Prop $p @('content','body','text','description')
      $texto    = if($titulo -and $conteudo){ "$titulo — $conteudo" } elseif($titulo){ $titulo } else { $conteudo }
      $url      = Get-Prop $p @('url','link','permalink','postUrl')
      if(-not $url -and $postId){ $url = "https://www.skool.com/$($g.slug)/posts/$postId" }
      [void]$atividade.Add([pscustomobject]@{ tipo="post"; comunidade=$g.rotulo; autor=[string]$autor; texto=(Trunc $texto 600); url=[string]$url; postId=[string]$postId })

      # comentários só dos posts QUE TÊM comentários (economiza o orçamento de chamadas)
      if($postId -and $p.commentCount -gt 0 -and $n -lt $MaxPostsComments){
        $n++
        try {
          $cmts = Invoke-SkoolSafe $g.slug "posts:getComments" @{ postId = "$postId" }
          [void]$rawDump.Add(@{ action="posts:getComments"; grupo=$g.slug; postId="$postId"; data=$cmts })
          foreach($c in $cmts){
            $ca = Get-Author $c
            $ct = Get-Prop $c @('content','comment','body','text')
            [void]$atividade.Add([pscustomobject]@{ tipo="comentario"; comunidade=$g.rotulo; autor=[string]$ca; texto=(Trunc $ct 400); url=[string]$url; postId=[string]$postId })
            foreach($r in @($c.replies)){
              if($r){ $rt = Get-Prop $r @('content','comment','body','text'); if($rt){ [void]$atividade.Add([pscustomobject]@{ tipo="resposta"; comunidade=$g.rotulo; autor=[string](Get-Author $r); texto=(Trunc $rt 400); url=[string]$url; postId=[string]$postId }) } }
            }
          }
          Log "getComments($($g.rotulo)/$postId) -> $($cmts.Count)"
        } catch { Log "getComments($($g.rotulo)/$postId) ERRO: $($_.Exception.Message)" }
      }
    }
  }

  if($totalPostsOk -eq 0){
    # NÃO sobrescreve o aios-skool.json: rascunhos antigos valem mais que um falso "tudo certo".
    Log "sem posts válidos em NENHUMA comunidade — abortando SEM sobrescrever os rascunhos antigos"
    $dica = if($usePass){ "A renovação automática do cookie não resolveu — confira a senha do Skool no .env e o log." } else { "Preencha SKOOL_EMAIL e SKOOL_PASSWORD no .env pra eu renovar o cookie sozinho (hoje só tem o cookie, que expira a cada ~3,5 dias)." }
    Show-Aviso "Skool inacessível" "A leitura das comunidades falhou — o cookie de sessão provavelmente expirou. $dica Detalhes em C:\tmp\aios-skool.log."
    return
  }
} catch {
  $det = ""; try { $det = [string]$_.ErrorDetails.Message } catch {}
  Log "Apify ERRO: $($_.Exception.Message) $det"
  if($det -match 'usage hard limit'){
    # limite de gastos das CONTAS Apify — não adianta renovar cookie nem tentar de novo
    $qual = if($tokenBackup){ "As DUAS contas do Apify (principal e backup) bateram" } else { "A conta do Apify bateu" }
    Show-Aviso "Apify sem saldo" "$qual o limite mensal de uso (Monthly usage hard limit). Aumente o limite ou o plano no console do Apify (Settings > Billing/Usage) — o cookie e a senha do Skool estão OK. Os rascunhos antigos foram preservados."
  } else {
    Show-Aviso "Erro ao ler o Skool" "Não consegui ler a comunidade ($($_.Exception.Message)). Confira o cookie (renova sozinho) e o token do Apify. Detalhes em C:\tmp\aios-skool.log."
  }
  return
}

# ---------- DMs (chat) via Playwright — api2.skool.com atrás do WAF, só leitura ----------
if($IncluirChat){
  try {
    $chatRaw = & node (Join-Path $Proj "scripts\skool\skool-chat.cjs") 2>$null | Out-String
    $chatObj = $chatRaw | ConvertFrom-Json
    foreach($d in @($chatObj.dms)){
      # monta a transcrição da conversa inteira (não só a última mensagem) pro rascunho ter contexto
      $conv = ""
      foreach($m in @($d.conversa)){ if($m -and $m.texto){ $conv += ("[{0}]: {1}`n" -f $m.de, $m.texto) } }
      $texto = if($conv){ "CONVERSA COMPLETA (da mais antiga pra mais recente):`n" + $conv } else { [string]$d.original }
      [void]$atividade.Add([pscustomobject]@{ tipo="dm"; comunidade="Chat (DM)"; autor=[string]$d.autor; texto=(Trunc $texto 3000); url=""; postId="" })
    }
    Log "chat DMs -> $(@($chatObj.dms).Count) (erro: $($chatObj.error))"
  } catch { Log "chat ERRO: $($_.Exception.Message)" }
}

# salva o cru pra calibrar os nomes de campo na 1ª rodada
try { [System.IO.File]::WriteAllText($RawOut, ($rawDump | ConvertTo-Json -Depth 12), (New-Object System.Text.UTF8Encoding($false))) } catch {}

if($atividade.Count -eq 0){
  Show-Aviso "Skool sem novidades" "Não achei atividade recente pra responder (ou os campos do ator vieram com outro nome — veja C:\tmp\aios-skool-raw.json)."
  return
}

# ---------- cérebro (claude -> rascunhos) ----------
$voz = ""
try { $voz = [System.IO.File]::ReadAllText($VoiceFile,[System.Text.Encoding]::UTF8) } catch {}
# DMs primeiro (prioridade + nunca cortadas), depois posts/comentários
$ordenada = New-Object System.Collections.ArrayList
foreach($a in $atividade){ if($a.tipo -eq 'dm'){ [void]$ordenada.Add($a) } }
foreach($a in $atividade){ if($a.tipo -ne 'dm'){ [void]$ordenada.Add($a) } }
$atividadeJson = $ordenada | ConvertTo-Json -Depth 6
$atividadeJson = Trunc $atividadeJson 60000

$prompt=@"
Você é o AIOS do Enzo Barbato. Abaixo está a ATIVIDADE RECENTE da comunidade dele no Skool
(posts, comentários e DMs do chat, em JSON). O Enzo é o dono/admin e ensina LEIGOS a criar
automações e apps sem código com Claude Code e Antigravity.

Tarefa: identifique os itens de MEMBROS (não do próprio Enzo/admin) que pedem uma resposta dele —
dúvidas, pedidos de ajuda, feedback que merece retorno, boas-vindas a quem se apresentou. Ignore
spam, autopromoção e coisas que claramente não pedem resposta. Os itens com "tipo":"dm" são
mensagens PRIVADAS do chat — priorize, e no campo "autor" desses comece com "💬 " pra marcar.

DMs: o campo "texto" traz a CONVERSA COMPLETA da thread, em linhas "[Nome]: mensagem" (da mais
antiga pra mais recente; "[Enzo]" = o que o próprio Enzo já respondeu antes). LEIA A CONVERSA
INTEIRA e rascunhe a resposta pra ÚLTIMA mensagem do membro considerando todo o contexto — o que
ele já contou, o que o Enzo já disse, promessas feitas. NUNCA responda como se estivesse vendo só
a última mensagem (ex.: se ele já explicou a dúvida antes, não pergunte "qual era sua dúvida?").
No campo "original" das DMs, ponha a última mensagem do membro (trecho literal).

Cada item tem o campo "comunidade" dizendo de onde veio (ex.: comunidade grátis vs. a de alunos
pagantes do curso). Itens da comunidade de ALUNOS têm prioridade (cliente pagante). Copie o campo
"comunidade" e o campo "url" pro resultado EXATAMENTE como vieram, sem alterar. No campo "original",
use um TRECHO LITERAL (palavra por palavra) do início do que o membro escreveu — não parafraseie —
porque esse trecho é usado pra localizar o comentário na página.

Para CADA item escolhido, escreva um RASCUNHO de resposta NA VOZ DO ENZO (rascunho, não final —
ele vai revisar e postar na mão). Siga À RISCA o perfil de voz abaixo — aberturas, fechamentos,
emojis, vocabulário, formato por canal e o playbook da situação correspondente. A resposta tem que
parecer escrita PELO PRÓPRIO Enzo, indistinguível das amostras reais. Regras extras:
- QUEBRA DE LINHA É OBRIGATÓRIA: DM = 2-4 mensagens curtas separadas por linha em branco (\n\n no
  JSON). Comentário = 2-4 parágrafos curtos separados por linha em branco sempre que passar de
  ~200 caracteres. NUNCA entregue parede de texto sem \n\n.
- NÃO prometa o que não dá pra confirmar (datas que não estão no contexto, recursos, reembolso
  fora das regras do playbook).
- Não repita a mesma abertura em dois itens seguidos — varie como ele varia.

PERFIL DE VOZ DO ENZO NO SKOOL (extraído das mensagens reais dele):
$(Trunc $voz 6000)

RESPONDA APENAS COM JSON VÁLIDO (sem markdown, sem cercas), exatamente neste formato:
{"itens":[{"autor":"nome do membro","comunidade":"de onde veio (copiar do item)","original":"trecho literal do que ele escreveu (curto)","rascunho":"a resposta sugerida na voz do Enzo","url":"link do item se houver (copiar do item)"}]}

ATIVIDADE (JSON):
$atividadeJson
"@

$promptFile=Join-Path $env:TEMP "aios-skool-prompt.txt"
$claudeOut =Join-Path $env:TEMP "aios-skool-claude.txt"
[System.IO.File]::WriteAllText($promptFile,$prompt,(New-Object System.Text.UTF8Encoding($false)))
$obj=$null
try {
  $cmd="cd '$(ConvertTo-Posix $Proj)' && cat '$(ConvertTo-Posix $promptFile)' | '$ClaudePosix' -p > '$(ConvertTo-Posix $claudeOut)' 2>/dev/null"
  & $GitBash -lc $cmd | Out-Null
  $raw=[System.IO.File]::ReadAllText($claudeOut,[System.Text.Encoding]::UTF8)
  $i=$raw.IndexOf('{'); $j=$raw.LastIndexOf('}')
  if($i -ge 0 -and $j -gt $i){ $obj = $raw.Substring($i,$j-$i+1) | ConvertFrom-Json }
  Log "claude JSON OK (itens=$($obj.itens.Count))"
} catch { Log "claude/JSON ERRO: $($_.Exception.Message)" }

# ---------- monta o JSON final ----------
$itensOut=New-Object System.Collections.ArrayList
$claudeOk = ($null -ne $obj -and ($obj.PSObject.Properties.Name -contains 'itens'))
if($claudeOk){
  foreach($it in @($obj.itens)){
    [void]$itensOut.Add([pscustomobject]@{ autor=[string]$it.autor; comunidade=[string]$it.comunidade; original=[string]$it.original; rascunho=[string]$it.rascunho; url=[string]$it.url })
  }
  if($itensOut.Count -eq 0){
    [void]$itensOut.Add([pscustomobject]@{ autor="AIOS"; original="Nenhum post ou comentário de membro pendente de resposta agora. ✅"; rascunho=""; url="" })
  }
} else {
  # claude não devolveu JSON: mostra a atividade crua pra responder na mão
  foreach($a in $atividade){ [void]$itensOut.Add([pscustomobject]@{ autor=[string]$a.autor; comunidade=[string]$a.comunidade; original=[string]$a.texto; rascunho="(a IA não conseguiu rascunhar agora — responda na mão)"; url=[string]$a.url }) }
}
$final=[pscustomobject]@{ titulo="Responder Skool"; data=(Get-Date).ToString("dd/MM/yyyy HH:mm"); itens=$itensOut }
$json=$final | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($JsonOut,$json,(New-Object System.Text.UTF8Encoding($false)))
Log "JSON gravado em $JsonOut ($($itensOut.Count) itens)"

# ---------- pop-up (ou saída em texto no modo -NoPopup) ----------
Stop-Loading
if($NoPopup){
  Write-Output $json
} else {
  try { . $PopupPs1; Show-SkoolPopup $json } catch { Log "Pop-up ERRO: $($_.Exception.Message)" }
}
Log "===== Fim ====="

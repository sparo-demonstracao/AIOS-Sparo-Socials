# popup.ps1 — Resumo Matinal (visual SaaS 2025 + interativo). Define Show-BriefPopup([string]$json).
# Recebe o JSON {data, destaque, secoes:[{fonte, itens:[{texto, url}]}]} e renderiza cada item como
# um card de vidro CLICÁVEL (abre o link) com hover animado. Fonte: Plus Jakarta Sans (projeto Lead-se).

function Show-BriefPopup([string]$json) {
  Add-Type -AssemblyName PresentationFramework
  Add-Type -AssemblyName PresentationCore
  Add-Type -AssemblyName WindowsBase

  $ASSET = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\daily-brief\assets"

  try { $data = $json | ConvertFrom-Json } catch { $data = $null }

  $xamlText = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="AIOS - Resumo Matinal" Width="700" Height="850"
        WindowStartupLocation="CenterScreen" Topmost="True"
        WindowStyle="None" AllowsTransparency="True" Background="Transparent" ResizeMode="NoResize">
  <Border x:Name="Root" CornerRadius="30" Margin="22">
    <Border.Effect><DropShadowEffect BlurRadius="55" ShadowDepth="0" Opacity="0.6" Color="#03020A"/></Border.Effect>
    <Border.Background>
      <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
        <GradientStop Color="#141A40" Offset="0"/><GradientStop Color="#1A1B4B" Offset="0.55"/><GradientStop Color="#2B1C55" Offset="1"/>
      </LinearGradientBrush>
    </Border.Background>
    <Grid x:Name="Layer">
      <Ellipse Width="520" Height="520" HorizontalAlignment="Right" VerticalAlignment="Top" Margin="0,-120,-120,0" IsHitTestVisible="False">
        <Ellipse.Fill><RadialGradientBrush><GradientStop Color="#85FFB23E" Offset="0"/><GradientStop Color="#00FFB23E" Offset="1"/></RadialGradientBrush></Ellipse.Fill>
        <Ellipse.Effect><BlurEffect Radius="70"/></Ellipse.Effect>
      </Ellipse>
      <Ellipse Width="540" Height="540" HorizontalAlignment="Left" VerticalAlignment="Bottom" Margin="-160,0,0,-160" IsHitTestVisible="False">
        <Ellipse.Fill><RadialGradientBrush><GradientStop Color="#807C5CFF" Offset="0"/><GradientStop Color="#007C5CFF" Offset="1"/></RadialGradientBrush></Ellipse.Fill>
        <Ellipse.Effect><BlurEffect Radius="80"/></Ellipse.Effect>
      </Ellipse>
      <Ellipse Width="320" Height="320" HorizontalAlignment="Right" VerticalAlignment="Center" Margin="0,0,-80,0" IsHitTestVisible="False">
        <Ellipse.Fill><RadialGradientBrush><GradientStop Color="#5536D1DC" Offset="0"/><GradientStop Color="#0036D1DC" Offset="1"/></RadialGradientBrush></Ellipse.Fill>
        <Ellipse.Effect><BlurEffect Radius="70"/></Ellipse.Effect>
      </Ellipse>

      <DockPanel>
        <Grid x:Name="HeaderBar" DockPanel.Dock="Top" Margin="26,24,22,6">
          <StackPanel Orientation="Horizontal">
            <Border Width="58" Height="58" CornerRadius="16" Margin="0,0,16,0" VerticalAlignment="Center">
              <Border.Background><LinearGradientBrush StartPoint="0,0" EndPoint="1,1"><GradientStop Color="#33FFFFFF" Offset="0"/><GradientStop Color="#11FFFFFF" Offset="1"/></LinearGradientBrush></Border.Background>
              <Image x:Name="HdrLogo" Width="40" Height="40" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
            <StackPanel VerticalAlignment="Center">
              <TextBlock x:Name="HdrTitle" Foreground="White" FontSize="23" FontWeight="Bold"/>
              <TextBlock x:Name="HdrSub" Foreground="#A7B0DE" FontSize="12.5" Margin="0,3,0,0"/>
            </StackPanel>
          </StackPanel>
          <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Top">
            <Border x:Name="BtnSkool" Height="38" CornerRadius="19" Background="#FFC83D" Margin="0,0,12,0" Padding="16,0,16,0" Cursor="Hand" VerticalAlignment="Top">
              <TextBlock Text="Responder Skool" Foreground="#0E1030" FontSize="12.5" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
            <Border x:Name="BtnMin" Width="38" Height="38" CornerRadius="19" Background="#1FFFFFFF" Margin="0,0,8,0" Cursor="Hand">
              <TextBlock x:Name="MinGlyph" Foreground="#D7DEF2" FontSize="17" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center" Margin="0,-6,0,0"/>
            </Border>
            <Border x:Name="BtnClose" Width="38" Height="38" CornerRadius="19" Background="#1FFFFFFF" Cursor="Hand">
              <TextBlock x:Name="CloseGlyph" Foreground="#D7DEF2" FontSize="15" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
          </StackPanel>
        </Grid>
        <ScrollViewer VerticalScrollBarVisibility="Auto" Padding="26,6,22,24">
          <StackPanel x:Name="Body"/>
        </ScrollViewer>
      </DockPanel>
    </Grid>
  </Border>
</Window>
'@

  $win = [Windows.Markup.XamlReader]::Parse($xamlText)
  $Root=$win.FindName("Root"); $Layer=$win.FindName("Layer"); $body=$win.FindName("Body")
  $hdrTitle=$win.FindName("HdrTitle"); $hdrSub=$win.FindName("HdrSub")
  $headerBar=$win.FindName("HeaderBar"); $btnClose=$win.FindName("BtnClose"); $btnMin=$win.FindName("BtnMin")
  $win.FindName("CloseGlyph").Text=[char]0x2715
  $win.FindName("MinGlyph").Text=[char]0x2013   # – minimizar

  # fonte do Lead-se (Plus Jakarta Sans) carregada do .ttf local
  try {
    $win.FontFamily = New-Object System.Windows.Media.FontFamily("file:///C:/Users/canal/Documentos/Antigravity%20Projetos/AIOS%20-%20Sparo%20Socials/scripts/daily-brief/assets/#Plus Jakarta Sans")
  } catch {}

  try {
    $ico=New-Object System.Windows.Media.Imaging.BitmapImage; $ico.BeginInit(); $ico.UriSource=New-Object System.Uri((Join-Path $ASSET "aios-sol.ico")); $ico.CacheOption=[System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad; $ico.EndInit(); $win.Icon=$ico
    $glyph=New-Object System.Windows.Media.Imaging.BitmapImage; $glyph.BeginInit(); $glyph.UriSource=New-Object System.Uri((Join-Path $ASSET "aios-sol-glyph.png")); $glyph.CacheOption=[System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad; $glyph.EndInit(); $win.FindName("HdrLogo").Source=$glyph
  } catch {}

  $Layer.Add_SizeChanged({ $rg=New-Object System.Windows.Media.RectangleGeometry; $rg.Rect=New-Object System.Windows.Rect 0,0,$Layer.ActualWidth,$Layer.ActualHeight; $rg.RadiusX=30; $rg.RadiusY=30; $Layer.Clip=$rg })
  # marca o clique dos botões como tratado pra NÃO vazar pro DragMove da barra (que engole o clique)
  $btnClose.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnMin.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnClose.Add_MouseLeftButtonUp({ $win.Close() })
  $btnMin.Add_MouseLeftButtonUp({ $win.WindowState=[System.Windows.WindowState]::Minimized })
  $btnSkool=$win.FindName("BtnSkool")
  if($btnSkool){
    $btnSkool.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
    $btnSkool.Add_MouseLeftButtonUp({ param($s,$e)
      if($s.Tag -eq 'busy'){ return }
      $s.Tag='busy'
      try { $s.Child.Text = ([char]0x23F3 + " Buscando...") } catch {}
      try {
        $base="C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\skool"
        Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile','-Sta','-ExecutionPolicy','Bypass','-Command',(". '$base\loading-popup.ps1'; Show-LoadingPopup")
        Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile','-Sta','-ExecutionPolicy','Bypass','-File',"$base\Run-Skool.ps1"
      } catch {
        # nunca engolir a falha do disparo: fica invisível e o "Buscando…" pendura pra sempre
        try { Add-Content -Path "C:\tmp\aios-skool.log" -Value ("{0}  popup: ERRO ao disparar o Run-Skool: {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $_.Exception.Message) -Encoding utf8 } catch {}
      }
    })
  }
  $headerBar.Add_MouseLeftButtonDown({ try { $win.DragMove() } catch {} })
  $win.Add_KeyDown({ if($_.Key -eq [System.Windows.Input.Key]::Escape){ $win.Close() } })

  function _Brush($hex){ New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.ColorConverter]::ConvertFromString($hex)) }
  function _TB($text,$size,$weight,$hex){ $tb=New-Object System.Windows.Controls.TextBlock; $tb.Text=$text; $tb.FontSize=$size; $tb.FontWeight=[System.Windows.FontWeights]::$weight; $tb.Foreground=(_Brush $hex); $tb.TextWrapping="Wrap"; $tb }

  # ---------- card/linha CLICÁVEL com hover animado ----------
  $animEnter = { param($s,$e)
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x2E,0xFF,0xFF,0xFF))
    $s.BorderBrush = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x66,0xFF,0xFF,0xFF))
    $a = New-Object System.Windows.Media.Animation.DoubleAnimation(1.025, (New-Object System.Windows.Duration ([TimeSpan]::FromMilliseconds(110))))
    $s.RenderTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleXProperty,$a)
    $s.RenderTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleYProperty,$a)
    $gl=New-Object System.Windows.Media.Effects.DropShadowEffect; $gl.BlurRadius=24; $gl.ShadowDepth=0; $gl.Opacity=0.6; $gl.Color=[System.Windows.Media.Color]::FromRgb(0x6E,0x7B,0xFF); $s.Effect=$gl
  }
  $animLeave = { param($s,$e)
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x12,0xFF,0xFF,0xFF))
    $s.BorderBrush = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x1F,0xFF,0xFF,0xFF))
    $a = New-Object System.Windows.Media.Animation.DoubleAnimation(1.0, (New-Object System.Windows.Duration ([TimeSpan]::FromMilliseconds(140))))
    $s.RenderTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleXProperty,$a)
    $s.RenderTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleYProperty,$a)
    $s.Effect=$null
  }
  # Tag do card = objeto { url; copiar }. Se tiver "copiar" (YouTube), copia o texto pro clipboard ANTES de abrir.
  $clickOpen = { param($s,$e)
    $t=$s.Tag
    if($t){
      try { if($t.copiar){ [System.Windows.Clipboard]::SetText([string]$t.copiar) } } catch {}
      try { if($t.url){ Start-Process ([string]$t.url) } } catch {}
    }
  }

  function _ItemRow($texto,$url,$rascunho,$copiar,$dim){
    $b=New-Object System.Windows.Controls.Border
    $b.CornerRadius=New-Object System.Windows.CornerRadius(14)
    $b.BorderThickness=New-Object System.Windows.Thickness(1)
    if($dim){ $b.Padding=New-Object System.Windows.Thickness(12,7,10,7); $b.Margin=New-Object System.Windows.Thickness(12,5,0,0) }
    else    { $b.Padding=New-Object System.Windows.Thickness(14,11,12,11); $b.Margin=New-Object System.Windows.Thickness(0,8,0,0) }
    $bgA = if($dim){0x0A}else{0x12}
    $b.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb($bgA,0xFF,0xFF,0xFF)))
    $b.BorderBrush=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x1F,0xFF,0xFF,0xFF)))
    $st=New-Object System.Windows.Media.ScaleTransform(1.0,1.0); $b.RenderTransform=$st; $b.RenderTransformOrigin=New-Object System.Windows.Point(0.5,0.5)

    $outer=New-Object System.Windows.Controls.StackPanel

    $g=New-Object System.Windows.Controls.Grid
    $c1=New-Object System.Windows.Controls.ColumnDefinition; $c1.Width="Auto"
    $c2=New-Object System.Windows.Controls.ColumnDefinition; $c2.Width="*"
    $c3=New-Object System.Windows.Controls.ColumnDefinition; $c3.Width="Auto"
    $g.ColumnDefinitions.Add($c1); $g.ColumnDefinitions.Add($c2); $g.ColumnDefinitions.Add($c3)
    $dotHex = if($dim){"#5B6493"}else{"#FFC83D"}
    $dot=_TB ([char]0x2022) 14 "Bold" $dotHex; $dot.Margin=New-Object System.Windows.Thickness(0,0,10,0); $dot.VerticalAlignment="Top"
    [System.Windows.Controls.Grid]::SetColumn($dot,0)
    $txHex = if($dim){"#AEB6D8"}else{"#E2E7F6"}; $txSz = if($dim){12.0}else{13.5}
    $tx=_TB $texto $txSz "Normal" $txHex; [System.Windows.Controls.Grid]::SetColumn($tx,1)
    [void]$g.Children.Add($dot); [void]$g.Children.Add($tx)
    $hasAction = ($url -or $copiar)
    if($hasAction){
      $arrow=_TB ([char]0x2197) 14 "Bold" "#8FA0E8"; $arrow.Margin=New-Object System.Windows.Thickness(10,0,0,0); $arrow.VerticalAlignment="Center"
      [System.Windows.Controls.Grid]::SetColumn($arrow,2); [void]$g.Children.Add($arrow)
    }
    [void]$outer.Children.Add($g)

    # rascunho: bolha verde com a resposta. WhatsApp -> abre a conversa já digitada; YouTube -> copia e abre o comentário.
    if($rascunho){
      $bub=New-Object System.Windows.Controls.Border
      $bub.CornerRadius=New-Object System.Windows.CornerRadius(11)
      $bub.BorderThickness=New-Object System.Windows.Thickness(1)
      $bub.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x22,0x25,0xD3,0x66)))
      $bub.BorderBrush=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x55,0x25,0xD3,0x66)))
      $bub.Padding=New-Object System.Windows.Thickness(12,9,12,9)
      $bub.Margin=New-Object System.Windows.Thickness(24,9,2,2)
      $bsp=New-Object System.Windows.Controls.StackPanel
      $hint = if($copiar){ ([char]::ConvertFromUtf32(0x1F4CB)+" Resposta sugerida - clique pra copiar e abrir o comentário") } else { ([char]::ConvertFromUtf32(0x270F)+" Resposta pronta - clique e dê Enter") }
      $lab=_TB $hint 10.5 "Bold" "#9FE6B5"; $lab.Margin=New-Object System.Windows.Thickness(0,0,0,4)
      [void]$bsp.Children.Add($lab); [void]$bsp.Children.Add((_TB $rascunho 13 "Normal" "#E4F6EA"))
      $bub.Child=$bsp; [void]$outer.Children.Add($bub)
    }

    $b.Child=$outer
    if($hasAction){
      $b.Tag=[pscustomobject]@{ url=$url; copiar=$copiar }; $b.Cursor=[System.Windows.Input.Cursors]::Hand
      $b.Add_MouseEnter($animEnter); $b.Add_MouseLeave($animLeave); $b.Add_MouseLeftButtonUp($clickOpen)
    }
    $b
  }

  # ---------- card do YouTube: DIVIDIDO em dois (esquerda ABRE o link, direita COPIA a resposta) ----------
  # Handlers compartilhados (constroem os pincéis inline pra não depender de variáveis externas no clique).
  $ytOpenEnter = { param($s,$e)
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x24,0x8F,0xA0,0xE8))
    try { $s.Tag.hint.Visibility=[System.Windows.Visibility]::Visible } catch {}
  }
  $ytOpenLeave = { param($s,$e)
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x00,0xFF,0xFF,0xFF))
    try { $s.Tag.hint.Visibility=[System.Windows.Visibility]::Hidden } catch {}
  }
  $ytOpenClick = { param($s,$e) try { if($s.Tag.url){ Start-Process ([string]$s.Tag.url) } } catch {} }
  $ytCopyEnter = { param($s,$e)
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x40,0x25,0xD3,0x66))
  }
  $ytCopyLeave = { param($s,$e)
    $done=$false; try { $done=[bool]$s.Tag.copied } catch {}
    $a= if($done){0x55}else{0x1A}
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb($a,0x25,0xD3,0x66))
  }
  $ytCopyClick = { param($s,$e)
    try { [System.Windows.Clipboard]::SetText([string]$s.Tag.copiar) } catch {}
    try { $s.Tag.copied=$true } catch {}
    try { $s.Tag.label.Text = ([char]0x2713 + " Copiado") } catch {}
    try { $s.Tag.label.Foreground = (New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromRgb(0xC9,0xF7,0xD5))) } catch {}
    $s.Background = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x55,0x25,0xD3,0x66))
  }

  function _YtCard($texto,$url,$rascunho,$copiar){
    $b=New-Object System.Windows.Controls.Border
    $b.CornerRadius=New-Object System.Windows.CornerRadius(14)
    $b.BorderThickness=New-Object System.Windows.Thickness(1)
    $b.Margin=New-Object System.Windows.Thickness(0,8,0,0)
    $b.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x12,0xFF,0xFF,0xFF)))
    $b.BorderBrush=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x1F,0xFF,0xFF,0xFF)))
    $b.ClipToBounds=$true

    $grid=New-Object System.Windows.Controls.Grid
    $cL=New-Object System.Windows.Controls.ColumnDefinition; $cL.Width=[System.Windows.GridLength]::new(1,[System.Windows.GridUnitType]::Star)
    $cR=New-Object System.Windows.Controls.ColumnDefinition; $cR.Width=[System.Windows.GridLength]::Auto
    $grid.ColumnDefinitions.Add($cL); $grid.ColumnDefinitions.Add($cR)

    # ---- ESQUERDA: abrir o comentário ----
    $left=New-Object System.Windows.Controls.Border
    $left.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x00,0xFF,0xFF,0xFF)))
    $left.Padding=New-Object System.Windows.Thickness(14,11,12,11)
    $left.Cursor=[System.Windows.Input.Cursors]::Hand
    [System.Windows.Controls.Grid]::SetColumn($left,0)
    $lg=New-Object System.Windows.Controls.Grid   # conteúdo + dica sobreposta
    $lsp=New-Object System.Windows.Controls.StackPanel
    # linha do comentário (Grid pra o texto QUEBRAR linha na largura da coluna)
    $rowg=New-Object System.Windows.Controls.Grid
    $rc1=New-Object System.Windows.Controls.ColumnDefinition; $rc1.Width=[System.Windows.GridLength]::Auto
    $rc2=New-Object System.Windows.Controls.ColumnDefinition; $rc2.Width=[System.Windows.GridLength]::new(1,[System.Windows.GridUnitType]::Star)
    $rowg.ColumnDefinitions.Add($rc1); $rowg.ColumnDefinitions.Add($rc2)
    $dot=_TB ([char]0x2022) 14 "Bold" "#FFC83D"; $dot.Margin=New-Object System.Windows.Thickness(0,0,10,0); $dot.VerticalAlignment="Top"
    [System.Windows.Controls.Grid]::SetColumn($dot,0)
    $tx=_TB $texto 13.5 "Normal" "#E2E7F6"; [System.Windows.Controls.Grid]::SetColumn($tx,1)
    [void]$rowg.Children.Add($dot); [void]$rowg.Children.Add($tx)
    [void]$lsp.Children.Add($rowg)
    if($rascunho){
      $bub=New-Object System.Windows.Controls.Border
      $bub.CornerRadius=New-Object System.Windows.CornerRadius(11); $bub.BorderThickness=New-Object System.Windows.Thickness(1)
      $bub.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x22,0x25,0xD3,0x66)))
      $bub.BorderBrush=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x55,0x25,0xD3,0x66)))
      $bub.Padding=New-Object System.Windows.Thickness(12,9,12,9); $bub.Margin=New-Object System.Windows.Thickness(24,9,2,2)
      $bsp=New-Object System.Windows.Controls.StackPanel
      $lab=_TB ([char]::ConvertFromUtf32(0x1F4A1)+" Resposta sugerida") 10.5 "Bold" "#9FE6B5"; $lab.Margin=New-Object System.Windows.Thickness(0,0,0,4)
      [void]$bsp.Children.Add($lab); [void]$bsp.Children.Add((_TB $rascunho 13 "Normal" "#E4F6EA"))
      $bub.Child=$bsp; [void]$lsp.Children.Add($bub)
    }
    [void]$lg.Children.Add($lsp)
    # dica "abrir" (só no hover da esquerda)
    $hint=_TB ([char]0x2197 + " abrir") 10.5 "Bold" "#BFD0FF"
    $hint.HorizontalAlignment="Right"; $hint.VerticalAlignment="Top"; $hint.Visibility=[System.Windows.Visibility]::Hidden
    [void]$lg.Children.Add($hint)
    $left.Child=$lg
    $left.Tag=[pscustomobject]@{ url=$url; hint=$hint }
    $left.Add_MouseEnter($ytOpenEnter); $left.Add_MouseLeave($ytOpenLeave); $left.Add_MouseLeftButtonUp($ytOpenClick)

    # ---- DIREITA: copiar a resposta ----
    $right=New-Object System.Windows.Controls.Border
    $right.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x1A,0x25,0xD3,0x66)))
    $right.BorderThickness=New-Object System.Windows.Thickness(1,0,0,0)
    $right.BorderBrush=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x22,0xFF,0xFF,0xFF)))
    $right.Padding=New-Object System.Windows.Thickness(14,0,14,0); $right.MinWidth=94
    $right.Cursor=[System.Windows.Input.Cursors]::Hand
    [System.Windows.Controls.Grid]::SetColumn($right,1)
    $rsp=New-Object System.Windows.Controls.StackPanel; $rsp.VerticalAlignment="Center"; $rsp.HorizontalAlignment="Center"
    $cg=_TB ([char]::ConvertFromUtf32(0x1F4CB)) 18 "Normal" "#CFEFD8"; $cg.HorizontalAlignment="Center"
    $clab=_TB "Copiar" 11.5 "Bold" "#B8ECC6"; $clab.HorizontalAlignment="Center"; $clab.Margin=New-Object System.Windows.Thickness(0,3,0,0)
    [void]$rsp.Children.Add($cg); [void]$rsp.Children.Add($clab)
    $right.Child=$rsp
    $right.Tag=[pscustomobject]@{ copiar=$copiar; label=$clab; copied=$false }
    $right.Add_MouseEnter($ytCopyEnter); $right.Add_MouseLeave($ytCopyLeave); $right.Add_MouseLeftButtonUp($ytCopyClick)

    [void]$grid.Children.Add($left); [void]$grid.Children.Add($right)
    $b.Child=$grid
    $b
  }

  # ---------- cabeçalho ----------
  $hdrTitle.Text="Resumo Matinal"
  $dataTxt = if($data -and $data.data){ $data.data } else { "" }
  try { $hdrSub.Text=(Get-Date).ToString("dddd, dd 'de' MMMM 'de' yyyy",[System.Globalization.CultureInfo]::GetCultureInfo('pt-BR')) } catch { $hdrSub.Text=$dataTxt }

  # ---------- destaque ----------
  if($data -and $data.destaque){
    $card=New-Object System.Windows.Controls.Border
    $card.CornerRadius=New-Object System.Windows.CornerRadius(18)
    $card.Background=(_Brush "#1FFFC83D"); $card.BorderBrush=(_Brush "#4DFFC83D"); $card.BorderThickness=New-Object System.Windows.Thickness(1)
    $card.Padding=New-Object System.Windows.Thickness(18,14,18,14); $card.Margin=New-Object System.Windows.Thickness(0,4,0,14)
    $sp=New-Object System.Windows.Controls.StackPanel
    $lbl=_TB ([char]::ConvertFromUtf32(0x26A1)+"  DESTAQUES") 11.5 "Bold" "#FFD98A"; $lbl.Margin=New-Object System.Windows.Thickness(0,0,0,6)
    [void]$sp.Children.Add($lbl); [void]$sp.Children.Add((_TB $data.destaque 13.5 "Normal" "#FBEFD2"))
    $card.Child=$sp; [void]$body.Children.Add($card)
  }

  # ---------- seções ----------
  function _Emoji($n){ [char]::ConvertFromUtf32($n) }
  if($data -and $data.secoes){
    $secoesArr=@($data.secoes)
    # há bloco "Pendentes da semana"? (2+ dias). Se sim, marcamos as seções de HOJE com um divisor.
    $hasPend=@($secoesArr | Where-Object { $_.fonte -match 'PENDENTE' }).Count -gt 0
    $todayHdrDone=$false
    foreach($s in $secoesArr){
      $isPend = ($s.fonte -match 'PENDENTE')
      if($isPend){
        # divisor grande do backlog da semana (âmbar, pra saltar aos olhos)
        $pd=New-Object System.Windows.Controls.Border
        $pd.CornerRadius=New-Object System.Windows.CornerRadius(16)
        $pd.Background=(_Brush "#1FFFB23E"); $pd.BorderBrush=(_Brush "#4DFFB23E"); $pd.BorderThickness=New-Object System.Windows.Thickness(1)
        $pd.Padding=New-Object System.Windows.Thickness(16,12,16,12); $pd.Margin=New-Object System.Windows.Thickness(0,22,0,2)
        $psp=New-Object System.Windows.Controls.StackPanel
        $ptt=_TB ((_Emoji 0x23F3)+"  PENDENTES DA SEMANA") 15 "Bold" "#FFD9A8"
        $psb=_TB "De dias anteriores e ainda sem resposta — não deixe passar." 11.5 "Normal" "#E7C9A8"; $psb.Margin=New-Object System.Windows.Thickness(0,3,0,0)
        [void]$psp.Children.Add($ptt); [void]$psp.Children.Add($psb); $pd.Child=$psp
        [void]$body.Children.Add($pd)
        foreach($it in @($s.itens)){ [void]$body.Children.Add((_ItemRow $it.texto $it.url $it.rascunho $it.copiar $false)) }
        continue
      }
      # antes da 1ª seção de HOJE, se existe backlog, marca o bloco "HOJE"
      if($hasPend -and -not $todayHdrDone){
        $hj=_TB "HOJE" 12 "Bold" "#8FA0E8"; $hj.Margin=New-Object System.Windows.Thickness(2,4,0,0)
        [void]$body.Children.Add($hj); $todayHdrDone=$true
      }
      $ic = if($s.fonte -match 'WHATS'){ _Emoji 0x1F4AC } elseif($s.fonte -match 'MAIL'){ _Emoji 0x1F4E7 } elseif($s.fonte -match 'YOU'){ [char]0x25B6 } else { [char]0x2022 }
      $title=_TB ("$ic  " + $s.fonte) 15 "Bold" "#FFFFFF"; $title.Margin=New-Object System.Windows.Thickness(2,14,0,2)
      [void]$body.Children.Add($title)
      if($s.grupos -and @($s.grupos).Count -gt 0){
        # YouTube: separado POR VÍDEO. Cabeçalho do vídeo (clicável abre o vídeo) + cards divididos.
        foreach($grp in @($s.grupos)){
          $vh=New-Object System.Windows.Controls.Border
          $vh.CornerRadius=New-Object System.Windows.CornerRadius(10)
          $vh.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x16,0x8F,0xA0,0xE8)))
          $vh.Padding=New-Object System.Windows.Thickness(12,7,12,7); $vh.Margin=New-Object System.Windows.Thickness(0,14,0,2)
          $vh.HorizontalAlignment="Left"
          $vhtxt=_TB ([char]::ConvertFromUtf32(0x1F3AC)+"  "+[string]$grp.video) 12.5 "Bold" "#C9D2F5"
          $vh.Child=$vhtxt
          if($grp.videoUrl){ $vh.Cursor=[System.Windows.Input.Cursors]::Hand; $vh.Tag=[string]$grp.videoUrl; $vh.Add_MouseLeftButtonUp({ param($src,$e) try{ if($src.Tag){ Start-Process ([string]$src.Tag) } }catch{} }) }
          [void]$body.Children.Add($vh)
          foreach($it in @($grp.itens)){ [void]$body.Children.Add((_YtCard $it.texto $it.url $it.rascunho $it.copiar)) }
        }
      } else {
        foreach($it in $s.itens){ [void]$body.Children.Add((_ItemRow $it.texto $it.url $it.rascunho $it.copiar $false)) }
      }
      # "ver mais": e-mails menos importantes escondidos atrás de um toggle (olhada rápida)
      $secund = @($s.secundarios) | Where-Object { $_ -and $_.texto }
      if($secund.Count -gt 0){
        $morePanel=New-Object System.Windows.Controls.StackPanel
        $morePanel.Visibility=[System.Windows.Visibility]::Collapsed
        foreach($it in $secund){ [void]$morePanel.Children.Add((_ItemRow $it.texto $it.url $null $null $true)) }
        $tg=New-Object System.Windows.Controls.Border
        $tg.CornerRadius=New-Object System.Windows.CornerRadius(10); $tg.Padding=New-Object System.Windows.Thickness(12,6,12,6)
        $tg.Margin=New-Object System.Windows.Thickness(2,8,0,0); $tg.HorizontalAlignment="Left"
        $tg.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x16,0x8F,0xA0,0xE8)))
        $tg.Cursor=[System.Windows.Input.Cursors]::Hand
        $tgTxt=_TB ([char]0x25BE + "  ver mais $($secund.Count) e-mail(s) menos importante(s)") 12 "Bold" "#9DB0F0"
        $tgTxt.Tag=$tgTxt.Text   # guarda o rótulo original pra restaurar ao recolher
        $tg.Child=$tgTxt; $tg.Tag=$morePanel
        $tg.Add_MouseLeftButtonUp({ param($src,$e)
          $panel=$src.Tag; $lbl=$src.Child
          if($panel.Visibility -eq [System.Windows.Visibility]::Visible){
            $panel.Visibility=[System.Windows.Visibility]::Collapsed; $lbl.Text=$lbl.Tag
          } else {
            $panel.Visibility=[System.Windows.Visibility]::Visible; $lbl.Text=([char]0x25B4 + "  ver menos")
          }
        })
        [void]$body.Children.Add($tg); [void]$body.Children.Add($morePanel)
      }
    }
  }

  # sobe na frente ao abrir, mas NÃO fica preso no topo (pode minimizar/cobrir depois)
  $win.Add_Loaded({ $win.Activate(); $win.Topmost=$false })
  try { [System.Media.SystemSounds]::Asterisk.Play() } catch {}
  [void]$win.ShowDialog()
}

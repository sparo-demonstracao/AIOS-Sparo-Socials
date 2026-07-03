# skool-popup.ps1 — Define Show-SkoolPopup([string]$json).
# Recebe {titulo, data, itens:[{autor, original, rascunho, url}]} e mostra cada item como um card de
# vidro: autor + o que o membro escreveu + o RASCUNHO de resposta (selecionável) + botão "Copiar
# resposta" + "Abrir no Skool". Mesmo tema visual do daily-brief. Nada é publicado — só rascunho.

function Show-SkoolPopup([string]$json) {
  Add-Type -AssemblyName PresentationFramework
  Add-Type -AssemblyName PresentationCore
  Add-Type -AssemblyName WindowsBase

  $ASSET = "C:\Users\canal\Documentos\Antigravity Projetos\AIOS - Sparo Socials\scripts\daily-brief\assets"
  try { $data = $json | ConvertFrom-Json } catch { $data = $null }

  $xamlText = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="AIOS - Responder Skool" Width="720" Height="880"
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
  $Layer=$win.FindName("Layer"); $body=$win.FindName("Body")
  $hdrTitle=$win.FindName("HdrTitle"); $hdrSub=$win.FindName("HdrSub")
  $headerBar=$win.FindName("HeaderBar"); $btnClose=$win.FindName("BtnClose"); $btnMin=$win.FindName("BtnMin")
  $win.FindName("CloseGlyph").Text=[char]0x2715
  $win.FindName("MinGlyph").Text=[char]0x2013

  try { $win.FontFamily = New-Object System.Windows.Media.FontFamily("file:///C:/Users/canal/Documentos/Antigravity%20Projetos/AIOS%20-%20Sparo%20Socials/scripts/daily-brief/assets/#Plus Jakarta Sans") } catch {}
  try {
    $ico=New-Object System.Windows.Media.Imaging.BitmapImage; $ico.BeginInit(); $ico.UriSource=New-Object System.Uri((Join-Path $ASSET "aios-sol.ico")); $ico.CacheOption=[System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad; $ico.EndInit(); $win.Icon=$ico
    $glyph=New-Object System.Windows.Media.Imaging.BitmapImage; $glyph.BeginInit(); $glyph.UriSource=New-Object System.Uri((Join-Path $ASSET "aios-sol-glyph.png")); $glyph.CacheOption=[System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad; $glyph.EndInit(); $win.FindName("HdrLogo").Source=$glyph
  } catch {}

  $Layer.Add_SizeChanged({ $rg=New-Object System.Windows.Media.RectangleGeometry; $rg.Rect=New-Object System.Windows.Rect 0,0,$Layer.ActualWidth,$Layer.ActualHeight; $rg.RadiusX=30; $rg.RadiusY=30; $Layer.Clip=$rg })
  # marca o clique nos botões como tratado pra NÃO vazar pro DragMove da barra (que engole o clique)
  $btnClose.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnMin.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnClose.Add_MouseLeftButtonUp({ $win.Close() })
  $btnMin.Add_MouseLeftButtonUp({ $win.WindowState=[System.Windows.WindowState]::Minimized })
  $headerBar.Add_MouseLeftButtonDown({ try { $win.DragMove() } catch {} })
  $win.Add_KeyDown({ if($_.Key -eq [System.Windows.Input.Key]::Escape){ $win.Close() } })

  function _Brush($hex){ New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.ColorConverter]::ConvertFromString($hex)) }
  function _TB($text,$size,$weight,$hex){ $tb=New-Object System.Windows.Controls.TextBlock; $tb.Text=$text; $tb.FontSize=$size; $tb.FontWeight=[System.Windows.FontWeights]::$weight; $tb.Foreground=(_Brush $hex); $tb.TextWrapping="Wrap"; $tb }

  # ---------- cabeçalho ----------
  $hdrTitle.Text= if($data -and $data.titulo){ $data.titulo } else { "Responder Skool" }
  $n = if($data -and $data.itens){ @($data.itens).Count } else { 0 }
  $hdrSub.Text = "$n para revisar  •  rascunhos na sua voz — você revisa e posta"

  # ---------- card de cada item ----------
  function _Card($autor,$original,$rascunho,$url,$comunidade){
    $card=New-Object System.Windows.Controls.Border
    $card.CornerRadius=New-Object System.Windows.CornerRadius(16)
    $card.BorderThickness=New-Object System.Windows.Thickness(1)
    $card.Padding=New-Object System.Windows.Thickness(16,14,16,14)
    $card.Margin=New-Object System.Windows.Thickness(0,10,0,0)
    $card.Background=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x12,0xFF,0xFF,0xFF)))
    $card.BorderBrush=(New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromArgb(0x1F,0xFF,0xFF,0xFF)))
    $sp=New-Object System.Windows.Controls.StackPanel

    if($autor -or $comunidade){
      $linha=New-Object System.Windows.Controls.StackPanel; $linha.Orientation="Horizontal"; $linha.Margin=New-Object System.Windows.Thickness(0,0,0,4)
      if($autor){ $a=_TB ([char]::ConvertFromUtf32(0x1F464) + "  " + $autor) 13 "Bold" "#FFD98A"; $a.VerticalAlignment="Center"; [void]$linha.Children.Add($a) }
      if($comunidade){
        if($comunidade -match '^\s*gratis\s*$'){ $comunidade="Grátis" }  # rótulo do .env vem sem acento
        # etiqueta de origem: Alunos+ = dourado, Chat/DM = lilás, grátis = verde
        $hex = "#2E7DD3A0"; $fg = "#7DD3A0"
        if($comunidade -match '\+|aluno'){ $hex="#2EFFC83D"; $fg="#FFC83D" }
        elseif($comunidade -match 'chat|dm'){ $hex="#2EB39DFF"; $fg="#B39DFF" }
        $chip=New-Object System.Windows.Controls.Border
        $chip.CornerRadius=New-Object System.Windows.CornerRadius(9)
        $chip.Background=(_Brush $hex)
        $chip.Padding=New-Object System.Windows.Thickness(9,2,9,3)
        $chip.Margin=New-Object System.Windows.Thickness(10,0,0,0)
        $chip.VerticalAlignment="Center"
        $ct=_TB $comunidade 10.5 "Bold" $fg
        $chip.Child=$ct
        [void]$linha.Children.Add($chip)
      }
      [void]$sp.Children.Add($linha)
    }
    if($original){ $o=_TB $original 12.5 "Normal" "#A7B0DE"; $o.Margin=New-Object System.Windows.Thickness(0,0,0,10); [void]$sp.Children.Add($o) }

    if($rascunho){
      $rb=New-Object System.Windows.Controls.Border
      $rb.CornerRadius=New-Object System.Windows.CornerRadius(12)
      $rb.Background=(_Brush "#15FFFFFF"); $rb.BorderBrush=(_Brush "#33FFFFFF"); $rb.BorderThickness=New-Object System.Windows.Thickness(1)
      $rb.Padding=New-Object System.Windows.Thickness(12,10,12,10)
      $tx=New-Object System.Windows.Controls.TextBox
      $tx.Text=$rascunho; $tx.AcceptsReturn=$true; $tx.TextWrapping="Wrap"; $tx.BorderThickness=New-Object System.Windows.Thickness(0)
      $tx.Background=[System.Windows.Media.Brushes]::Transparent; $tx.Foreground=(_Brush "#EAF0FF"); $tx.FontSize=13.5
      $tx.IsReadOnly=$false; $tx.MaxHeight=220; $tx.VerticalScrollBarVisibility="Auto"
      $rb.Child=$tx; [void]$sp.Children.Add($rb)

      # ações
      $row=New-Object System.Windows.Controls.StackPanel; $row.Orientation="Horizontal"; $row.Margin=New-Object System.Windows.Thickness(0,10,0,0)
      $copy=New-Object System.Windows.Controls.Button
      $copy.Content="Copiar resposta"; $copy.Foreground=(_Brush "#0E1030"); $copy.Background=(_Brush "#FFC83D"); $copy.BorderThickness=New-Object System.Windows.Thickness(0)
      $copy.Padding=New-Object System.Windows.Thickness(14,7,14,7); $copy.Cursor="Hand"; $copy.FontWeight="Bold"; $copy.FontSize=12.5
      $copy.Add_Click({ param($s,$e) try { [System.Windows.Clipboard]::SetText($tx.Text); $s.Content="Copiado!" } catch {} }.GetNewClosure())
      [void]$row.Children.Add($copy)

      if($url){
        $open=New-Object System.Windows.Controls.Button
        $open.Content="Abrir e localizar"; $open.Foreground=(_Brush "#D7DEF2"); $open.Background=(_Brush "#1FFFFFFF"); $open.BorderThickness=New-Object System.Windows.Thickness(0)
        $open.Padding=New-Object System.Windows.Thickness(14,7,14,7); $open.Margin=New-Object System.Windows.Thickness(10,0,0,0); $open.Cursor="Hand"; $open.FontSize=12.5
        $open.ToolTip="Abre o post já destacando o trecho do comentário. O nome do membro fica copiado — se não destacar, é só Ctrl+F e Ctrl+V."
        # Abre o post com scroll-to-text (#:~:text=) pro navegador destacar o trecho do comentário,
        # e deixa o nome do membro no clipboard como plano B (Ctrl+F + Ctrl+V).
        $open.Add_Click({
          try {
            $alvo=[string]$url
            $snip=(([string]$original) -replace '[,…“”"\-]',' ' -replace '\s+',' ').Trim()
            if($snip){
              $pal=$snip.Split(' '); $n=[Math]::Min(7,$pal.Count)
              $snip=($pal[0..($n-1)] -join ' ')
              $alvo=$alvo + '#:~:text=' + [uri]::EscapeDataString($snip)
            }
            $nome=(([string]$autor) -replace '^[^\p{L}]+','').Trim()
            if($nome){ try { [System.Windows.Clipboard]::SetText($nome) } catch {} }
            Start-Process $alvo
          } catch {}
        }.GetNewClosure())
        [void]$row.Children.Add($open)
      }
      [void]$sp.Children.Add($row)
    }
    $card.Child=$sp; $card
  }

  if($data -and $data.itens){
    foreach($it in @($data.itens)){ [void]$body.Children.Add((_Card $it.autor $it.original $it.rascunho $it.url $it.comunidade)) }
  } else {
    [void]$body.Children.Add((_TB "Nada pra mostrar." 14 "Normal" "#E2E7F6"))
  }

  $win.Add_Loaded({ $win.Activate(); $win.Topmost=$false })
  try { [System.Media.SystemSounds]::Asterisk.Play() } catch {}
  [void]$win.ShowDialog()
}

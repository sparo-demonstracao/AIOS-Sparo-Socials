# loading-brief.ps1 — Define Show-LoadingBrief($Process, $ProgressFile).
# Tela de carregamento do Resumo Matinal que mostra os LOGS REAIS aparecendo ao vivo: lê o arquivo
# de progresso (C:\tmp\aios-brief-progress.log) que o Run-DailyBrief vai preenchendo passo a passo,
# e acrescenta cada linha nova na tela (efeito de "log rolando"). Fecha sozinha quando a coleta
# termina (o processo do Run-DailyBrief sai). Tem minimizar/fechar e minimiza ao perder o foco.

function Show-LoadingBrief($Process, $ProgressFile) {
  Add-Type -AssemblyName PresentationFramework
  Add-Type -AssemblyName PresentationCore
  Add-Type -AssemblyName WindowsBase

  $xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="AIOS - Buscando mensagens" Width="580" Height="500"
        WindowStartupLocation="CenterScreen" Topmost="True" ShowInTaskbar="True"
        WindowStyle="None" AllowsTransparency="True" Background="Transparent" ResizeMode="CanMinimize">
  <Border CornerRadius="28" Margin="18">
    <Border.Effect><DropShadowEffect BlurRadius="52" ShadowDepth="0" Opacity="0.6" Color="#03020A"/></Border.Effect>
    <Border.Background>
      <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
        <GradientStop Color="#141A40" Offset="0"/><GradientStop Color="#1A1B4B" Offset="0.55"/><GradientStop Color="#2B1C55" Offset="1"/>
      </LinearGradientBrush>
    </Border.Background>
    <Grid x:Name="Layer" Margin="30,22,30,26">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="*"/>
        <RowDefinition Height="Auto"/>
      </Grid.RowDefinitions>

      <StackPanel Grid.Row="0" Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Top" Margin="0,-6,-8,0">
        <Border x:Name="BtnMin" Width="30" Height="30" CornerRadius="15" Background="#1FFFFFFF" Margin="0,0,8,0" Cursor="Hand">
          <TextBlock x:Name="MinGlyph" Foreground="#D7DEF2" FontSize="15" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center" Margin="0,-5,0,0"/>
        </Border>
        <Border x:Name="BtnClose" Width="30" Height="30" CornerRadius="15" Background="#1FFFFFFF" Cursor="Hand">
          <TextBlock x:Name="CloseGlyph" Foreground="#D7DEF2" FontSize="13" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
      </StackPanel>

      <StackPanel Grid.Row="1" Orientation="Horizontal" Margin="0,4,0,0">
        <TextBlock Text="&#x1F4E8;" FontSize="30" VerticalAlignment="Center" Margin="0,0,12,0"/>
        <StackPanel VerticalAlignment="Center">
          <TextBlock x:Name="T1" Foreground="White" FontSize="20" FontWeight="Bold"/>
          <TextBlock x:Name="T2" Foreground="#A7B0DE" FontSize="12.5" Margin="0,3,0,0" TextWrapping="Wrap"/>
        </StackPanel>
      </StackPanel>

      <Border Grid.Row="3" CornerRadius="16" Background="#26000B2E" Margin="0,18,0,0" Padding="18,14,12,14">
        <ScrollViewer x:Name="Scroll" VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Disabled">
          <StackPanel x:Name="LogPanel"/>
        </ScrollViewer>
      </Border>

      <ProgressBar Grid.Row="4" x:Name="Bar" IsIndeterminate="True" Height="6" Margin="0,18,0,0" Background="#1FFFFFFF" Foreground="#FFC83D" BorderThickness="0"/>
    </Grid>
  </Border>
</Window>
'@

  $win = [Windows.Markup.XamlReader]::Parse($xaml)
  try { $win.FontFamily = New-Object System.Windows.Media.FontFamily("file:///C:/Users/canal/Documentos/Antigravity%20Projetos/AIOS%20-%20Sparo%20Socials/scripts/daily-brief/assets/#Plus Jakarta Sans") } catch {}

  $win.FindName("T1").Text = "Buscando suas mensagens..."
  $win.FindName("T2").Text = "Primeira vez hoje — reunindo WhatsApp, Gmail e YouTube das últimas 24h. Leva ~1-2 min."
  $win.FindName("MinGlyph").Text  = [char]0x2013   # –
  $win.FindName("CloseGlyph").Text = [char]0x2715  # ✕

  $layer    = $win.FindName("Layer")
  $btnMin   = $win.FindName("BtnMin")
  $btnClose = $win.FindName("BtnClose")
  $scroll   = $win.FindName("Scroll")
  $logPanel = $win.FindName("LogPanel")
  $t1       = $win.FindName("T1")
  $bar      = $win.FindName("Bar")

  # arrastar pela janela (mas não quando clica nos botões)
  $layer.Add_MouseLeftButtonDown({ try { $win.DragMove() } catch {} })
  $btnMin.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnClose.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnMin.Add_MouseLeftButtonUp({ $win.WindowState=[System.Windows.WindowState]::Minimized })
  $btnClose.Add_MouseLeftButtonUp({ $win.Close() })

  $soft  = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromRgb(0x9A,0xA4,0xCE))
  $bright= New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.Color]::FromRgb(0xFF,0xFF,0xFF))

  # estado compartilhado com o timer (mesmo padrão do loading-popup.ps1)
  $state = @{ offset = 0; proc = $Process; file = $ProgressFile; done = $false; closeAt = 0; ticks = 0; lastTb = $null; armed = $false }

  # acrescenta uma linha de log na tela, escurecendo a anterior e destacando a nova
  $appendLine = {
    param($txt)
    if($state.lastTb){ $state.lastTb.Foreground = $soft; $state.lastTb.FontWeight = 'Normal' }
    $tb = New-Object System.Windows.Controls.TextBlock
    $tb.Text = $txt
    $tb.Foreground = $bright
    $tb.FontWeight = 'SemiBold'
    $tb.FontSize = 13.5
    $tb.TextWrapping = 'Wrap'
    $tb.Margin = '0,3,0,3'
    [void]$logPanel.Children.Add($tb)
    $state.lastTb = $tb
    try { $scroll.ScrollToEnd() } catch {}
  }

  $timer = New-Object System.Windows.Threading.DispatcherTimer
  $timer.Interval = [TimeSpan]::FromMilliseconds(350)
  $timer.Add_Tick({
    $state.ticks++

    # 1) lê as linhas novas do arquivo de progresso (sem travar a escrita do Run-DailyBrief)
    try {
      $path = $state.file
      if(Test-Path $path){
        $fs = New-Object System.IO.FileStream($path,[System.IO.FileMode]::Open,[System.IO.FileAccess]::Read,[System.IO.FileShare]::ReadWrite)
        try {
          if($fs.Length -lt $state.offset){ $state.offset = 0 }   # arquivo foi resetado -> recomeça
          [void]$fs.Seek($state.offset,[System.IO.SeekOrigin]::Begin)
          $sr = New-Object System.IO.StreamReader($fs,[System.Text.Encoding]::UTF8)
          $txt = $sr.ReadToEnd()
          $state.offset = $fs.Length
          $sr.Dispose()
          if($txt){
            foreach($ln in ($txt -split "`r?`n")){ if($ln.Trim() -ne ""){ & $appendLine $ln.Trim() } }
          }
        } finally { $fs.Dispose() }
      }
    } catch {}

    # 2) terminou? (processo do Run-DailyBrief saiu) -> mostra "pronto" e fecha em seguida
    $exited = $false
    if($state.proc){ try { $exited = $state.proc.HasExited } catch { $exited = $true } }
    $timedOut = ($state.ticks -ge 700)   # ~4 min de teto de segurança

    if(($exited -or $timedOut) -and -not $state.done){
      $state.done = $true
      $state.closeAt = $state.ticks + 3   # fecha ~1s depois (3 ticks x 350ms), pra você ler o "pronto"
      try { $bar.IsIndeterminate = $false; $bar.Value = 100 } catch {}
      try { $t1.Text = "Pronto! Abrindo seu resumo..." } catch {}
    }
    # fechamento adiado feito pelo PRÓPRIO timer (sem timer aninhado, que não enxergaria a si mesmo)
    if($state.done -and $state.ticks -ge $state.closeAt){
      $timer.Stop()
      try { $win.Close() } catch {}
    }
  })

  # minimiza sozinha ao perder o foco (clicou em outro app) — só depois de 1,5s visível
  $armTimer = New-Object System.Windows.Threading.DispatcherTimer
  $armTimer.Interval = [TimeSpan]::FromMilliseconds(1500)
  $armTimer.Add_Tick({ $state.armed = $true; $armTimer.Stop() })
  $win.Add_Deactivated({ try { if($state.armed -and -not $state.done -and $win.WindowState -ne [System.Windows.WindowState]::Minimized){ $win.WindowState=[System.Windows.WindowState]::Minimized } } catch {} })
  $win.Add_KeyDown({ if($_.Key -eq [System.Windows.Input.Key]::Escape){ $win.Close() } })

  $win.Add_Loaded({ $win.Activate(); $timer.Start(); $armTimer.Start() })
  [void]$win.ShowDialog()
}

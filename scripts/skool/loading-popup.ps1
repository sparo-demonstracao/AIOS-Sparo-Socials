# loading-popup.ps1 — Define Show-LoadingPopup(). Janelinha central "Buscando no Skool…" com barra
# de progresso ANIMADA (indeterminada, nativa do WPF) enquanto o Run-Skool busca (~1-2 min).
# Tem botão minimizar/fechar, é arrastável, e MINIMIZA SOZINHA quando você clica em outro app
# (Deactivated). Aparece na barra de tarefas pra restaurar. O Run-Skool a fecha pelo título no fim.

function Show-LoadingPopup() {
  Add-Type -AssemblyName PresentationFramework
  Add-Type -AssemblyName PresentationCore
  Add-Type -AssemblyName WindowsBase

  $xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="AIOS - Buscando Skool" Width="460" Height="240"
        WindowStartupLocation="CenterScreen" Topmost="True" ShowInTaskbar="True"
        WindowStyle="None" AllowsTransparency="True" Background="Transparent" ResizeMode="CanMinimize">
  <Border CornerRadius="26" Margin="18">
    <Border.Effect><DropShadowEffect BlurRadius="48" ShadowDepth="0" Opacity="0.6" Color="#03020A"/></Border.Effect>
    <Border.Background>
      <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
        <GradientStop Color="#141A40" Offset="0"/><GradientStop Color="#1A1B4B" Offset="0.55"/><GradientStop Color="#2B1C55" Offset="1"/>
      </LinearGradientBrush>
    </Border.Background>
    <Grid x:Name="Layer">
      <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Top" Margin="0,12,14,0">
        <Border x:Name="BtnMin" Width="30" Height="30" CornerRadius="15" Background="#1FFFFFFF" Margin="0,0,8,0" Cursor="Hand">
          <TextBlock x:Name="MinGlyph" Foreground="#D7DEF2" FontSize="15" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center" Margin="0,-5,0,0"/>
        </Border>
        <Border x:Name="BtnClose" Width="30" Height="30" CornerRadius="15" Background="#1FFFFFFF" Cursor="Hand">
          <TextBlock x:Name="CloseGlyph" Foreground="#D7DEF2" FontSize="13" FontWeight="Bold" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
      </StackPanel>
      <StackPanel HorizontalAlignment="Center" VerticalAlignment="Center" Margin="34,8,34,0">
        <TextBlock Text="&#x1F50E;" FontSize="34" HorizontalAlignment="Center" Margin="0,0,0,10"/>
        <TextBlock x:Name="T1" Foreground="White" FontSize="19" FontWeight="Bold" HorizontalAlignment="Center"/>
        <TextBlock x:Name="T2" Foreground="#A7B0DE" FontSize="12.5" Margin="0,7,0,16" HorizontalAlignment="Center" TextAlignment="Center" TextWrapping="Wrap"/>
        <ProgressBar IsIndeterminate="True" Height="7" Width="340" Background="#1FFFFFFF" Foreground="#FFC83D" BorderThickness="0"/>
      </StackPanel>
    </Grid>
  </Border>
</Window>
'@

  $win = [Windows.Markup.XamlReader]::Parse($xaml)
  try { $win.FontFamily = New-Object System.Windows.Media.FontFamily("file:///C:/Users/canal/Documentos/Antigravity%20Projetos/AIOS%20-%20Sparo%20Socials/scripts/daily-brief/assets/#Plus Jakarta Sans") } catch {}
  $win.FindName("T1").Text = "Buscando no Skool..."
  $win.FindName("T2").Text = "Lendo posts, comentarios e DMs e rascunhando na sua voz - pode levar 1-2 min."
  $win.FindName("MinGlyph").Text = [char]0x2013   # –
  $win.FindName("CloseGlyph").Text = [char]0x2715 # ✕

  $layer  = $win.FindName("Layer")
  $btnMin = $win.FindName("BtnMin")
  $btnClose = $win.FindName("BtnClose")

  # arrastar pela janela (mas não quando clica nos botões)
  $layer.Add_MouseLeftButtonDown({ try { $win.DragMove() } catch {} })
  $btnMin.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnClose.Add_PreviewMouseLeftButtonDown({ param($s,$e) $e.Handled=$true })
  $btnMin.Add_MouseLeftButtonUp({ $win.WindowState=[System.Windows.WindowState]::Minimized })
  $btnClose.Add_MouseLeftButtonUp({ $win.Close() })

  # MINIMIZA SOZINHA ao perder o foco (clicou em outro app) — mas só depois de 1,5s visível, pra não
  # minimizar no instante em que abre (antes de fixar o foco).
  $state = @{ armed = $false }
  $timer = New-Object System.Windows.Threading.DispatcherTimer
  $timer.Interval = [TimeSpan]::FromMilliseconds(1500)
  $timer.Add_Tick({ $state.armed = $true; $timer.Stop() })
  $win.Add_Deactivated({ try { if($state.armed -and $win.WindowState -ne [System.Windows.WindowState]::Minimized){ $win.WindowState=[System.Windows.WindowState]::Minimized } } catch {} })
  $win.Add_KeyDown({ if($_.Key -eq [System.Windows.Input.Key]::Escape){ $win.Close() } })

  # Watchdog: se o Run-Skool morrer sem fechar esta janela, ela avisa aos 4 min e fecha aos 6.
  # (O normal é o Run-Skool fechá-la pelo título em 1-2 min.)
  $wdEstado = @{ fase = 0 }
  $wd = New-Object System.Windows.Threading.DispatcherTimer
  $wd.Interval = [TimeSpan]::FromMinutes(4)
  $wd.Add_Tick({
    if($wdEstado.fase -eq 0){
      $wdEstado.fase = 1
      try {
        $win.FindName("T1").Text = "Isso esta demorando demais..."
        $win.FindName("T2").Text = "Algo deu errado na busca do Skool - veja C:\tmp\aios-skool.log. Esta janela fecha sozinha em 2 min."
      } catch {}
      $wd.Interval = [TimeSpan]::FromMinutes(2)
    } else {
      $wd.Stop()
      try { $win.Close() } catch {}
    }
  })
  $win.Add_Loaded({ $win.Activate(); $timer.Start(); $wd.Start() })
  [void]$win.ShowDialog()
}

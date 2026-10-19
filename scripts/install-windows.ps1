# TCA Agentic Engineering: one-command Windows setup.
#
# Paste this line into Windows PowerShell (no need to run it as Administrator):
#
#   irm https://raw.githubusercontent.com/paulkeen/tca-habits/main/scripts/install-windows.ps1 | iex
#
# It turns on WSL2, installs Ubuntu, installs every course prerequisite inside
# Ubuntu (scripts/install-ubuntu.sh), downloads the reference app and checks it.
# Safe to run again: after a restart, or if anything fails, paste the same line
# and it carries on from where it stopped.
#
# Kept to plain ASCII so Windows PowerShell 5.1 reads it correctly.

& {
    $ErrorActionPreference = 'Stop'
    $Distro = 'Ubuntu'
    $Raw = 'https://raw.githubusercontent.com/paulkeen/tca-habits/main/scripts'
    $env:WSL_UTF8 = '1'   # otherwise wsl.exe prints UTF-16 and the distro list cannot be read

    function Say([string]$Message) { Write-Host "`n==> $Message" -ForegroundColor Cyan }
    function Tell([string]$Message) { Write-Host "    $Message" }
    function Warn([string]$Message) { Write-Host "`n$Message" -ForegroundColor Yellow }

    # Probes run with 'Continue': in PowerShell 5.1, redirected stderr from a
    # native command becomes a terminating error under 'Stop'.
    function Test-WslReady {
        $ErrorActionPreference = 'Continue'
        & wsl.exe --status *> $null
        return ($LASTEXITCODE -eq 0)
    }

    function Test-DistroInstalled {
        $ErrorActionPreference = 'Continue'
        $list = (& wsl.exe --list --quiet 2>$null) -replace "`0", ''
        return [bool]($list | Where-Object { $_.Trim() -eq $Distro })
    }

    function Get-DefaultUid {
        $ErrorActionPreference = 'Continue'
        $uid = (& wsl.exe -d $Distro -e id -u 2>$null) -replace "`0", ''
        return "$uid".Trim()
    }

    Write-Host ''
    Write-Host 'TCA Agentic Engineering: Windows setup' -ForegroundColor Green
    Write-Host 'This takes 15 to 30 minutes. Leave this window open until it says it is finished.'

    # 1. Windows itself
    $build = [Environment]::OSVersion.Version.Build
    if ($build -lt 19041) {
        Warn "This version of Windows (build $build) is too old for WSL2. Run Windows Update, or use the Codespaces Setup guide instead."
        return
    }
    if (-not (Get-Command wsl.exe -ErrorAction SilentlyContinue)) {
        Warn 'wsl.exe is missing on this PC. Run Windows Update, or use the Codespaces Setup guide instead.'
        return
    }

    # 2. WSL (the only step that needs Administrator rights)
    Say 'Step 1 of 4: WSL (Linux inside Windows)'
    if (Test-WslReady) {
        Tell 'already on'
    } else {
        Tell 'Turning WSL on. If Windows asks "Do you want to allow this app to make changes", click Yes.'
        try {
            Start-Process wsl.exe -ArgumentList '--install', '--no-distribution' -Verb RunAs -Wait
        } catch {
            Warn 'Windows did not allow the change. You need Administrator rights for this one step; if your laptop is locked down, use the Codespaces Setup guide instead.'
            return
        }
        Tell 'If it says a restart is needed, the next step tells you what to do.'
    }

    # 3. Ubuntu, and your Ubuntu user
    Say 'Step 2 of 4: Ubuntu'
    if (Test-DistroInstalled) {
        Tell 'already installed'
    } else {
        Tell 'Downloading Ubuntu (a few minutes).'
        Tell 'Next it asks you to choose a USERNAME and PASSWORD for Ubuntu.'
        Tell 'Use lowercase letters for the username. The password shows nothing as you type: that is normal.'
        Tell 'Write the password down. When you see a prompt ending in $, type  exit  and press Enter.'
        & wsl.exe --install -d $Distro
        if (-not (Test-DistroInstalled)) {
            Warn 'Ubuntu is not installed yet, usually because Windows needs a restart to finish turning WSL on. RESTART YOUR COMPUTER, then open PowerShell and paste the same command again. It carries on from here.'
            return
        }
    }

    if ((Get-DefaultUid) -eq '0') {
        Read-Host '    If a separate Ubuntu window opened, finish choosing the username and password there, then press Enter here'
    }
    if ((Get-DefaultUid) -eq '0') {
        Tell 'Ubuntu still needs a user. Choose a username and password now; when you see the $ prompt, type  exit'
        & wsl.exe -d $Distro
        if ((Get-DefaultUid) -eq '0') {
            Warn 'Ubuntu has no user yet, so the setup cannot continue. Paste the same command again, or screenshot this window and post it in the cohort chat.'
            return
        }
    }
    Tell 'Ubuntu user ready'

    # 4. Everything else happens inside Ubuntu
    Say 'Step 3 of 4: system packages inside Ubuntu'
    & wsl.exe -d $Distro -u root -e bash -c "curl -fsSL $Raw/install-ubuntu.sh | bash -s -- --system"
    if ($LASTEXITCODE -ne 0) {
        Warn 'Installing the Ubuntu packages failed (see above). Check your internet connection and paste the same command again.'
        return
    }

    Say 'Step 4 of 4: Node, uv, Claude Code and the course app (about 10 minutes)'
    & wsl.exe -d $Distro -e bash -c "curl -fsSL $Raw/install-ubuntu.sh | bash"
    if ($LASTEXITCODE -ne 0) {
        Warn 'Something failed inside Ubuntu (see above). Paste the same command again; if it fails twice, screenshot this window and post it in the cohort chat.'
        return
    }

    Write-Host ''
    Write-Host 'Setup finished.' -ForegroundColor Green
    Write-Host 'From now on, use the Ubuntu app (Start menu, type Ubuntu) for everything in the course, not PowerShell.'
    Write-Host 'Next: open Ubuntu, type  claude  and log in (Step 5 of the Prerequisites handout).'
}

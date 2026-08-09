[CmdletBinding()]
param(
  [ValidateSet("sync", "install", "plugins", "test", "build", "serve")]
  [string]$Command = "build"
)

$ErrorActionPreference = "Stop"

$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
if ([string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
  throw "LOCALAPPDATA is not set. This script requires a Windows local AppData directory."
}

$localAppDataRoot = [System.IO.Path]::GetFullPath($env:LOCALAPPDATA)
$runtimeRoot = [System.IO.Path]::GetFullPath((Join-Path $localAppDataRoot "moon-tech-runtime"))
$npmCache = [System.IO.Path]::GetFullPath((Join-Path $localAppDataRoot "moon-tech-npm-cache"))
$pluginRoot = Join-Path $runtimeRoot "plugins/source-note-brief"
$installStamp = Join-Path $localAppDataRoot "moon-tech-runtime-dependencies.sha256"

function Assert-PathUnder {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Root,
    [Parameter(Mandatory = $true)][string]$Label
  )

  $normalizedPath = [System.IO.Path]::GetFullPath($Path)
  $normalizedRoot = ([System.IO.Path]::GetFullPath($Root)).TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
  if (-not $normalizedPath.StartsWith($normalizedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Unsafe $Label path: $normalizedPath"
  }
}

Assert-PathUnder -Path $runtimeRoot -Root $localAppDataRoot -Label "runtime"
Assert-PathUnder -Path $npmCache -Root $localAppDataRoot -Label "npm cache"
Assert-PathUnder -Path $installStamp -Root $localAppDataRoot -Label "dependency stamp"

if (-not (Test-Path -LiteralPath $workspaceRoot -PathType Container)) {
  throw "Workspace root does not exist: $workspaceRoot"
}

New-Item -ItemType Directory -Force -Path $runtimeRoot, $npmCache | Out-Null

# Keep build state and dependencies outside Google Drive. The wildcard entries
# also prevent previously quarantined/corrupt runtime artifacts from being
# copied back into the local working tree.
$excludedDirectories = @(
  ".git",
  ".quartz",
  ".quartz-corrupt-*",
  ".tmp-quartz-*",
  ".node_modules-corrupt-*",
  "node_modules",
  "public",
  ".playwright-cli",
  "playwright-report",
  "test-results"
)

$robocopyArgs = @(
  $workspaceRoot,
  $runtimeRoot,
  "/E",
  "/PURGE",
  "/R:2",
  "/W:1",
  "/NFL",
  "/NDL",
  "/NJH",
  "/NJS",
  "/NP",
  "/XD"
) + $excludedDirectories

& robocopy @robocopyArgs | Out-Null
$robocopyExitCode = $LASTEXITCODE
if ($robocopyExitCode -gt 7) {
  throw "Workspace sync failed with robocopy exit code $robocopyExitCode"
}

Write-Host "Synced Vault workspace to $runtimeRoot"

if ($Command -eq "sync") {
  return
}

function Invoke-Npm {
  param(
    [Parameter(Mandatory = $true)][string[]]$Arguments,
    [Parameter(Mandatory = $true)][string]$Label
  )

  Write-Host "→ $Label"
  & npm @Arguments
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    throw "$Label failed with exit code $exitCode"
  }
}

function Get-DependencyFingerprint {
  $lockFiles = @(
    (Join-Path $runtimeRoot "package-lock.json"),
    (Join-Path $pluginRoot "package-lock.json"),
    (Join-Path $runtimeRoot ".node-version")
  )

  foreach ($lockFile in $lockFiles) {
    if (-not (Test-Path -LiteralPath $lockFile -PathType Leaf)) {
      throw "Required dependency manifest is missing: $lockFile"
    }
  }

  return (($lockFiles | ForEach-Object { (Get-FileHash -Algorithm SHA256 -LiteralPath $_).Hash }) -join "|")
}

function Ensure-RuntimeDependencies {
  $fingerprint = Get-DependencyFingerprint
  $rootPackageLock = Join-Path $runtimeRoot "node_modules/.package-lock.json"
  $pluginPackageLock = Join-Path $pluginRoot "node_modules/.package-lock.json"
  $previousFingerprint = if (Test-Path -LiteralPath $installStamp -PathType Leaf) {
    (Get-Content -Raw -LiteralPath $installStamp).Trim()
  } else {
    ""
  }

  $needsInstall = $previousFingerprint -ne $fingerprint -or
    -not (Test-Path -LiteralPath $rootPackageLock -PathType Leaf) -or
    -not (Test-Path -LiteralPath $pluginPackageLock -PathType Leaf)

  if ($needsInstall) {
    Invoke-Npm -Arguments @(
      "ci",
      "--cache", $npmCache,
      "--foreground-scripts",
      "--no-audit",
      "--no-fund"
    ) -Label "Install Quartz dependencies in AppData"

    Invoke-Npm -Arguments @(
      "ci",
      "--prefix", $pluginRoot,
      "--cache", $npmCache,
      "--foreground-scripts",
      "--no-audit",
      "--no-fund"
    ) -Label "Install Source Note Brief dependencies in AppData"
  } else {
    Write-Host "Using dependency lock state already installed in $runtimeRoot"
  }

  # verify:package includes the production build, so each invocation both
  # reflects source edits and verifies the distributable without a duplicate build.
  Invoke-Npm -Arguments @("run", "verify:package", "--prefix", $pluginRoot) -Label "Verify Source Note Brief package"

  if ($needsInstall) {
    Set-Content -LiteralPath $installStamp -Value $fingerprint -Encoding UTF8
  }
}

function Ensure-QuartzPlugins {
  Invoke-Npm -Arguments @("run", "plugin-install") -Label "Install configured Quartz plugins"
}

Push-Location $runtimeRoot
try {
  Ensure-RuntimeDependencies
  Ensure-QuartzPlugins

  switch ($Command) {
    "install" {
      Write-Host "Local runtime installation is ready."
    }
    "plugins" {
      Write-Host "Configured Quartz plugins are ready."
    }
    "test" {
      Invoke-Npm -Arguments @("test") -Label "Run Quartz and validator tests"
      Invoke-Npm -Arguments @("test", "--prefix", $pluginRoot) -Label "Run Source Note Brief tests"
      Invoke-Npm -Arguments @("run", "validate:sources") -Label "Validate published Source Notes"
    }
    "build" {
      Invoke-Npm -Arguments @("run", "build") -Label "Build moon's tech Quartz site"
    }
    "serve" {
      Invoke-Npm -Arguments @("run", "serve") -Label "Serve moon's tech Quartz site"
    }
  }
}
finally {
  Pop-Location
}

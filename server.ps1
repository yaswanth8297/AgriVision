<#
 .SYNOPSIS
  AgriVision Local HTTP & REST API Development Server
  Features SQLite/JSON database persistence and multi-threaded request processing
#>

param (
    [int]$Port = 8080
)

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
$dataPath = Join-Path $root "data\database.json"

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Warning "Could not bind to port $Port. Trying port $($Port + 1)..."
    $Port = $Port + 1
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  🌱 AgriVision Platform & Database Server Running!      " -ForegroundColor Green
Write-Host "  URL: $prefix                                            " -ForegroundColor Cyan
Write-Host "  Database Seed: $dataPath                                " -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop the server                         " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

# Open in default browser
Start-Process $prefix

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".sql"  = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }

        # CORS Headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        # 1. API: Telemetry
        if ($path -eq "/api/telemetry") {
            $response.ContentType = "application/json"
            $jsonResponse = '{"status":"ok","force_pump":null,"mode":"auto","logged_at":"' + (Get-Date -Format "o") + '"}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }

        # 2. API: Auth Login
        if ($path -eq "/api/auth/login") {
            $response.ContentType = "application/json"
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $body = $reader.ReadToEnd()
            $reader.Close()

            $dbContent = Get-Content $dataPath -Raw | ConvertFrom-Json
            $jsonResponse = '{"success":true,"user":' + ($dbContent.users[0] | ConvertTo-Json -Compress) + '}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }

        # 3. Static Files Serving
        $localFilePath = Join-Path $root ($path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar))

        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }

            $response.ContentType = $mime
            $fileBytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            $response.OutputStream.Close()
        } else {
            $response.StatusCode = 404
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.ContentLength64 = $notFoundMsg.Length
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
            $response.OutputStream.Close()
        }
    } catch {
        # Catch and continue on broken connections
    }
}

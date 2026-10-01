# download_and_replace.ps1

$htmlFile = "responsive-merged-website-fixed.html"
$cssFile = "style.css"
$imagesDir = "images"

if (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir | Out-Null
}

$html = Get-Content -Path $htmlFile -Raw -Encoding UTF8
$css = Get-Content -Path $cssFile -Raw -Encoding UTF8

$urlRegex = [regex]'https://kirsten-gwk862kmgg\.figweb\.site/[^\s"''\)\>]+'

$matchesHtml = $urlRegex.Matches($html) | ForEach-Object { $_.Value }
$matchesCss = $urlRegex.Matches($css) | ForEach-Object { $_.Value }

$allUrls = ($matchesHtml + $matchesCss) | Select-Object -Unique

Write-Host "Found $($allUrls.Count) Figma image URLs to download."

$urlToLocalMap = @{}
$index = 1

foreach ($url in $allUrls) {
    try {
        # Fetch headers to get content-type
        $req = [System.Net.WebRequest]::Create($url)
        $req.Method = "HEAD"
        $resp = $req.GetResponse()
        $contentType = $resp.ContentType
        $resp.Close()

        $ext = ".png"
        if ($contentType -like "*jpeg*" -or $contentType -like "*jpg*") {
            $ext = ".jpg"
        } elseif ($contentType -like "*svg*") {
            $ext = ".svg"
        } elseif ($contentType -like "*webp*") {
            $ext = ".webp"
        } elseif ($contentType -like "*gif*") {
            $ext = ".gif"
        }

        # Create unique filename
        # Extract a snippet of hash if available from URL
        $urlHash = ""
        if ($url -match "figweb\.site-([a-f0-9]{8})") {
            $urlHash = "_" + $matches[1]
        }
        
        $filename = "img_$index$urlHash$ext"
        $filePath = Join-Path $imagesDir $filename

        Write-Host "Downloading [$index/$($allUrls.Count)]: $url -> $filePath ($contentType)"
        
        Invoke-WebRequest -Uri $url -OutFile $filePath -UserAgent "Mozilla/5.0"
        
        $urlToLocalMap[$url] = "$imagesDir/$filename"
        $index++
    }
    catch {
        Write-Host "Error downloading $url : $_"
    }
}

Write-Host "Updating HTML and CSS files..."

# Sort URLs by length descending to avoid partial string replacements
$sortedUrls = $allUrls | Sort-Object -Property Length -Descending

foreach ($url in $sortedUrls) {
    if ($urlToLocalMap.ContainsKey($url)) {
        $localPath = $urlToLocalMap[$url]
        $html = $html.Replace($url, $localPath)
        $css = $css.Replace($url, $localPath)
    }
}

Set-Content -Path $htmlFile -Value $html -Encoding UTF8
Set-Content -Path $cssFile -Value $css -Encoding UTF8

Write-Host "Done! All images downloaded to '$imagesDir' and references updated in '$htmlFile' and '$cssFile'."

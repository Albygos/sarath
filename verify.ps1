# verify.ps1
$html = Get-Content "responsive-merged-website-fixed.html" -Raw -Encoding UTF8
$css = Get-Content "style.css" -Raw -Encoding UTF8

$figmaMatchesHtml = [regex]::Matches($html, 'https://kirsten-gwk862kmgg\.figweb\.site/[^\s"''\)\>]+')
$figmaMatchesCss = [regex]::Matches($css, 'https://kirsten-gwk862kmgg\.figweb\.site/[^\s"''\)\>]+')

$localMatchesHtml = [regex]::Matches($html, 'images/[^\s"''\)\>]+')
$localMatchesCss = [regex]::Matches($css, 'images/[^\s"''\)\>]+')

Write-Host "Remaining Figma image URLs in HTML: $($figmaMatchesHtml.Count)"
Write-Host "Remaining Figma image URLs in CSS:  $($figmaMatchesCss.Count)"
Write-Host "Local image URLs in HTML:          $($localMatchesHtml.Count)"
Write-Host "Local image URLs in CSS:           $($localMatchesCss.Count)"

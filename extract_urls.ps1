$html = Get-Content -Path "responsive-merged-website-fixed.html" -Raw
$css = Get-Content -Path "style.css" -Raw

$urls = @()

# Regex for url(...)
$regexUrl = [regex]'url\((?:["'']?)([^"'')]+)(?:["'']?)\)'
# Regex for src="..."
$regexSrc = [regex]'src=["'']([^"'']+)["'']'

foreach ($match in $regexUrl.Matches($html + " " + $css)) {
    $urls += $match.Groups[1].Value
}
foreach ($match in $regexSrc.Matches($html + " " + $css)) {
    $urls += $match.Groups[1].Value
}

$unique = $urls | Select-Object -Unique

Set-Content -Path "extracted_urls.txt" -Value ($unique -join "`n")
Write-Output "Found $($unique.Count) unique URLs"

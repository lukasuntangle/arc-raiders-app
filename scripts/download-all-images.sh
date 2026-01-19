#!/bin/bash

# Download Arc Raiders item images using Fandom API
# This script gets the correct image URLs from the wiki API for ALL items in items.json

cd "$(dirname "$0")"
OUTPUT_DIR="../assets/images/items"
mkdir -p "$OUTPUT_DIR"

# Extract all items from items.json using node
ITEMS=$(node -e "
const items = require('../data/items.json').items;
items.forEach(item => {
  // Convert id to display name for wiki lookup
  const name = item.name;
  console.log(item.id + '|' + name);
});
")

echo "Starting download of images using Fandom API..."
echo "Output directory: $OUTPUT_DIR"

downloaded=0
failed=0
skipped=0

while IFS='|' read -r id name; do
  filename="${id}.webp"
  filepath="$OUTPUT_DIR/$filename"

  # Skip if already downloaded with reasonable size
  if [ -f "$filepath" ] && [ $(stat -f%z "$filepath" 2>/dev/null || echo "0") -gt 1000 ]; then
    ((skipped++))
    continue
  fi

  # URL encode the name for the API
  encoded_name=$(python3 -c "import urllib.parse; print(urllib.parse.quote('File:${name}.png'))")

  # Get image URL from Fandom API
  api_url="https://arc-raiders.fandom.com/api.php?action=query&titles=${encoded_name}&prop=imageinfo&iiprop=url&format=json"

  # Extract the URL from the API response
  image_url=$(curl -s "$api_url" | python3 -c "
import sys, json
data = json.load(sys.stdin)
pages = data.get('query', {}).get('pages', {})
for page_id, page in pages.items():
    if 'imageinfo' in page:
        print(page['imageinfo'][0]['url'])
        break
" 2>/dev/null)

  if [ -z "$image_url" ]; then
    ((failed++))
    continue
  fi

  # Download the image
  http_code=$(curl -s -w "%{http_code}" -L \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -o "$filepath" \
    "$image_url")

  filesize=$(stat -f%z "$filepath" 2>/dev/null || echo "0")

  if [ "$http_code" = "200" ] && [ "$filesize" -gt 1000 ]; then
    echo "Downloaded: $id ($filesize bytes)"
    ((downloaded++))
  else
    rm -f "$filepath"
    ((failed++))
  fi

  # Small delay to be nice to the server
  sleep 0.1
done <<< "$ITEMS"

echo ""
echo "Download complete!"
echo "Downloaded: $downloaded"
echo "Skipped (already exists): $skipped"
echo "Not found: $failed"

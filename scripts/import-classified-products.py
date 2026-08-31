"""Import owner-classified folders, preserving every image and category."""
from pathlib import Path
from PIL import Image, ImageOps
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/peterhuang/Desktop/全新')
TARGET = ROOT / 'public/catalog-v3'
CATEGORIES = [('MP3:Speaker', 'mp3'), ('Horn', 'horn'), ('Phone Holder', 'phone'), ('Alarm', 'alarm'), ('Other Accessories', 'other')]
TARGET.mkdir(parents=True, exist_ok=True)
products = []
counts = {}
for folder, category in CATEGORIES:
    files = sorted(p for p in (SOURCE / folder).rglob('*') if p.is_file() and p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.bmp'})
    counts[folder] = len(files)
    for source in files:
        index = len(products) + 1
        filename = f'product-{index:04d}.webp'
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert('RGB')
            image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
            canvas = Image.new('RGB', (1000, 1000), '#f3f1ec')
            canvas.paste(image, ((1000-image.width)//2, (1000-image.height)//2))
            canvas.save(TARGET / filename, 'WEBP', quality=82, method=4)
        products.append({'id': index, 'name': source.stem, 'category': category, 'image': f'/catalog-v3/{filename}'})
assert products and all(counts.values())
(ROOT / 'app/products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'total': len(products), 'categories': counts}, ensure_ascii=False))

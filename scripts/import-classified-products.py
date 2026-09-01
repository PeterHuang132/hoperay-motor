"""Import the owner-classified folders and apply the approved catalogue order."""
from pathlib import Path
from PIL import Image, ImageOps
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/peterhuang/Desktop/全新')
TARGET = ROOT / 'public/catalog-v3'
REUSABLE_EXPORT = ROOT / 'outputs/catalog-v3-pre-prune-20260901'
ADDITIONAL_MP3 = ROOT / 'assets/product-additions/mp3'
INSERTED_MP3 = ADDITIONAL_MP3 / 'insert-after-014.webp'
CATEGORIES = [('MP3:Speaker', 'mp3'), ('Horn', 'horn'), ('Phone Holder', 'phone'), ('Alarm', 'alarm'), ('Other Accessories', 'other')]
EXCLUDED_SOURCE_IDS = {
    'mp3': {2, 5, 9, 15, 16, 22, 26, 28, 30, 31, 34, 35, 36, 42, 44, 47, 52, 59, 60, 61, 62, 64, 70, 73, 77, 81, 83, 86, 87, 88, 91, 95, 98, 99, 100, 102, 103, 104, 105, 119, 130, 138, 139, 140, 146, 148, 150, 151, 154, 155, 156, 158, 159, 160, 176, 195, 199, 200, 201, 204, 205, 209, 210, 214, 215, 221, 223, 226},
    'horn': {246, 248, 253, 254, 266, 276, 280, 296, 299},
    'phone': {351, 352, 366, 379},
    'alarm': set(),
    'other': {386, 421, 423, 424},
}
# The first ten source IDs match the owner's attached screenshots, in order.
# The remaining IDs preserve the previously approved priority order.
PRIORITY_SOURCE_IDS = [108, 107, 8, 19, 18, 109, 110, 112, 134, 135, 114, 111, 6, 7, 142, 141, 149, 153, 143, 144, 145, 147, 48, 49]
CATEGORY_OVERRIDES = {153: 'horn', 177: 'phone'}
TARGET.mkdir(parents=True, exist_ok=True)
source_products = []
counts = {}
for folder, category in CATEGORIES:
    files = sorted(p for p in (SOURCE / folder).rglob('*') if p.is_file() and p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.bmp'})
    counts[folder] = len(files)
    for source in files:
        source_products.append({'source_id': len(source_products) + 1, 'name': source.stem, 'category': category, 'source': source})

assert len(source_products) == 431, 'The source catalogue changed; review saved source IDs before importing.'
by_source_id = {product['source_id']: product for product in source_products}
for category, source_ids in EXCLUDED_SOURCE_IDS.items():
    assert all(by_source_id[source_id]['category'] == category for source_id in source_ids)
assert all(by_source_id[source_id]['category'] == 'mp3' for source_id in PRIORITY_SOURCE_IDS)

excluded = set().union(*EXCLUDED_SOURCE_IDS.values())
priority_rank = {source_id: rank for rank, source_id in enumerate(PRIORITY_SOURCE_IDS)}
selected = [product for product in source_products if product['source_id'] not in excluded]
selected.sort(key=lambda product: (0, priority_rank[product['source_id']]) if product['source_id'] in priority_rank else (1, product['source_id']))
for product in selected:
    product['category'] = CATEGORY_OVERRIDES.get(product['source_id'], product['category'])
assert INSERTED_MP3.exists()
selected.insert(14, {'source_id': None, 'name': INSERTED_MP3.stem, 'category': 'mp3', 'source': INSERTED_MP3})
additional_mp3 = sorted(ADDITIONAL_MP3.glob('addition-*.webp'))
assert len(additional_mp3) == 7
selected.extend({'source_id': None, 'name': source.stem, 'category': 'mp3', 'source': source} for source in additional_mp3)

products = []
for product in selected:
    index = len(products) + 1
    filename = f'product-{index:04d}.webp'
    if product['source_id'] is None:
        shutil.copyfile(product['source'], TARGET / filename)
    else:
        reusable = REUSABLE_EXPORT / f"product-{product['source_id']:04d}.webp"
        if reusable.exists():
            shutil.copyfile(reusable, TARGET / filename)
        else:
            with Image.open(product['source']) as image:
                image = ImageOps.exif_transpose(image).convert('RGB')
                image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
                canvas = Image.new('RGB', (1000, 1000), '#f3f1ec')
                canvas.paste(image, ((1000-image.width)//2, (1000-image.height)//2))
                canvas.save(TARGET / filename, 'WEBP', quality=82, method=4)
    products.append({'id': index, 'name': product['name'], 'category': product['category'], 'image': f'/catalog-v3/{filename}'})
assert products and all(counts.values())
assert len(products) == 354
(ROOT / 'app/products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
final_counts = {category: sum(product['category'] == category for product in products) for _, category in CATEGORIES}
print(json.dumps({'total': len(products), 'source_categories': counts, 'final_categories': final_counts}, ensure_ascii=False))

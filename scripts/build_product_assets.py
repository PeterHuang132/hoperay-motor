from pathlib import Path
from PIL import Image, ImageOps
import json
import re

SOURCE = Path("/Users/peterhuang/Downloads/产品图片")
TARGET = Path(__file__).resolve().parents[1] / "public" / "catalog-v2"
DATA = Path(__file__).resolve().parents[1] / "app" / "products.json"

PHONE = re.compile(r"手机支架|手机架|手机把座|手机镜座|支架气囊|BO5", re.I)
MP3 = re.compile(r"mp3|蓝牙|主机|一体机|功放|低音炮|音响|手机线|线控|控制器|尾箱|排气管|后视镜", re.I)
AUDIO = re.compile(r"喇叭|单叭|蜗牛|喊话|汽叭|号角|怪音|三音|[0-9一二三四五六七十]+音|滴滴|狗叫|警报|麦克风|话筒", re.I)


def category(name: str) -> str:
    if PHONE.search(name):
        return "phone"
    if MP3.search(name):
        return "mp3"
    if AUDIO.search(name):
        return "audio"
    return "other"


def clean_name(filename: str) -> str:
    name = Path(filename).stem
    name = re.sub(r"微信图片_|QQ图片|QQ截图|截图", "", name)
    name = re.sub(r"[_-]?[A-F0-9]{20,}", "", name, flags=re.I)
    name = re.sub(r"\s*\(\d+\)|\s*（\d+）|\s*- 副本", "", name)
    name = re.sub(r"\s+", " ", name).strip(" ._-")
    return name or "Motorcycle accessory"


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    files = sorted(
        p for p in SOURCE.iterdir()
        if p.is_file() and p.name not in {".DS_Store", "Desktop.ini"}
        and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    )
    products = []
    for index, source in enumerate(files, 1):
        output_name = f"product-{index:04d}.webp"
        output = TARGET / output_name
        try:
            with Image.open(source) as image:
                image = ImageOps.exif_transpose(image).convert("RGB")
                image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
                canvas = Image.new("RGB", (1000, 1000), "#f3f1ec")
                canvas.paste(image, ((1000 - image.width) // 2, (1000 - image.height) // 2))
                canvas.save(output, "WEBP", quality=76, method=5)
        except Exception as exc:
            print(f"skip {source.name}: {exc}")
            continue
        products.append({
            "id": index,
            "name": clean_name(source.name),
            "category": category(source.name),
            "image": f"/catalog-v2/{output_name}",
        })
    DATA.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    counts = {key: sum(p["category"] == key for p in products) for key in ("mp3", "audio", "phone", "other")}
    print(f"generated {len(products)} products: {counts}")


if __name__ == "__main__":
    main()

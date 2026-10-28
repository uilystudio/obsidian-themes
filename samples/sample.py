from dataclasses import dataclass

@dataclass(frozen=True)
class Product:
    name: str
    price: float
    available: bool = True


def format_product(product: Product) -> str:
    """Format a single product in a calm, readable way."""
    status = 'Available' if product.available else 'Out of stock'
    return f'{product.name}: {product.price:.2f} PLN — {status}'


items = [Product('Obsidian desk lamp', 349.0), Product('Cream shade', 119.9)]
for item in items:
    print(format_product(item))

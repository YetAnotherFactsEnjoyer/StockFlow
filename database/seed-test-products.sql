INSERT INTO suppliers (name, contact_person, email, phone, address)
SELECT seed.name, seed.contact_person, seed.email, seed.phone, seed.address
FROM (
    VALUES
        ('Northline Wholesale', 'Maya Chen', 'orders@northline.example', '+1-555-0101', '18 Harbor Road'),
        ('Urban Pantry Supply', 'Leo Martin', 'sales@urbanpantry.example', '+1-555-0102', '42 Market Street'),
        ('FreshCrate Partners', 'Nora Singh', 'hello@freshcrate.example', '+1-555-0103', '7 Orchard Lane'),
        ('KitchenPro Distribution', 'Amir Haddad', 'support@kitchenpro.example', '+1-555-0104', '210 Industrial Avenue'),
        ('Daily Goods Co.', 'Elena Rossi', 'team@dailygoods.example', '+1-555-0105', '65 Central Park Way')
) AS seed(name, contact_person, email, phone, address)
WHERE NOT EXISTS (
    SELECT 1
    FROM suppliers existing
    WHERE existing.name = seed.name
);

INSERT INTO products (
    created_at,
    updated_at,
    description,
    name,
    price,
    sku,
    stock_quantity,
    supplier_id
)
SELECT
    now(),
    now(),
    category.description || ' for search and inventory testing',
    category.name_prefix || ' ' || lpad(series.item_number::text, 3, '0'),
    round((category.base_price + (series.item_number * 0.37))::numeric, 2),
    'TEST-' || lpad(series.item_number::text, 3, '0'),
    (series.item_number * 7) % 64,
    (
        SELECT supplier.id
        FROM suppliers supplier
        WHERE supplier.name = category.supplier_name
        ORDER BY supplier.id
        LIMIT 1
    )
FROM generate_series(1, 120) AS series(item_number)
CROSS JOIN LATERAL (
    SELECT *
    FROM (
        VALUES
            (0, 'Ceramic Mug', 'Drinkware item', 4.99, 'Northline Wholesale'),
            (1, 'Glass Storage Jar', 'Storage container', 6.49, 'Urban Pantry Supply'),
            (2, 'Bamboo Cutting Board', 'Kitchen prep tool', 12.99, 'KitchenPro Distribution'),
            (3, 'Cotton Apron', 'Kitchen textile', 15.50, 'Daily Goods Co.'),
            (4, 'Stainless Steel Whisk', 'Cooking utensil', 7.25, 'KitchenPro Distribution'),
            (5, 'Reusable Produce Bag', 'Sustainable grocery item', 3.75, 'FreshCrate Partners'),
            (6, 'Olive Oil Bottle', 'Pantry product', 9.90, 'Urban Pantry Supply'),
            (7, 'Herb Starter Kit', 'Fresh produce accessory', 11.40, 'FreshCrate Partners'),
            (8, 'Serving Bowl', 'Tableware item', 18.20, 'Northline Wholesale'),
            (9, 'Dish Towel Set', 'Cleaning textile', 8.80, 'Daily Goods Co.')
    ) AS category_options(category_index, name_prefix, description, base_price, supplier_name)
    WHERE category_options.category_index = series.item_number % 10
) AS category
ON CONFLICT (sku) DO NOTHING;

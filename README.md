# Das ERP-Backend mit Drizzle ORM, Zod Validation, Express, Docker und Postgres

## Getting Started

**Prerequisites:**

- Docker muss installiert sein 🦭
- Node.js muss installiert sein 🐣

**Starten:**

```bash
docker-compose up -d
npm install

# Migrations ausführen
npm run db-clean
npm run db-generate
npm run db-migrate

# Inserts ausführen
npm run db-insert

# Server starten
npm run dev
```

## Pagination

Die API unterstützt Pagination. Die Parameter `page` und `page_size` können verwendet werden, um die Ergebnisse zu paginieren.

Implementierte Endpunkte für Pagination:

```http
http://localhost:5488/orders?page_size=5&page=5

http://localhost:5488/products?page_size=5&page=5

http://localhost:5488/customers?page_size=5&page=5
```

### Pagination Response:

```json
"pagination": {
        "page": 5,
        "pageSize": 5,
        "pageCount": 200,
        "totalCount": "1000"
    }
```

### order format für die API

```json
{
  "customerId": 201,
  "positions": [
    {
      "productId": 22,
      "quantity": 55
    },
    {
      "productId": 37,
      "quantity": 552
    },
    {
      "productId": 1,
      "quantity": 224
    }
  ]
}
```

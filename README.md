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
npm run db-migrate

# Inserts ausführen
npm run db-insert

# Server starten
npm run dev
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

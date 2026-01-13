# Feza Pay Backend API

Backend API for Feza Pay with Flutterwave integration for KYC verification, virtual card issuing, and mobile money payments.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Firebase project with Firestore enabled
- Flutterwave account (test or live keys)

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
- **Flutterwave keys** (already configured with your test keys)
- **Firebase credentials** (download from Firebase Console → Project Settings → Service Accounts)

### Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Server will start on `http://localhost:3000`

## 📚 API Endpoints

### Health Check
```
GET /health
```

### KYC Verification
```
POST /kyc/verify
Headers: Authorization: Bearer <firebase-token>
Body: {
  "documentType": "voter" | "passport",
  "frontImageUrl": "https://...",
  "backImageUrl": "https://..." (optional)
}
```

```
GET /kyc/status
Headers: Authorization: Bearer <firebase-token>
```

### Card Issuing
```
POST /issuing/cards
Headers: Authorization: Bearer <firebase-token>
Body: {
  "scheme": "VISA" | "MASTERCARD",
  "currency": "USD" | "CDF",
  "billingName": "John Doe",
  "amount": 50,
  "transactionId": "tx_xxx" (optional)
}
```

```
GET /issuing/cards/:cardId
Headers: Authorization: Bearer <firebase-token>
```

```
POST /issuing/cards/:cardId/freeze
Headers: Authorization: Bearer <firebase-token>
```

```
POST /issuing/cards/:cardId/unfreeze
Headers: Authorization: Bearer <firebase-token>
```

### Mobile Money Payments
```
POST /payin/mobile-money
Headers: Authorization: Bearer <firebase-token>
Body: {
  "amount": 50,
  "currency": "USD",
  "phone_number": "243810000000",
  "network": "VODACOM" | "AIRTEL" | "ORANGE",
  "email": "user@example.com"
}
```

```
GET /payin/verify/:transactionId
Headers: Authorization: Bearer <firebase-token>
```

### Webhooks
```
POST /webhooks/flutterwave
Headers: verif-hash: <flutterwave-signature>
Body: <flutterwave-webhook-payload>
```

## 🔒 Security

- **Authentication**: Firebase ID tokens required for all endpoints (except webhooks)
- **Rate Limiting**: 
  - General: 20 requests/minute
  - Sensitive operations (KYC, card creation): 5 requests/15 minutes
  - Payments: 3 requests/minute
- **Data Masking**: Card numbers masked to last 4 digits, CVV never returned after creation
- **Webhook Verification**: HMAC signature validation for Flutterwave webhooks

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

## 📦 Deployment

### Docker
```bash
docker build -t Feza Pay-backend .
docker run -p 3000:3000 --env-file .env Feza Pay-backend
```

### Firebase Functions (Optional)
The backend can be deployed as Firebase Cloud Functions. Contact for setup instructions.

## 🔧 Environment Variables

See `.env.example` for all required variables.

**Critical:**
- `FLW_SECRET_KEY` - Never expose in frontend
- `FIREBASE_PRIVATE_KEY` - Keep secure
- `FLW_WEBHOOK_HASH` - Get from Flutterwave Dashboard → Settings → Webhooks

## 📝 Logs

Logs are written to console with structured format:
```
[2026-01-12T10:00:00.000Z] [INFO] Server running on port 3000
```

Log levels: `error`, `warn`, `info`, `debug`

## 🐛 Troubleshooting

**CORS errors:**
- Update `ALLOWED_ORIGINS` in `.env` to include your frontend URL

**Firebase auth errors:**
- Verify `FIREBASE_PRIVATE_KEY` is properly formatted (with `\n` for line breaks)
- Check Firebase project ID matches

**Flutterwave errors:**
- Verify API keys are correct
- Check Flutterwave API status
- Review logs for detailed error messages

## 📞 Support

For issues or questions, check the logs first. Most errors include detailed messages.

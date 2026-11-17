import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || /DB_USER|ENCODED_PASSWORD|YOUR_HOST/.test(uri)) {
    throw new Error('LAB10_CONFIG');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

// Do not print driver error.message: it may contain a private host or URI.
export function reportDatabaseError(error) {
  const message = error.message === 'LAB10_CONFIG'
    ? 'Set MONGODB_URI in your private .env; replace all Atlas placeholders.'
    : 'Database operation failed. Check database user/password, IP access list, DNS/network, or Docker readiness. See Lab 10 troubleshooting.';
  console.error(message);
  process.exitCode = 1;
}

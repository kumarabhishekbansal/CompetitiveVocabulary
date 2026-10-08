import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Vocabulary } from '../models/Vocabulary.js';
import { normalizeTerm } from '../utils/normalize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedInitial50Words = async () => {
  console.log('====================================================');
  console.log('🌱 Starting 50-Word Seed Pipeline on MongoDB Atlas');
  console.log('====================================================');

  await connectDB();

  const dataPath = path.join(__dirname, 'data', 'initial50Words.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Seed data file not found at: ${dataPath}`);
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  const items = JSON.parse(rawData);

  if (!Array.isArray(items) || items.length !== 50) {
    throw new Error(`Seed dataset must contain exactly 50 words! Found: ${items?.length}`);
  }

  console.log(`[Seeder] Loaded ${items.length} curated words from initial50Words.json`);

  // Prepare idempotent bulk operations
  const bulkOperations = items.map((item) => {
    const normalized = normalizeTerm(item.term);
    const enrichedItem = {
      ...item,
      normalizedTerm: normalized,
      contentType: 'word',
      isSystem: true,
      createdBy: null
    };

    return {
      updateOne: {
        filter: { 
          normalizedTerm: normalized, 
          contentType: 'word',
          isSystem: true 
        },
        update: { $set: enrichedItem },
        upsert: true
      }
    };
  });

  const bulkResult = await Vocabulary.bulkWrite(bulkOperations, { ordered: false });

  // Verify total count in database
  const totalSystemWords = await Vocabulary.countDocuments({ 
    isSystem: true, 
    contentType: 'word' 
  });

  console.log('\n--- Seeder Execution Summary ---');
  console.log(`• Upserted (Newly Inserted): ${bulkResult.upsertedCount}`);
  console.log(`• Matched (Existing Updated): ${bulkResult.matchedCount}`);
  console.log(`• Modified: ${bulkResult.modifiedCount}`);
  console.log(`• Total System Words in Atlas DB: ${totalSystemWords}`);
  console.log('--------------------------------\n');

  if (totalSystemWords !== 50) {
    throw new Error(`Verification failed: Expected exactly 50 system words in DB, found ${totalSystemWords}`);
  }

  console.log('✅ Successfully seeded and verified exactly 50 system vocabulary words!');
};

// Direct script execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedInitial50Words()
    .then(() => {
      mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeder failed:', err.message);
      mongoose.connection.close();
      process.exit(1);
    });
}

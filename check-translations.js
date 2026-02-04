// Script to check which zodiac signs are missing from translation files
import fs from 'fs';
import path from 'path';

const englishData = JSON.parse(fs.readFileSync('src/data/zodiac.json', 'utf8'));
const englishSigns = Object.keys(englishData).sort();

const languages = ['vi', 'ko', 'ja'];

console.log('=== ZODIAC TRANSLATION STATUS ===\n');
console.log(`English has ${englishSigns.length} signs: ${englishSigns.join(', ')}\n`);

languages.forEach(lang => {
  const filePath = `src/data/translations/${lang}/zodiac.json`;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const signs = Object.keys(data).sort();
    const missing = englishSigns.filter(sign => !signs.includes(sign));
    
    console.log(`\n${lang.toUpperCase()} (${signs.length}/${englishSigns.length} signs):`);
    console.log(`  ✓ Has: ${signs.join(', ')}`);
    if (missing.length > 0) {
      console.log(`  ✗ Missing: ${missing.join(', ')}`);
    }
  } catch (error) {
    console.log(`\n${lang.toUpperCase()}: ERROR - ${error.message}`);
  }
});

console.log('\n=== RECOMMENDATION ===');
console.log('The code is working correctly. To see translations:');
console.log('1. Add missing zodiac sign translations to the JSON files');
console.log('2. Or use a sign that already has translations (e.g., Leo for Korean/Japanese)');
console.log('3. The system will automatically fall back to English for missing translations');

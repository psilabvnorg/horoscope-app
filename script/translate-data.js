import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const cliArgs = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].substring(2);
    const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
    cliArgs[key] = value;
    if (value !== true) i++;
  }
}

// Configuration
const config = {
  sourceLanguage: 'en',
  // Support CLI override: --lang vi or --lang vi,ko,ja
  targetLanguages: cliArgs.lang 
    ? cliArgs.lang.split(',').map(l => l.trim())
    : (cliArgs.languages 
      ? cliArgs.languages.split(',').map(l => l.trim())
      : ['vi', 'ko', 'ja']),
  
  dataDir: path.join(__dirname, '../src/data'),
  outputDir: path.join(__dirname, '../src/data/translations'),
  
  // Support CLI override: --files zodiac.json or --files zodiac.json,tarot.json
  dataFiles: cliArgs.files
    ? cliArgs.files.split(',').map(f => f.trim())
    : (cliArgs.file
      ? [cliArgs.file]
      : ['zodiac.json', 'tarot.json', 'love.json']),
  
  // Batching Configuration
  batching: {
    // Maximum characters per batch (adjust based on your LLM's context window)
    maxCharsPerBatch: parseInt(cliArgs.batchSize || process.env.BATCH_SIZE || '8000'),
    // Minimum entries per batch (avoid too many small requests)
    minEntriesPerBatch: parseInt(cliArgs.minEntries || '3'),
    // Maximum entries per batch (balance between size and manageability)
    maxEntriesPerBatch: parseInt(cliArgs.maxEntries || '20'),
  },
  
  // LLM Configuration
  // Support CLI override: --provider ollama or --provider azure
  llmProvider: cliArgs.provider || process.env.VITE_LLM_PROVIDER || 'ollama',
  
  // Support CLI override: --model deepseek-r1:8b or --model qwen2.5:14b
  ollama: {
    baseUrl: cliArgs.ollamaUrl || process.env.VITE_OLLAMA_URL || 'http://172.18.96.1:11434',
    model: cliArgs.model || process.env.VITE_OLLAMA_MODEL || 'deepseek-r1:8b',
  },
  azure: {
    endpoint: cliArgs.azureEndpoint || process.env.VITE_AZURE_OPENAI_ENDPOINT || '',
    apiKey: cliArgs.azureKey || process.env.VITE_AZURE_OPENAI_API_KEY || '',
    deployment: cliArgs.azureDeployment || process.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
    apiVersion: process.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
  },
  
  // Custom prompt template (optional)
  customPrompt: cliArgs.prompt || null,
  
  // Verbose mode
  verbose: cliArgs.verbose || cliArgs.v || false,
};

// Language names for better context
const languageNames = {
  vi: 'Vietnamese',
  ko: 'Korean',
  ja: 'Japanese',
};

// Zodiac sign translations
const zodiacGlossary = {
  'Aries': { vi: 'Bạch Dương', ko: '양자리', ja: '牡羊座' },
  'Taurus': { vi: 'Kim Ngưu', ko: '황소자리', ja: '牡牛座' },
  'Gemini': { vi: 'Song Tử', ko: '쌍둥이자리', ja: '双子座' },
  'Cancer': { vi: 'Cự Giải', ko: '게자리', ja: '蟹座' },
  'Leo': { vi: 'Sư Tử', ko: '사자자리', ja: '獅子座' },
  'Virgo': { vi: 'Xử Nữ', ko: '처녀자리', ja: '乙女座' },
  'Libra': { vi: 'Thiên Bình', ko: '천칭자리', ja: '天秤座' },
  'Scorpio': { vi: 'Bọ Cạp', ko: '전갈자리', ja: '蠍座' },
  'Sagittarius': { vi: 'Nhân Mã', ko: '사수자리', ja: '射手座' },
  'Capricorn': { vi: 'Ma Kết', ko: '염소자리', ja: '山羊座' },
  'Aquarius': { vi: 'Bảo Bình', ko: '물병자리', ja: '水瓶座' },
  'Pisces': { vi: 'Song Ngư', ko: '물고기자리', ja: '魚座' },
};

// Clean response from thinking tags
function cleanResponse(text) {
  return text.replace(/<think>.*?<\/think>/gs, '').trim();
}

// Call LLM for translation
async function callLLM(prompt) {
  if (config.llmProvider === 'azure') {
    return await callAzure(prompt);
  }
  return await callOllama(prompt);
}

async function callOllama(prompt) {
  const { baseUrl, model } = config.ollama;
  
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: `${prompt}\n\nAssistant:`,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return cleanResponse(data.response || '');
}

async function callAzure(prompt) {
  const { endpoint, apiKey, deployment, apiVersion } = config.azure;
  
  if (!endpoint || !apiKey) {
    throw new Error('Azure OpenAI not configured');
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 8000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Create translation prompt for data files
function createDataTranslationPrompt(sourceJson, targetLang, fileName) {
  // Use custom prompt if provided
  if (config.customPrompt) {
    return config.customPrompt
      .replace('{targetLang}', languageNames[targetLang])
      .replace('{fileName}', fileName)
      .replace('{sourceJson}', JSON.stringify(sourceJson, null, 2));
  }
  
  const glossaryForLang = Object.entries(zodiacGlossary)
    .map(([en, translations]) => `"${en}" → "${translations[targetLang] || en}"`)
    .join('\n');

  let contextInfo = '';
  if (fileName === 'zodiac.json') {
    contextInfo = 'This file contains detailed descriptions of zodiac signs and their characteristics.';
  } else if (fileName === 'tarot.json') {
    contextInfo = 'This file contains tarot card meanings organized by Major Arcana and suits (WANDS, CUPS, SWORDS, PENTACLES).';
  } else if (fileName === 'love.json') {
    contextInfo = 'This file contains compatibility descriptions between zodiac signs in romantic relationships.';
  }

  return `You are a professional translator specializing in astrology, tarot, and mystical content.

Task: Translate the following JSON data from English to ${languageNames[targetLang]}.

Context: ${contextInfo}

CRITICAL RULES:
1. Preserve ALL JSON structure exactly (keys, nesting, arrays, objects)
2. Translate ONLY the string values, NEVER the keys
3. For zodiac.json and love.json: Keep zodiac sign names as keys in English (Aries, Taurus, etc.)
4. For tarot.json: Keep category names as keys in English (MAJOR ARCANA, WANDS, CUPS, SWORDS, PENTACLES)
5. Maintain the spiritual, mystical, and astrological tone
6. Use these standard translations when zodiac signs appear in text:
${glossaryForLang}

7. Return ONLY valid JSON, no explanations, no markdown code blocks
8. Ensure natural, culturally appropriate translations
9. Preserve the depth and nuance of astrological meanings

Source JSON:
${JSON.stringify(sourceJson, null, 2)}

Translated JSON in ${languageNames[targetLang]}:`;
}

// Calculate the size of JSON content in characters
function getJsonSize(obj) {
  return JSON.stringify(obj).length;
}

// Smart batching: Split large JSON into optimal batches
function createBatches(data, fileName) {
  const { maxCharsPerBatch, minEntriesPerBatch, maxEntriesPerBatch } = config.batching;
  
  // For flat objects (zodiac.json)
  if (!isNestedStructure(data)) {
    return createFlatBatches(data, maxCharsPerBatch, minEntriesPerBatch, maxEntriesPerBatch);
  }
  
  // For nested objects (tarot.json, love.json)
  return createNestedBatches(data, maxCharsPerBatch, minEntriesPerBatch, maxEntriesPerBatch);
}

// Check if data has nested structure
function isNestedStructure(data) {
  const firstValue = Object.values(data)[0];
  return typeof firstValue === 'object' && firstValue !== null && !Array.isArray(firstValue);
}

// Create batches for flat structure (e.g., zodiac.json)
function createFlatBatches(data, maxChars, minEntries, maxEntries) {
  const entries = Object.entries(data);
  const batches = [];
  let currentBatch = {};
  let currentSize = 0;
  let currentCount = 0;

  for (const [key, value] of entries) {
    const entrySize = JSON.stringify({ [key]: value }).length;
    
    // If single entry is too large, include it alone
    if (entrySize > maxChars) {
      if (Object.keys(currentBatch).length > 0) {
        batches.push(currentBatch);
        currentBatch = {};
        currentSize = 0;
        currentCount = 0;
      }
      batches.push({ [key]: value });
      continue;
    }
    
    // Check if adding this entry would exceed limits
    const wouldExceedSize = currentSize + entrySize > maxChars;
    const wouldExceedCount = currentCount >= maxEntries;
    
    if ((wouldExceedSize || wouldExceedCount) && currentCount >= minEntries) {
      batches.push(currentBatch);
      currentBatch = {};
      currentSize = 0;
      currentCount = 0;
    }
    
    currentBatch[key] = value;
    currentSize += entrySize;
    currentCount++;
  }

  // Add remaining batch
  if (Object.keys(currentBatch).length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

// Create batches for nested structure (e.g., tarot.json, love.json)
function createNestedBatches(data, maxChars, minEntries, maxEntries) {
  const batches = [];
  
  for (const [category, categoryData] of Object.entries(data)) {
    const categorySize = getJsonSize(categoryData);
    
    // If entire category fits in one batch, keep it together
    if (categorySize <= maxChars) {
      batches.push({ [category]: categoryData });
      continue;
    }
    
    // Otherwise, split category into sub-batches
    const subBatches = createFlatBatches(categoryData, maxChars, minEntries, maxEntries);
    
    // Wrap each sub-batch with category key
    for (const subBatch of subBatches) {
      batches.push({ [category]: subBatch });
    }
  }

  return batches;
}

// Merge translated batches back together
function mergeBatches(batches, isNested) {
  if (!isNested) {
    // Flat structure: merge all batches into one object
    return Object.assign({}, ...batches);
  }
  
  // Nested structure: merge by category
  const result = {};
  for (const batch of batches) {
    for (const [category, categoryData] of Object.entries(batch)) {
      if (!result[category]) {
        result[category] = {};
      }
      Object.assign(result[category], categoryData);
    }
  }
  return result;
}

// Translate a single data file
async function translateDataFile(fileName, targetLang) {
  const sourcePath = path.join(config.dataDir, fileName);
  const targetDir = path.join(config.outputDir, targetLang);
  const targetPath = path.join(targetDir, fileName);

  console.log(`\n📝 Translating ${fileName} to ${languageNames[targetLang]}...`);

  // Read source file
  const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  const sourceJson = JSON.parse(sourceContent);

  // Calculate file size
  const fileSize = getJsonSize(sourceJson);
  const fileSizeKB = (fileSize / 1024).toFixed(2);
  console.log(`   File size: ${fileSizeKB} KB (${fileSize} chars)`);

  // Create batches
  const batches = createBatches(sourceJson, fileName);
  const isNested = isNestedStructure(sourceJson);
  
  console.log(`   Split into ${batches.length} batch(es) for optimal translation`);

  const translatedBatches = [];
  let successCount = 0;
  let failCount = 0;

  // Translate each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchSize = getJsonSize(batch);
    const batchNum = i + 1;
    
    console.log(`   Batch ${batchNum}/${batches.length}: ${(batchSize / 1024).toFixed(2)} KB...`);

    try {
      // Create prompt for this batch
      const prompt = createDataTranslationPrompt(batch, targetLang, fileName);
      
      // Call LLM
      const translatedText = await callLLM(prompt);
      
      // Extract JSON from response
      let jsonMatch = translatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in LLM response');
      }
      
      const translatedBatch = JSON.parse(jsonMatch[0]);
      translatedBatches.push(translatedBatch);
      
      console.log(`   ✅ Batch ${batchNum}/${batches.length} completed`);
      successCount++;
      
      // Delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
    } catch (error) {
      console.error(`   ❌ Batch ${batchNum}/${batches.length} failed:`, error.message);
      failCount++;
      
      // If batch fails, try to continue with remaining batches
      // Store empty object as placeholder
      translatedBatches.push({});
    }
  }

  // Check if we have any successful translations
  if (successCount === 0) {
    return { 
      success: false, 
      fileName, 
      targetLang, 
      error: 'All batches failed to translate' 
    };
  }

  try {
    // Merge all translated batches
    const translatedJson = mergeBatches(translatedBatches, isNested);
    
    // Ensure output directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Write to target file
    fs.writeFileSync(targetPath, JSON.stringify(translatedJson, null, 2), 'utf-8');
    
    const resultMsg = failCount > 0 
      ? `partially completed (${successCount}/${batches.length} batches succeeded)`
      : 'completed';
    
    console.log(`✅ Successfully translated ${fileName} to ${languageNames[targetLang]} - ${resultMsg}`);
    
    return { 
      success: true, 
      fileName, 
      targetLang, 
      batches: batches.length,
      successCount,
      failCount 
    };
    
  } catch (error) {
    console.error(`❌ Error merging/saving ${fileName} to ${languageNames[targetLang]}:`, error.message);
    return { 
      success: false, 
      fileName, 
      targetLang, 
      error: error.message 
    };
  }
}

// Main translation function
async function translateAllData() {
  // Show help if requested
  if (cliArgs.help || cliArgs.h) {
    showHelp();
    return;
  }
  
  console.log('🌍 Starting data translation...');
  console.log(`📚 Source: ${config.sourceLanguage}`);
  console.log(`🎯 Targets: ${config.targetLanguages.join(', ')}`);
  console.log(`📦 Data files: ${config.dataFiles.join(', ')}`);
  console.log(`🤖 LLM Provider: ${config.llmProvider}`);
  
  if (config.llmProvider === 'ollama') {
    console.log(`📡 Ollama URL: ${config.ollama.baseUrl}`);
    console.log(`🔧 Model: ${config.ollama.model}`);
  } else {
    console.log(`📡 Azure Endpoint: ${config.azure.endpoint}`);
    console.log(`🔧 Deployment: ${config.azure.deployment}`);
  }
  
  console.log(`📁 Output: ${config.outputDir}`);
  console.log(`📊 Batch size: ${config.batching.maxCharsPerBatch} chars`);
  
  if (config.customPrompt) {
    console.log(`📝 Using custom prompt template`);
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  const results = [];
  
  for (const targetLang of config.targetLanguages) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🌐 Translating to ${languageNames[targetLang] || targetLang}`);
    console.log('='.repeat(50));
    
    for (const fileName of config.dataFiles) {
      const result = await translateDataFile(fileName, targetLang);
      results.push(result);
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Translation Summary');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const partial = results.filter(r => r.success && r.failCount > 0).length;
  
  console.log(`✅ Successful: ${successful}`);
  if (partial > 0) {
    console.log(`⚠️  Partial: ${partial} (some batches failed)`);
  }
  console.log(`❌ Failed: ${failed}`);
  
  // Show batch statistics
  const totalBatches = results.reduce((sum, r) => sum + (r.batches || 0), 0);
  const successfulBatches = results.reduce((sum, r) => sum + (r.successCount || 0), 0);
  if (totalBatches > 0) {
    console.log(`\n📦 Batch Statistics:`);
    console.log(`   Total batches: ${totalBatches}`);
    console.log(`   Successful: ${successfulBatches}`);
    console.log(`   Failed: ${totalBatches - successfulBatches}`);
  }
  
  if (failed > 0) {
    console.log('\n❌ Failed translations:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.fileName} → ${r.targetLang}: ${r.error}`);
    });
  }
  
  if (partial > 0) {
    console.log('\n⚠️  Partial translations (some batches failed):');
    results.filter(r => r.success && r.failCount > 0).forEach(r => {
      console.log(`  - ${r.fileName} → ${r.targetLang}: ${r.successCount}/${r.batches} batches succeeded`);
    });
  }
  
  console.log('\n✨ Data translation complete!');
  console.log(`📁 Translated files saved to: ${config.outputDir}`);
}

// Show help message
function showHelp() {
  console.log(`
🌍 Data Translation Script - Help

USAGE:
  node script/translate-data.js [OPTIONS]

OPTIONS:
  --lang <languages>        Target languages (comma-separated)
                           Example: --lang vi
                           Example: --lang vi,ko,ja
                           Default: vi,ko,ja

  --files <files>          Data files to translate (comma-separated)
                           Example: --files zodiac.json
                           Example: --files zodiac.json,tarot.json
                           Default: zodiac.json,tarot.json,love.json

  --provider <provider>    LLM provider (ollama or azure)
                           Example: --provider ollama
                           Default: ollama

  --model <model>          Ollama model name
                           Example: --model deepseek-r1:8b
                           Example: --model qwen2.5:14b
                           Default: deepseek-r1:8b

  --ollamaUrl <url>        Ollama server URL
                           Example: --ollamaUrl http://localhost:11434
                           Default: http://172.18.96.1:11434

  --batchSize <size>       Maximum characters per batch
                           Example: --batchSize 10000
                           Default: 8000

  --minEntries <num>       Minimum entries per batch
                           Example: --minEntries 5
                           Default: 3

  --maxEntries <num>       Maximum entries per batch
                           Example: --maxEntries 30
                           Default: 20

  --prompt <template>      Custom prompt template (advanced)
                           Use {targetLang}, {fileName}, {sourceJson}

  --verbose, -v            Verbose output

  --help, -h               Show this help message

EXAMPLES:

  # Translate only Vietnamese
  node script/translate-data.js --lang vi

  # Translate only zodiac.json to Korean
  node script/translate-data.js --lang ko --files zodiac.json

  # Use different model
  node script/translate-data.js --model qwen2.5:14b

  # Translate with larger batches
  node script/translate-data.js --batchSize 15000

  # Multiple options
  node script/translate-data.js --lang vi,ja --files zodiac.json --model qwen2.5:14b

  # All languages, all files (default)
  node script/translate-data.js

ENVIRONMENT VARIABLES:
  VITE_LLM_PROVIDER         LLM provider (ollama or azure)
  VITE_OLLAMA_URL          Ollama server URL
  VITE_OLLAMA_MODEL        Ollama model name
  VITE_AZURE_OPENAI_ENDPOINT    Azure OpenAI endpoint
  VITE_AZURE_OPENAI_API_KEY     Azure OpenAI API key
  VITE_AZURE_OPENAI_DEPLOYMENT  Azure OpenAI deployment
  BATCH_SIZE               Default batch size

SUPPORTED LANGUAGES:
  vi  - Vietnamese
  ko  - Korean
  ja  - Japanese

SUPPORTED FILES:
  zodiac.json - Zodiac sign descriptions
  tarot.json  - Tarot card meanings
  love.json   - Love compatibility descriptions
`);
}

// Run translation
translateAllData().catch(console.error);

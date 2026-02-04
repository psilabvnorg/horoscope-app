import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  sourceLanguage: 'en',
  targetLanguages: ['vi', 'ko', 'ja'],
  localesDir: path.join(__dirname, '../src/locales'),
  namespaces: ['common', 'tarot', 'zodiac', 'readings'],
  
  // LLM Configuration
  llmProvider: process.env.VITE_LLM_PROVIDER || 'ollama',
  ollama: {
    baseUrl: process.env.VITE_OLLAMA_URL || 'http://172.18.96.1:11434',
    model: process.env.VITE_OLLAMA_MODEL || 'deepseek-r1:8b',
  },
  azure: {
    endpoint: process.env.VITE_AZURE_OPENAI_ENDPOINT || '',
    apiKey: process.env.VITE_AZURE_OPENAI_API_KEY || '',
    deployment: process.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
    apiVersion: process.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
  },
};

// Language names for better context
const languageNames = {
  vi: 'Vietnamese',
  ko: 'Korean',
  ja: 'Japanese',
};

// Terminology glossary (terms that should remain consistent)
const glossary = {
  'Tarot': { vi: 'Tarot', ko: '타로', ja: 'タロット' },
  'Zodiac': { vi: 'Hoàng đạo', ko: '조디악', ja: '星座' },
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
      max_tokens: 4000,
      temperature: 0.3, // Lower temperature for more consistent translations
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Create translation prompt
function createTranslationPrompt(sourceJson, targetLang, namespace) {
  const glossaryForLang = Object.entries(glossary)
    .map(([en, translations]) => `"${en}" → "${translations[targetLang] || en}"`)
    .join('\n');

  return `You are a professional translator specializing in astrology and mystical applications.

Task: Translate the following JSON from English to ${languageNames[targetLang]}.

Context: This is the "${namespace}" namespace of an astrology/tarot mobile app.

CRITICAL RULES:
1. Preserve ALL JSON structure exactly (keys, nesting, arrays)
2. Translate ONLY the values, NEVER the keys
3. Preserve ALL placeholders like {{name}}, {{count}}, {{date}} exactly as they are
4. Maintain spiritual/mystical tone appropriate for astrology content
5. Use these standard translations for zodiac/tarot terms:
${glossaryForLang}

6. Return ONLY valid JSON, no explanations or markdown
7. Ensure natural, native-sounding translations
8. Keep the same level of formality as the English version

Source JSON:
${JSON.stringify(sourceJson, null, 2)}

Translated JSON in ${languageNames[targetLang]}:`;
}

// Translate a single namespace file
async function translateNamespace(namespace, targetLang) {
  const sourcePath = path.join(config.localesDir, config.sourceLanguage, `${namespace}.json`);
  const targetPath = path.join(config.localesDir, targetLang, `${namespace}.json`);

  console.log(`\n📝 Translating ${namespace} to ${languageNames[targetLang]}...`);

  // Read source file
  const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  const sourceJson = JSON.parse(sourceContent);

  // Create prompt
  const prompt = createTranslationPrompt(sourceJson, targetLang, namespace);

  try {
    // Call LLM
    const translatedText = await callLLM(prompt);
    
    // Extract JSON from response (in case LLM adds markdown)
    let jsonMatch = translatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in LLM response');
    }
    
    const translatedJson = JSON.parse(jsonMatch[0]);
    
    // Write to target file
    fs.writeFileSync(targetPath, JSON.stringify(translatedJson, null, 2), 'utf-8');
    
    console.log(`✅ Successfully translated ${namespace} to ${languageNames[targetLang]}`);
    return { success: true, namespace, targetLang };
    
  } catch (error) {
    console.error(`❌ Error translating ${namespace} to ${languageNames[targetLang]}:`, error.message);
    return { success: false, namespace, targetLang, error: error.message };
  }
}

// Main translation function
async function translateAll() {
  console.log('🌍 Starting i18n translation...');
  console.log(`📚 Source: ${config.sourceLanguage}`);
  console.log(`🎯 Targets: ${config.targetLanguages.join(', ')}`);
  console.log(`📦 Namespaces: ${config.namespaces.join(', ')}`);
  console.log(`🤖 LLM Provider: ${config.llmProvider}`);
  
  const results = [];
  
  for (const targetLang of config.targetLanguages) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🌐 Translating to ${languageNames[targetLang]}`);
    console.log('='.repeat(50));
    
    for (const namespace of config.namespaces) {
      const result = await translateNamespace(namespace, targetLang);
      results.push(result);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Translation Summary');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed translations:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.namespace} → ${r.targetLang}: ${r.error}`);
    });
  }
  
  console.log('\n✨ Translation complete!');
}

// Run translation
translateAll().catch(console.error);

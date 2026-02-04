#!/usr/bin/env node

/**
 * Script to find hardcoded English strings in React components
 * Usage: node script/find-untranslated.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const EXCLUDE_PATTERNS = [
  /className=/,
  /style=/,
  /import\s+/,
  /from\s+/,
  /console\./,
  /\/\//,  // comments
  /\/\*/,  // comments
  /\bt\(/,  // already using translation
];

// Common English words that indicate untranslated text
const ENGLISH_INDICATORS = /\b(the|is|are|was|were|your|you|my|me|today|tomorrow|read|more|learn|about|know|fortune|discover|explore)\b/i;

function findHardcodedStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    // Skip if line matches exclude patterns
    if (EXCLUDE_PATTERNS.some(pattern => pattern.test(line))) {
      return;
    }

    // Find strings in JSX text content: >Text here<
    const jsxTextMatch = line.match(/>\s*([A-Z][a-zA-Z\s]+)\s*</);
    if (jsxTextMatch && ENGLISH_INDICATORS.test(jsxTextMatch[1])) {
      issues.push({
        line: index + 1,
        text: jsxTextMatch[1].trim(),
        context: line.trim()
      });
    }

    // Find strings in quotes that look like English text
    const quotedStrings = line.match(/["']([A-Z][a-zA-Z\s]{10,})["']/g);
    if (quotedStrings) {
      quotedStrings.forEach(str => {
        const text = str.slice(1, -1);
        if (ENGLISH_INDICATORS.test(text)) {
          issues.push({
            line: index + 1,
            text: text,
            context: line.trim()
          });
        }
      });
    }
  });

  return issues;
}

function scanDirectory(dir) {
  const results = {};
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scan(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const issues = findHardcodedStrings(filePath);
        if (issues.length > 0) {
          const relativePath = path.relative(process.cwd(), filePath);
          results[relativePath] = issues;
        }
      }
    });
  }
  
  scan(dir);
  return results;
}

console.log('🔍 Scanning for untranslated strings...\n');

const results = scanDirectory(COMPONENTS_DIR);
const fileCount = Object.keys(results).length;

if (fileCount === 0) {
  console.log('✅ No obvious untranslated strings found!');
} else {
  console.log(`⚠️  Found potential untranslated strings in ${fileCount} file(s):\n`);
  
  Object.entries(results).forEach(([file, issues]) => {
    console.log(`📄 ${file}`);
    issues.forEach(issue => {
      console.log(`   Line ${issue.line}: "${issue.text}"`);
    });
    console.log('');
  });
  
  console.log('\n💡 Tip: Use t() function from useTranslation() hook to translate these strings.');
}

#!/usr/bin/env node
/**
 * Obsidian Cream — safe, dependency-free VS Code JSONC settings patcher.
 * - Changes ONLY approved layout settings; preserves existing typography and animations.
 * - Leaves other keys, key order, comments and other JSONC text intact.
 * - Creates a timestamped backup before writing anything.
 * - Refuses to write invalid JSONC or to create a settings file silently.
 * Usage: node scripts/apply-settings.mjs [--settings "C:\\...\\settings.json"] [--dry-run]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const visuals = {
  'workbench.colorTheme': 'Obsidian Cream',
  'editor.minimap.enabled': false,
  'breadcrumbs.enabled': false,
  'editor.guides.indentation': false,
  'editor.guides.bracketPairs': false,
  'editor.guides.highlightActiveIndentation': false,
  'editor.renderLineHighlight': 'line',
  'editor.overviewRulerBorder': false,
  'editor.hideCursorInOverviewRuler': true,
  'editor.scrollbar.verticalScrollbarSize': 8,
  'editor.scrollbar.horizontalScrollbarSize': 8,
  'workbench.layoutControl.enabled': false,
  'window.commandCenter': false,
  'workbench.tree.renderIndentGuides': 'none'
};
// Only add when missing; preserve customized values if they are present.
const defaultsIfMissing = {
  'editor.fontFamily': 'JetBrains Mono',
  'workbench.iconTheme': 'material-icon-theme'
};

const argv = process.argv.slice(2);
let dryRun = false;
let providedPath;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--dry-run') dryRun = true;
  else if (argv[i] === '--settings' && argv[i+1]) providedPath = argv[++i];
  else { console.error(`Unknown or incomplete option: ${argv[i]}`); process.exit(2); }
}
const defaultWindows = path.join(process.env.APPDATA ?? '', 'Code', 'User', 'settings.json');
const defaultNonWindows = process.platform === 'darwin'
  ? path.join(os.homedir(), 'Library/Application Support/Code/User/settings.json')
  : path.join(os.homedir(), '.config/Code/User/settings.json');
const settingsFile = path.resolve(providedPath ?? (process.platform === 'win32' ? defaultWindows : defaultNonWindows));

function skipTrivia(s, from) {
  let i = from;
  for (;;) {
    while (/\s/.test(s[i] ?? '') && i < s.length) i++;
    if (s.startsWith('//',i)) { i=s.indexOf('\n',i+2); if (i < 0) i=s.length; continue; }
    if (s.startsWith('/*',i)) { const e=s.indexOf('*/',i+2); if(e<0) throw Error('Unclosed block comment'); i=e+2; continue; }
    return i;
  }
}
function scanString(s, from) {
  if(s[from] !== '"') throw Error(`Expected quoted string at offset ${from}`);
  let i=from+1;
  for (; i<s.length; i++) {
    if(s[i]==='\\') { i++; continue; }
    if(s[i]==='"') return i+1;
  }
  throw Error('Unclosed string');
}
function scanValue(s, from) {
  let i=from, depth=0, lastSig=from;
  while(i < s.length) {
    if(/\s/.test(s[i])) { i++; continue; }
    if(s.startsWith('//',i) || s.startsWith('/*',i)) { i=skipTrivia(s,i); continue; }
    if(s[i]==='"') { i=scanString(s,i); lastSig=i; continue; }
    if(s[i]==='{' || s[i]==='[') { depth++; i++; lastSig=i; continue; }
    if(s[i]==='}' || s[i]===']') {
      if(depth===0) break;
      depth--; i++; lastSig=i; continue;
    }
    if(s[i]===',' && depth===0) break;
    i++; lastSig=i;
  }
  return lastSig;
}
function topLevel(s) {
  const entries=[];
  let i=skipTrivia(s,0);
  if(s[i]!=='{') throw Error('Expected a JSONC object at root');
  i++;
  for (;;) {
    i=skipTrivia(s,i);
    if(s[i]==='}') return { entries, closingIndex:i };
    if(s[i]!=='"') throw Error(`Expected a settings key near offset ${i}`);
    const keyStart=i, keyEnd=scanString(s,i), key=JSON.parse(s.slice(i,keyEnd));
    i=skipTrivia(s,keyEnd);
    if(s[i]!==':') throw Error(`Expected ':' after ${key}`);
    i=skipTrivia(s,i+1);
    const valueStart=i, valueEnd=scanValue(s,i);
    if(valueStart===valueEnd) throw Error(`Missing value for ${key}`);
    i=skipTrivia(s,valueEnd);
    const hasComma=s[i]===',';
    entries.push({key,keyStart,valueStart,valueEnd,hasComma});
    if(hasComma) { i++; continue; }
    if(s[i]==='}') return {entries,closingIndex:i};
    throw Error(`Expected comma or '}' after ${key}`);
  }
}
function removeCommentsAndTrailingCommas(s) {
  let out='';
  for(let i=0;i<s.length;) {
    if(s[i]==='"') { const end=scanString(s,i); out+=s.slice(i,end); i=end; continue; }
    if(s.startsWith('//',i)) { let end=s.indexOf('\n',i+2); if(end<0) end=s.length; out+=' '.repeat(end-i); i=end; continue; }
    if(s.startsWith('/*',i)) { const end=s.indexOf('*/',i+2); if(end<0) throw Error('Unclosed comment');
      out+=s.slice(i,end+2).replace(/[^\r\n]/g,' '); i=end+2; continue; }
    out+=s[i++];
  }
  // Remove trailing commas only outside quoted strings. A string like ",}" is untouched.
  let clean='';
  for(let i=0;i<out.length;) {
    if(out[i]==='"') { const end=scanString(out,i); clean+=out.slice(i,end); i=end; continue; }
    if(out[i]===',') {
      let j=i+1;
      while(j<out.length && /\s/.test(out[j])) j++;
      if(out[j]==='}' || out[j]===']') { i++; continue; }
    }
    clean+=out[i++];
  }
  return clean;
}
function jsoncParse(s){ return JSON.parse(removeCommentsAndTrailingCommas(s)); }
function indentForEntry(s,e) {
  const from=s.lastIndexOf('\n',e.keyStart-1)+1;
  const prefix=s.slice(from,e.keyStart);
  return /^[ \t]*$/.test(prefix) ? prefix : '  ';
}
function patch(s) {
  const info=topLevel(s);
  const data=jsoncParse(s);
  if(data===null || typeof data!=='object' || Array.isArray(data)) throw Error('settings.json must be an object');
  const byKey=new Map(info.entries.map(e=>[e.key,e]));
  const edits=[]; const changes=[]; const missing=[];
  for(const [key,value] of Object.entries(visuals)) {
    const existing=byKey.get(key);
    if(!existing) {missing.push([key,value]);changes.push(`${key}: added`);continue;}
    if(JSON.stringify(data[key])===JSON.stringify(value)) continue;
    edits.push({start:existing.valueStart,end:existing.valueEnd,text:JSON.stringify(value)});
    changes.push(`${key}: updated`);
  }
  for(const [key,value] of Object.entries(defaultsIfMissing)) {
    if(!byKey.has(key)) {missing.push([key,value]);changes.push(`${key}: added (was missing)`);}
  }
  if(missing.length) {
    const eol=s.includes('\r\n')?'\r\n':'\n';
    const last=info.entries.at(-1);
    const indent=last?indentForEntry(s,last):'  ';
    if(last && !last.hasComma) edits.push({start:last.valueEnd,end:last.valueEnd,text:','});
    // Keep existing end-of-object comments untouched; append new fields before the closing brace.
    const additions=missing.map(([k,v])=>`${indent}${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(','+eol);
    const lastLineStart=s.lastIndexOf('\n',info.closingIndex-1)+1;
    const beforeBrace=s.slice(lastLineStart,info.closingIndex);
    // If the closing brace is indented on its own line, insert before that indentation.
    const insertAt=/^[ \t]*$/.test(beforeBrace) ? lastLineStart : info.closingIndex;
    const needsLeadingNewline=insertAt>0 && s[insertAt-1]!=='\n';
    edits.push({start:insertAt,end:insertAt,text:`${needsLeadingNewline?eol:''}${additions}${eol}`});
  }
  edits.sort((a,b)=>b.start-a.start || b.end-a.end);
  let result=s;
  for(const e of edits) result=result.slice(0,e.start)+e.text+result.slice(e.end);
  const parsed=jsoncParse(result);
  for(const [k,v] of Object.entries(visuals)) if(JSON.stringify(parsed[k])!==JSON.stringify(v)) throw Error(`Post-write validation failed: ${k}`);
  for(const [k,v] of Object.entries(data)) if(!(k in visuals) && JSON.stringify(parsed[k])!==JSON.stringify(v)) throw Error(`Unrelated setting was modified: ${k}`);
  return {result,changes,data};
}
try {
  if(!fs.existsSync(settingsFile)) throw Error(`Settings file does not exist: ${settingsFile}\nOpen VS Code settings.json first, or use --settings <path>. No file was created.`);
  const original=fs.readFileSync(settingsFile,'utf8');
  const bom=original.startsWith('\uFEFF') ? '\uFEFF' : '';
  const {result,changes,data}=patch(original.slice(bom.length));
  console.log(`Settings: ${settingsFile}`);
  console.log(`${changes.length} proposed visual changes. Unrelated settings remain untouched.`);
  for(const name of changes) console.log(`  ${name}`);
  if('workbench.colorCustomizations' in data || 'editor.tokenColorCustomizations' in data || 'editor.semanticTokenColorCustomizations' in data) {
    console.warn('NOTE: Existing global color/token overrides were preserved. Some may visually override this theme.');
  }
  if(dryRun){console.log('Dry run: no file changed, no backup created.');process.exit(0);}
  if(result===original.slice(bom.length)){console.log('Already configured; no changes necessary.');process.exit(0);}
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  const backup=`${settingsFile}.${stamp}.bak`;
  fs.copyFileSync(settingsFile,backup,fs.constants.COPYFILE_EXCL);
  console.log(`Original backup: ${backup}`);
  // Do not overwrite when we cannot back up first.
  fs.writeFileSync(settingsFile,bom+result,'utf8');
  console.log('Updated visual settings. Restart VS Code / switch to theme if needed.');
} catch(error){console.error(`ABORTED: ${error.message}`);process.exit(1);}

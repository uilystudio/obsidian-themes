#!/usr/bin/env python3
"""Sanity checks for Obsidian Themes 2.0.2 (no VS Code runtime required)."""
import json, re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
p=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
assert p['name']=='obsidian-cream' and p['publisher']=='uilystudio'
assert p['version']=='2.0.2'
themes=p['contributes']['themes']
assert len(themes)==6
assert {x['label'] for x in themes}=={'Obsidian Cream','Obsidian Cherry Velvet','Obsidian Forest','Obsidian Graphite','Obsidian Moonstone','Obsidian Pearl'}
for entry in themes:
 path=ROOT/entry['path']
 d=json.loads(path.read_text(encoding='utf8'))
 assert d['semanticHighlighting'] is True
 assert d['type']==('light' if entry['uiTheme']=='vs' else 'dark')
 assert len(d['colors'])>=380
 assert len(d['tokenColors'])>=125
 assert len(d['semanticTokenColors'])>=400
 for color in d['colors'].values():
  assert re.fullmatch('#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?',color),f'{path}: {color}'
 for rule in d['tokenColors']:
  assert rule.get('name') and rule.get('scope')
  assert re.fullmatch('#[0-9a-fA-F]{6}',rule['settings']['foreground'])
 for v in d['semanticTokenColors'].values():
  color=v if isinstance(v,str) else v['foreground']
  assert re.fullmatch('#[0-9a-fA-F]{6}',color)
 assert any('rust' in str(t['scope']) for t in d['tokenColors'])
 assert 'function:rust' in d['semanticTokenColors']
 assert 'type:luau' in d['semanticTokenColors']
 print(entry['label'],len(d['colors']),'UI colors',len(d['tokenColors']),'TextMate rules',len(d['semanticTokenColors']),'semantic selectors')
print('OK - 6 themes, manifest, XML-free JSON checks, added cross-language selectors')

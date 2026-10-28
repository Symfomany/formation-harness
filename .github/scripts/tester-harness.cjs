#!/usr/bin/env node
'use strict';
// Tests du harness SprintDesk : scripts de contrôle et hooks d'exemple, sans agent ni réseau.
// Usage : node .github/scripts/tester-harness.cjs
// Chaque hook est lancé comme le ferait le runtime : événement JSON sur stdin, JSON lu sur stdout.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { verifierUS } = require('./verifier-us.cjs');
const { violations } = require('./verifier-sources.cjs');

const RACINE = path.resolve(__dirname, '..', '..');
const HOOKS = path.join(RACINE, '.github', 'hooks-exemples', 'scripts');

const US_CONFORME = fs.readFileSync(path.join(RACINE, 'sprintdesk', 'backlog', 'entree', 'lot1', 'US-105.md'), 'utf8');
const US_NON_CONFORME = `# US-999 — Exemple non conforme

## Besoin
Pouvoir joindre des fichiers.

## Critères d'acceptation
- Les pièces jointes sont limitées à 5 Mo (ND-02).
`;

let echecs = 0;
function verifier(nom, condition, detail = '') {
  console.log(`${condition ? 'OK ' : 'KO '} ${nom}${condition ? '' : ` — ${detail}`}`);
  if (!condition) echecs += 1;
}

function lancerHook(script, evenement) {
  const r = spawnSync(process.execPath, [path.join(HOOKS, script)], {
    input: typeof evenement === 'string' ? evenement : JSON.stringify(evenement),
    encoding: 'utf8',
    timeout: 10000,
  });
  let sortie = null;
  try { sortie = r.stdout.trim() ? JSON.parse(r.stdout) : {}; } catch { sortie = { brut: r.stdout }; }
  return { code: r.status, sortie, stderr: r.stderr };
}

function dossierTemporaire(us) {
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'sprintdesk-'));
  const lot = path.join(dossier, 'sprintdesk', 'backlog', 'sortie', 'lot9');
  fs.mkdirSync(lot, { recursive: true });
  for (const [nom, contenu] of Object.entries(us)) fs.writeFileSync(path.join(lot, nom), contenu);
  return dossier;
}

// 1. verifier-us
verifier('verifier-us : US-105 (conforme) passe', verifierUS('US-105.md', US_CONFORME).length === 0, verifierUS('US-105.md', US_CONFORME).join(' | '));
const erreurs = verifierUS('US-999.md', US_NON_CONFORME);
verifier('verifier-us : sections manquantes détectées', erreurs.some((e) => e.includes('Règles métier')));
verifier('verifier-us : ND-02 dans un critère détectée', erreurs.some((e) => e.includes("ND-02 citée dans un critère")));
verifier('verifier-us : besoin incomplet détecté', erreurs.some((e) => e.startsWith('besoin incomplet')));
const derivee = US_CONFORME.replace('# US-105 —', '# US-105a —');
verifier('verifier-us : US dérivée sans lien d\'origine détectée', verifierUS('US-105a.md', derivee).some((e) => e.includes("US d'origine")));

// 2. verifier-sources
verifier('verifier-sources : entree/ interdit', violations(['sprintdesk/backlog/entree/lot1/US-101.md']).length === 1);
verifier('verifier-sources : contexte/ interdit sans dérogation', violations(['sprintdesk/contexte/regles-metier.md']).length === 1);
verifier('verifier-sources : contexte/ autorisé avec dérogation', violations(['sprintdesk/contexte/regles-metier.md'], { autoriserContexte: true }).length === 0);
verifier('verifier-sources : sortie/ autorisé', violations(['sprintdesk\\backlog\\sortie\\lot1\\US-101.md']).length === 0);

// 3. Hook preToolUse
let r = lancerHook('protege-sources.cjs', { toolName: 'edit', toolArgs: { path: 'sprintdesk/backlog/entree/lot1/US-101.md' } });
verifier('preToolUse : écriture dans entree/ refusée', r.sortie.permissionDecision === 'deny', JSON.stringify(r.sortie));
r = lancerHook('protege-sources.cjs', { toolName: 'create', toolArgs: { path: 'sprintdesk/backlog/sortie/lot1/US-101.md' } });
verifier('preToolUse : écriture dans sortie/ sans objection ({})', Object.keys(r.sortie).length === 0, JSON.stringify(r.sortie));
r = lancerHook('protege-sources.cjs', { toolName: 'bash', toolArgs: { command: 'git push origin main' } });
verifier('preToolUse : git push refusé', r.sortie.permissionDecision === 'deny');
r = lancerHook('protege-sources.cjs', { hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'Remove-Item sprintdesk\\contexte\\produit.md' } });
verifier('preToolUse (format VS Code) : suppression dans contexte/ refusée', r.sortie.permissionDecision === 'deny', JSON.stringify(r.sortie));
r = lancerHook('protege-sources.cjs', 'ceci n\'est pas du JSON');
verifier('preToolUse : événement illisible refusé (fail-closed)', r.sortie.permissionDecision === 'deny');
r = lancerHook('protege-sources.cjs', { toolName: 'view', toolArgs: { path: 'sprintdesk/contexte/regles-metier.md' } });
verifier('preToolUse : lecture de contexte/ sans objection', Object.keys(r.sortie).length === 0);

// 4. Hook sessionStart
r = lancerHook('contexte-session.cjs', { cwd: RACINE, source: 'resume' });
verifier('sessionStart : ND-01 à ND-06 injectées depuis regles-metier.md', /ND-01/.test(r.sortie.additionalContext || '') && /ND-06/.test(r.sortie.additionalContext || ''));
verifier('sessionStart : consigne de reprise si source = resume', /Reprise de session/.test(r.sortie.additionalContext || ''));

// 5. Hook subagentStart
r = lancerHook('rappel-sous-agent.cjs', { agentName: 'redacteur-backlog' });
verifier('subagentStart : consigne spécifique au rédacteur', /verifier-us\.cjs/.test(r.sortie.additionalContext || ''));

// 6. Hook postToolUse
let tmp = dossierTemporaire({ 'US-999.md': US_NON_CONFORME, 'US-105.md': US_CONFORME });
r = lancerHook('controle-apres-ecriture.cjs', { cwd: tmp, toolName: 'create', toolArgs: { path: path.join(tmp, 'sprintdesk', 'backlog', 'sortie', 'lot9', 'US-999.md') } });
verifier('postToolUse : US non conforme signalée au modèle', /n'est pas conforme/.test(r.sortie.additionalContext || ''), JSON.stringify(r.sortie));
r = lancerHook('controle-apres-ecriture.cjs', { cwd: tmp, toolName: 'edit', toolArgs: { path: 'sprintdesk/backlog/sortie/lot9/US-105.md' } });
verifier('postToolUse : US conforme sans retour', Object.keys(r.sortie).length === 0, JSON.stringify(r.sortie));

// 7. Hook agentStop
r = lancerHook('verifier-avant-arret.cjs', { cwd: tmp, stop_hook_active: false });
verifier('agentStop : US non conforme -> decision block', r.sortie.decision === 'block' && /US-999/.test(r.sortie.reason || ''), JSON.stringify(r.sortie));
r = lancerHook('verifier-avant-arret.cjs', { cwd: tmp, stop_hook_active: true });
verifier('agentStop : anti-boucle si stop_hook_active', Object.keys(r.sortie).length === 0);
fs.rmSync(tmp, { recursive: true, force: true });

tmp = dossierTemporaire({ 'US-105.md': US_CONFORME });
r = lancerHook('verifier-avant-arret.cjs', { cwd: tmp });
verifier('agentStop : tout est conforme -> fin autorisée', Object.keys(r.sortie).length === 0, JSON.stringify(r.sortie));
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`\n${echecs ? `${echecs} test(s) en échec.` : 'Tous les tests passent.'}`);
process.exitCode = echecs ? 1 : 0;

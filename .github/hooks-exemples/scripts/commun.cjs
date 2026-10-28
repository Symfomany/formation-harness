'use strict';
// Fonctions communes aux hooks d'exemple SprintDesk.
// Compatibles avec les deux formats d'événement :
//   - camelCase (preToolUse, toolName, toolArgs) : Copilot CLI, cloud agent, VS Code (harness Copilot) ;
//   - PascalCase / snake_case (PreToolUse, tool_name, tool_input) : format « compatible VS Code ».

const fs = require('node:fs');

function lireEvenement() {
  try {
    const brut = fs.readFileSync(0, 'utf8');
    return brut.trim() ? JSON.parse(brut) : {};
  } catch {
    return null; // événement illisible : à chaque hook de décider (fail-closed ou fail-open)
  }
}

function champ(evenement, camel, snake) {
  return evenement[camel] !== undefined ? evenement[camel] : evenement[snake];
}

function argumentsOutil(evenement) {
  const args = champ(evenement, 'toolArgs', 'tool_input');
  if (typeof args !== 'string') return args || {};
  try { return JSON.parse(args); } catch { return { brut: args }; }
}

function repondre(objet) {
  // Une seule sortie JSON sur stdout : deux objets concaténés seraient ignorés.
  process.stdout.write(JSON.stringify(objet || {}));
}

module.exports = { lireEvenement, champ, argumentsOutil, repondre };

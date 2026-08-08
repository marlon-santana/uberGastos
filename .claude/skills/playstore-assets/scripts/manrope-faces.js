// Gera o bloco CSS @font-face com a fonte Manrope embutida como data URI base64.
// Usado tanto pelos screenshots quanto pelo vídeo para que o Chrome headless
// renderize a MESMA tipografia do app (Manrope) — sem isso, o headless cai num
// fallback de sistema mais largo que estoura os layouts e come os acentos pt-BR.
//
// Uso: const { manropeFaces } = require('./manrope-faces');
//      const css = manropeFaces();   // string com 5 @font-face
//
// Requer que o projeto tenha @expo-google-fonts/manrope instalado (já é dep do app).
const fs = require('fs');
const path = require('path');

// Resolve a pasta de TTFs a partir da raiz do projeto (2 níveis acima de .claude/skills/<skill>/scripts... ajuste se mover).
// Estratégia robusta: procurar node_modules subindo a partir de cwd.
function findFontDir() {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const cand = path.join(dir, 'node_modules', '@expo-google-fonts', 'manrope');
    if (fs.existsSync(cand)) return cand;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  throw new Error('Nao encontrei @expo-google-fonts/manrope em node_modules. Rode a partir da raiz do projeto (npm install feito).');
}

// [peso, nome do TTF, subpasta usada no layout novo do pacote]
const FACES = [
  [400, 'Manrope_400Regular.ttf', '400Regular'],
  [500, 'Manrope_500Medium.ttf', '500Medium'],
  [600, 'Manrope_600SemiBold.ttf', '600SemiBold'],
  [700, 'Manrope_700Bold.ttf', '700Bold'],
  [800, 'Manrope_800ExtraBold.ttf', '800ExtraBold'],
];

// O pacote mudou de layout entre versoes: versoes antigas deixam os TTFs na raiz
// do pacote, versoes novas (>=0.4) em uma subpasta por peso. Aceitar os dois.
function resolveFace(fontDir, file, subdir) {
  const candidates = [path.join(fontDir, file), path.join(fontDir, subdir, file)];
  const hit = candidates.find((p) => fs.existsSync(p));
  if (!hit) {
    throw new Error('Nao encontrei ' + file + ' em ' + fontDir + ' (nem na raiz nem em ' + subdir + '/).');
  }
  return hit;
}

function manropeFaces() {
  const fontDir = findFontDir();
  return FACES.map(([w, file, subdir]) => {
    const b64 = fs.readFileSync(resolveFace(fontDir, file, subdir)).toString('base64');
    return "@font-face{font-family:'Manrope';font-weight:" + w +
      ";font-style:normal;font-display:block;src:url(data:font/ttf;base64," +
      b64 + ") format('truetype');}";
  }).join('\n');
}

module.exports = { manropeFaces };

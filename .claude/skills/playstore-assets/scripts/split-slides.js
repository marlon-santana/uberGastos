// Divide um HTML "strip" (varios .slide-wrap lado a lado, para preview) em N
// paginas standalone, uma por slide, cada uma renderizando o .slide em 1:1
// (1080x1920) com a fonte Manrope embutida — prontas para screenshot headless.
//
// O HTML de origem deve ter:
//   - um bloco <style>...</style> com os estilos dos componentes (o primeiro).
//   - um container <div class="strip"> ... </div> com os slides.
//   - cada slide precedido de um comentario marcador:  <!-- ==== SLIDE ... ==== -->
//   - cada slide no formato  <div class="slide-wrap"><div class="slide" ...> ... </div></div>
//
// Uso:  node split-slides.js <origem.html> <pastaSaida> nome1,nome2,nome3,...
//   (os nomes viram slide-<nome>.html; a ordem casa com a ordem dos slides)
const fs = require('fs');
const path = require('path');
const { manropeFaces } = require('./manrope-faces');

const [src, outDir, namesCsv] = process.argv.slice(2);
if (!src || !outDir || !namesCsv) {
  console.error('uso: node split-slides.js <origem.html> <pastaSaida> nome1,nome2,...');
  process.exit(1);
}
const names = namesCsv.split(',').map(s => s.trim());
const art = fs.readFileSync(src, 'utf8');

const style = art.match(/<style>[\s\S]*?<\/style>/)[0].replace('<style>', '').replace('</style>', '');
const strip = art.match(/<div class="strip">([\s\S]*)<\/div>\s*$/)[1];
// separa por comentarios de banner de slide
const parts = strip.split(/<!--\s*=+\s*SLIDE[^>]*-->/).slice(1);

if (parts.length !== names.length) {
  console.warn(`aviso: ${parts.length} slides no HTML mas ${names.length} nomes passados; usando o menor.`);
}
const fontCss = manropeFaces();
const n = Math.min(parts.length, names.length);
for (let i = 0; i < n; i++) {
  const html = parts[i].trim();
  const page = '<!doctype html><html><head><meta charset="utf-8">\n'
    + '<style>' + fontCss + '</style>\n'
    + '<style>' + style + '</style>\n'
    + '<style>\n'
    + "  html,body{margin:0;padding:0;background:#fff;font-family:'Manrope',sans-serif;}\n"
    + '  .slide-wrap{width:1080px !important;height:1920px !important;border-radius:0 !important;box-shadow:none !important;overflow:hidden;}\n'
    + '  .slide{transform:none !important;}\n'
    + '</style>\n</head><body>\n'
    + html + '\n</body></html>';
  fs.writeFileSync(path.join(outDir, 'slide-' + names[i] + '.html'), page, 'utf8');
  console.log('escreveu slide-' + names[i] + '.html');
}
console.log('total:', n, 'slides');

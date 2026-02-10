async function replaceImgByInlineSVG(img) {
  const src = img.getAttribute("src");
  if (!src) return;

  const res = await fetch(src);
  const svgText = await res.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText;

  const svg = wrapper.querySelector("svg");
  if (!svg) return;

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.fill = "currentColor";

  const parent = img.parentElement;

  // remplacer <img> par <svg>
  parent.replaceChild(svg, img);

  // ajouter classe "loading"
  parent.classList.add("svg-loading");

  // tous les éléments du SVG invisibles
  const dots = svg.querySelectorAll("path, circle, rect, polygon");
  dots.forEach(dot => {
    dot.style.opacity = 0;
  });

  // délai aléatoire avant apparition
  const delay = Math.random() * 800;
  setTimeout(() => {
    // rendre parent et SVG visibles
    parent.classList.add("is-visible");
    parent.classList.remove("svg-loading");

    // apparition aléatoire des dots
    dots.forEach(dot => {
      const dotDelay = Math.random() * 900;
      setTimeout(() => {
        dot.style.opacity = 1;
      }, dotDelay);
    });
  }, delay);
}

function bubbleTextAnimation() {
  const imgs = document.querySelectorAll(".vu .nav-item img.nav-svg");
  imgs.forEach(img => replaceImgByInlineSVG(img));
}








function clusterAnimation() {
  const cluster = document.querySelector('.cluster');
  const panels = Array.from(cluster.querySelectorAll('.panel'));

  // Positions fixes pour cases vides
  const emptyPositions = [0, 1, 2, 3, 4, 5, 8, 12, 16, 17, 18, 20, 22, 25, 28, 30, 33, 35, 36, 37, 39, 40, 43, 48, 50, 51, 54, 60, 63, 65, 67, 69, 72, 75, 76, 80, 83, 86, 89, 90];

  // Reconstruire la grille avec cases vides
  const newOrder = [];
  let panelIndex = 0;

  for (let i = 0; i < panels.length + emptyPositions.length; i++) {
    if (emptyPositions.includes(i)) {
      const emptyDiv = document.createElement('div');
      emptyDiv.classList.add('empty');
      newOrder.push(emptyDiv);
    } else {
      newOrder.push(panels[panelIndex]);
      panelIndex++;
    }
  }

  cluster.innerHTML = '';
  newOrder.forEach(el => cluster.appendChild(el));

  // ANIMATION ALÉATOIRE DES PANELS
  const finalPanels = Array.from(cluster.querySelectorAll('.panel'));

  // Mélanger l'ordre aléatoirement
  const shuffledPanels = finalPanels
    .map(p => ({ panel: p, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(obj => obj.panel);

  // Ajouter classes avec délai aléatoire pour chaque panel
  shuffledPanels.forEach(panel => {
    const borderDelay = Math.random() * 800; // bordure aléatoire

    // apparition de la bordure
    setTimeout(() => {
      panel.classList.add('is-loading');

      // apparition de l'image après bordure
      setTimeout(() => {
        panel.classList.add('is-visible');
        panel.classList.remove('is-loading'); // enlève la bordure
      }, 400 + Math.random() * 300); // délai variable image
    }, borderDelay);
  });
}








/*

function makeQuarterCircleRoundedBottomLeft(paraSelector) {
  const paragraphs = document.querySelectorAll(paraSelector);

  paragraphs.forEach((p, index) => {
    const text = p.textContent.trim();
    const fontSize = parseFloat(getComputedStyle(p).fontSize);
    const charWidth = fontSize * 0.6;

    const width = p.clientWidth;
    const radius = width * 0.87;
    let i = 0;
    const lines = [];

    let lineIndex = 0;
    while (i < text.length) {
        const y = lineIndex * fontSize;
        if (y > radius) break;

        // largeur max selon le quart de cercle
        let maxLineWidth = Math.sqrt(radius * radius - y * y);

        // deuxième paragraphe : quart bas-gauche
        if (index === 1) {
            const remainingChars = text.length - i;
            const charsInLine = Math.min(Math.floor(maxLineWidth / charWidth) || 1, remainingChars);
            const lineText = text.substr(i, charsInLine); // texte normal, pas inversé
            lines.push(lineText); 
            i += charsInLine;
        } else {
            const charsInLine = Math.floor(maxLineWidth / charWidth) || 1;
            lines.push(text.substr(i, charsInLine));
            i += charsInLine;
        }

        lineIndex++;
    }

    // reste du texte
    if (i < text.length) {
      const remaining = text.substr(i);
      if (index === 1) lines.unshift(remaining);
      else lines.push(remaining);
    }

    // remplacement par spans avec alignement
    p.innerHTML = lines.map(line => `<span style="display:block; text-align:${index === 1 ? 'right' : 'left'}">${line}</span>`).join('');
  });
}


window.addEventListener('load', () => {
  makeQuarterCircleRoundedBottomLeft('.para p');
});

*/






















function launchAnimations() {
  // Étape 1 : disparition des cercles

  // Étape 2 : apparition du texte en même temps
  bubbleTextAnimation();

  // Étape 3 : animation du cluster après 500ms
  setTimeout(() => {
    clusterAnimation();
  }, 1500);
}



// === Lancer après que le DOM et les fonts soient prêts ===
window.addEventListener("load", () => {
  document.fonts.ready.then(() => {
    launchAnimations();
  });
});






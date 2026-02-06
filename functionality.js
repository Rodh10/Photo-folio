// === Fonction pour la disparition des cercles ===
function circleFadeAnimation(callback) {
  const canvas = document.getElementById("textCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const zoneHeight = 250;
  const spacing = 6;
  const radius = 4;

  const particleCountX = Math.floor(canvas.width / spacing);
  const particleCountY = Math.floor(zoneHeight / spacing);

  for (let y = 0; y < particleCountY; y++) {
    for (let x = 0; x < particleCountX; x++) {
      // On ajoute un petit décalage aléatoire seulement sur y pour casser la ligne du bas
      const randomOffsetY = (Math.random() - 0.5) * spacing * 2; // +/- 1 spacing

      particles.push({
        x: x * spacing + spacing / 2,
        y: y * spacing + spacing / 2 + randomOffsetY,
        radius: radius,
        opacity: 1,
        speed: Math.random() * 0.03 + 0.02
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allInvisible = true;

    particles.forEach(p => {
      if (p.opacity > 0) {
        allInvisible = false;
        p.opacity -= p.speed;
        if (p.opacity < 0) p.opacity = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(219, 250, 255, ${p.opacity})`;
        ctx.fill();
      }
    });

    if (!allInvisible) {
      requestAnimationFrame(animate);
    } else {
      if (callback) callback();
    }
  }

  animate();
}




function bubbleTextAnimation() {
  const buttons = document.querySelectorAll(".vu button");

  buttons.forEach(btn => {
    btn.style.opacity = 0; // texte invisible au départ
    btn.style.transition = "opacity 1s ease"; // apparition douce

    // déclencher l'apparition après un petit délai aléatoire
    const delay = Math.random() * 1000;
    setTimeout(() => {
      btn.style.opacity = 1;
    }, delay);
  });
}




function clusterAnimation() {
  const cluster = document.querySelector('.cluster');
  const panels = Array.from(cluster.querySelectorAll('.panel'));

  // Positions fixes où on veut laisser des cases vides
  const emptyPositions = [0, 1, 2, 3, 4, 5, 8, 12, 16, 17, 18, 20, 22, 25, 28, 30, 33, 35, 36, 37, 39, 40, 43, 48, 50, 51, 54, 60, 63, 65, 67, 69, 72, 75, 76, 80, 83, 86, 89, 90];

  // Reconstruire la grille avec les cases vides
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

  // --- ANIMATION ALÉATOIRE ---
  const finalPanels = Array.from(cluster.querySelectorAll('.panel'));

  // Mélanger les panels pour l'ordre aléatoire
  const shuffledPanels = finalPanels
    .map(p => ({ panel: p, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(obj => obj.panel);

  // Appliquer l'animation avec cascade aléatoire
  shuffledPanels.forEach((panel, i) => {
    panel.classList.add('is-loading');

    setTimeout(() => {
      panel.classList.remove('is-loading');
      panel.classList.add('is-visible');
    }, 500 + i * 45);
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
  circleFadeAnimation();

  // Étape 2 : apparition du texte en même temps
  bubbleTextAnimation();

  // Étape 3 : animation du cluster après 500ms
  setTimeout(() => {
    clusterAnimation();
  }, 3000);
}



// === Lancer après que le DOM et les fonts soient prêts ===
window.addEventListener("load", () => {
  document.fonts.ready.then(() => {
    launchAnimations();
  });
});






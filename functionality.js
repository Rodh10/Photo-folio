// ===============================
// SECTIO LOADER
// ===============================
function launchLoadingSVGAnimation(svg, loader, onFinish) {
  const pieces = [...svg.querySelectorAll("path, circle, rect, polygon, line, polyline, ellipse")];

  // état initial
  pieces.forEach(el => {
    el.style.opacity = 0;
    el.style.transition = "opacity 1.2s ease";
  });
  svg.style.opacity = 0;
  svg.style.transition = "opacity 1.4s ease, transform 1.8s ease";

  // fade-in du SVG
  setTimeout(() => {
    svg.style.opacity = 1;
  }, 250);

  // 🔹 apparition aléatoire des pièces
  pieces.forEach(el => {
    const randomDelay = 1000 + Math.random() * 3000; // entre 0.5s et 1.5s
    setTimeout(() => {
      el.style.opacity = 1;
    }, randomDelay);
  });

  // durée approximative pour la pause après apparition
  const maxAppearDelay = 3000; // correspond au max randomDelay
  setTimeout(() => {
  }, maxAppearDelay + 800); // légère pause

  // 🔹 disparition aléatoire des pièces
  setTimeout(() => {
    pieces.forEach(el => {
      const randomDelay = Math.random() * 800; // disparition aléatoire
      setTimeout(() => {
        el.style.opacity = 0;
      }, randomDelay);
    });

    // disparition du SVG en même temps
    setTimeout(() => {
      svg.style.opacity = 0;
    }, 1000); // après disparition des pièces
  }, maxAppearDelay + 1800); // après pause logo complet

  // 🔹 disparition complète du loader et callback
  setTimeout(() => {
    if (loader) loader.classList.remove("active");
    document.body.style.overflow = "auto";
    if (onFinish) onFinish(); // signale que le loader est terminé
  }, maxAppearDelay + 1800 + 1500); // marge finale pour s'assurer que tout est fini
}

function startLoader() {
  return new Promise((resolve) => {
    const alreadyPlayed = sessionStorage.getItem("loadingSVGPlayed");
    const loader = document.querySelector(".load");

    if (!alreadyPlayed) {
      if (loader) document.body.style.overflow = "hidden";

      inlineLoadingSVG(loader, () => {
        sessionStorage.setItem("loadingSVGPlayed", "true");
        resolve(); // 🔹 ici, on sait que le loader est fini
      });

    } else {
      if (loader) {
        loader.classList.remove("active");
        document.body.style.overflow = "auto";
      }
      resolve(); // rien à attendre
    }
  });
}

async function inlineLoadingSVG(loader, onFinish) {
  if (!loader) return;

  const img = loader.querySelector("img");
  if (!img) return;

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
  svg.style.opacity = 0;

  img.replaceWith(svg);
  loader.classList.add("active");

  // 🔹 on passe le callback à l'animation
  launchLoadingSVGAnimation(svg, loader, onFinish);
}








// ===============================
// SECTION MENU
// ===============================


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

  const dots = svg.querySelectorAll("path, circle, rect, polygon");
  dots.forEach(dot => dot.style.opacity = 0);

  // vérifier si cette page est active
  const pageUrl = window.location.pathname.split("/").pop(); // ex: "about.html"
  const linkUrl = parent.getAttribute("href");
  const isActive = pageUrl === linkUrl;

  // --- apparition initiale pour tous ---
  const delay = Math.random() * 800;
  setTimeout(() => {
    parent.classList.add("is-visible");

    dots.forEach(dot => {
      const dotDelay = Math.random() * 900;
      setTimeout(() => dot.style.opacity = 1, dotDelay);
    });

    svg.style.opacity = 1;

    // --- après apparition complète ---
    setTimeout(() => {
      if (!isActive) {
        returnToDefault(svg, dots, parent); // lien actif ne revient pas à 0.5
      }
      // hover effect uniquement si pas actif
      if (!isActive) addHoverEffect(svg, parent);
    }, 3000);
  }, delay);
}

// retour à 0.5 pour les non-actifs
function returnToDefault(svg, dots, parent) {
  svg.style.opacity = 0.5;
  dots.forEach(dot => {
    const dotDelay = Math.random() * 500;
    setTimeout(() => dot.style.opacity = 0.5, dotDelay);
  });
}

// hover effect pour les non-actifs
function addHoverEffect(svg, parent) {
  const dots = svg.querySelectorAll("path, circle, rect, polygon");

  parent.addEventListener("mouseenter", () => {
    svg.style.opacity = 1;
    dots.forEach(dot => {
      const dotDelay = Math.random() * 300;
      setTimeout(() => dot.style.opacity = 1, dotDelay);
    });
  });

  parent.addEventListener("mouseleave", () => {
    returnToDefault(svg, dots, parent);
  });
}

function bubbleTextAnimation() {
  const imgs = document.querySelectorAll(".vu .nav-item img.nav-svg");
  imgs.forEach(img => replaceImgByInlineSVG(img));
}


// ===============================
// nouvelle fonction : shrink / minim
// ===============================

function applyMinim(svg) {
  if (!svg) return;
  svg.classList.add("minim"); // applique la classe CSS
}

// fonction pour retirer le minim
function removeMinim(svg) {
  if (!svg) return;
  svg.classList.remove("minim");
}

// exemple d'utilisation : tous les SVG de navigation
function shrinkAllNavSVG() {
  document.querySelectorAll(".vu .nav-item svg").forEach(svg => {
    applyMinim(svg);
  });
}

function resetAllNavSVG() {
  document.querySelectorAll(".vu .nav-item svg").forEach(svg => {
    removeMinim(svg);
  });
}




















// ===============================
// SECTION ANIMATION TEXTE
// ===============================


let amateurLoopActive = true; // contrôle la boucle
let amateurTimeouts = [];     // stocke tous les timeouts actifs

// --- Crée les spans du texte
function splitAmateurText(text) {
  const p = document.querySelector(".amateur p");
  if (!p) return null;

  p.innerHTML = "";
  [...text].forEach(char => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.opacity = "0";
    p.appendChild(span);
  });
  return p;
}

// --- Apparition aléatoire
function amateurAppear(text) {
  const p = splitAmateurText(text);
  if (!p) return;

  p.style.color = "#dbfaff";
  const spans = [...p.querySelectorAll("span")];

  spans.forEach(span => {
    const delay = Math.random() * 900;
    const t = setTimeout(() => {
      span.style.transition = "opacity 0.25s ease";
      span.style.opacity = "1";
    }, delay);
    amateurTimeouts.push(t);
  });
}

// --- Disparition aléatoire de boucle (ne stoppe pas la loop)
function amateurDisappearLoop() {
  const p = document.querySelector(".amateur p");
  if (!p) return;
  const spans = [...p.querySelectorAll("span")];
  spans.forEach(span => {
    const delay = Math.random() * 700;
    const t = setTimeout(() => {
      span.style.transition = "opacity 0.25s ease";
      span.style.opacity = "0";
    }, delay);
    amateurTimeouts.push(t);
  });
  // Remet la couleur transparente après disparition
  const t = setTimeout(() => { if(p) p.style.color = "transparent"; }, 900);
  amateurTimeouts.push(t);
}

// --- Boucle principale
function startAmateurLoop() {
  const texts = [
    "Life through a smartphone lens.",
    "Feeling like a déjà-vu",
    "Logic ends where paradox begins."
  ];
  let index = 0;

  function loop() {
    if (!amateurLoopActive) return; // stop si on veut terminer
    amateurAppear(texts[index]);

    const t1 = setTimeout(() => {
      amateurDisappearLoop();
      const t2 = setTimeout(() => {
        index = (index + 1) % texts.length;
        loop();
      }, 1200);
      amateurTimeouts.push(t2);
    }, 10000);
    amateurTimeouts.push(t1);
  }

  loop();
}


function hideAmateurTextInstant() {
  const p = document.querySelector(".amateur p");
  if (!p) return;

  const spans = [...p.querySelectorAll("span")];

  spans.forEach(span => {
    span.style.transition = "none"; // pas d'animation
    span.style.opacity = "0";
  });

  p.style.color = "transparent";
}

let hasScrolled = false;

function handleScrollAmateur() {
  if (hasScrolled) return; // évite spam
  hasScrolled = true;

  hideAmateurTextInstant();

  // optionnel : stop complètement la loop
  amateurLoopActive = false;

  // clear tous les timeouts actifs
  amateurTimeouts.forEach(t => clearTimeout(t));
  amateurTimeouts = [];
}












// ===============================
// SECTION IMAGES
// ===============================

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

  // Mélanger l'ordre des panels pour apparition aléatoire
  const finalPanels = Array.from(cluster.querySelectorAll('.panel'));
  const shuffledPanels = finalPanels
    .map(p => ({ panel: p, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(obj => obj.panel);

  // Animation aléatoire des panels
  let visibleCount = 0; // compteur pour savoir quand toutes les images sont visibles

  shuffledPanels.forEach(panel => {
    const borderDelay = Math.random() * 800;

    setTimeout(() => {
      panel.classList.add('is-loading');

      setTimeout(() => {
        panel.classList.add('is-visible');
        panel.classList.remove('is-loading');

        visibleCount++;

        // 🔹 Condition : activer hover uniquement quand toutes les images sont visibles
        if (visibleCount === shuffledPanels.length) {
          addClusterHoverEffect(); // une seule fois pour toutes les images
        }
      }, 400 + Math.random() * 300);
    }, borderDelay);
  });
}

function addClusterHoverEffect() {
  const panels = document.querySelectorAll('.cluster .panel img');

  panels.forEach(img => {
    const panel = img.parentElement;

    // Créer le cercle si pas déjà présent
    let hoverCircle = document.createElement('div');
    hoverCircle.classList.add('hover-circle');
    document.body.appendChild(hoverCircle); // ajouter au body pour ne pas être masqué

    // Style du cercle
    hoverCircle.style.position = 'absolute';
    hoverCircle.style.border = '2px solid #dbfaff';
    hoverCircle.style.borderRadius = '50%';
    hoverCircle.style.pointerEvents = 'none'; // ne bloque pas le hover
    hoverCircle.style.opacity = 0;
    hoverCircle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    hoverCircle.style.zIndex = 9999;

    // Fonction pour mettre à jour la position et taille du cercle
    function updateCircle() {
      const rect = img.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) + 6; // 2px espace
      hoverCircle.style.width = `${size}px`;
      hoverCircle.style.height = `${size}px`;
      hoverCircle.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
      hoverCircle.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
      hoverCircle.style.transform = 'translate(-50%, -50%)';
    }

    // Mettre à jour maintenant et à chaque resize/scroll
    updateCircle();
    window.addEventListener('resize', updateCircle);
    window.addEventListener('scroll', updateCircle);

    // Apparition/disparition au hover
    panel.addEventListener('mouseenter', () => {
      updateCircle();
      hoverCircle.style.opacity = 1;
    });

    panel.addEventListener('mouseleave', () => {
      hoverCircle.style.opacity = 0;
    });
  });
}

function enableMaximOnScroll() {
  let activated = false;

  function handleScroll() {
    if (activated) return;

    const scene = document.querySelector('.scene');
    if (!scene) return;

    activated = true;

    const allPanels = scene.querySelectorAll('.panel');

    // Indices des panels à garder visibles
    const indicesToMaxim = [0, 3, 5, 7]; 

    allPanels.forEach((panel, i) => {
      if (indicesToMaxim.includes(i)) {
        // Garder et agrandir
        panel.classList.add('maxim');
        panel.style.zIndex = 2;
        panel.style.opacity = 1;
      } else {
        // Faire disparaître complètement
        panel.style.opacity = 0;
        panel.style.pointerEvents = 'none'; // si tu veux bloquer le hover
        // ou si tu préfères : panel.style.display = 'none';
      }
    });

    // On peut aussi appliquer la classe sur le conteneur si tu veux
    scene.classList.add('maxim');
  }

  window.addEventListener('scroll', handleScroll);
}














// ===============================
// SECTION REGROUPEMENT ANIMATIONS
// ===============================

function launchAnimations() {
  // Étape 1 : disparition des cercles

  // Étape 2 : apparition du texte en même temps
  bubbleTextAnimation();

  // Étape 3 : animation du cluster après 500ms
  setTimeout(() => {
    clusterAnimation();
    startAmateurLoop(); // ✅ démarre la boucle texte
  }, 1500);
}






// ===============================
// CHARGEMENT DE LA PAGE
// ===============================
window.addEventListener("load", () => {
  document.fonts.ready.then(() => {
    startLoader().then(() => {
      // 🔹 ici, toutes les autres animations ne démarrent qu'après la fin du loader
      launchAnimations();
    });
  });
});








// ===============================
// SECTION SCROLL & REDIRECTION
// ===============================


let scrollCooldown = false;
let startY = 0;

function handleScrollToRoam() {
  if (scrollCooldown) return;
  scrollCooldown = true;

  // Réduire tous les SVG à 10%
  shrinkAllNavSVG();
  handleScrollAmateur();
  enableMaximOnScroll();

}

// === Desktop ===
window.addEventListener('wheel', e => {
  if (e.deltaY <= 0) return; // ignore scroll vers le haut
  handleScrollToRoam();
});

// === Mobile ===
window.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY; // position de départ du doigt
});

window.addEventListener('touchend', e => {
  const endY = e.changedTouches[0].clientY;
  const diff = startY - endY;

  if (diff > 50) { // swipe vers le haut → scroll vers le bas
    handleScrollToRoam();
  }
});
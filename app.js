/* GEH NAILS - APP.JS 
   FINALIZAÇÃO: PERFORMANCE, CURSOR MAGNÉTICO E RITMO ORGÂNICO
*/

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const hero = document.querySelector(".hero");
  const typingElement = document.querySelector(".typing");
  const bgText = document.querySelector(".manifesto-bg-text");
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");

  // 1. TIPOGRAFIA DINÂMICA (HUMAN RHYTHM)
  const text = "Especialista em alongamento de fibra";
  let index = 0;

  const typeEffect = () => {
    if (index < text.length) {
      typingElement.textContent += text.charAt(index++);
      const humanDelay = Math.random() * (100 - 50) + 50;
      setTimeout(typeEffect, humanDelay);
    }
  };

  // 2. GESTÃO DO VÍDEO E GATILHO DE TEXTO
  if (video) {
    video.play().catch(() => console.log("Aguardando interação para play"));
    
    video.addEventListener("ended", () => {
      hero.classList.add("video-ended");
      if (typingElement) {
        typingElement.textContent = "";
        setTimeout(typeEffect, 500);
      }
    });
  }

  // 3. CURSOR MAGNÉTICO (EXPERIÊNCIA DESKTOP)
  if (window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      dot.style.left = `${posX}px`;
      dot.style.top = `${posY}px`;

      outline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    // Expansão do cursor em elementos interativos
    document.querySelectorAll('a, .galeria img, .glass-btn').forEach(el => {
      el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => outline.classList.remove('cursor-hover'));
    });
  }

  // 4. SCROLL EXPERIENCE (PARALAXE & HUE ROTATE)
  const updateScrollEffects = () => {
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight - window.innerHeight;
    const percentage = (scrollY / pageHeight) * 100;

    // Barra de progresso e Cor do fundo dinâmica (Ambição)
    document.documentElement.style.setProperty('--scroll-width', `${percentage}%`);
    
    // Mudança sutil de tom no fundo conforme o scroll
    const hue = 250 + (scrollY * 0.02); 
    document.body.style.backgroundColor = `hsl(${hue}, 20%, 96%)`;

    // Paralaxe do Hero
    if (scrollY < window.innerHeight) {
      const moveValue = scrollY * 0.3;
      if (video) video.style.transform = `translate3d(0, ${moveValue}px, 0)`;
    }

    // Texto flutuante "ESSÊNCIA"
    if (bgText) {
      const slowScroll = scrollY * 0.1;
      bgText.style.transform = `translate3d(calc(-50% + ${slowScroll}px), -50%, 0) rotate(-5deg)`;
    }

    requestAnimationFrame(updateScrollEffects);
  };
  requestAnimationFrame(updateScrollEffects);

  // 5. REVELAÇÃO LÍQUIDA (INTERSECTION OBSERVER)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.random() * 200);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .sobre-manifesto, .galeria img, .servicos-container, .footer-simple')
    .forEach(target => revealObserver.observe(target));

  // 6. DISTORÇÃO 3D NA GALERIA
  document.querySelectorAll('.galeria img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = img.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      img.style.transform = `perspective(1000px) scale(0.98) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`;
    });

    img.addEventListener('mouseleave', () => {
      img.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
    });
  });
});

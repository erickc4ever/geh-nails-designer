/* GEH NAILS - APP.JS */

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const typingElement = document.querySelector(".typing");
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");

  // 1. EFEITO DE DIGITAÇÃO
  const text = "Especialista em alongamento de fibra";
  let index = 0;

  const typeEffect = () => {
    if (index < text.length) {
      typingElement.textContent += text.charAt(index++);
      setTimeout(typeEffect, Math.random() * (100 - 50) + 50);
    }
  };

  // 2. VÍDEO E GATILHO INICIAL
  if (video) {
    video.play().catch(() => console.log("Play aguardando interação"));
    video.addEventListener("ended", () => {
      if (typingElement) setTimeout(typeEffect, 500);
    });
  }

  // 3. CURSOR MAGNÉTICO (DESKTOP)
  if (window.innerWidth > 768 && dot && outline) {
    window.addEventListener("mousemove", (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      
      outline.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 400, fill: "forwards" });
    });

    document.querySelectorAll('a, .galeria img').forEach(el => {
      el.addEventListener('mouseenter', () => outline.style.transform = 'scale(1.5)');
      el.addEventListener('mouseleave', () => outline.style.transform = 'scale(1)');
    });
  }

  // 4. SCROLL PROGRESS E PARALAXE
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollY / pageHeight) * 100;

    document.documentElement.style.setProperty('--scroll-width', `${progress}%`);

    if (video && scrollY < window.innerHeight) {
      video.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  // 5. REVELAÇÃO DE ELEMENTOS (SCROLL REVEAL)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .galeria img').forEach(el => revealObserver.observe(el));
});

/* GEH NAILS - APP.JS 
   VERSÃO: REVELAÇÃO EM CASCATA & RITMO ORGÂNICO
*/

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const typingElement = document.querySelector(".typing");
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");

  // 1. EFEITO DE DIGITAÇÃO (RITMO HUMANO)
  const text = "Especialista em alongamento de fibra";
  let index = 0;

  const typeEffect = () => {
    if (index < text.length) {
      typingElement.textContent += text.charAt(index++);
      setTimeout(typeEffect, Math.random() * (100 - 50) + 50);
    }
  };

  // 2. GESTÃO DE MÍDIA
  if (video) {
    video.play().catch(() => console.log("Play aguardando interação"));
    video.addEventListener("ended", () => {
      if (typingElement) {
        typingElement.textContent = "";
        setTimeout(typeEffect, 500);
      }
    });
  }

  // 3. CURSOR MAGNÉTICO (DESKTOP)
  if (window.innerWidth > 768 && dot && outline) {
    window.addEventListener("mousemove", (e) => {
      const { clientX: x, clientY: y } = e;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      outline.animate({ left: `${x}px`, top: `${y}px` }, { duration: 400, fill: "forwards" });
    });

    document.querySelectorAll('a, .galeria img, .glass-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        outline.style.backgroundColor = 'rgba(155, 126, 189, 0.1)'; // Usando Accent Purple
      });
      el.addEventListener('mouseleave', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.backgroundColor = 'transparent';
      });
    });
  }

  // 4. MODO DE SCROLL (PROGRESSO E PARALAXE)
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollY / pageHeight) * 100;

    document.documentElement.style.setProperty('--scroll-width', `${progress}%`);

    if (video && scrollY < window.innerHeight) {
      video.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  // 5. SISTEMA DE REVELAÇÃO EM CASCATA (STAGGERED FADE-IN)
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        // Verifica se o elemento é parte de um grupo (Galeria ou Tabela)
        const isGalleryImg = target.tagName === 'IMG' && target.closest('.galeria');
        const isServiceItem = target.classList.contains('servico-item');

        if (isGalleryImg || isServiceItem) {
          // Captura todos os itens do mesmo grupo
          const parent = isGalleryImg ? target.closest('.galeria') : target.closest('.servicos-container');
          const siblings = Array.from(parent.querySelectorAll(isGalleryImg ? 'img' : '.servico-item'));
          const indexInGroup = siblings.indexOf(target);

          // Aplica um atraso baseado na posição (cascata)
          setTimeout(() => {
            target.classList.add('visible');
          }, indexInGroup * 150); // 150ms entre cada item
        } else {
          // Revelação padrão para itens únicos
          setTimeout(() => {
            target.classList.add('visible');
          }, 100);
        }
        
        revealObserver.unobserve(target);
      }
    });
  }, revealOptions);

  // Seleciona alvos e itens internos da tabela para a cascata
  const targets = document.querySelectorAll('.reveal, .galeria img, .servicos-container, .servico-item, .footer-simple');
  targets.forEach(el => revealObserver.observe(el));
});

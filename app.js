/* GEH NAILS - APP.JS 
   VERSÃO: CONTROLE DE FLUXO, INTERAÇÃO E REVELAÇÃO DINÂMICA
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

  // 2. GESTÃO DE MÍDIA E GATILHOS
  if (video) {
    video.play().catch(() => {
      // Autoplay bloqueado pelo navegador até interação
      console.log("Play aguardando interação do usuário");
    });
    
    video.addEventListener("ended", () => {
      if (typingElement) {
        typingElement.textContent = ""; // Limpa antes de iniciar
        setTimeout(typeEffect, 500);
      }
    });
  }

  // 3. CURSOR MAGNÉTICO (EXPERIÊNCIA PREMIUM DESKTOP)
  if (window.innerWidth > 768 && dot && outline) {
    window.addEventListener("mousemove", (e) => {
      const { clientX: x, clientY: y } = e;

      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      
      outline.animate({
        left: `${x}px`,
        top: `${y}px`
      }, { duration: 400, fill: "forwards" });
    });

    // Feedback visual em elementos clicáveis
    document.querySelectorAll('a, .galeria img, .glass-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        outline.style.backgroundColor = 'rgba(162, 148, 249, 0.1)';
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

    // Atualiza barra de progresso no CSS
    document.documentElement.style.setProperty('--scroll-width', `${progress}%`);

    // Paralaxe suave no vídeo Hero
    if (video && scrollY < window.innerHeight) {
      video.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  // 5. SISTEMA DE REVELAÇÃO (INTERSECTION OBSERVER)
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Delay aleatório para parecer um carregamento orgânico/líquido
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Seleciona todos os elementos que devem "nascer" ao scroll
  const targets = document.querySelectorAll('.reveal, .galeria img, .servicos-container, .footer-simple');
  targets.forEach(el => revealObserver.observe(el));
});

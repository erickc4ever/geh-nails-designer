/* GEH NAILS - APP.JS 
   VERSÃO: REVELAÇÃO EM CASCATA & RITMO ORGÂNICO - CORRIGIDO
*/

document.addEventListener("DOMContentLoaded", () => {
  // 1. INICIALIZAÇÃO
  const video = document.getElementById("heroVideo");
  const typingElement = document.querySelector(".typing");
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  
  // Flag para controlar digitação
  let typingStarted = false;

  // 2. EFEITO DE DIGITAÇÃO (RITMO HUMANO)
  const typeEffect = () => {
    const text = "Especialista em alongamento de fibra";
    let index = 0;
    typingElement.textContent = "";
    
    const typeNextChar = () => {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index++);
        setTimeout(typeNextChar, Math.random() * (100 - 50) + 50);
      }
    };
    
    typeNextChar();
  };

  // 3. GESTÃO DE MÍDIA E INÍCIO DA DIGITAÇÃO
  const startTyping = () => {
    if (!typingStarted && typingElement) {
      typingStarted = true;
      typeEffect();
    }
  };

  if (video) {
    video.play().catch(() => {
      console.log("Play aguardando interação - iniciando digitação");
      startTyping();
    });
    
    video.addEventListener("ended", () => {
      startTyping();
    });
    
    // Iniciar digitação se o vídeo já estiver pronto
    if (video.readyState >= 3) {
      setTimeout(startTyping, 1000);
    }
  } else {
    // Se não houver vídeo, iniciar digitação imediatamente
    setTimeout(startTyping, 1500);
  }

  // 4. CURSOR MAGNÉTICO (DESKTOP)
  if (dot && outline) {
    const isDesktop = window.innerWidth > 768;
    
    if (isDesktop) {
      window.addEventListener("mousemove", (e) => {
        const { clientX: x, clientY: y } = e;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        outline.animate(
          { left: `${x}px`, top: `${y}px` }, 
          { duration: 400, fill: "forwards" }
        );
      });

      // Elementos interativos
      const interactiveElements = document.querySelectorAll('a, .galeria img, .glass-btn, button, .servico-item');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
          outline.style.backgroundColor = 'rgba(155, 126, 189, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
          outline.style.transform = 'translate(-50%, -50%) scale(1)';
          outline.style.backgroundColor = 'transparent';
        });
      });
    } else {
      // Em mobile, esconder elementos do cursor
      dot.style.display = 'none';
      outline.style.display = 'none';
    }
  }

  // 5. SCROLL & PARALLAX
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(100, (scrollY / pageHeight) * 100);
    
    // Barra de progresso
    document.documentElement.style.setProperty('--scroll-width', `${progress}%`);
    
    // Parallax no vídeo (apenas na seção hero)
    if (video && scrollY < window.innerHeight) {
      const parallaxAmount = scrollY * 0.3;
      video.style.transform = `translateY(${parallaxAmount}px)`;
    }
  });

  // 6. SISTEMA DE REVELAÇÃO EM CASCATA OTIMIZADO
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        // Delay baseado no tipo de elemento
        let delay = 0;
        
        if (target.classList.contains('servico-item')) {
          // Para itens da tabela, usar posição na lista
          const serviceItems = Array.from(
            document.querySelectorAll('.servicos-container .servico-item')
          );
          const index = serviceItems.indexOf(target);
          delay = index * 100; // 100ms entre cada item
        } 
        else if (target.tagName === 'IMG' && target.closest('.galeria')) {
          // Para imagens da galeria
          const galleryImages = Array.from(
            document.querySelectorAll('.galeria img')
          );
          const index = galleryImages.indexOf(target);
          delay = index * 150; // 150ms entre cada imagem
        }
        
        // Aplicar revelação com delay
        setTimeout(() => {
          target.classList.add('visible');
        }, delay);
        
        // Parar de observar após revelar
        revealObserver.unobserve(target);
      }
    });
  }, revealOptions);

  // 7. OBSERVAR ELEMENTOS (SEM DUPLICAÇÃO)
  // Observar apenas os elementos "folha", não os containers
  const revealTargets = document.querySelectorAll(
    '.reveal:not(.servicos-container):not(.galeria), ' +
    '.galeria img, ' +
    '.servico-item, ' +
    '.footer-simple > *' // Observar filhos diretos do footer, não o container
  );
  
  revealTargets.forEach(el => {
    // Verificar se elemento já está visível inicialmente
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // 8. DISPARAR EVENTO DE SCROLL INICIAL
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
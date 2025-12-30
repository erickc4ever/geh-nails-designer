/* GEH NAILS - APP.JS 
   VERSÃO: CONGELAMENTO DO FRAME FINAL
*/

document.addEventListener("DOMContentLoaded", () => {
  // 1. INICIALIZAÇÃO
  const video = document.getElementById("heroVideo");
  const typingElement = document.querySelector(".typing");
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  
  // Flag para controlar digitação
  let typingStarted = false;
  
  // Flag para controlar se vídeo já terminou
  let videoEnded = false;

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

  // 3. GESTÃO DO VÍDEO - CONGELAMENTO NO FRAME FINAL
  const handleVideoEnd = () => {
    if (video && !videoEnded) {
      videoEnded = true;
      
      // 1. Pausa o vídeo
      video.pause();
      
      // 2. Vai para o frame final (último segundo)
      // Se o vídeo tem 3s, vai para 2.9s para pegar o frame da logo
      video.currentTime = Math.max(0, video.duration - 0.1);
      
      // 3. Desabilita completamente os controles
      video.controls = false;
      video.removeAttribute('autoplay');
      
      // 4. Inicia a digitação
      startTyping();
      
      console.log("Vídeo congelado no frame final com logo");
    }
  };

  // 4. INÍCIO DA DIGITAÇÃO
  const startTyping = () => {
    if (!typingStarted && typingElement) {
      typingStarted = true;
      typeEffect();
    }
  };

  // 5. CONFIGURAÇÃO DO VÍDEO
  if (video) {
    // Remove autoplay se já tiver terminado em sessão anterior
    if (sessionStorage.getItem('videoEnded')) {
      video.removeAttribute('autoplay');
      video.currentTime = video.duration - 0.1; // Vai direto para o frame final
      video.pause();
      startTyping();
      videoEnded = true;
    } else {
      // Primeira vez - toca o vídeo
      video.play().catch((error) => {
        console.log("Aguardando interação ou erro no play:", error);
        // Se não conseguir tocar, inicia digitação
        startTyping();
      });
    }
    
    // Monitora o tempo do vídeo
    video.addEventListener('timeupdate', () => {
      // Se estiver nos últimos 0.5 segundos, prepara para congelar
      if (video.currentTime >= video.duration - 0.5 && !videoEnded) {
        handleVideoEnd();
        sessionStorage.setItem('videoEnded', 'true');
      }
    });
    
    // Backup: se o evento 'ended' não disparar
    video.addEventListener('ended', handleVideoEnd);
    
    // Backup de segurança: inicia digitação após 4 segundos
    setTimeout(() => {
      if (!typingStarted) {
        startTyping();
      }
    }, 4000);
    
  } else {
    // Se não houver vídeo, inicia digitação
    setTimeout(startTyping, 1000);
  }

  // 6. CURSOR MAGNÉTICO (DESKTOP) - MANTIDO
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
      dot.style.display = 'none';
      outline.style.display = 'none';
    }
  }

  // 7. SCROLL & PARALLAX - MANTIDO
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(100, (scrollY / pageHeight) * 100);
    
    document.documentElement.style.setProperty('--scroll-width', `${progress}%`);
    
    if (video && scrollY < window.innerHeight) {
      const parallaxAmount = scrollY * 0.3;
      video.style.transform = `translateY(${parallaxAmount}px)`;
    }
  });

  // 8. SISTEMA DE REVELAÇÃO EM CASCATA - MANTIDO
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        let delay = 0;
        
        if (target.classList.contains('servico-item')) {
          const serviceItems = Array.from(
            document.querySelectorAll('.servicos-container .servico-item')
          );
          const index = serviceItems.indexOf(target);
          delay = index * 100;
        } 
        else if (target.tagName === 'IMG' && target.closest('.galeria')) {
          const galleryImages = Array.from(
            document.querySelectorAll('.galeria img')
          );
          const index = galleryImages.indexOf(target);
          delay = index * 150;
        }
        
        setTimeout(() => {
          target.classList.add('visible');
        }, delay);
        
        revealObserver.unobserve(target);
      }
    });
  }, revealOptions);

  const revealTargets = document.querySelectorAll(
    '.reveal:not(.servicos-container):not(.galeria), ' +
    '.galeria img, ' +
    '.servico-item, ' +
    '.footer-simple > *'
  );
  
  revealTargets.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // 9. DISPARAR EVENTO DE SCROLL INICIAL
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});

// 10. LIMPA SESSION STORAGE QUANDO O USUÁRIO SAIR COMPLETAMENTE
window.addEventListener('beforeunload', () => {
  // Não limpa o sessionStorage - mantém o estado "vídeo terminado"
  // Isso faz com que ao voltar na página, o vídeo já esteja congelado
});

// 11. RESETA APÓS 1 HORA (opcional)
setTimeout(() => {
  sessionStorage.removeItem('videoEnded');
}, 3600000); // 1 hora em milissegundos
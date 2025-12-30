/* GEH NAILS - APP.JS 
   VERSÃO: CONGELAMENTO DO FRAME FINAL - OTIMIZADO
*/

// Variáveis globais para otimização de performance
let typingTimeout = null;
let scrollTimeout = null;
let mouseMoveHandler = null;

document.addEventListener("DOMContentLoaded", () => {
  // 1. INICIALIZAÇÃO OTIMIZADA
  const video = document.getElementById("heroVideo");
  const typingElement = document.querySelector(".typing");
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  
  // Flag para controlar digitação
  let typingStarted = false;
  
  // Flag para controlar se vídeo já terminou
  let videoEnded = false;

  // 2. EFEITO DE DIGITAÇÃO (RITMO HUMANO) - OTIMIZADO
  const typeEffect = () => {
    if (!typingElement) return;
    
    const text = "Especialista em alongamento de fibra";
    let index = 0;
    typingElement.textContent = "";
    
    const typeNextChar = () => {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index++);
        // Otimizado: usar requestAnimationFrame para melhor performance
        typingTimeout = setTimeout(typeNextChar, Math.random() * (100 - 50) + 50);
      }
    };
    
    typeNextChar();
  };

  // 3. GESTÃO DO VÍDEO - CONGELAMENTO NO FRAME FINAL (OTIMIZADO)
  const handleVideoEnd = () => {
    if (video && !videoEnded) {
      videoEnded = true;
      
      // Usar requestAnimationFrame para sincronização visual
      requestAnimationFrame(() => {
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
      });
    }
  };

  // 4. INÍCIO DA DIGITAÇÃO (OTIMIZADO)
  const startTyping = () => {
    if (!typingStarted && typingElement) {
      typingStarted = true;
      // Delay mínimo para garantir que o vídeo está congelado
      setTimeout(typeEffect, 300);
    }
  };

  // 5. CONFIGURAÇÃO DO VÍDEO (OTIMIZADO)
  const initVideo = () => {
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
      
      // Monitora o tempo do vídeo - OTIMIZADO: throttle no timeupdate
      let lastTimeUpdate = 0;
      const videoTimeUpdateHandler = () => {
        const now = Date.now();
        // Throttle para melhor performance (executa no máximo a cada 100ms)
        if (now - lastTimeUpdate > 100) {
          lastTimeUpdate = now;
          // Se estiver nos últimos 0.5 segundos, prepara para congelar
          if (video.currentTime >= video.duration - 0.5 && !videoEnded) {
            handleVideoEnd();
            sessionStorage.setItem('videoEnded', 'true');
          }
        }
      };
      
      video.addEventListener('timeupdate', videoTimeUpdateHandler);
      
      // Backup: se o evento 'ended' não disparar
      video.addEventListener('ended', handleVideoEnd);
      
      // Backup de segurança: inicia digitação após 3 segundos (reduzido de 4s)
      setTimeout(() => {
        if (!typingStarted) {
          startTyping();
        }
      }, 3000);
      
    } else {
      // Se não houver vídeo, inicia digitação
      setTimeout(startTyping, 800);
    }
  };

  // Inicializar vídeo
  initVideo();

  // 6. CURSOR MAGNÉTICO (DESKTOP) - MANTIDO E OTIMIZADO
  const initCursor = () => {
    if (dot && outline) {
      const isDesktop = window.innerWidth > 768;
      
      if (isDesktop) {
        // Otimizado: usar requestAnimationFrame para cursor suave
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        
        mouseMoveHandler = (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };
        
        window.addEventListener("mousemove", mouseMoveHandler);
        
        // Animação suave do cursor usando requestAnimationFrame
        const animateCursor = () => {
          // Atualiza dot instantaneamente
          dot.style.left = `${mouseX}px`;
          dot.style.top = `${mouseY}px`;
          
          // Suaviza o outline com lerp
          outlineX += (mouseX - outlineX) * 0.2;
          outlineY += (mouseY - outlineY) * 0.2;
          
          outline.style.left = `${outlineX}px`;
          outline.style.top = `${outlineY}px`;
          
          requestAnimationFrame(animateCursor);
        };
        
        animateCursor();

        // Atualizado para incluir os novos elementos da tabela premium
        const interactiveElements = document.querySelectorAll('a, .galeria img, .glass-btn, button, .servico-item, .luxury-item, .servico-header, .gradient-text');
        
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
  };

  initCursor();

  // 7. SCROLL & PARALLAX - MANTIDO E OTIMIZADO
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(100, (scrollY / pageHeight) * 100);
    
    document.documentElement.style.setProperty('--scroll-width', `${progress}%`);
    
    if (video && scrollY < window.innerHeight) {
      const parallaxAmount = scrollY * 0.3;
      // Usar transform3d para GPU acceleration
      video.style.transform = `translate3d(0, ${parallaxAmount}px, 0)`;
    }
  };

  // Throttle no scroll para performance
  const throttledScroll = () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 16); // ~60fps
    }
  };

  window.addEventListener("scroll", throttledScroll);

  // 8. SISTEMA DE REVELAÇÃO EM CASCATA - CORRIGIDO E OTIMIZADO
  const initRevealSystem = () => {
    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px" // Reduzido de -50px para melhor performance
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          let delay = 0;
          
          // Para itens da nova tabela premium (.luxury-item)
          if (target.classList.contains('luxury-item')) {
            const serviceItems = Array.from(
              document.querySelectorAll('.servicos-container .luxury-item')
            );
            const index = serviceItems.indexOf(target);
            delay = index * 100; // 100ms entre cada item
          } 
          // Para imagens da galeria - APENAS se ainda não tiver classe visible
          else if (target.tagName === 'IMG' && target.closest('.galeria') && !target.classList.contains('visible')) {
            const galleryImages = Array.from(
              document.querySelectorAll('.galeria img:not(.visible)')
            );
            const index = galleryImages.indexOf(target);
            delay = index * 150; // 150ms entre cada imagem
          }
          // Para outros elementos reveal - APENAS parágrafos e títulos
          else if (target.classList.contains('reveal') && 
                  (target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2')) {
            delay = Math.random() * 200; // Delay aleatório reduzido
          }
          
          // Aplicar revelação com delay usando requestAnimationFrame
          setTimeout(() => {
            requestAnimationFrame(() => {
              target.classList.add('visible');
            });
          }, delay);
          
          // Parar de observar após revelar
          revealObserver.unobserve(target);
        }
      });
    }, revealOptions);

    // 9. OBSERVAR ELEMENTOS - CORRIGIDO
    // AGORA: Observar apenas elementos que precisam de animação
    const revealTargets = document.querySelectorAll(
      '.reveal:not(.servico-item):not(.luxury-item), ' + // Remove duplicatas
      '.galeria img, ' +
      '.luxury-item'
    );
    
    // Verificar visibilidade inicial com IntersectionObserver
    revealTargets.forEach(el => {
      // Não adicionar .visible inicialmente - deixar para o IntersectionObserver
      revealObserver.observe(el);
    });

    // Revelar elementos já visíveis na inicialização
    setTimeout(() => {
      revealTargets.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= -100;
        
        if (isInViewport && !el.classList.contains('visible')) {
          el.classList.add('visible');
          revealObserver.unobserve(el);
        }
      });
    }, 500); // Delay para garantir que o DOM está pronto
  };

  initRevealSystem();

  // 10. DISPARAR EVENTO DE SCROLL INICIAL
  setTimeout(() => {
    handleScroll(); // Chamar diretamente ao invés de dispatchEvent
  }, 150);

  // 11. LIMPEZA DE EVENTOS PARA PERFORMANCE
  window.addEventListener('beforeunload', () => {
    // Limpar timeouts
    if (typingTimeout) clearTimeout(typingTimeout);
    if (scrollTimeout) clearTimeout(scrollTimeout);
    
    // Remover event listeners
    if (mouseMoveHandler) {
      window.removeEventListener('mousemove', mouseMoveHandler);
    }
    
    window.removeEventListener('scroll', throttledScroll);
    
    // Manter sessionStorage para vídeo congelado
    // Não limpar aqui - mantém a experiência do usuário
  });
});

// 12. RESETA APÓS 30 MINUTOS (reduzido de 1 hora)
setTimeout(() => {
  sessionStorage.removeItem('videoEnded');
}, 1800000); // 30 minutos em milissegundos

// 13. FUNÇÃO DE DEBUG PARA DESENVOLVIMENTO
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.debugGEH = {
    resetVideo: () => {
      sessionStorage.removeItem('videoEnded');
      location.reload();
    },
    showAllTexts: () => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.luxury-item').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.galeria img').forEach(el => el.classList.add('visible'));
    }
  };
  console.log('GEH Debug: window.debugGEH disponível');
}
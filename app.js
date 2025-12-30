/* GEH NAILS - APP.JS 
   VERSÃO: CONGELAMENTO DO FRAME FINAL - CORRIGIDO
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
  
  // Flag para saber se é primeira visita nesta página
  let isFirstVisit = !sessionStorage.getItem('videoEnded');

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

  // 3. GESTÃO DO VÍDEO - CONGELAMENTO NO FRAME FINAL (CORRIGIDO)
  const handleVideoEnd = () => {
    if (video && !videoEnded) {
      videoEnded = true;
      
      // Usar requestAnimationFrame para sincronização visual
      requestAnimationFrame(() => {
        // 1. Vai para 0.2 segundos antes do final (frame da logo)
        video.currentTime = Math.max(0, video.duration - 0.2);
        
        // 2. Pausa o vídeo
        video.pause();
        
        // 3. Desabilita completamente os controles
        video.controls = false;
        video.removeAttribute('autoplay');
        
        // 4. Remove o atributo loop (não precisa mais)
        video.removeAttribute('loop');
        
        // 5. Inicia a digitação
        startTyping();
        
        console.log("Vídeo congelado 0.2s antes do final (frame da logo)");
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

  // 5. CONFIGURAÇÃO DO VÍDEO (CORRIGIDA)
  const initVideo = () => {
    if (video) {
      console.log("Inicializando vídeo...");
      console.log("Primeira visita?", isFirstVisit);
      console.log("Duração do vídeo:", video.duration);
      
      // Se NÃO for primeira visita (já viu o vídeo antes)
      if (!isFirstVisit) {
        console.log("Já viu vídeo antes - mostrando frame final");
        // Apenas prepara o vídeo no frame final
        video.removeAttribute('autoplay');
        video.removeAttribute('loop');
        video.controls = false;
        
        // Aguarda metadados para saber a duração
        if (video.duration && video.duration > 0) {
          video.currentTime = video.duration - 0.2; // 0.2s antes do final
          video.pause();
        } else {
          // Se não tem duração ainda, espera loadedmetadata
          video.addEventListener('loadedmetadata', () => {
            video.currentTime = video.duration - 0.2;
            video.pause();
          }, { once: true });
        }
        
        startTyping();
        videoEnded = true;
        
      } else {
        // PRIMEIRA VISITA - toca o vídeo completo
        console.log("Primeira visita - tocando vídeo completo");
        
        // Remove loop do HTML para tocar apenas uma vez
        video.removeAttribute('loop');
        
        // Tenta tocar o vídeo
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("Vídeo começou a tocar");
            // Monitora o tempo do vídeo para congelar 0.2s antes do final
            const videoTimeUpdateHandler = () => {
              // Se estiver nos últimos 0.2 segundos, congela
              if (video.currentTime >= video.duration - 0.2 && !videoEnded) {
                console.log("Congelando vídeo nos últimos 0.2s");
                handleVideoEnd();
                sessionStorage.setItem('videoEnded', 'true');
                video.removeEventListener('timeupdate', videoTimeUpdateHandler);
              }
            };
            
            video.addEventListener('timeupdate', videoTimeUpdateHandler);
            
          }).catch((error) => {
            console.log("Erro ao tocar vídeo:", error);
            // Se não conseguir tocar, inicia digitação
            startTyping();
          });
        }
        
        // Backup: se o evento 'ended' não disparar
        video.addEventListener('ended', () => {
          console.log("Evento 'ended' disparado");
          if (!videoEnded) {
            handleVideoEnd();
            sessionStorage.setItem('videoEnded', 'true');
          }
        }, { once: true });
      }
      
      // Backup de segurança: inicia digitação após 4 segundos
      setTimeout(() => {
        if (!typingStarted) {
          console.log("Backup: iniciando digitação após timeout");
          startTyping();
        }
      }, 4000);
      
    } else {
      // Se não houver vídeo, inicia digitação
      console.log("Nenhum vídeo encontrado, iniciando digitação");
      setTimeout(startTyping, 800);
    }
  };

  // Inicializar vídeo (com pequeno delay para garantir DOM carregado)
  setTimeout(initVideo, 100);

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

// 12. RESETA APÓS 5 MINUTOS (reduzido de 30 minutos para testes)
setTimeout(() => {
  sessionStorage.removeItem('videoEnded');
  console.log("SessionStorage resetado após 5 minutos");
}, 300000); // 5 minutos em milissegundos

// 13. FUNÇÃO DE DEBUG PARA DESENVOLVIMENTO
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.debugGEH = {
    resetVideo: () => {
      sessionStorage.removeItem('videoEnded');
      console.log("Resetando vídeo... recarregando página");
      location.reload();
    },
    showAllTexts: () => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.luxury-item').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.galeria img').forEach(el => el.classList.add('visible'));
      console.log("Todos textos revelados");
    },
    getVideoStatus: () => {
      const video = document.getElementById("heroVideo");
      return {
        duration: video?.duration,
        currentTime: video?.currentTime,
        paused: video?.paused,
        ended: video?.ended,
        sessionStorage: sessionStorage.getItem('videoEnded')
      };
    }
  };
  console.log('GEH Debug: window.debugGEH disponível');
  console.log('Comandos disponíveis:');
  console.log('- debugGEH.resetVideo() - Reseta e recarrega');
  console.log('- debugGEH.showAllTexts() - Mostra todos textos');
  console.log('- debugGEH.getVideoStatus() - Status do vídeo');
}
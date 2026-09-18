 (function () {
      'use strict';

      // 1. SPOTLIGHT REVEAL
      const revealImg = document.getElementById('reveal-img');
      
      function updateSpotlight(e) {
        if (!revealImg) return;
        const rect = revealImg.getBoundingClientRect();
        
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        let r = 260;
        if (window.innerWidth < 480) {
          r = 120;
        } else if (window.innerWidth < 720) {
          r = 160;
        }

        const maskGradient = `radial-gradient(circle ${r}px at ${x}px ${y}px, #fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)`;
        
        revealImg.style.webkitMaskImage = maskGradient;
        revealImg.style.maskImage = maskGradient;
      }

      window.addEventListener('mousemove', updateSpotlight);
      window.addEventListener('touchmove', updateSpotlight, { passive: true });


      // 2. WORD SPLIT
      const pullUpElements = document.querySelectorAll('.words-pull-up');
      
      pullUpElements.forEach((el) => {
        if (el.dataset.split) return;
        el.dataset.split = 'true';

        let globalWordIdx = 0;

        // Check if H1 contains direct child spans
        const directSpans = el.querySelectorAll(':scope > span');
        if (el.tagName === 'H1' && directSpans.length > 0) {
          directSpans.forEach((span) => {
            span.classList.add('pull-line');
            const text = span.textContent.trim();
            const words = text.split(/\s+/);
            span.innerHTML = '';
            
            words.forEach((word) => {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'pull-word';
              wordSpan.textContent = word;
              wordSpan.style.animationDelay = `${globalWordIdx * 0.1}s`;
              span.appendChild(wordSpan);
              globalWordIdx++;
            });
          });
        } else {
          const text = el.textContent.trim();
          const words = text.split(/\s+/);
          el.innerHTML = '';
          
          words.forEach((word) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'pull-word';
            wordSpan.textContent = word;
            wordSpan.style.animationDelay = `${globalWordIdx * 0.1}s`;
            el.appendChild(wordSpan);
            globalWordIdx++;
          });
        }
      });


      // 3. SCROLL REVEAL (Intersection Observer)
      if ('IntersectionObserver' in window) {
        // Observer for words-pull-up
        const wordsObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('words-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 });

        pullUpElements.forEach((el) => wordsObserver.observe(el));

        // Observer for fade-up-reveal
        const fadeUpElements = document.querySelectorAll('.fade-up-reveal');
        const fadeObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = entry.target.getAttribute('data-delay');
              if (delay) {
                entry.target.style.animationDelay = `${delay}s`;
              }
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });

        fadeUpElements.forEach((el) => fadeObserver.observe(el));

      } else {
        // Fallback for browsers without IntersectionObserver support
        pullUpElements.forEach((el) => el.classList.add('words-visible'));
        document.querySelectorAll('.fade-up-reveal').forEach((el) => {
          const delay = el.getAttribute('data-delay');
          if (delay) el.style.animationDelay = `${delay}s`;
          el.classList.add('is-visible');
        });
      }
    })();

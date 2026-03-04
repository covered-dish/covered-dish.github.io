/* ============================================================
   Covered Dish — App Logic
   Search, filter, quiz interactivity, scroll effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === Nav scroll effect ===
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // === Back to top ===
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === Fade-in on scroll ===
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => observer.observe(el));
  }

  // === Search ===
  const searchInput = document.getElementById('searchInput');
  const topicsGrid = document.getElementById('topicsGrid');
  if (searchInput && topicsGrid) {
    const cards = topicsGrid.querySelectorAll('.topic-card');
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      cards.forEach(card => {
        const searchText = (card.dataset.search || '') + ' ' + (card.textContent || '');
        card.style.display = searchText.toLowerCase().includes(q) ? '' : 'none';
      });
      // Clear active filter when searching
      document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      document.querySelector('.filter-tag[data-filter="all"]')?.classList.add('active');
    });
  }

  // === Filter Tags ===
  const filterTags = document.querySelectorAll('.filter-tag');
  if (filterTags.length > 0 && topicsGrid) {
    const cards = topicsGrid.querySelectorAll('.topic-card');
    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        const filter = tag.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            const tags = (card.dataset.tags || '').split(',');
            card.style.display = tags.includes(filter) ? '' : 'none';
          }
        });
        // Clear search
        if (searchInput) searchInput.value = '';
      });
    });
  }

  // === Interactive Quiz ===
  initQuiz();

  // === Flashcards ===
  initFlashcards();
});

function initQuiz() {
  const quizContainer = document.getElementById('quizContainer');
  if (!quizContainer) return;

  const questions = JSON.parse(quizContainer.dataset.questions || '[]');
  if (questions.length === 0) return;

  let answered = 0;
  let correct = 0;

  questions.forEach((q, qi) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question fade-in';
    qDiv.innerHTML = `
      <div class="quiz-question-number">Question ${qi + 1} of ${questions.length}</div>
      <div class="quiz-question-text">${q.question}</div>
      <div class="quiz-options" id="quiz-opts-${qi}">
        ${q.options.map((opt, oi) => `
          <div class="quiz-option" data-qi="${qi}" data-oi="${oi}" data-correct="${oi === q.correct_index}">
            <span class="quiz-option-letter">${String.fromCharCode(65 + oi)}</span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-fb-${qi}"></div>
    `;
    quizContainer.appendChild(qDiv);
  });

  // Score display
  const scoreDiv = document.createElement('div');
  scoreDiv.className = 'quiz-score';
  scoreDiv.id = 'quizScore';
  scoreDiv.innerHTML = `
    <div class="quiz-score-number" id="quizScoreNum">0/${questions.length}</div>
    <div class="quiz-score-label">Final Score</div>
  `;
  quizContainer.appendChild(scoreDiv);

  // Click handlers
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', function () {
      const qi = parseInt(this.dataset.qi);
      const optContainer = document.getElementById(`quiz-opts-${qi}`);
      if (optContainer.dataset.answered) return;
      optContainer.dataset.answered = 'true';
      answered++;

      const isCorrect = this.dataset.correct === 'true';
      if (isCorrect) correct++;

      // Mark all options
      optContainer.querySelectorAll('.quiz-option').forEach(o => {
        if (o.dataset.correct === 'true') {
          o.classList.add('correct');
        } else if (o === this && !isCorrect) {
          o.classList.add('incorrect');
        }
        o.style.cursor = 'default';
      });

      // Show feedback
      const fb = document.getElementById(`quiz-fb-${qi}`);
      fb.className = `quiz-feedback show ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`;
      fb.textContent = isCorrect ? '✓ Correct!' : `✗ The correct answer is ${String.fromCharCode(65 + questions[qi].correct_index)}.`;

      // Check if all answered
      if (answered === questions.length) {
        const scoreEl = document.getElementById('quizScore');
        document.getElementById('quizScoreNum').textContent = `${correct}/${questions.length}`;
        scoreEl.classList.add('show');
        scoreEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Animate quiz questions
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.quiz-question.fade-in').forEach(el => observer.observe(el));
}

function initFlashcards() {
  document.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

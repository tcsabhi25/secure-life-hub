  const navibar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navibar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // HAMBURGER
  const hamburgerMenu = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mobileMenu');
  hamburgerMenu.addEventListener('click', () => {
    mobMenu.style.display = mobMenu.style.display === 'flex' ? 'none' : 'flex';
  });
  mobMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { mobMenu.style.display = 'none'; });
  });

  // SCROLL REVEAL
  const revealEl = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const interObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        interObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEl.forEach(el => interObs.observe(el));

  // COUNTERS
  let count = false;
  const counterEl = document.querySelectorAll('.counter-num[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !count) {
      count = true;
      counterEl.forEach(el => {
        const target = +el.dataset.target;
        const suffix = target === 5000 ? '+' : target === 98 ? '%' : target === 7 ? '×' : '+';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
      });
    }
  }, { threshold: 0.5 });
  counterObs.observe(document.querySelector('.counters'));

  // MODAL
  function openModal() {
    document.getElementById('callbackModal').classList.add('open');
    document.body.classList.add('modal-open');
  }
  function closeModal() {
    document.getElementById('callbackModal').classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  document.getElementById('callbackModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  const reviewStorageKey = 'secureLifeReviews';
  const reviewFeaturedCount = 3;
  const reviewEditableWindowMs = 60000;
  let reviewExpanded = false;
  let currentEditingReviewId = null;

  const defaultReviews = [
    {
      id: 'review-1',
      name: 'Rajesh Kumar',
      role: 'Business Owner, Thrissur',
      rating: 5,
      message: 'Manikandan sir has been our family\'s insurance Consultant for over 15 years. When we needed to make a claim after my father\'s hospitalisation, he personally helped us through every step. The settlement was smooth and fast. We trust Secure Life Hub completely.',
      date: '20 May 2026',
      dateTime: '20 May 2026, 10:00 AM',
      timestamp: new Date('2026-05-20T10:00:00').getTime(),
      ownerToken: '',
      editableUntil: 0,
      editable: false
    },
    {
      id: 'review-2',
      name: 'Priya Nair',
      role: 'Teacher, Thiruvillwamala',
      rating: 5,
      message: 'I was confused about which health insurance plan to choose for my family. Manikandan sir explained everything clearly, understood our needs, and suggested the perfect Star Health plan. His guidance felt like talking to a trusted family elder.',
      date: '14 May 2026',
      dateTime: '14 May 2026, 11:30 AM',
      timestamp: new Date('2026-05-14T11:30:00').getTime(),
      ownerToken: '',
      editableUntil: 0,
      editable: false
    },
    {
      id: 'review-3',
      name: 'Suresh Menon',
      role: 'Engineer, Thrissur District',
      rating: 5,
      message: 'Secure Life Hub has protected my family for over a decade. When I lost my job temporarily, Manikandan sir helped me understand my policy benefits and ensured I was fully covered during a difficult time.',
      date: '08 May 2026',
      dateTime: '08 May 2026, 09:15 AM',
      timestamp: new Date('2026-05-08T09:15:00').getTime(),
      ownerToken: '',
      editableUntil: 0,
      editable: false
    }
  ];

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, (char) => map[char]);
  }

  function getCurrentOwnerToken() {
    let token = localStorage.getItem('secureLifeReviewOwnerToken');
    if (!token) {
      token = `owner-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      localStorage.setItem('secureLifeReviewOwnerToken', token);
    }
    return token;
  }

  function getStoredReviews() {
    try {
      const raw = JSON.parse(localStorage.getItem(reviewStorageKey) || 'null');
      if (!Array.isArray(raw)) return [];
      return raw.map((review, index) => normalizeReview(review, index));
    } catch (error) {
      return [];
    }
  }

  function saveStoredReviews(reviews) {
    try {
      localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
    } catch (error) {
      console.warn('Unable to save review', error);
    }
  }

  function normalizeReview(review, index) {
    const now = Date.now();
    const timestamp = review.timestamp || now - index;
    return {
      id: review.id || `review-${timestamp}-${index}`,
      name: review.name ? String(review.name).trim() : 'Anonymous',
      role: review.role ? String(review.role).trim() : '',
      rating: Number(review.rating) || 5,
      message: review.message ? String(review.message).trim() : '',
      date: review.date || new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateTime: review.dateTime || new Date(timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp,
      ownerToken: review.ownerToken || '',
      editableUntil: review.editableUntil || 0,
      editable: !!review.editable
    };
  }

  function initReviewData() {
    const reviews = getStoredReviews();
    if (reviews.length === 0) {
      saveStoredReviews(defaultReviews);
      return defaultReviews.slice();
    }
    saveStoredReviews(reviews);
    return reviews;
  }

  function sortReviews(reviews) {
    return [...reviews].sort((a, b) => b.timestamp - a.timestamp);
  }

  function getFeaturedReviews(reviews) {
    const sorted = sortReviews(reviews);
    const fiveStars = sorted.filter(review => review.rating === 5);
    if (fiveStars.length >= reviewFeaturedCount) {
      return fiveStars.slice(0, reviewFeaturedCount);
    }
    const featured = [...fiveStars];
    const remaining = sorted.filter(review => !fiveStars.some(star => star.id === review.id));
    featured.push(...remaining.slice(0, reviewFeaturedCount - featured.length));
    return featured;
  }

  function getMoreReviews(reviews, featuredReviews) {
    return sortReviews(reviews).filter(review => !featuredReviews.some(featured => featured.id === review.id));
  }

  function formatReviewDate(review) {
    return review.dateTime || new Date(review.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function canModifyReview(review) {
    const ownerToken = getCurrentOwnerToken();
    const now = Date.now();
    return review.ownerToken === ownerToken && (currentEditingReviewId === review.id || (review.editableUntil && now <= review.editableUntil));
  }

  function getEditableWindowRemaining(review) {
    const remainingMs = (review.editableUntil || 0) - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
  }

  function formatEditableWindow(review) {
    const totalSeconds = getEditableWindowRemaining(review);
    if (totalSeconds <= 0) return 'Expired';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  function renderReviewCard(review) {
    const template = document.getElementById('review-card-template');
    const card = template.content.cloneNode(true).firstElementChild;
    card.dataset.reviewId = review.id;
    const now = Date.now();
    const ownerToken = getCurrentOwnerToken();
    const ownReview = review.ownerToken && review.ownerToken === ownerToken;
    const canModify = ownReview && review.editableUntil && now <= review.editableUntil;
    const expired = ownReview && review.editableUntil && now > review.editableUntil;
    const stars = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color:${i < review.rating ? '#C9A84C' : 'rgba(11, 31, 75, 0.18)'}"></i>`).join('');
    card.querySelector('.testi-stars').innerHTML = stars;
    card.querySelector('.testi-text').textContent = review.message;
    card.querySelector('.testi-name').textContent = review.name;
    card.querySelector('.testi-role').textContent = review.role || '';
    card.querySelector('.review-card-meta').textContent = `Submitted on ${formatReviewDate(review)}`;
    if (canModify) {
      const timerDiv = document.createElement('div');
      timerDiv.className = 'review-timer';
      timerDiv.dataset.reviewId = review.id;
      timerDiv.textContent = `Editable for ${formatEditableWindow(review)}`;
      card.appendChild(timerDiv);
    }
    if (expired) {
      const expiredDiv = document.createElement('div');
      expiredDiv.className = 'review-timer expired';
      expiredDiv.dataset.reviewId = review.id;
      expiredDiv.textContent = 'Edit/Delete expired';
      card.appendChild(expiredDiv);
    }
    if (ownReview && !expired) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'review-actions';
      actionsDiv.innerHTML = `<button class="review-action-btn edit" data-id="${review.id}">Edit</button><button class="review-action-btn delete" data-id="${review.id}">Delete</button>`;
      card.appendChild(actionsDiv);
      const editBtn = actionsDiv.querySelector('.review-action-btn.edit');
      const deleteBtn = actionsDiv.querySelector('.review-action-btn.delete');
      editBtn?.addEventListener('click', () => openReviewEditor(review.id));
      deleteBtn?.addEventListener('click', () => deleteReview(review.id));
    }
    return card;
  }

  function renderReviews() {
    const reviews = getStoredReviews();
    const featuredReviews = getFeaturedReviews(reviews);
    const moreReviews = getMoreReviews(reviews, featuredReviews);

    const featuredContainer = document.getElementById('featuredReviews');
    const moreContainer = document.getElementById('moreReviewsGrid');
    const toggleButton = document.getElementById('toggleMoreBtn');
    const moreSection = document.getElementById('moreReviews');

    if (!featuredContainer || !moreContainer || !toggleButton || !moreSection) return;

    featuredContainer.innerHTML = '';
    moreContainer.innerHTML = '';

    if (featuredReviews.length === 0) {
      const template = document.getElementById('empty-review-card-template');
      const emptyCard = template.content.cloneNode(true).firstElementChild;
      featuredContainer.appendChild(emptyCard);
    } else {
      featuredReviews.forEach(review => featuredContainer.appendChild(renderReviewCard(review)));
    }

    if (moreReviews.length === 0) {
      moreSection.classList.remove('expanded');
      moreSection.classList.add('hidden');
      toggleButton.style.display = 'none';
      reviewExpanded = false;
    } else {
      moreReviews.forEach(review => moreContainer.appendChild(renderReviewCard(review)));
      toggleButton.style.display = 'inline-flex';
      toggleButton.textContent = reviewExpanded ? 'View Less Reviews' : 'View More Reviews';
      if (reviewExpanded) {
        moreSection.classList.remove('hidden');
        moreSection.classList.add('expanded');
      } else {
        moreSection.classList.remove('expanded');
        moreSection.classList.add('hidden');
      }
    }
  }

  function toggleMoreReviews() {
    reviewExpanded = !reviewExpanded;
    renderReviews();
    const button = document.getElementById('toggleMoreBtn');
    if (button) {
      button.textContent = reviewExpanded ? 'View Less Reviews' : 'View More Reviews';
    }
  }

  function openReviewEditor(reviewId) {
    const reviews = getStoredReviews();
    const review = reviews.find(item => item.id === reviewId);
    if (!review || !canModifyReview(review)) {
      return alert('You are not authorized to edit this review or the edit window has expired.');
    }
    currentEditingReviewId = reviewId;
    const card = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (!card) return;
    const template = document.getElementById('review-editor-template');
    const editor = template.content.cloneNode(true);
    editor.querySelector('#edit-name-').id = `edit-name-${review.id}`;
    editor.querySelector('#edit-name-').value = review.name;
    editor.querySelector('#edit-rating-').id = `edit-rating-${review.id}`;
    editor.querySelector('#edit-rating-').value = review.rating;
    editor.querySelector('#edit-message-').id = `edit-message-${review.id}`;
    editor.querySelector('#edit-message-').value = review.message;
    editor.querySelector('button[onclick*="saveReviewEdit"]').setAttribute('onclick', `saveReviewEdit('${review.id}')`);
    editor.querySelector('#editFeedback-').id = `editFeedback-${review.id}`;
    card.innerHTML = '';
    card.appendChild(editor);
  }

  function saveReviewEdit(reviewId) {
    const nameEl = document.getElementById(`edit-name-${reviewId}`);
    const ratingEl = document.getElementById(`edit-rating-${reviewId}`);
    const messageEl = document.getElementById(`edit-message-${reviewId}`);
    const feedbackEl = document.getElementById(`editFeedback-${reviewId}`);

    const reviews = getStoredReviews();
    const review = reviews.find(item => item.id === reviewId);
    if (!review || !canModifyReview(review)) {
      if (feedbackEl) {
        feedbackEl.textContent = 'You are not authorized to edit this review or the time window has passed.';
        feedbackEl.style.color = '#d9534f';
      }
      return;
    }

    const name = nameEl?.value.trim();
    const rating = Number(ratingEl?.value || 0);
    const message = messageEl?.value.trim();

    if (!name || !message || !rating) {
      if (feedbackEl) {
        feedbackEl.textContent = 'Please complete all fields before saving your review.';
        feedbackEl.style.color = '#d9534f';
      }
      return;
    }

    const updatedReviews = reviews.map(item => {
      if (item.id !== reviewId) return item;
      return {
        ...item,
        name,
        rating,
        message,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        dateTime: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        timestamp: item.timestamp,
        ownerToken: item.ownerToken,
        editableUntil: Date.now() + reviewEditableWindowMs,
        editable: true
      };
    });

    currentEditingReviewId = null;
    saveStoredReviews(updatedReviews);
    renderReviews();
  }

  function cancelReviewEdit() {
    currentEditingReviewId = null;
    renderReviews();
  }

  function deleteReview(reviewId) {
    const reviews = getStoredReviews();
    const review = reviews.find(item => item.id === reviewId);
    if (!review || !canModifyReview(review)) {
      return alert('You are not authorized to delete this review or the time window has expired.');
    }
    if (!confirm('Delete this review? This action cannot be undone.')) return;
    saveStoredReviews(reviews.filter(item => item.id !== reviewId));
    renderReviews();
  }

  function submitReview() {
    const nameEl = document.getElementById('review-name');
    const ratingEl = document.getElementById('review-rating');
    const messageEl = document.getElementById('review-message');
    const feedbackEl = document.getElementById('reviewFeedback');

    const name = nameEl?.value.trim();
    const rating = Number(ratingEl?.value || 0);
    const message = messageEl?.value.trim();

    if (!name || !message || !rating) {
      feedbackEl.textContent = 'Please fill in your name, rating and review before submitting.';
      feedbackEl.style.color = '#d9534f';
      return;
    }

    const timestamp = Date.now();
    const reviewOwner = getCurrentOwnerToken();

    const newReview = {
      id: `review-${timestamp}`,
      name,
      rating,
      message,
      date: new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateTime: new Date(timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp,
      ownerToken: reviewOwner,
      editableUntil: timestamp + reviewEditableWindowMs,
      editable: true
    };

    const reviews = getStoredReviews();
    reviews.push(newReview);
    saveStoredReviews(reviews);
    reviewExpanded = false;
    renderReviews();

    feedbackEl.textContent = 'Thank you! Your review has been added and is visible on the page.';
    feedbackEl.style.color = '#2a7f32';

    nameEl.value = '';
    ratingEl.value = '5';
    messageEl.value = '';
  }

  function loadUserReviews() {
    initReviewData();
    renderReviews();
  }

  function updateReviewTimers() {
    if (document.querySelector('.review-editor')) return;
    const timerElements = document.querySelectorAll('.review-timer[data-review-id]');
    if (!timerElements.length) return;
    timerElements.forEach(el => {
      const reviewId = el.dataset.reviewId;
      const review = getStoredReviews().find(item => item.id === reviewId);
      if (!review) return;
      const remaining = getEditableWindowRemaining(review);
      if (remaining <= 0) {
        if (!el.classList.contains('expired')) {
          el.textContent = 'Edit/Delete expired';
          el.classList.add('expired');
          const card = el.closest('.testi-card');
          card?.querySelector('.review-actions')?.remove();
          setTimeout(() => el.remove(), 2000);
        }
      } else {
        el.textContent = `Editable for ${remaining}s`;
        el.classList.remove('expired');
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadUserReviews();
    setInterval(updateReviewTimers, 1000);
  });

  // FORM HANDLERS - Now handled by form-handler.js with EmailJS and Twilio integration

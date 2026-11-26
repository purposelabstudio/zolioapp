function enhanceCarousel(card, template) {
  const cover = card.querySelector('.carousel-picture');
  const coverNumber = card.querySelector('.frame-number');
  const allSlides = card.querySelector('.more-frames');
  const list = allSlides.querySelector('ul');
  const slides = [cover.querySelector('img'), ...list.querySelectorAll('img')];
  const preview = template.content.firstElementChild.cloneNode(true);
  const image = slides[0].cloneNode();
  const pager = preview.querySelector('.carousel-pager');
  const [previous, next] = pager.querySelectorAll('button');
  const [position, description] = preview.querySelector('.carousel-position').children;
  const dots = slides.map(() => document.createElement('span'));
  preview.setAttribute('aria-label', `Carousel preview: ${card.querySelector('h2').textContent.trim()}`);
  pager.before(image);
  preview.querySelector('.carousel-dots').append(...dots);
  let index = -1;

  function show(target) {
    if (target === index || target < 0 || target >= slides.length) return;
    index = target;
    image.alt = slides[index].alt;
    image.setAttribute('src', slides[index].getAttribute('src'));
    position.textContent = `Slide ${index + 1} of ${slides.length}`;
    description.textContent = `: ${image.alt}`;
    dots.forEach((dot, i) => dot.classList.toggle('is-current', i === index));
    // Keep focus on the arrow at either end of the sequence.
    previous.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === slides.length - 1));
  }

  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  pager.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  show(0);

  // Keep the original cover in the complete slide list once the phone replaces it.
  coverNumber.before(preview);
  const first = document.createElement('li');
  first.append(coverNumber, cover);
  list.prepend(first);
  const summary = allSlides.querySelector('summary');
  summary.replaceChildren(`Show all ${slides.length} slides`, summary.querySelector('.visually-hidden'));
}

const previewTemplate = document.querySelector('#carousel-preview');
document.querySelectorAll('.carousel-grid > .piece').forEach(card => enhanceCarousel(card, previewTemplate));

// ===== Dynamic Content Loading =====
async function loadContent() {
  try {
    const response = await fetch('data/content.json');
    const data = await response.json();

    // 1. Load Profile Image
    try {
        const imageContainer = document.getElementById('about-image-container');
        if (imageContainer && data.profile_image) {
          imageContainer.innerHTML = `
            <div class="image-wrapper">
                <img src="${data.profile_image}" alt="Dharun N" class="profile-img">
                <div class="image-border"></div>
            </div>
          `;
        }
    } catch (e) { console.error("Error loading image:", e); }

    // 2. Load Contact & Socials (Priority)
    try {
        if (data.contact) {
            const heroEmail = document.getElementById('hero-email');
            const heroPhone = document.getElementById('hero-phone');
            const heroLinkedin = document.getElementById('hero-linkedin');
            const heroWhatsapp = document.getElementById('hero-whatsapp');

            const waLink = `https://wa.me/${data.contact.whatsapp.replace(/\D/g,'')}`;

            if (heroEmail) heroEmail.href = `mailto:${data.contact.email}`;
            if (heroPhone) heroPhone.href = `tel:${data.contact.phone.replace(/\s/g,'')}`;
            if (heroLinkedin) heroLinkedin.href = data.contact.linkedin;
            if (heroWhatsapp) heroWhatsapp.href = waLink;

            const contactEmail = document.getElementById('contact-email');
            const contactPhone = document.getElementById('contact-phone');
            const contactLinkedin = document.getElementById('contact-linkedin');
            const contactWhatsapp = document.getElementById('contact-whatsapp');

            if (contactEmail) { contactEmail.href = `mailto:${data.contact.email}`; contactEmail.innerText = data.contact.email; }
            if (contactPhone) { contactPhone.href = `tel:${data.contact.phone.replace(/\s/g,'')}`; contactPhone.innerText = data.contact.phone; }
            if (contactLinkedin) { 
                contactLinkedin.href = data.contact.linkedin;
                const linkedinUser = data.contact.linkedin.split('/').filter(Boolean).pop();
                contactLinkedin.innerText = linkedinUser || 'LinkedIn';
            }
            if (contactWhatsapp) { contactWhatsapp.href = waLink; contactWhatsapp.innerText = data.contact.phone; }
        }
    } catch (e) { console.error("Error loading contacts:", e); }

    // 3. Load About Section
    try {
        const aboutContainer = document.getElementById('about-container');
        if (aboutContainer && data.about) {
          aboutContainer.innerHTML = `
            <p>${data.about.bio1}</p>
            <p>${data.about.bio2}</p>
            <p>${data.about.bio3}</p>
            <div class="about-stats">
                <div class="stat-item">
                    <span class="stat-number" data-count="${data.about.stat_projects}">0</span>
                    <span class="stat-label">Projects</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-count="${data.about.stat_awards}">0</span>
                    <span class="stat-label">Awards</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-count="${data.about.stat_skills}">0</span>
                    <span class="stat-label">Skills</span>
                </div>
            </div>
          `;
        }
    } catch (e) { console.error("Error loading about:", e); }

    // 4. Load Skills
    try {
        const skillsContainer = document.getElementById('skills-container');
        if (skillsContainer && data.skills) {
          skillsContainer.innerHTML = data.skills.map(skill => `
            <div class="skill-card animate-on-scroll" data-skill="${skill.level}">
                <div class="skill-icon"><i class="${skill.icon}"></i></div>
                <h3>${skill.name}</h3>
                <div class="skill-bar"><div class="skill-fill" data-width="${skill.level}"></div></div>
            </div>
          `).join('');
        }
    } catch (e) { console.error("Error loading skills:", e); }

    // 5. Load Projects
    try {
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer && data.projects) {
          projectsContainer.innerHTML = data.projects.map(project => `
            <div class="project-card animate-on-scroll">
                <div class="project-header">
                    <i class="fas fa-folder-open project-folder"></i>
                    <div class="project-links">
                        <a href="${project.link}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-tags">
                    ${Array.isArray(project.tags) ? project.tags.map(tag => `<span>${tag}</span>`).join('') : ''}
                </div>
            </div>
          `).join('');
        }
    } catch (e) { console.error("Error loading projects:", e); }

    // 6. Load Achievements
    try {
        const achievementsContainer = document.getElementById('achievements-container');
        if (achievementsContainer && data.achievements) {
          achievementsContainer.innerHTML = data.achievements.map(achievement => `
            <div class="achievement-card animate-on-scroll">
                <div class="achievement-icon">
                    <i class="fas fa-award"></i>
                </div>
                <div class="achievement-content">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.text}</p>
                </div>
                <div class="achievement-badge">${achievement.badge}</div>
            </div>
          `).join('');
        }
    } catch (e) { console.error("Error loading achievements:", e); }

    initObservers();

  } catch (error) {
    console.error('Critical error loading content:', error);
  }
}

function initObservers() {
    // ===== Scroll Animations =====
    const animateEls = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animateEls.forEach(el => observer.observe(el));
    
    // ===== Skill Bar Animation =====
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    skillFills.forEach(bar => skillObserver.observe(bar));
    
    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.dataset.count;
          let count = 0;
          const increment = Math.ceil(target / 30);
          const timer = setInterval(() => {
            count += increment;
            if (count >= target) { count = target; clearInterval(timer); }
            entry.target.textContent = count + '+';
          }, 50);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(c => counterObserver.observe(c));
}

// ===== Typing Animation =====
const titles = [
  'Website Developer',
  'ECE Student',
  'IoT Developer',
  'Future Startup Founder'
];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
  const current = titles[titleIndex];
  typingEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  if (!isDeleting && charIndex > current.length) {
    setTimeout(() => { isDeleting = true; typeEffect(); }, 1800);
    return;
  }
  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
  }
  setTimeout(typeEffect, isDeleting ? 40 : 80);
}
typeEffect();

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
  });
});

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// ===== Cursor Glow =====
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// ===== Smooth scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Start the app
loadContent();

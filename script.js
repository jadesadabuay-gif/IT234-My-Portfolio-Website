document.addEventListener("DOMContentLoaded", () => {
    // 1. นำ Loader ออกเมื่อโหลดหน้าเว็บเสร็จ
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1000); 

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Fetch Data จาก JSON
    fetchData();

    // 4. Scroll Animation Observer
    setupScrollObserver();
});

async function fetchData() {
    try {
        const response = await fetch('./data/portfolio.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        renderPortfolio(data);
    } catch (error) {
        console.error("Error loading portfolio data:", error);
        if(window.location.protocol === 'file:') {
            alert("⚠️ ไม่สามารถโหลดข้อมูล JSON ได้ กรุณาอัปโหลดขึ้น GitHub หรือเปิดผ่าน Local Server");
        }
    }
}

function renderPortfolio(data) {
    // Render Hero
    document.getElementById('hero-subtitle').textContent = data.hero.subtitle;
    document.getElementById('hero-title').textContent = data.hero.title;
    document.getElementById('hero-desc').textContent = data.hero.description;

    // Render About
    document.getElementById('about-bio').textContent = data.about.bio;
    const aboutInfo = document.getElementById('about-info');
    aboutInfo.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">สถานศึกษา</div>
            <div class="stat-value">${data.about.university}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">แผนการเรียน</div>
            <div class="stat-value">${data.about.major}</div>
        </div>
        <div class="stat-card" style="grid-column: span 2;">
            <div class="stat-label">ความสนใจ</div>
            <div class="stat-value">${data.about.interests.join(', ')}</div>
        </div>
    `;

    // Render Skills
    const skillsContainer = document.getElementById('skills-container');
    data.skills.forEach(skillCategory => {
        const tags = skillCategory.items.map(item => `<span class="skill-tag">${item}</span>`).join('');
        skillsContainer.innerHTML += `
            <div class="skill-category">
                <i class="${skillCategory.icon} skill-icon"></i>
                <h3>${skillCategory.title}</h3>
                <div class="skill-list">
                    ${tags}
                </div>
            </div>
        `;
    });

    // Render Projects
    const projectsContainer = document.getElementById('projects-container');
    data.projects.forEach(project => {
        const techTags = project.technologies.map(tech => `<span>${tech}</span>`).join('');
        projectsContainer.innerHTML += `
            <div class="project-card">
                <div class="project-visual">
                    <span class="project-number">${project.id}</span>
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${techTags}
                    </div>
                    <a href="${project.link}" class="btn-link" target="_blank">
                        ดูรายละเอียด <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    });

    // Render Workflow
    const workflowContainer = document.getElementById('workflow-container');
    data.workflow.forEach(step => {
        workflowContainer.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-step-num">${step.id}</div>
                <div class="timeline-content">
                    <h3>${step.title}</h3>
                    <p>${step.description}</p>
                </div>
            </div>
        `;
    });

    // Render Contact
    document.getElementById('contact-title').textContent = data.contact.title;
    document.getElementById('contact-desc').textContent = data.contact.description;
    
    const socialContainer = document.getElementById('social-container');
    data.contact.links.forEach(link => {
        socialContainer.innerHTML += `
            <a href="${link.url}" class="social-btn" target="_blank">
                <i class="${link.icon}"></i> ${link.platform}
            </a>
        `;
    });

    // Re-trigger observer
    setupScrollObserver();
}

function setupScrollObserver() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}
// Set current year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Navigation scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.top-nav');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Track navigation clicks
            if (typeof umami !== 'undefined') {
                umami.track('navigation-click', { section: this.getAttribute('href').substring(1) });
            }
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Track external link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
        if (typeof umami !== 'undefined') {
            const url = this.getAttribute('href');
            const linkText = this.textContent.trim() || this.getAttribute('aria-label') || 'external-link';
            umami.track('external-link-click', { url: url, text: linkText });
        }
    });
});

// Active navigation link highlighting
let lastTrackedSection = '';
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    // Track section views
    if (current && current !== lastTrackedSection && typeof umami !== 'undefined') {
        umami.track('section-view', { section: current });
        lastTrackedSection = current;
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Load and render experiences from JSON
async function loadExperiences() {
    try {
        console.log('Attempting to fetch experiences.json...');
        const response = await fetch('./experiences.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded experiences data:', data);
        renderTimeline(data.experiences);
        renderHeroMetrics(); // Don't depend on JSON for hero metrics
    } catch (error) {
        console.error('Error loading experiences:', error);
        // Fallback: render with hardcoded data if JSON fails
        renderTimelineWithFallback();
        renderHeroMetrics();
    }
}

function renderTimelineWithFallback() {
    console.log('Using fallback timeline data...');
    // Embed the full experiences data directly to avoid CORS issues
    const fallbackExperiences = [
        {
            title: "B.S. Computer Science & Statistics",
            company: "University of Illinois at Urbana-Champaign",
            year: "2018-2022",
            logoUrl: "./logos/uiuc.png",
            logo: "🎓",
            metric: "200+ hours at Kams",
            description: "Fun fact: senior year, my roommates and I rewired a Keurig machine to dispense Jagerbombs and got featured on Barstool."
        },
        {
            title: "Partner",
            company: "OTCR Consulting",
            year: "2019-2020",
            logoUrl: "./logos/otcr.png",
            logo: "💼",
            metric: "~$8k per project",
            description: "Performed user research study for social media giant, led client engagement with Director of UX Research and oversaw two project teams.",
            customButton: {
                text: "Learn About OTCR",
                url: "https://otcrconsulting.com/"
            }
        },
        {
            title: "Co-Director // Corporate Staff",
            company: "Reflections|Projections",
            year: "2019-2020",
            logoUrl: "./logos/reflections.png",
            logo: "🎯",
            metric: "2k+ Attendees",
            description: "Largest student-run tech conference in the Midwest, led staff of 60+ to organize 2020 event with $50k operating budget. Raised over $100k from corporate sponsors for 2019 conference.",
            customButton: {
                text: "View Conference Site",
                url: "https://reflectionsprojections.org"
            }
        },
        {
            title: "Software Engineer Intern",
            company: "DocuSign",
            year: "2019",
            logoUrl: "./logos/docusign.png",
            logo: "📄",
            metric: "10min -> 10sec to create contracts",
            description: "Built document generation API for Dynamics 365 x DocuSign integration",
            customButton: {
                text: "See Integration",
                url: "https://www.docusign.com/integrations/microsoft/dynamics-365"
            }
        },
        {
            title: "Product Manager Intern",
            company: "Microsoft",
            year: "2020",
            logoUrl: "./logos/microsoft.png",
            logo: "🪟",
            metric: "5M MAU",
            description: "Designed new sharing flow for Power BI Desktop",
            customButton: {
                text: "View Release Notes",
                url: "https://powerbi.microsoft.com/en-us/blog/new-sharing-experience-coming-soon/"
            }
        },
        {
            title: "Growth Intern",
            company: "Alpaca",
            year: "2020",
            logoUrl: "./logos/alpaca.png",
            logo: "📈",
            metric: "100+ New Institutional Partnerships",
            description: "Driving adoption of Alpaca's developer-first stock trading API, ran trading competition with 1000+ participants.",
            customButton: {
                text: "Read Interview",
                url: "https://alpaca.markets/learn/trading-competition-interview2"
            }
        },
        {
            title: "Product Manager Intern",
            company: "Microsoft",
            year: "2021",
            logoUrl: "./logos/microsoft.png",
            logo: "🪟",
            metric: "2M MAU",
            description: "Introduced version management and reversion capabilities to Dynamics 365 Commerce Site Builder",
            customButton: {
                text: "View Documentation",
                url: "https://docs.microsoft.com/en-us/dynamics365/commerce/e-commerce-extensibility/site-builder-versioning"
            }
        },
        {
            title: "Product Lead // Growth Engineer",
            company: "Rize Education",
            year: "2021-2023",
            logoUrl: "./logos/rize.png",
            logo: "🎯",
            metric: "~10x ARR Growth",
            description: "Helped grow usage-based ARR by nearly 10x (~$2.5M when I left) over two years while increasing overall product NPS from roughly -10 to +20. Also got to design a few CS courses and projects that are still being taken by students at 100+ universities :)",
            customButton: {
                text: "About Rize",
                url: "https://www.rize.education/"
            }
        },
        {
            title: "Technical Product Manager, AI & Customer Solutions",
            company: "Bilt Rewards",
            year: "2023-2024",
            logoUrl: "./logos/bilt.png",
            logo: "🏠",
            metric: "70% Resolution Rate",
            description: "CX agents, fraud, data infra",
            customButton: {
                text: "Bilt x Decagon Case Study",
                url: "https://decagon.ai/case-studies/bilt"
            }
        },
        {
            title: "Product Manager, Machine Learning",
            company: "Capital One",
            year: "2024-Present",
            logoUrl: "./logos/capital-one.png",
            logo: "🏦",
            metric: "$7B+ NPV",
            description: "Credit underwriting/acquisition risk models + ML infra.",
            customButton: {
                text: "C1 AI/ML",
                url: "https://www.capitalone.com/tech/machine-learning/"
            }
        },
        {
            title: "Founder",
            company: "Mirage AI",
            year: "2025-Present",
            logoUrl: "./logos/mirage.png",
            logo: "🎨",
            metric: "100k+ runs/$2k in first week",
            description: "AI photo frame + stable diffusion models.",
            customButton: {
                text: "Stylize any image, 10x cheaper/faster than ChatGPT.",
                url: "https://replicate.com/aaronaftab/mirage-ghibli"
            }
        },
        {
            title: "Co-Founder",
            company: "Something New",
            year: "2025-Present",
            logoUrl: "./logos/quetzal.png",
            logo: "🦅",
            metric: "?",
            description: ""
        }
    ];
    renderTimeline(fallbackExperiences);
}

function renderHeroMetrics() {
    const heroMetricsContainer = document.getElementById('heroMetrics');
    if (!heroMetricsContainer) return;

    // Define specific hero metrics with better formatting
    const heroMetrics = [
        {
            company: 'Capital One',
            metric: '$7B+',
            label: 'NPV generated at Capital One',
            logoUrl: './logos/capital-one.png',
            logo: '🏦'
        },
        {
            company: 'Microsoft',
            metric: '5M+',
            label: 'MAUs served at Microsoft',
            logoUrl: './logos/microsoft.png',
            logo: '🪟'
        },
        {
            company: 'Mirage AI',
            metric: '500K+',
            label: 'Model runs at Mirage AI (Founder)',
            logoUrl: './logos/mirage.png',
            logo: '🎨'
        },
        {
            company: 'Rize Education',
            metric: '10x',
            label: 'ARR Growth at Rize',
            logoUrl: './logos/rize.png',
            logo: '🎯'
        }
    ];
    
    heroMetricsContainer.innerHTML = '';
    
    heroMetrics.forEach(metric => {
        const metricItem = document.createElement('div');
        metricItem.className = 'metric-item';
        
        const logoHtml = metric.logoUrl 
            ? `<img src="${metric.logoUrl}" alt="${metric.company} logo" style="width: 24px; height: 24px; object-fit: contain; filter: brightness(0) saturate(0) invert(1); opacity: 0.9;" onerror="console.log('Failed to load hero metric logo:', this.src); this.style.display='none'; this.nextElementSibling.style.display='block';">
               <span style="display: none; filter: brightness(0) invert(1); opacity: 0.8; font-size: 1.2rem;">${metric.logo}</span>`
            : `<span style="filter: brightness(0) invert(1); opacity: 0.8; font-size: 1.2rem;">${metric.logo}</span>`;

        metricItem.innerHTML = `
            <div class="metric-logo">
                ${logoHtml}
            </div>
            <span class="metric-value">${metric.metric}</span>
            <span class="metric-label">${metric.label}</span>
        `;
        
        heroMetricsContainer.appendChild(metricItem);
    });
}

function renderTimeline(experiences) {
    console.log('renderTimeline called with:', experiences);
    const timelineContainer = document.querySelector('.timeline');
    console.log('Timeline container found:', timelineContainer);
    
    if (!timelineContainer) {
        console.error('Timeline container not found!');
        return;
    }

    // Clear existing timeline items
    timelineContainer.innerHTML = '';
    console.log('Timeline container cleared, rendering', experiences.length, 'experiences');

    // Use experiences in the exact order they appear in the JSON array
    // Render each experience
    experiences.forEach(exp => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const logoHtml = exp.logoUrl 
            ? `<img src="${exp.logoUrl}" alt="${exp.company} logo" style="width: 24px; height: 24px; object-fit: contain; filter: brightness(0) saturate(0) invert(0.2) sepia(1) saturate(5) hue-rotate(200deg);" onerror="console.log('Failed to load:', this.src); this.style.display='none'; this.nextElementSibling.style.display='block';">
               <span style="display: none; color: var(--mckinsey-blue); font-size: 1rem;">${exp.logo}</span>`
            : `<span style="color: var(--mckinsey-blue); font-size: 1rem;">${exp.logo}</span>`;

        const customButtonHtml = exp.customButton 
            ? `<a href="${exp.customButton.url}" class="action-btn" target="_blank">${exp.customButton.text}</a>`
            : '';

        timelineItem.innerHTML = `
            <div class="timeline-logo">
                ${logoHtml}
            </div>
            <div class="timeline-header">
                <h3 class="timeline-title">${exp.title}</h3>
                <span class="timeline-company">${exp.company}</span>
            </div>
            <p class="timeline-subtitle">${exp.year}</p>
            <div class="timeline-content">
                <div class="timeline-metric">${exp.metric}</div>
                <p>${exp.description}</p>
                ${customButtonHtml ? `<div class="timeline-actions">${customButtonHtml}</div>` : ''}
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Load experiences on page load
document.addEventListener('DOMContentLoaded', function() {
    renderHeroMetrics(); // Load hero metrics immediately
    loadExperiences(); // Then load timeline from JSON
    observeSkills(); // Initialize skills animation observer
});

// Modern Skills Visualization
function renderSkills() {
    const skillsData = [
        { 
            name: 'Software Engineering', 
            details: 'Fullstack, Python/JS, React, Node.js',
            years: 6, 
            color: '#003366' 
        },
        { 
            name: 'Data Science', 
            details: 'SQL/NoSQL, BigQuery, Snowflake, Databricks',
            years: 4, 
            color: '#666666' 
        },
        { 
            name: 'Product Management', 
            details: 'B2B SaaS, Fintech, AI/ML Products',
            years: 4, 
            color: '#0066cc' 
        },
        { 
            name: 'Cloud/DevOps', 
            details: 'AWS, Google Cloud, Vercel, Cloudflare',
            years: 4, 
            color: '#ff6b35' 
        },
        { 
            name: 'AI/ML Engineering', 
            details: 'Agent orchestration, Diffusion models, MLOps',
            years: 2, 
            color: '#4d94ff' 
        },
        { 
            name: 'Leadership', 
            details: 'Team management, Strategic planning',
            years: 2, 
            color: '#999999' 
        }
    ];

    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = '';

    skillsData.forEach((skill, index) => {
        const maxYears = 7;
        const percentage = Math.min((skill.years / maxYears) * 100, 100);

        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.style.animationDelay = `${index * 0.1}s`;

        skillItem.innerHTML = `
            <div class="skill-header">
                <div class="skill-title-section">
                    <h4 class="skill-name">${skill.name}</h4>
                    <p class="skill-details">${skill.details}</p>
                </div>
                <div class="skill-years-badge">${skill.years}y</div>
            </div>
            <div class="skill-progress">
                <div class="skill-progress-bar">
                    <div class="skill-progress-fill" style="background-color: ${skill.color}; width: 0%;" data-target="${percentage}%"></div>
                </div>
            </div>
        `;

        skillsGrid.appendChild(skillItem);
    });

    // Animate bars on load
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.skill-progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-target');
            bar.style.width = targetWidth;
        });
    }, 500);
}

// Intersection Observer for skills animation
function observeSkills() {
    const skillsContainer = document.querySelector('.skills-container');
    if (!skillsContainer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillsContainer);
} 
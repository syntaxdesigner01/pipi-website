// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const messageBox = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

// Check local storage or system preference
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Parallax effect for features background
window.addEventListener('scroll', () => {
    const features = document.getElementById('features');
    if (features) {
        const scrolled = window.scrollY;
        features.style.setProperty('--bg-y', `${scrolled * 0.2}px`);
    }
});

// fade-in observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

// waitlist form submit
const form = document.getElementById("waitlistForm");
const msg = document.getElementById("formMessage");

if (form && msg && submitBtn && messageBox) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // UI: loading state
        msg.classList.remove("hidden");
        msg.textContent = "Submitting…";

        submitBtn.disabled = true;
        submitBtn.classList.add(
            "opacity-50",
            "cursor-not-allowed",
            "pointer-events-none"
        );

        try {
            const res = await fetch(
                "https://script.google.com/macros/s/AKfycbyRYMO-zUloeDKTQNAHrAfXY_YAYIvxaIu1uIgw-V1Rwwa6PcGwNwlSs6HPMCVO7cQ8/exec",
                {
                    method: "POST",
                    body: new FormData(form),
                }
            );

            const data = await res.json();

            // Reset message box styles
            messageBox.classList.remove("bg-green-500", "bg-gray-500", "bg-red-500");

            if (data.status === "success") {
                messageBox.textContent =
                    "🎉 You’re on the waitlist! Check your inbox.";
                messageBox.classList.add("bg-green-500");
                form.reset();
            }

            else if (data.status === "duplicate") {
                messageBox.textContent =
                    "😉 You’re already on the waitlist. Check your inbox.";
                messageBox.classList.add("bg-gray-500");
            }

            else {
                messageBox.textContent =
                    "Something went wrong — please try again.";
                messageBox.classList.add("bg-red-500");
            }

            messageBox.classList.remove("hidden");

            setTimeout(() => {
                messageBox.classList.add("hidden");
            }, 3000);

        } catch (err) {
            messageBox.textContent =
                "Network error — please try again later.";
            messageBox.classList.remove("hidden");
            messageBox.classList.add("bg-red-500");

            setTimeout(() => {
                messageBox.classList.add("hidden");
            }, 3000);
        }

        // UI: restore button
        submitBtn.disabled = false;
        submitBtn.classList.remove(
            "opacity-50",
            "cursor-not-allowed",
            "pointer-events-none"
        );
    });
}


const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialContainer = document.getElementById('testimonials-container');
let currentCardIndex = 0;
let touchStartX = 0;

function updateTestimonialStack() {
    if (window.innerWidth >= 768) {
        testimonialCards.forEach(card => {
            card.style.transform = '';
            card.style.opacity = '';
            card.style.zIndex = '';
        });
        return;
    }

    testimonialCards.forEach((card, index) => {
        const i = (index - currentCardIndex + testimonialCards.length) % testimonialCards.length;

        card.style.zIndex = (testimonialCards.length - i).toString();

        if (i === 0) {
            // Top card
            card.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            card.style.opacity = '1';
        } else if (i === 1) {
            // Next card (10% visible below)
            card.style.transform = 'translateY(10%) scale(0.95) rotate(-2deg)';
            card.style.opacity = '1';
        } else {
            // Others hidden
            card.style.transform = 'translateY(20%) scale(0.9) rotate(-4deg)';
            card.style.opacity = '0';
        }
    });
}

if (testimonialContainer) {
    testimonialContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    testimonialContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (Math.abs(touchStartX - touchEndX) > 50) {
            // Swipe Left or Right -> Next card
            currentCardIndex = (currentCardIndex + 1) % testimonialCards.length;
            updateTestimonialStack();
        }
    }, { passive: true });
}

window.addEventListener('resize', updateTestimonialStack);
// Initial call
updateTestimonialStack();

// Back to Top Logic
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
        } else {
            backToTopBtn.classList.add('opacity-0', 'translate-y-10');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const messageBox = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('btnSpinner');

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
    // Check if already joined
    if (localStorage.getItem('pipi_waitlist_joined') === 'true') {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Joined! 🚀</span>";
        submitBtn.classList.add("opacity-50", "cursor-not-allowed");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Email Validation
        const email = form.email.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            messageBox.textContent = "Please enter a valid email address.";
            messageBox.classList.remove("bg-green-500", "bg-gray-500", "hidden");
            messageBox.classList.add("bg-red-500", "z-50");
            setTimeout(() => {
                messageBox.classList.add("hidden");
            }, 3000);
            return;
        }

        // UI: loading state
        msg.classList.remove("hidden");
        msg.textContent = "Submitting…";
        if (spinner) spinner.classList.remove('hidden');

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
                msg.classList.add("hidden")
                localStorage.setItem('pipi_waitlist_joined', 'true');
            }

            else if (data.status === "duplicate") {
                messageBox.textContent =
                    "😉 You’re already on the waitlist. Check your inbox.";
                messageBox.classList.add("bg-gray-500");
                localStorage.setItem('pipi_waitlist_joined', 'true');
                msg.classList.add("hidden")
            }

            else {
                messageBox.textContent =
                    "Something went wrong — please try again.";
                messageBox.classList.add("bg-red-500");
                msg.classList.add("hidden")
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
            msg.classList.add("hidden")

            setTimeout(() => {
                messageBox.classList.add("hidden");
            }, 3000);
        }

        // UI: restore button if not joined
        if (localStorage.getItem('pipi_waitlist_joined') === 'true') {
            submitBtn.innerHTML = "<span>Joined! 🚀</span>";
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => input.disabled = true);
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove(
                "opacity-50",
                "cursor-not-allowed",
                "pointer-events-none"
            );
        }
        if (spinner) spinner.classList.add('hidden');
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





// Countdown Timer Logic

const countdownElement = document.getElementById('countdown');

// Target next Saturday at 00:00:00 (Friday Midnight)
const now = new Date();
const targetDate = new Date();

// 6 is Saturday
const dayOfWeek = 6;
const daysUntilSaturday = (dayOfWeek + 7 - now.getDay()) % 7;

targetDate.setDate(now.getDate() + daysUntilSaturday);
targetDate.setHours(0, 0, 0, 0);

// If target is in the past, move to next week
if (targetDate <= now) {
    targetDate.setDate(targetDate.getDate() + 7);
}

setInterval(() => {
    const distance = targetDate.getTime() - new Date().getTime();
    if (distance < 0) {
        countdownElement.innerHTML = "LIVE NOW!";
        return;
    }
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    countdownElement.innerHTML = `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}, 1000);
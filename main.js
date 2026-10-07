document.addEventListener("DOMContentLoaded", () => {
    const loaderBar = document.getElementById("loader-bar");
    const loaderPercentage = document.getElementById("loader-percentage");
    const loaderContainer = document.getElementById("sao-loader");

    let progress = { value: 0 };

    const loadingTimeline = anime.timeline({
        easing: 'easeInOutQuad'
    });

    // 1. Animasi Loading Bar Minimalis (1 Detik)
    loadingTimeline.add({
        targets: progress,
        value: 100,
        duration: 1000,
        update: function() {
            let currentVal = Math.floor(progress.value);
            loaderBar.style.width = currentVal + '%';
            loaderPercentage.innerHTML = currentVal + '%';
        }
    })
    // 2. Hilangkan Loader secara Halus (Fade Out)
    .add({
        targets: loaderContainer,
        opacity: 0,
        duration: 400,
        complete: function() {
            loaderContainer.style.display = 'none';
            // 3. Jalankan Animasi Menu Utama SAO
            startMainPortfolioAnimation();
        }
    });
});

// Fungsi Animasi Utama Portofolio SAO
function startMainPortfolioAnimation() {
    const mainTimeline = anime.timeline({
        easing: 'easeOutExpo'
    });

    mainTimeline.add({
        targets: '#sao-container',
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 800
    })
    .add({
        targets: '.sao-element',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 600
    }, '-=400')
    .add({
        targets: '.sao-skill',
        opacity: [0, 1],
        translateX: [-20, 0],
        delay: anime.stagger(100),
        duration: 500
    }, '-=300')
    .add({
        targets: '.sao-action',
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: anime.stagger(80),
        duration: 400
    }, '-=300')
    .add({
        targets: '.sao-quest-title',
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600
    }, '-=200')
    .add({
        targets: '.sao-card',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(150),
        duration: 700
    }, '-=400');
}
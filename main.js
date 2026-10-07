document.addEventListener('DOMContentLoaded', () => {
    // === ANIMASI 1: MENU UTAMA (HERO) ===
    const tl = anime.timeline({
        easing: 'easeOutExpo'
    });

    tl.add({
        targets: '#sao-container',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800
    })
    .add({
        targets: '.sao-element',
        opacity: [0, 1],
        translateY: [-20, 0],
        delay: anime.stagger(150),
        duration: 600
    }, '-=400')
    .add({
        targets: '.sao-skill',
        opacity: [0, 1],
        translateX: [-30, 0],
        delay: anime.stagger(100),
        duration: 500
    }, '-=200')
    .add({
        targets: '.sao-action',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 500
    }, '-=200');

    // === ANIMASI 2: SCROLL UNTUK QUEST LOG (PROYEK) ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Jika bagian "Quest Log" mulai terlihat di layar
            if (entry.isIntersecting) {
                
                // Animasikan Judul masuk dari kiri
                anime({
                    targets: '.sao-quest-title',
                    opacity: [0, 1],
                    translateX: [-50, 0],
                    duration: 800,
                    easing: 'easeOutExpo'
                });
                
                // Animasikan Kartu Proyek masuk dari bawah satu per satu
                anime({
                    targets: '.sao-card',
                    opacity: [0, 1],
                    translateY: [50, 0],
                    delay: anime.stagger(150),
                    duration: 800,
                    easing: 'easeOutExpo'
                });

                // Hentikan pantauan agar animasi tidak berulang setiap kali di-scroll
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1 // Animasi dimulai saat 10% bagian teratas masuk ke layar
    });

    // Mulai pantau elemen quests
    const questsSection = document.getElementById('quests');
    if(questsSection) {
        observer.observe(questsSection);
    }
});
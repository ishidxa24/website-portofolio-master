// Menunggu seluruh halaman (termasuk gambar) selesai dimuat
window.addEventListener('load', function() {

    // Ambil elemen loader dan konten utama berdasarkan ID-nya
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    // Atur waktu tunggu sebelum menyembunyikan loader (2000ms = 2 detik)
    setTimeout(() => {
        // 1. Buat loader menjadi transparan (memulai animasi fade-out)
        loader.style.opacity = '0';

        // 2. Tampilkan konten utama dengan membuatnya tidak transparan (memulai animasi fade-in)
        mainContent.style.opacity = '1';

        // 3. Setelah animasi fade-out selesai (1 detik), sembunyikan loader sepenuhnya
        //    agar tidak menghalangi interaksi dengan konten di bawahnya.
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000); // Durasi ini harus sama dengan 'duration-1000' di kelas CSS

    }, 2000);

});
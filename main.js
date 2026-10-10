/* ===================== CONFIG ===================== */
const CFG = {
    loader: { bar: 1000, fade: 400 },

    contact: {
        user: "adikusumanyxly",
        domain: "gmail.com",
        phone: "6287782869155",
        subject: "Inquiry from Portfolio",
        message: "Halo Adi, saya tertarik dengan portofolio Anda."
    },

    preview: {
        ids: { modal: "sao-pdf-modal", window: "sao-pdf-window", frame: "pdf-modal-frame", title: "pdf-modal-title" },
        prefix: "",
        openDelay: 10,
        closeDuration: 300,       // samakan dengan transition CSS (ms)
        closeOnEsc: true,
        closeOnBackdrop: true,
        lockScroll: true,
        defaultType: "pdf",
        ext: {
            pdf: ["pdf"],
            image: ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"],
            video: ["mp4", "webm", "ogg", "mov"]
        }
    },

    pdf: {
        libUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
        workerUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
        maxPages: 20,
        maxWidth: 1100,           // lebar maksimum halaman (px)
        maxRatio: 2,              // ketajaman render
        padding: 16,
        gap: 12,
        bg: "#05080c",
        loadingText: "Memuat sertifikat...",
        errorText: "Gagal memuat sertifikat. Periksa nama file dan lokasinya.",
        showErrorDetail: true     // ubah ke false saat sudah live
    }
};

const $ = (id) => document.getElementById(id);
const P = CFG.preview, PDF = CFG.pdf;

/* ===================== LOADER ===================== */
// Aman dipakai di halaman mana pun: tanpa loader / tanpa anime.js, script tidak error.
const ANIMATED = "#sao-container,.sao-element,.sao-skill,.sao-action,.sao-quest-title,.sao-card";

function showWithoutAnimation(loader) {
    loader.style.display = "none";
    document.querySelectorAll(ANIMATED).forEach((el) => {
        el.style.opacity = 1;
        el.style.scale = "1";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initPreviewSystem();

    const bar = $("loader-bar"), pct = $("loader-percentage"), loader = $("sao-loader");
    if (!loader) return;                                                  // halaman tanpa loader
    if (typeof anime === "undefined") return showWithoutAnimation(loader); // anime.js gagal dimuat

    const progress = { value: 0 };

    anime.timeline({ easing: "easeInOutQuad" })
        .add({
            targets: progress,
            value: 100,
            duration: CFG.loader.bar,
            update: () => {
                const v = Math.floor(progress.value);
                if (bar) bar.style.width = v + "%";
                if (pct) pct.innerHTML = v + "%";
            }
        })
        .add({
            targets: loader,
            opacity: 0,
            duration: CFG.loader.fade,
            complete: () => {
                loader.style.display = "none";
                startMainPortfolioAnimation();
            }
        });
});

/* ===================== KONTAK ===================== */
function openGmail() {
    const c = CFG.contact;
    const q = `view=cm&fs=1&to=${c.user}@${c.domain}&su=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.message)}`;
    window.open(`https://mail.google.com/mail/?${q}`, "_blank");
}

function openWhatsApp() {
    window.open(`https://wa.me/${CFG.contact.phone}?text=${encodeURIComponent(CFG.contact.message)}`, "_blank");
}

/* ===================== ANIMASI UTAMA ===================== */
function startMainPortfolioAnimation() {
    // [target, properti, offset timeline]
    const steps = [
        ["#sao-container", { opacity: [0, 1], scale: [0.95, 1], duration: 800 }],
        [".sao-element", { opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(100), duration: 600 }, "-=400"],
        [".sao-skill", { opacity: [0, 1], translateX: [-20, 0], delay: anime.stagger(100), duration: 500 }, "-=300"],
        [".sao-action", { opacity: [0, 1], scale: [0.9, 1], delay: anime.stagger(80), duration: 400 }, "-=300"],
        [".sao-quest-title", { opacity: [0, 1], translateY: [-20, 0], duration: 600 }, "-=200"],
        [".sao-card", { opacity: [0, 1], translateY: [30, 0], delay: anime.stagger(150), duration: 700 }, "-=400"]
    ];

    const tl = anime.timeline({ easing: "easeOutExpo" });
    steps.forEach(([targets, props, offset]) => tl.add({ targets, ...props }, offset));
}

/* ===================== PREVIEW UNIVERSAL =====================
   openPreview('sertif/cv.pdf', 'CV')            -> PDF (canvas, tanpa download)
   openPreview('img/a.png', 'Foto')              -> gambar
   openPreview('video/a.mp4', 'Demo')            -> video
   openPreview('https://...', 'Live Demo', 'web') -> iframe
   Atau HTML: <button data-preview="sertif/cv.pdf" data-preview-title="CV">
   Kode lama openPdfPreview() / closePdfPreview() tetap jalan.
================================================================ */
const S = { open: false, timer: null, token: 0, doc: null, lib: null, v: {} };

const els = () => ({
    modal: $(P.ids.modal),
    win: $(P.ids.window),
    frame: $(P.ids.frame),
    title: $(P.ids.title)
});

const safeUrl = (u) => {
    try { return encodeURI(decodeURI(u)); } catch { return u; }
};

function detectType(url) {
    const e = url.split(/[?#]/)[0].split(".").pop().toLowerCase();
    for (const t in P.ext) if (P.ext[t].includes(e)) return t;
    return /^https?:/i.test(url) ? "web" : P.defaultType;
}

/* ---------- PDF.js ---------- */
const loadPdfJs = () =>
    window.pdfjsLib
        ? Promise.resolve(window.pdfjsLib)
        : (S.lib ||= new Promise((ok, fail) => {
            const s = document.createElement("script");
            s.src = PDF.libUrl;
            s.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = PDF.workerUrl;
                ok(pdfjsLib);
            };
            s.onerror = () => { S.lib = null; fail(new Error("Gagal memuat PDF.js")); };
            document.head.appendChild(s);
        }));

function pdfMessage(text) {
    const box = S.v.pdf, d = document.createElement("div");
    d.textContent = text;
    d.style.cssText = "color:#9ca3af;text-align:center;padding:40px 16px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;";
    box.innerHTML = "";
    box.appendChild(d);
}

async function renderPdf(url) {
    const box = S.v.pdf, token = ++S.token, stale = () => token !== S.token;
    pdfMessage(PDF.loadingText);

    try {
        const lib = await loadPdfJs();
        if (stale()) return;

        // Unduh utuh dulu (hindari range request bermasalah di Live Server / IDM)
        const res = await fetch(url);
        if (!res.ok) throw Object.assign(new Error(), { name: "HTTP " + res.status });
        const buf = await res.arrayBuffer();
        if (stale()) return;

        const head = new TextDecoder("latin1").decode(new Uint8Array(buf, 0, Math.min(1024, buf.byteLength)));
        if (!head.includes("%PDF-")) {
            throw Object.assign(new Error(), {
                name: `Bukan PDF valid, ukuran ${buf.byteLength} byte, tipe ${res.headers.get("content-type") || "?"}`
            });
        }

        const doc = await lib.getDocument({ data: new Uint8Array(buf) }).promise;
        if (stale()) return doc.destroy();
        S.doc = doc;

        box.innerHTML = "";
        box.scrollTop = 0;

        const width = Math.max(200, Math.min(box.clientWidth - PDF.padding * 2, PDF.maxWidth));
        const ratio = Math.min(window.devicePixelRatio || 1, PDF.maxRatio);

        for (let i = 1; i <= Math.min(doc.numPages, PDF.maxPages); i++) {
            const page = await doc.getPage(i);
            if (stale()) return;

            const base = page.getViewport({ scale: 1 });
            const vp = page.getViewport({ scale: (width / base.width) * ratio });

            const canvas = document.createElement("canvas");
            canvas.width = Math.floor(vp.width);
            canvas.height = Math.floor(vp.height);
            canvas.style.cssText =
                `display:block;margin:0 auto ${PDF.gap}px;background:#fff;max-width:100%;` +
                `width:${width}px;height:${Math.floor(vp.height / ratio)}px;`;
            box.appendChild(canvas);

            await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
        }
    } catch (err) {
        console.error("Preview PDF gagal:", err);
        if (!stale()) {
            const why = (err && (err.name || err.message)) || "Unknown";
            pdfMessage(PDF.errorText + (PDF.showErrorDetail ? ` [${why}] ${url}` : ""));
        }
    }
}

/* ---------- Viewer ---------- */
function ensureViewers(frame) {
    if (S.v.pdf) return;
    const parent = frame.parentNode;
    parent.style.cssText += ";min-height:0;overflow:hidden;"; // konten panjang scroll di dalam

    const mk = (tag, cls, css, props = {}) => {
        const e = Object.assign(document.createElement(tag), props);
        e.className = cls;
        e.style.cssText = "display:none;" + css;
        parent.insertBefore(e, frame.nextSibling);
        return e;
    };

    S.v.pdf = mk("div", "w-full h-full border border-gray-600/50",
        `height:100%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;` +
        `-webkit-overflow-scrolling:touch;padding:${PDF.padding}px;background:${PDF.bg};box-sizing:border-box;`);
    S.v.image = mk("img", frame.className, "object-fit:contain;", { alt: "Preview" });
    S.v.video = mk("video", frame.className, "object-fit:contain;", { controls: true, playsInline: true });
    S.v.video.setAttribute("controlsList", "nodownload");
    S.v.web = frame;
}

function resetViewers() {
    S.token++; // batalkan render PDF yang berjalan
    if (S.doc) { S.doc.destroy(); S.doc = null; }

    const { pdf, image, video, web } = S.v;
    if (!pdf) return;

    [pdf, image, video, web].forEach((e) => (e.style.display = "none"));
    pdf.innerHTML = "";
    image.removeAttribute("src");
    video.pause();
    video.removeAttribute("src");
    video.load();
    web.src = "";
}

/* ---------- Buka / tutup ---------- */
function openPreview(url, titleText, type) {
    const { modal, win, frame, title } = els();
    if (!modal || !win || !frame || !title || !url) return;

    clearTimeout(S.timer);
    ensureViewers(frame);
    resetViewers();

    const kind = type || detectType(url), src = safeUrl(url), viewer = S.v[kind] || S.v.pdf;
    title.textContent = P.prefix + (titleText || "");

    // Tampilkan modal dulu supaya lebar kontainer bisa dihitung
    modal.classList.replace("hidden", "flex");
    if (P.lockScroll) document.body.style.overflow = "hidden";

    viewer.style.display = "block";
    if (viewer === S.v.pdf) renderPdf(src);
    else viewer.src = src;

    setTimeout(() => {
        modal.classList.replace("opacity-0", "opacity-100");
        win.classList.replace("scale-95", "scale-100");
    }, P.openDelay);

    S.open = true;
}

function closePreview() {
    const { modal, win } = els();
    if (!modal || !win || !S.open) return;
    S.open = false;

    modal.classList.replace("opacity-100", "opacity-0");
    win.classList.replace("scale-100", "scale-95");

    S.timer = setTimeout(() => {
        modal.classList.replace("flex", "hidden");
        resetViewers();
        if (P.lockScroll) document.body.style.overflow = "";
    }, P.closeDuration);
}

// Kompatibilitas kode lama
const openPdfPreview = (url, title) => openPreview(url, title, "pdf");
const closePdfPreview = () => closePreview();

/* ---------- Event ---------- */
function initPreviewSystem() {
    const { modal } = els();

    if (modal && P.closeOnBackdrop) {
        modal.addEventListener("click", (e) => e.target === modal && closePreview());
    }

    document.addEventListener("keydown", (e) => {
        if (P.closeOnEsc && S.open && e.key === "Escape") closePreview();
    });

    document.addEventListener("click", (e) => {
        const t = e.target.closest("[data-preview]");
        if (!t) return;
        e.preventDefault();
        openPreview(t.dataset.preview, t.dataset.previewTitle || t.textContent.trim(), t.dataset.previewType);
    });
}
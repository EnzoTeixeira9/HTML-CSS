(function () {
    const openBtn = document.getElementById('open-pdf');
    const modal = document.getElementById('pdf-modal');
    const closeBtn = document.getElementById('close-pdf');
    const frame = document.getElementById('pdf-frame');
    const pdfPath = 'cv.pdf';
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    const certCards = document.querySelectorAll('.cert-card');
    const prevBtn = document.getElementById('prev-pdf');
    const nextBtn = document.getElementById('next-pdf');
    const caption = document.getElementById('pdf-caption');

    let viewerPdfs = [];
    let viewerIndex = 0;
    let viewerTitle = '';

    openBtn && openBtn.addEventListener('click', function () {
        openViewer([pdfPath], 0, 'CV');
    });

    closeBtn && closeBtn.addEventListener('click', function () {
        modal.setAttribute('hidden', '');
        frame.src = '';
        viewerPdfs = [];
    });

    modal && modal.addEventListener('click', function (e) {
        if (e.target === modal) { modal.setAttribute('hidden', ''); frame.src = ''; viewerPdfs = []; }
    });

    menuIcon && menuIcon.addEventListener('click', function () {
        navbar && navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    });

    navbar && navbar.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navbar && navbar.classList.remove('active');
            menuIcon && menuIcon.classList.remove('bx-x');
        }
    });

    certCards && certCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const multi = card.dataset.pdfs;
            const single = card.dataset.pdf;
            const title = card.dataset.title || '';
            if (multi) {
                const arr = multi.split(',').map(s => s.trim()).filter(Boolean);
                openViewer(arr, 0, title || 'CNIL');
            } else if (single) {
                openViewer([single.trim()], 0, title || '');
            }
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
    });

    prevBtn && prevBtn.addEventListener('click', function () { navigateViewer(-1); });
    nextBtn && nextBtn.addEventListener('click', function () { navigateViewer(1); });

    function openViewer(list, index, title) {
        viewerPdfs = list.slice();
        viewerIndex = index || 0;
        viewerTitle = title || '';
        updateViewer();
        modal && modal.removeAttribute('hidden');
    }

    function updateViewer() {
        if (!frame) return;
        const src = viewerPdfs[viewerIndex] || '';
        frame.src = src;
        caption && (caption.textContent = viewerTitle + (viewerPdfs.length > 1 ? ` — ${viewerIndex + 1}/${viewerPdfs.length}` : ''));
        if (prevBtn) prevBtn.style.display = (viewerPdfs.length > 1 ? 'inline-flex' : 'none');
        if (nextBtn) nextBtn.style.display = (viewerPdfs.length > 1 ? 'inline-flex' : 'none');
    }

    function navigateViewer(delta) {
        if (!viewerPdfs.length) return;
        viewerIndex = (viewerIndex + delta + viewerPdfs.length) % viewerPdfs.length;
        updateViewer();
    }
})();

// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');
    const hesapListesi = document.getElementById('hesapListesi');
    const contentSections = document.getElementById('contentSections');
    const initialDisclaimer = document.getElementById('initialDisclaimer');

    // Resimleri önceden yükleme fonksiyonu (Promise yapısıyla)
    function preloadImages() {
        return new Promise((resolve) => {
            const imageUrls = [
                'icons/hesaplamasec.jpg', // HTML dosyanla eşleşmesi için güncellendi
                'icons/anasayfa.jpg',
                'icons/hepsi.jpg',
                'icons/protein.jpg',
                'icons/kreatin.jpg',
                'icons/Kafein.jpg',
                'icons/sitrulin.jpg',
                'icons/beta.jpg',
                'icons/karnitin.jpg',
                'icons/eaa.jpg',
                'icons/bcaa.jpg',
                'icons/arjinin.jpg',
                'icons/glutamin.jpg',
                'icons/yag.jpg',
                'icons/kreatinin.jpg',
            ];
            let imagesLoaded = 0;
            const totalImages = imageUrls.length;

            if (totalImages === 0) {
                resolve();
                return;
            }

            imageUrls.forEach(url => {
                const img = new Image();
                img.onload = () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        resolve();
                    }
                };
                img.onerror = () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        resolve();
                    }
                };
                img.src = url;
            });
        });
    }

    // Klavye navigasyonu ve odaklama yönetimi
    document.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const visibleFocusableElements = Array.from(document.querySelectorAll('.section:not([style*="display: none"]) input:not([type="hidden"]), .section:not([style*="display: none"]) select, .section:not([style*="display: none"]) button:not(.no-focus-on-enter)'));
                const currentIndex = visibleFocusableElements.indexOf(this);

                const nextElement = visibleFocusableElements[(currentIndex + 1) % visibleFocusableElements.length];
                if (nextElement) {
                    nextElement.focus();
                } else if (visibleFocusableElements.length > 0) {
                    visibleFocusableElements [0].focus();
                } else {
                    const activeSection = document.querySelector('.section:not([style*="display: none"])');
                    if (activeSection) {
                        const calculateBtn = activeSection.querySelector('button');
                        if (calculateBtn) calculateBtn.click();
                    }
                }
            }
        });
    });

    // Tooltip benzeri bilgi balonları ekle
    addInfoTooltips();

    // Dropdown menüyü açma/kapama
    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('open');
        dropdownButton.classList.toggle('active');
    });

    // Sayfanın herhangi bir yerine tıklandığında menüyü kapatma
    document.addEventListener('click', (e) => {
        if (!dropdownButton.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('open');
            dropdownButton.classList.remove('active');
        }
    });

    // Hesaplama listesinden seçim yapma
    hesapListesi.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (listItem) {
            const selectedValue = listItem.dataset.value;
            if (selectedValue) {
                if (selectedValue === 'home') {
                    window.location.hash = '';
                } else {
                    window.location.hash = selectedValue;
                }
            }
        }
        dropdownContent.classList.remove('open');
        dropdownButton.classList.remove('active');
    });

    // URL hash'ini kontrol eden ve içeriği yükleyen fonksiyon (basitleştirildi ve düzeltildi)
    function loadContentFromHash() {
        const hash = window.location.hash.substring(1);
        document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

        const dropdownIconImg = dropdownButton.querySelector('.dropdown-icon-img');
        const dropdownText = dropdownButton.querySelector('.dropdown-text');

        if (hash) {
            initialDisclaimer.style.display = 'none';
            loadSection(hash);
            
            const selectedItem = document.querySelector(`[data-value="${hash}"]`);
            if (selectedItem) {
                const selectedText = selectedItem.querySelector('.menu-text').textContent;
                const iconSrc = selectedItem.querySelector('.menu-icon-img').src;
                
                // Sadece resim ve metni güncelliyoruz, tüm butonu değil.
                dropdownIconImg.src = iconSrc;
                dropdownIconImg.alt = selectedText;
                dropdownText.textContent = selectedText;
            }
        } else {
            // Ana sayfa için varsayılan içeriği atıyoruz.
            dropdownIconImg.src = 'icons/hesaplamasec.jpg'; // HTML'deki resim yolu
            dropdownIconImg.alt = 'Hesaplama';
            dropdownText.textContent = 'Hesaplama Türü Seçiniz';
            
            initialDisclaimer.style.display = 'block';
            contentSections.innerHTML = '';
            
            if (window.location.hash) {
                history.replaceState(null, '', ' ');
            }
        }
        adjustPageHeight();
    }

    // Sayfanın yüksekliğini içeriğe göre ayarlayan fonksiyon
    function adjustPageHeight() {
      const isHomepage = window.location.hash === '';
      document.body.classList.toggle('anapage', isHomepage);
      const mainContent = document.querySelector('.main-scroll-content');
      if (isHomepage) {
        mainContent.style.flexGrow = 1;
        mainContent.style.minHeight = 'auto';
      } else {
        mainContent.style.flexGrow = 'unset';
        mainContent.style.minHeight = 'calc(100vh - 200px)';
      }
    }

    window.addEventListener('hashchange', () => loadContentFromHash());

    // Resimlerin yüklenmesini bekle ve ardından ilk içeriği yükle
    preloadImages().then(() => {
        loadContentFromHash();
    });

    // Bölüm yükleme fonksiyonu
    async function loadSection(selectedValue) {
        initialDisclaimer.style.display = 'none';
        contentSections.innerHTML = '';

        try {
            const response = await fetch(`sections/${selectedValue}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}. Section file not found or server error.`);
            }
            const htmlContent = await response.text();
            contentSections.innerHTML = htmlContent;

            const section = contentSections.querySelector('.section');
            if (section) {
                section.style.display = "block";
                setTimeout(() => {
                    section.style.opacity = "1";
                }, 10);
                
                // Buradaki otomatik odaklama kodu, klavyenin açılmasına neden oluyordu.
                // İsteğiniz üzerine bu kısım kaldırıldı.
                // const firstInput = section.querySelector('input:not([type="hidden"]), select');
                // if (firstInput) {
                //     firstInput.focus();
                // }
            }

            const accordionHeaders = document.querySelectorAll('.accordion-header');
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const accordionItem = this.parentElement;
                    accordionItem.classList.toggle('active');
                });
            });

            const scripts = contentSections.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                    newScript.async = false;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

        } catch (error) {
            console.error('Bölüm yüklenirken bir hata oluştu:', error);
            contentSections.innerHTML = `<div class="disclaimer danger">Hesaplama yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>`;
            initialDisclaimer.style.display = 'block';
            history.replaceState(null, '', ' ');
        }
    }
});

// Bilgi Tooltip Fonksiyonu
function addInfoTooltips() {
    const tooltips = {
        'p_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        'p_hedef': 'Mevcut fitness hedefinizi seçin.',
        'y_cinsiyet': 'Cinsiyetinize göre farklı hesaplama yapılacaktır.',
        'y_boy': 'Santimetre cinsinden boyunuzu girin.',
        'y_kilo': 'Kilogram cinsinden ağırlığınızı girin.',
        'y_boyun': 'Boyun çevrenizi cm cinsinden ölçün.',
        'y_bel': 'Bel çevrenizi cm cinsinden ölçün.',
        'y_kalca': 'Kalça çevrenizi cm cinsinden ölçün (kadınlar için).',
        'k_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        'b_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        's_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        'l_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        'c_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        'toplu_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin.',
        'toplu_hedef': 'Mevcut fitness hedefinizi seçin.',
        'gender': 'Cinsiyetinizi seçin (erkek/kadın).',
        'age': 'Yaşınızı girin.',
        'weight': 'Kilonuzu kilogram cinsinden girin.',
        'height': 'Boyunuzu santimetre cinsinden girin.',
        'fat': 'Vücut yağ oranınızı yüzde olarak girin (örneğin %15 için 15). Opsiyoneldir ancak daha doğru sonuç sağlar.',
        'water': 'Son 24 saat içinde attığınız idrar hacmini litre cinsinden girin (ortalama 1.5 Litre). Opsiyoneldir.',
        'protein': 'Günlük ortalama et ve hayvansal ürünlerden aldığınız protein miktarını gram cinsinden girin (ortalama 60g). Opsiyoneldir.',
        'creatine': 'Günlük kreatin takviyesi alıyorsanız gram cinsinden miktarını girin (ortalama 0g). Opsiyoneldir.',
        'activity': 'Aktivite seviyenizi 0 (çok az aktif) ile 10 (çok aktif, sporcu) arasında bir sayı olarak girin (ortalama 5). Opsiyoneldir.',
        'lbmMethod': 'Yağsız Vücut Kütlesi (LBM) hesaplama yöntemini seçin. Yağ oranınız biliniyorsa "Yağ Oranına Göre" daha hassas olabilir. Bilinmiyorsa "Boer Formülü" kullanılabilir.'
    };

    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltips[id]);
            element.setAttribute('aria-label', tooltips[id]);
        }
    });
}

// Sayfa içeriği tamamen yüklendikten sonra çalışacak kod bloğu
document.addEventListener('DOMContentLoaded', function() {
    // Gerekli HTML elemanlarını seçme
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');

    // Eğer menü butonları ve içerikleri varsa
    if (dropdownButton && dropdownContent) {
        // Dropdown butonuna tıklandığında çalışacak işlev
        dropdownButton.addEventListener('click', function() {
            // Dropdown içeriğinin görünürlüğünü CSS sınıfı ile değiştirme
            dropdownContent.classList.toggle('open');
            // Butonun durumunu (açık/kapalı) CSS sınıfı ile değiştirme
            this.classList.toggle('active');
        });
    }

    // Menü dışına tıklandığında menüyü kapatma işlevi
    window.addEventListener('click', function(e) {
        // Tıklanan yerin dropdown butonu veya menü içeriği olmadığından emin olma
        if (!dropdownButton.contains(e.target) && !dropdownContent.contains(e.target)) {
            // Eğer menü açıksa, kapat
            if (dropdownContent.classList.contains('open')) {
                dropdownContent.classList.remove('open');
                dropdownButton.classList.remove('active');
            }
        }
    });

    // Tema değiştirme butonuna ait kodlar da buraya eklenebilir.
    // Diğer tüm JavaScript fonksiyonların da bu blok içinde yer alabilir.
});
// Sayfa içeriği tamamen yüklendikten sonra çalışacak kod bloğu
document.addEventListener('DOMContentLoaded', function() {
    // Gerekli HTML elemanlarını seçme
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');

    // Eğer menü butonları ve içerikleri varsa
    if (dropdownButton && dropdownContent) {
        // Dropdown butonuna tıklandığında çalışacak işlev
        dropdownButton.addEventListener('click', function() {
            // Dropdown içeriğinin görünürlüğünü CSS sınıfı ile değiştirme
            dropdownContent.classList.toggle('open');
            // Butonun durumunu (açık/kapalı) CSS sınıfı ile değiştirme
            this.classList.toggle('active');
        });
    }

    // Menü dışına tıklandığında menüyü kapatma işlevi
    window.addEventListener('click', function(e) {
        // Tıklanan yerin dropdown butonu veya menü içeriği olmadığından emin olma
        if (!dropdownButton.contains(e.target) && !dropdownContent.contains(e.target)) {
            // Eğer menü açıksa, kapat
            if (dropdownContent.classList.contains('open')) {
                dropdownContent.classList.remove('open');
                dropdownButton.classList.remove('active');
            }
        }
    });

    // Tema değiştirme butonuna ait kodlar da buraya eklenebilir.
    // Diğer tüm JavaScript fonksiyonların da bu blok içinde yer alabilir.
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggleButton');
    const buttonText = themeToggleButton.querySelector('.button-text');
    
    // Başlangıç temasını kontrol et ve ayarla
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateButtonContent(currentTheme);

    // Tema değiştirme işlevi
    themeToggleButton.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonContent(newTheme);
    });

    // Buton metnini güncelle
    function updateButtonContent(theme) {
        const isDark = theme === 'dark';
        buttonText.textContent = isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç';
    }
});
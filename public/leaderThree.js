// Hamburger menüsüne tıklama olayını ekle
document.getElementById('hamburger-menu').addEventListener('click', function() {
    const leaderboard = document.getElementById('leaderboard-container');
    
    // Liderlik tablosunu aç/kapat
    leaderboard.style.display = (leaderboard.style.display === 'none' || leaderboard.style.display === '') ? 'block' : 'none';
});

//Lider Tablosu yazısı aç/kapat
document.getElementById('hamburger-menu').addEventListener('click', function() {
    const ldtitle = document.getElementById('leaderboard-title');
    
    // Liderlik tablosunu aç/kapat
    ldtitle.style.display = (ldtitle.style.display === 'none' || ldtitle.style.display === '') ? 'block' : 'none';
});

function updateLeaderboard() {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById('leaderboard-list');
            leaderboardList.innerHTML = ''; // Önceki veriyi temizle
            
            data.forEach(item => {
                const li = document.createElement('li');
                
                // Bayrak SVG dosyasının yolunu oluşturun
                const flagPath = `flags/${item.country.toLowerCase()}.svg`;

                li.innerHTML = `<img src="${flagPath}" alt="${item.country} flag" class="flag-icon">
                ${item.country}: ${item.total_clicks}`;
                
                leaderboardList.appendChild(li);
            });
        })
        .catch((error) => console.error('Liderlik tablosu güncellenemedi:', error));
}
// Sayfa yüklendiğinde liderlik tablosunu güncelle
updateLeaderboard();

// Her 50 saniyede bir liderlik tablosunu güncelle
setInterval(updateLeaderboard, 50000);

// Ülke isimlerini SVG üzerinde otomatik ekle
document.querySelectorAll('#world-map path').forEach(country => {  
    const countryName = country.getAttribute('title'); // Ülke adını title attribute'dan al  
    const bbox = country.getBBox(); // Ülkenin sınır kutusunu al  

    // Ülkenin boyutlarına göre font büyüklüğünü hesapla  
    const scaleFactor = Math.min(bbox.width, bbox.height) / 10;  
    const fontSize = Math.max(scaleFactor, 5); // Minimum font boyutunu 5px olarak ayarla  

    // Eğer ülke daha önce eklenmişse, metin elementini güncelle  
    let existingText = document.getElementById(`label-${countryName}`);  
    
    if (existingText) {  
        existingText.setAttribute("x", bbox.x + bbox.width / 2);  
        existingText.setAttribute("y", bbox.y + bbox.height / 2);  
    } else {  
        // Ülke ismini SVG'ye ekle  
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");  
        textElement.setAttribute("id", `label-${countryName}`); // Benzersiz ID  
        textElement.setAttribute("x", bbox.x + bbox.width / 2); // Ortalanmış X pozisyonu  
        textElement.setAttribute("y", bbox.y + bbox.height / 2); // Ortalanmış Y pozisyonu  
        textElement.setAttribute("class", "country-label");  
        textElement.setAttribute("text-anchor", "middle"); // Metni ortalamak için  
        textElement.setAttribute("alignment-baseline", "middle"); // Y ekseninde ortalama  
        textElement.setAttribute("font-size", `${fontSize}px`); // Dinamik olarak ayarlanmış font büyüklüğü  
        textElement.textContent = countryName;  

        // SVG'ye ekle  
        document.getElementById('world-map').appendChild(textElement);  
    }  
});


// Zoom seviyesini hesaplamak için bir fonksiyon
function getZoomLevel() {
    const matrix = window.getComputedStyle(document.getElementById('world-map')).transform;
    if (matrix === 'none') return 1; // Ölçeklenmiş değilse varsayılan zoom seviyesini döndür
    const values = matrix.match(/matrix\(([^)]+)\)/)[1].split(',').map(parseFloat);
    return Math.sqrt(values[0] * values[0] + values[1] * values[1]);
}

// Sayfa yüklendiğinde ve zoom seviyesinde değişiklik olduğunda etiketleri yeniden ekle
window.addEventListener('load', addCountryLabels);
window.addEventListener('resize', addCountryLabels); // Yakınlaştırma işlemi sırasında da etiketleri güncellemek için

// Yakınlaştırma işlemi sırasında etiketleri güncellemek için
document.getElementById('world-map').addEventListener('wheel', addCountryLabels);


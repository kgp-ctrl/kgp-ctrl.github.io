const map = document.getElementById('world-map');
let isPanning = false;
let startX, startY;
let scale = 1, originX = 0, originY = 0;

function applyTransform() {
map.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
}

// Mouse down olayı
map.addEventListener('mousedown', function(e) {
if (e.button === 0) { // Sol fare tuşu
isPanning = true;
startX = e.clientX;
startY = e.clientY;

const matrix = window.getComputedStyle(map).transform;
if (matrix === 'none') {
    originX = 0;
    originY = 0;
} else {
    const values = matrix.match(/matrix\(([^)]+)\)/)[1].split(',').map(parseFloat);
    originX = values[4];
    originY = values[5];
    scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
}
}
});

// Mouse move olayı
map.addEventListener('mousemove', function(e) {
if (isPanning) {
const dx = e.clientX - startX;
const dy = e.clientY - startY;
map.style.transform = `translate(${originX + dx}px, ${originY + dy}px) scale(${scale})`;
}
});

// Mouse up olayı
map.addEventListener('mouseup', function() {
isPanning = false;
});

// Mouse wheel olayı (zoom)
map.addEventListener('wheel', function(e) {
e.preventDefault();

// Yumuşak bir yakınlaştırma için zoomFactor
const zoomFactor = Math.exp(e.deltaY * -0.005); // Daha düşük bir çarpan kullanarak daha yavaş zoom
const rect = map.getBoundingClientRect();
const offsetX = e.clientX - rect.left;
const offsetY = e.clientY - rect.top;

// Yakınlaştırma işlemi
scale = Math.max(0.1, Math.min(10, scale * zoomFactor));

originX -= (offsetX - originX) * (zoomFactor - 1);
originY -= (offsetY - originY) * (zoomFactor - 1);

applyTransform();
});
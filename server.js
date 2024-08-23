const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const app = express();
const PORT = 3000;

// Veritabanına bağlanma
let db = new sqlite3.Database('./clicker.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});


// 'countries' tablosunu oluşturma
db.run(`CREATE TABLE IF NOT EXISTS countries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
)`);

// HTML dosyasını okuma ve SVG içeriğini işleme
fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
    if (err) {
        console.error('HTML dosyası okunamadı:', err);
        return;
    }

    // SVG etiketini bulmak için regex kullanma
    const svgMatch = data.match(/<svg[\s\S]*<\/svg>/);
    if (svgMatch) {
        const svgContent = svgMatch[0];

        // SVG içeriğini ayrıştırma
        xml2js.parseString(svgContent, (err, result) => {
            if (err) {
                console.error('SVG içeriği ayrıştırılamadı:', err);
                return;
            }

            // SVG'deki tüm <path> elemanlarını bul
            const paths = result.svg.path;

            paths.forEach(path => {
                const countryCode = path.$.id;
                const countryName = path.$.title;

                // Ülkeyi veritabanına ekleme
                db.run(`INSERT OR IGNORE INTO countries (id, name) VALUES (?, ?)`, [countryCode, countryName], (err) => {
                    if (err) {
                        console.error('Ülke veritabanına eklenemedi:', err.message);
                    }
                });
            });

            console.log('Ülkeler veritabanına başarıyla eklendi.');
        });
    } else {
        console.error('SVG içeriği bulunamadı.');
    }
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 'clicks' tablosunu oluşturma
db.run(`CREATE TABLE IF NOT EXISTS clicks (
    country TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
)`);

app.use(express.static('public'));

// Tıklama sayısını güncelleme
app.post('/click', (req, res) => {
    const country = req.body.country;
    console.log(`Received click for country: ${country}`);
    db.run(`INSERT INTO clicks (country, count) VALUES (?, 1) 
            ON CONFLICT(country) DO UPDATE SET count = count + 1`, [country], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Database error");
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/leaderboard', (req, res) => {
    db.all(`
        SELECT c.name AS country, cl.count AS total_clicks 
        FROM clicks cl 
        JOIN countries c ON cl.country = c.id
        ORDER BY total_clicks DESC
    `, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});



// Sunucuyu başlatma
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

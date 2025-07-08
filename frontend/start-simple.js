const express = require('express');
const path = require('path');
const app = express();
const PORT = 4200;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'src')));

// Route principale
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Emploi du Temps Scolaire</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { color: #4caf50; }
            .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .btn { background: #1976d2; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
            .btn:hover { background: #1565c0; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .card { background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #1976d2; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎓 Emploi du Temps Scolaire</h1>
            <p class="success">✅ Frontend démarré avec succès !</p>
            
            <div class="info">
                <strong>🚀 Système Opérationnel</strong><br>
                Backend API: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a><br>
                Frontend: <a href="http://localhost:4200" target="_blank">http://localhost:4200</a>
            </div>

            <div class="grid">
                <div class="card">
                    <h3>👨‍🏫 Enseignants</h3>
                    <button class="btn" onclick="testAPI('/api/teachers')">Voir Enseignants</button>
                </div>
                <div class="card">
                    <h3>📚 Matières</h3>
                    <button class="btn" onclick="testAPI('/api/subjects')">Voir Matières</button>
                </div>
                <div class="card">
                    <h3>🏫 Classes</h3>
                    <button class="btn" onclick="testAPI('/api/classes')">Voir Classes</button>
                </div>
                <div class="card">
                    <h3>📅 Emploi du Temps</h3>
                    <button class="btn" onclick="generateTimetable()">Générer</button>
                </div>
            </div>

            <div id="result" style="margin-top: 20px;"></div>
        </div>

        <script>
            async function testAPI(endpoint) {
                try {
                    const response = await fetch('http://localhost:3000' + endpoint);
                    const data = await response.json();
                    document.getElementById('result').innerHTML = 
                        '<h3>Résultat:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML = 
                        '<p style="color: red;">Erreur: ' + error.message + '</p>';
                }
            }

            async function generateTimetable() {
                const testData = {
                    teachers: [
                        { id: 1, firstName: "Jean", lastName: "Dupont", subjects: [{id: 1}], 
                          availability: { "Lundi": [{start: "08:00", end: "16:30"}] } }
                    ],
                    subjects: [{ id: 1, name: "Mathématiques", duration: 60 }],
                    classes: [{ id: 1, name: "6ème A", subjects: [{id: 1}] }]
                };

                try {
                    const response = await fetch('http://localhost:3000/api/timetables/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(testData)
                    });
                    const data = await response.json();
                    document.getElementById('result').innerHTML = 
                        '<h3>Emploi du Temps Généré:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML = 
                        '<p style="color: red;">Erreur: ' + error.message + '</p>';
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log('🚀 Frontend simple démarré sur http://localhost:' + PORT);
  console.log('✅ Interface de test disponible');
});
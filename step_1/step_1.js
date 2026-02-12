const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Pagina /post con form minimale
app.get('/post', (req, res) => {
    res.send(`
        <form action="/post" method="POST">
            <input type="text" name="titolo" placeholder="Titolo" required />
            <button type="submit">Salva</button>
        </form>
    `);
});

// Salvataggio dati in post.json
app.post('/post', (req, res) => {
    const filePath = path.join(__dirname, 'post.json');
    const newPost = req.body;

    let posts = [];

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        posts = JSON.parse(data);
    }

    posts.push(newPost);

    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    res.send("Salvato");
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

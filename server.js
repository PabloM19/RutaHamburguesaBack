const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener los datos
app.get('/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener el menú de un restaurante específico por ID
app.get('/data/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const jsonData = JSON.parse(data);
    const restaurant = jsonData.find(item => item.id == id); // Busca el restaurante por ID

    if (restaurant) {
      res.json(restaurant.menu); // Devuelve solo el menú del restaurante
    } else {
      res.status(404).send('Restaurant not found'); // Si no se encuentra, devuelve un error 404
    }
  });
});

// Ruta para escribir datos
app.post('/data', (req, res) => {
  const newData = req.body;
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const jsonData = JSON.parse(data);
    jsonData.push(newData);
    
    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.status(201).send('Data added');
    });
  });
});

// Ruta para actualizar datos
app.put('/data/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const jsonData = JSON.parse(data);
    const index = jsonData.findIndex(item => item.id == id);

    if (index !== -1) {
      jsonData[index] = { ...jsonData[index], ...updatedData };
      fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Error writing file');
        }
        res.send('Data updated');
      });
    } else {
      res.status(404).send('Item not found');
    }
  });
});

// Ruta para borrar datos
app.delete('/data/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    let jsonData = JSON.parse(data);
    jsonData = jsonData.filter(item => item.id != id);

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.send('Data deleted');
    });
  });
});

//Ruta para el menu de los restaurantes
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

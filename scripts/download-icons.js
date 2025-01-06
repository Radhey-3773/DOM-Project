const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = {
  // Weather condition icons
  'sunny': 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
  'clear-night': 'https://cdn-icons-png.flaticon.com/512/3073/3073665.png',
  'partly-cloudy': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
  'cloudy-night': 'https://cdn-icons-png.flaticon.com/512/3075/3075858.png',
  'cloudy': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
  'rainy': 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png',
  'snowy': 'https://cdn-icons-png.flaticon.com/512/642/642102.png',
  'sleet': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
  'windy': 'https://cdn-icons-png.flaticon.com/512/959/959711.png',
  'foggy': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
  'thunder': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
  'thunderstorm': 'https://cdn-icons-png.flaticon.com/512/2675/2675785.png',
  
  // Weather metrics icons
  'humidity': 'https://cdn-icons-png.flaticon.com/512/728/728093.png',
  'wind': 'https://cdn-icons-png.flaticon.com/512/959/959711.png',
  'rain': 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png'
};

const downloadIcon = (name, url) => {
  const filepath = path.join(__dirname, '../public/weather-icons', `${name}.png`);
  const file = fs.createWriteStream(filepath);

  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${name}.png`);
    });
  }).on('error', (err) => {
    fs.unlink(filepath, () => {}); // Delete the file if there was an error
    console.error(`Error downloading ${name}: ${err.message}`);
  });
};

// Create the weather-icons directory if it doesn't exist
const iconDir = path.join(__dirname, '../public/weather-icons');
if (!fs.existsSync(iconDir)){
    fs.mkdirSync(iconDir, { recursive: true });
}

// Download all icons
Object.entries(icons).forEach(([name, url]) => downloadIcon(name, url)); 
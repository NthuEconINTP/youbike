import { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
      const data = await response.json();

      setStations(data);
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFavorite = (station) => {
    if (!favorites.find((fav) => fav.sno === station.sno)) { // 假設站點有編號，以編號為標識
      setFavorites([...favorites, station]);
      localStorage.setItem('favorites', JSON.stringify([...favorites, station]));
    }
  };
  
  const handleRemoveFavorite = (station) => {
    setFavorites(favorites.filter((favorite) => favorite.sno !== station.sno));
    localStorage.setItem('favorites', JSON.stringify(favorites.filter((favorite) => favorite.sno !== station.sno)));
  };
  
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favorites);
  }, []);
  
  const fetchData = async () => {
    const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
    const data = await response.json();
    console.log(data);
    setStations(data);
  };
  
  return (
    <div className="container">
      <h2>Favorites:</h2>
      <button onClick={fetchData}>Refresh Data</button>
      {favorites.length === 0 ? (
        <p>You have not selected any favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((station) => (
            <li key={station.sno}>
              <strong>{station.sna}</strong> ({station.sbi}/{station.tot})
              <button onClick={() => handleRemoveFavorite(station)}>Remove from favorites</button>
            </li>
          ))}
        </ul>
      )}
      <h1>Youbike Search</h1>
      <input type="text" onChange={handleSearch} value={searchTerm} placeholder="Search by station name" />
      <button onClick={fetchData}>Refresh Data</button>
      <h2>Results:</h2>
      <ul>
        {stations
          .filter((station) => station.sna.includes(searchTerm))
          .map((station) => (
            <li key={station.sno}>
              <strong>{station.sna}</strong> ({station.sbi}/{station.tot})
              {!favorites.find((fav) => fav.sno === station.sno) && <button onClick={() => handleFavorite(station)}>Add to favorites</button>}
              {favorites.find((fav) => fav.sno === station.sno) && <button onClick={() => handleRemoveFavorite(station)}>Remove from favorites</button>}
            </li>
          ))}
      </ul>
      
    </div>
  );
}

export default App
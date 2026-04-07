import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Bookshelf from './Bookshelf';
import './App.css';

function App() {
  console.log('App rendering');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

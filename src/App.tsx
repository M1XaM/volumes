import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Bookshelf from './Bookshelf';
import Why from './Why';
import './App.css';

function App() {
  console.log('App rendering');
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
        <Route path="/why" element={<Why />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import CountryDetails from './pages/CountryDetails';
import NotFound from './pages/NotFound';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path="/" element={<Home />} />
        {/*<Route path="/favoritos" element={<Favorites />} />
        <Route path="/pais/:code" element={<CountryDetails />} />
        <Route path="*" element={<NotFound />} />   */}
        </Route>
    </Routes>
  );
}

export default App;
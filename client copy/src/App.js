import { RecoilRoot } from "recoil";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./modules/components/navbar";
import About from "./modules/about/about";
import Mosaic from "./modules/mosaicTiler/explore";
import Home from "./modules/home/home";
export default function App() {
  const navbarLinks = [
        { path: "/home", title: "Home" },
    { path: "/", title: "Mosaic", exact: "true" },
    { path: "/about", title: "About" },

  ];

  return (
    <RecoilRoot>
      <Router>
        <Navbar links={navbarLinks} className="shadow-sm" />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Mosaic />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

import { RecoilRoot } from "recoil";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./modules/components/navbar";
import About from "./modules/about/about";
import Mosaic from "./modules/mosaicTiler/explore";
import Home from "./modules/home/home";
export default function App() {
  const navbarLinks = [
    { path: "/", title: "Home" },

    { path: "/mosaic", title: "Mosaic Explore", exact: "true" },
       { path: "/api", title: "API Access" },
    { path: "/about", title: "About" },

  ];

  return (
    <RecoilRoot>
      <Router>
        <Navbar links={navbarLinks} className="shadow-sm" />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/mosaic" element={<Mosaic />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

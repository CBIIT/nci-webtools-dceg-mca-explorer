import { RecoilRoot } from "recoil";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./modules/components/navbar";
import About from "./modules/about/about";
import Mosaic from "./modules/mosaicTiler/explore";
import Home from "./modules/home/home";
import Api from "./modules/api/api";
export default function App() {
  const navbarLinks = [
    { path: "/", title: "Home" },
    { path: "/mosaic", title: "mCA Explorer", exact: "true" },
    { path: "/api", title: "API Access" ,exact: "true" },
    { path: "/about", title: "About",exact: "true"  },

  ];

  return (
    <RecoilRoot>
      <Router>
        <Navbar links={navbarLinks} className="shadow-sm" />
        <Routes>
          <Route path="/mosaic" exact='true' element={<Mosaic />} />
          <Route path="/about" element={<About />} />
          <Route path="/api" element={<Api />} />
          <Route path="/" element={<Home />} />

        </Routes>
      </Router>
    </RecoilRoot>
  );
}

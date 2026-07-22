import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
  <Sidebar />

  <div style={{ flex: 1 }}>
    {children}
  </div>

  <Footer/>
</div>
  );
};

export default Layout;
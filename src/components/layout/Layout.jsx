import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import { NewsletterSubscribe } from "./NewsletterSubscribe";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <NewsletterSubscribe />
      <Footer />
    </div>
  );
};

export default Layout;

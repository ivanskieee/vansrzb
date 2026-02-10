import Home from "./pages/Home";
import Header from "./components/layout/Header";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4">
        <Home />
      </main>
    </div>
  );
}

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-8 mb-8">
          <a
            href="https://vite.dev"
            target="_blank"
            className="hover:opacity-80 transition-opacity"
          >
            <img src={viteLogo} className="logo w-24 h-24" alt="Vite logo" />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="hover:opacity-80 transition-opacity"
          >
            <img src={reactLogo} className="logo react w-24 h-24" alt="React logo" />
          </a>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Vite + React + TailwindCSS
        </h1>

        <div className="card bg-card border border-border rounded-lg p-6 mb-8 text-center">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            count is {count}
          </button>
          <p className="mt-4 text-muted-foreground">
            Edit <code className="bg-muted px-2 py-1 rounded text-foreground">src/App.tsx</code> and
            save to test HMR
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-primary mb-2">Primary</h3>
            <p className="text-sm text-muted-foreground">Primary color scheme</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-secondary-foreground mb-2">Secondary</h3>
            <p className="text-sm text-muted-foreground">Secondary color scheme</p>
          </div>
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <h3 className="font-semibold text-destructive mb-2">Destructive</h3>
            <p className="text-sm text-muted-foreground">Destructive color scheme</p>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;

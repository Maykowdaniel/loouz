import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 👇 ADICIONE ESTAS 2 LINHAS NO TOPO (MUITO IMPORTANTE)
import { Buffer } from 'buffer';
window.Buffer = Buffer; // Força o Buffer a existir globalmente
createRoot(document.getElementById("root")!).render(<App />);

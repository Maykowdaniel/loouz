import { Home, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. PEGA O ESTADO ATUAL (NOME/GÊNERO) PARA NÃO PERDER NA VIAGEM
  const currentState = location.state as { name?: string; gender?: string } | null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md pb-safe">
      <button 
        // 2. PASSA O "currentState" NO SEGUNDO PARÂMETRO DA NAVEGAÇÃO
        onClick={() => navigate("/lobby", { state: currentState })}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive("/lobby") ? "text-purple-500" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        <Home className={isActive("/lobby") ? "fill-purple-500/20" : ""} size={24} />
        <span className="text-[11px] font-medium">Lar</span>
      </button>
      
      <button 
        // 3. FAZ O MESMO AQUI
        onClick={() => navigate("/rooms", { state: currentState })} 
        className={`flex flex-col items-center gap-1 transition-colors ${isActive("/rooms") ? "text-purple-500" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        <MessageSquare className={isActive("/rooms") ? "fill-purple-500/20" : ""} size={24} />
        <span className="text-[11px] font-medium">Quartos</span>
      </button>
    </div>
  );
};

export default BottomNav;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolla a página para o topo sempre que a rota mudar.
 * Corrige o comportamento onde o conteúdo aparece "no meio" ao navegar.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

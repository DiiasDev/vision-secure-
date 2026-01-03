import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-compact">
      <div className="footer-compact-container">
        <div className="footer-compact-brand">
          <span className="footer-brand-name">Vision Secure</span>
          <span className="footer-tagline">Solução completa para monitoramento e segurança inteligente.</span>
        </div>

        <div className="footer-compact-links">
          <div className="footer-link-group">
            <h4>Links Rápidos</h4>
            <a href="#dashboard">Dashboard</a>
            <a href="#cameras">Câmeras</a>
            <a href="#alertas">Alertas</a>
            <a href="#configuracoes">Configurações</a>
          </div>

          <div className="footer-link-group">
            <h4>Suporte</h4>
            <a href="#ajuda">Central de Ajuda</a>
            <a href="#documentacao">Documentação</a>
            <a href="#contato">Contato</a>
            <a href="#privacidade">Privacidade</a>
          </div>

          <div className="footer-link-group">
            <h4>Contato</h4>
            <a href="mailto:contato@visionsecure.com">contato@visionsecure.com</a>
            <a href="tel:+551112345678">+55 (11) 1234-5678</a>
            <span className="footer-location">São Paulo, SP - Brasil</span>
          </div>
        </div>

        <div className="footer-compact-bottom">
          <p>© {currentYear} Vision Secure. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

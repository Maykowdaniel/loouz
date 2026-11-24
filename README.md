LOOUZ — Chat Aleatório por Vídeo e Texto
Plataforma web voltada à conexão espontânea entre pessoas de diferentes lugares do mundo, por meio de conversas aleatórias por vídeo e texto. O LOOUZ foi concebido como uma alternativa moderna aos serviços de chat com desconhecidos, com foco em acesso simples e experiência de uso em computadores e dispositivos móveis.

Site em produção: louuz.com
Repositório: github.com/Maykowdaniel/loouz
Sobre o projeto
O objetivo do LOOUZ é facilitar novas conexões online, reduzindo barreiras de entrada como a necessidade de criar uma conta antes de começar uma conversa. A aplicação oferece uma interface de tema escuro e apresenta modalidades de interação por vídeo e texto.
Funcionalidades apresentadas
- Chat aleatório por vídeo: proposta de conectar usuários para conversas em tempo real.
- Chat por texto: alternativa de comunicação sem utilização da câmera.
- Acesso sem cadastro: experiência apresentada como anônima e sem login obrigatório.
- Interface responsiva: navegação planejada para desktop e dispositivos móveis.
- Alcance internacional: experiência voltada à interação entre pessoas de diferentes regiões.
- Páginas informativas e FAQ: conteúdo que explica a proposta e o uso da plataforma.
As funcionalidades acima descrevem a proposta e a interface pública do produto. Sua disponibilidade depende dos serviços e configurações utilizados em cada ambiente.

Tecnologias e ferramentas
A estrutura do repositório inclui arquivos de configuração relacionados a:
- TypeScript — linguagem utilizada na base do projeto.
- Vite — ferramenta de desenvolvimento e build do frontend.
- Tailwind CSS — configuração de estilização da interface.
- Node.js e npm — ambiente e gerenciador de dependências para execução local.
- Vercel — implantação da aplicação web.
Para consultar as bibliotecas e versões exatas utilizadas, veja [`package.json`](./package.json).

Estrutura do repositório
loouz/
├── docs/              # Documentação e materiais de apoio
├── public/            # Arquivos estáticos públicos
├── scripts/           # Scripts auxiliares
├── server/            # Código relacionado ao servidor
├── src/               # Código-fonte da aplicação
├── index.html         # Página HTML de entrada
├── package.json       # Dependências e comandos do projeto
├── vite.config.ts     # Configuração do Vite
├── tailwind.config.ts # Configuração do Tailwind CSS
├── vitest.config.ts   # Configuração do Vitest
└── vercel.json        # Configuração de implantação na Vercel
Executando localmente
Pré-requisitos
- Git instalado.
- Node.js e npm instalados.
Instalação
1. Clone o repositório:
   git clone https://github.com/Maykowdaniel/loouz.git
2. Entre na pasta do projeto:
   cd loouz
3. Instale as dependências:
   npm install
4. Inicie o ambiente de desenvolvimento:
   npm run dev
5. Abra no navegador o endereço local informado no terminal.
Observação: recursos que dependam de serviços externos ou do backend podem exigir configurações de ambiente adicionais. Consulte os scripts do [`package.json`](./package.json) e as configurações do servidor antes de executá-los. Não publique credenciais em arquivos versionados.
Implantação
A versão pública da aplicação está disponível em https://www.louuz.com. O repositório contém um arquivo vercel.json associado à configuração de implantação.
Cuidados de segurança e privacidade
Como a proposta envolve conversas entre pessoas desconhecidas, aspectos importantes para a evolução do projeto incluem proteção de dados pessoais, tratamento de conteúdo inadequado, mecanismos de denúncia e gerenciamento seguro das conexões. Esta seção representa áreas de atenção; não é uma declaração de que todos esses mecanismos já foram implementados.
Evolução do projeto
O LOOUZ está publicado e pode receber melhorias contínuas de desempenho, usabilidade, acessibilidade, confiabilidade das conexões e segurança da experiência.
Autor
Desenvolvido por Maykowdaniel.
- GitHub: github.com/Maykowdaniel
- Demonstração: louuz.com

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Última atualização:</strong> 25 de outubro de 2025
        </p>

        <p className="text-gray-700 mb-6">
          Esta Política de Privacidade descreve como o JobConnect coleta, usa, armazena e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações que Coletamos</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Candidatos</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Nome completo</li>
            <li>Email</li>
            <li>Telefone</li>
            <li>Currículo (PDF)</li>
            <li>Histórico de candidaturas</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Empresas</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Razão social</li>
            <li>CNPJ</li>
            <li>Email corporativo</li>
            <li>Telefone</li>
            <li>Endereço</li>
            <li>Informações de pagamento (processadas pelo Mercado Pago)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Dados Técnicos</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Endereço IP</li>
            <li>Tipo de navegador</li>
            <li>Páginas visitadas</li>
            <li>Data e hora de acesso</li>
            <li>Cookies e tecnologias similares</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Como Usamos Suas Informações</h2>
          <p className="text-gray-700 mb-4">
            Utilizamos suas informações pessoais para:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Criar e gerenciar sua conta</li>
            <li>Processar candidaturas a vagas</li>
            <li>Processar pagamentos de assinaturas</li>
            <li>Enviar notificações sobre candidaturas e vagas</li>
            <li>Melhorar nossos serviços</li>
            <li>Cumprir obrigações legais</li>
            <li>Prevenir fraudes e abusos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Base Legal para Tratamento de Dados</h2>
          <p className="text-gray-700 mb-4">
            Tratamos seus dados pessoais com base nas seguintes bases legais da LGPD:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Consentimento:</strong> Ao criar uma conta e aceitar esta política</li>
            <li><strong>Execução de contrato:</strong> Para fornecer os serviços contratados</li>
            <li><strong>Cumprimento de obrigação legal:</strong> Para cumprir leis fiscais e regulatórias</li>
            <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
          <p className="text-gray-700 mb-4">
            Podemos compartilhar suas informações com:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Empresas contratantes:</strong> Quando você se candidata a uma vaga</li>
            <li><strong>Processadores de pagamento:</strong> Mercado Pago para processar transações</li>
            <li><strong>Provedores de serviços:</strong> Hospedagem, email, analytics</li>
            <li><strong>Autoridades legais:</strong> Quando exigido por lei</li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Não vendemos</strong> suas informações pessoais a terceiros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Armazenamento e Segurança</h2>
          <p className="text-gray-700 mb-4">
            Seus dados são armazenados em servidores seguros localizados no Brasil e nos Estados Unidos (AWS/Supabase). Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Criptografia de dados em trânsito (HTTPS/SSL)</li>
            <li>Criptografia de senhas (bcrypt)</li>
            <li>Controle de acesso baseado em funções</li>
            <li>Monitoramento de segurança</li>
            <li>Backups regulares</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="text-gray-700 mb-4">
            Você tem os seguintes direitos em relação aos seus dados pessoais:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Acesso:</strong> Solicitar cópia de seus dados</li>
            <li><strong>Correção:</strong> Atualizar dados incompletos ou incorretos</li>
            <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
            <li><strong>Revogação de consentimento:</strong> Retirar consentimento a qualquer momento</li>
            <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
            <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Para exercer seus direitos, entre em contato conosco através do email: <strong>privacidade@jobconnect.com</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
          <p className="text-gray-700 mb-4">
            Mantemos seus dados pessoais pelo tempo necessário para:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Fornecer nossos serviços</li>
            <li>Cumprir obrigações legais (5 anos para dados fiscais)</li>
            <li>Resolver disputas</li>
            <li>Fazer cumprir nossos acordos</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Após este período, seus dados serão anonimizados ou excluídos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
          <p className="text-gray-700 mb-4">
            Utilizamos cookies para:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Manter você conectado</li>
            <li>Lembrar suas preferências</li>
            <li>Analisar o uso da plataforma</li>
            <li>Melhorar a experiência do usuário</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade da plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Transferência Internacional de Dados</h2>
          <p className="text-gray-700 mb-4">
            Seus dados podem ser transferidos e processados em países fora do Brasil, incluindo Estados Unidos (servidores AWS/Supabase). Garantimos que estas transferências estão em conformidade com a LGPD e que seus dados recebem proteção adequada.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Menores de Idade</h2>
          <p className="text-gray-700 mb-4">
            Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se tomarmos conhecimento de que coletamos dados de um menor, excluiremos essas informações imediatamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Alterações nesta Política</h2>
          <p className="text-gray-700 mb-4">
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas por email ou através de um aviso na plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Encarregado de Dados (DPO)</h2>
          <p className="text-gray-700 mb-4">
            Nosso Encarregado de Proteção de Dados pode ser contatado em:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> dpo@jobconnect.com<br />
            <strong>Telefone:</strong> (11) 9999-9999
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contato</h2>
          <p className="text-gray-700 mb-4">
            Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> privacidade@jobconnect.com<br />
            <strong>Telefone:</strong> (11) 9999-9999<br />
            <strong>Endereço:</strong> [Seu endereço completo]
          </p>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-blue-800">
            <strong>Importante:</strong> Ao usar o JobConnect, você concorda com esta Política de Privacidade e com nossos Termos de Uso.
          </p>
        </div>
      </div>
    </div>
  );
}


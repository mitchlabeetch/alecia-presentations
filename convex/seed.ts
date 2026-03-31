import { mutation } from './_generated/server';

/**
 * Seed M&A Templates for Alecia Presentations
 *
 * Templates created:
 * 1. Pitch Deck Standard (8 slides) - cession_vente
 * 2. Information Memorandum (15+ slides) - cession_vente
 * 3. LBO Model Summary (10 slides) - lbo_levee_fonds
 * 4. Company Overview (6 slides) - acquisition_achats
 * 5. Financial Projections (8 slides) - lbo_levee_fonds
 * 6. Team Introduction (4 slides) - custom
 * 7. Timeline/Process (5 slides) - custom
 * 8. Comparison Analysis (6 slides) - custom
 * 9. Risk Factors (4 slides) - custom
 * 10. Closing/CTA (2 slides) - custom
 */

interface SlideTemplate {
  type: string;
  title: string;
  content: string;
  notes?: string;
}

interface MATemplate {
  name: string;
  description: string;
  category: string;
  slides: SlideTemplate[];
  isCustom: boolean;
}

const MA_TEMPLATES: MATemplate[] = [
  // 1. Pitch Deck Standard - cession_vente
  {
    name: 'Pitch Deck Standard',
    description:
      "Template classique de pitch deck M&A pour transactions de cession/vente. 8 slides essentielles pour présenter une opportunité d'investissement.",
    category: 'cession_vente',
    slides: [
      {
        type: 'title',
        title: '{{client_name}}',
        content: "Opportunité d'investissement | {{client_sector}}\nConfidentiel",
        notes: 'Slide de couverture avec le nom du client et le secteur',
      },
      {
        type: 'content',
        title: 'Résumé Exécutif',
        content:
          '{{client_name}} recherche un repreneur pour sa division {{division}}.\n\n' +
          'Transaction estimée à {{deal_amount}}\n' +
          'Multiple EBITDA : {{ebitda_multiple}}x',
        notes: 'Présenter les points clés de la transaction',
      },
      {
        type: 'content',
        title: "Présentation de l'Entreprise",
        content:
          '{{client_name}} est un leader dans le secteur {{client_sector}} depuis {{year_founded}}.\n\n' +
          "Chiffre d'affaires : {{revenue}}\n" +
          'EBITDA : {{ebitda}}\n' +
          'Croissance CA : {{growth}}%',
        notes: "Positionnement et taille de l'entreprise",
      },
      {
        type: 'content',
        title: 'Opportunité de Marché',
        content:
          'Marché en croissance de {{market_growth}}% par an.\n\n' +
          'TAM : {{tam}}\n' +
          'SAM : {{sam}}\n' +
          'SOM : {{som}}',
        notes: 'Analyse du marché adressable',
      },
      {
        type: 'content',
        title: 'Points Forts',
        content:
          '1. Position de leader sur le marché avec {{market_share}}% de part de marché\n' +
          "2. Équipe de direction expérimentée avec {{years_experience}} ans d'expertise\n" +
          '3. Technologie propriétaire protégée par {{patents}} brevets\n' +
          '4. Base client diversifiée avec {{clients}} clients actifs',
        notes: 'Avantages compétitifs clés',
      },
      {
        type: 'content',
        title: 'Performance Financière',
        content:
          'Chiffres clés FY{{fy_year}} :\n\n' +
          'Revenue : {{revenue}}\n' +
          'EBITDA Margin : {{ebitda_margin}}%\n' +
          'Cash Flow : {{cash_flow}}\n' +
          'Dette nette : {{net_debt}}',
        notes: 'Données financières historiques',
      },
      {
        type: 'content',
        title: 'Acquéreurs Potentiels',
        content:
          'Profil des acquéreurs stratégiques :\n\n{{acquirers_profile}}\n\n' +
          'Concurrents directs :\n{{competitors_list}}',
        notes: 'Identification des acquéreurs potentiels',
      },
      {
        type: 'closing',
        title: 'Contact',
        content:
          '{{advisor_name}}\n' +
          '{{advisor_email}}\n' +
          '{{advisor_phone}}\n\n' +
          'Document confidentiel - {{confidentiality_level}}',
        notes: 'Informations de contact et clause de confidentialité',
      },
    ],
    isCustom: false,
  },

  // 2. Information Memorandum - cession_vente
  {
    name: 'Information Memorandum',
    description:
      'Document confidentiel complet pour processus M&A structuré. 15 slides couvrant tous les aspects de la société cible.',
    category: 'cession_vente',
    slides: [
      {
        type: 'title',
        title: "Mémorandum d'Information",
        content: '{{client_name}}\nConfidentiel | {{date}}',
        notes: 'Page de titre du IM',
      },
      {
        type: 'content',
        title: 'Table des Matières',
        content:
          '1. Résumé Exécutif\n' +
          "2. Description de l'Entreprise\n" +
          '3. Marché et Competition\n' +
          '4. Performance Financière\n' +
          '5. Organisation et Équipe\n' +
          '6. Données Complémentaires',
        notes: "Vue d'ensemble du document",
      },
      {
        type: 'content',
        title: 'Résumé Exécutif',
        content:
          'Transaction : Cession de {{client_name}}\n' +
          'Secteur : {{client_sector}}\n' +
          "Valeur d'entreprise : {{deal_amount}}\n" +
          'Date : {{date}}\n' +
          'Advisor : {{advisor_name}}',
        notes: 'Points clés de la transaction',
      },
      {
        type: 'content',
        title: "Description de l'Entreprise",
        content:
          '{{client_name}} opère dans {{client_sector}} depuis {{year_founded}}.\n\n' +
          '{{business_description}}\n\n' +
          'Siège : {{headquarters}}\n' +
          'Implantations : {{locations}}',
        notes: "Présentation générale de l'entreprise",
      },
      {
        type: 'content',
        title: 'Historique',
        content: '{{company_history}}\n\n' + 'Étapes clés :\n' + '{{milestones}}',
        notes: "Historique et évolution de l'entreprise",
      },
      {
        type: 'content',
        title: 'Actionnariat',
        content:
          'Structure actionnariale actuelle :\n\n{{shareholders}}\n\n' +
          'Flottant : {{free_float}}%\n' +
          'Actionnariat salarié : {{employee_share}}%',
        notes: 'Structure du capital',
      },
      {
        type: 'content',
        title: 'Marché',
        content:
          'Le marché {{client_sector}} représente {{market_size}} en {{market_year}}.\n\n' +
          'Croissance prévue : {{market_growth}}% par an\n' +
          'Tendances principales :\n{{market_trends}}',
        notes: 'Analyse du marché',
      },
      {
        type: 'content',
        title: 'Concurrence',
        content:
          'Principaux concurrents :\n\n{{competitors}}\n\n' +
          'Position concurrentielle : {{competitive_position}}',
        notes: 'Analyse concurrentielle',
      },
      {
        type: 'content',
        title: 'Avantages Concurrentiels',
        content:
          '1. {{competitive_advantage_1}}\n\n' +
          '2. {{competitive_advantage_2}}\n\n' +
          '3. {{competitive_advantage_3}}',
        notes: 'Durabilité des avantages',
      },
      {
        type: 'content',
        title: 'Comptes de Résultat',
        content: "En milliers d'euros :\n\n" + '{{income_statement_table}}',
        notes: 'Données financières historiques',
      },
      {
        type: 'content',
        title: 'Bilan',
        content: 'Structure du bilan au {{date}} :\n\n{{balance_sheet_table}}',
        notes: 'Situation patrimoniale',
      },
      {
        type: 'content',
        title: 'Cash Flow',
        content: 'Flux de trésorerie :\n\n{{cashflow_data}}',
        notes: 'Analyse des flux',
      },
      {
        type: 'content',
        title: 'Organisation',
        content:
          "L'entreprise emploie {{employees}} personnes.\n\n" + 'Répartition :\n{{org_structure}}',
        notes: 'Structure organisationnelle',
      },
      {
        type: 'content',
        title: 'Équipe Dirigeante',
        content: '{{management_team}}',
        notes: 'Présentation des dirigeants clés',
      },
      {
        type: 'content',
        title: 'Annexes',
        content: 'Documents disponibles sur demande :\n\n' + '{{available_documents}}',
        notes: 'Liste des documents complémentaires',
      },
    ],
    isCustom: false,
  },

  // 3. LBO Model Summary - lbo_levee_fonds
  {
    name: 'LBO Model Summary',
    description:
      'Résumé du modèle LBO pour opérations de rachat par endettement. 10 slides présentant la structure financière et les rendements attendus.',
    category: 'lbo_levee_fonds',
    slides: [
      {
        type: 'title',
        title: 'Modèle LBO',
        content: '{{client_name}}\nLevée de fonds {{deal_amount}} | {{date}}',
        notes: 'Page de titre LBO',
      },
      {
        type: 'content',
        title: 'Paramètres de la Transaction',
        content:
          "Prix d'acquisition : {{purchase_price}}\n" +
          'Effet de levier : {{leverage}}x EBITDA\n' +
          'Equity contribution : {{equity}}%\n' +
          'Dette totale : {{total_debt}}',
        notes: "Paramètres clés de l'opération",
      },
      {
        type: 'content',
        title: 'Hypothèses Clés',
        content:
          'Croissance CA : {{revenue_growth}}% par an\n' +
          'Marge EBITDA : {{ebitda_margin}}%\n' +
          'Capex annuel : {{capex}}\n' +
          "Taux d'intérêt dette senior : {{interest_rate}}%",
        notes: 'Hypothèses du бизнес-плана',
      },
      {
        type: 'content',
        title: 'Structure du Financement',
        content:
          'Dette totale : {{total_debt}}\n\n' +
          'Senior debt : {{senior_debt}}\n' +
          'Mezzanine : {{mezzanine}}\n' +
          'Unitranche : {{unitranche}}\n\n' +
          'Equity : {{equity_amount}}',
        notes: 'Répartition des sources de financement',
      },
      {
        type: 'content',
        title: 'Remboursement de la Dette',
        content:
          'Timeline de remboursement sur {{hold_period}} ans :\n\n' + '{{debt_repayment_schedule}}',
        notes: 'Capacité de remboursement',
      },
      {
        type: 'content',
        title: 'Scénarios',
        content:
          'Base case IRR : {{irr_base}}%\n' +
          'Upside IRR : {{irr_upside}}%\n' +
          'Downside IRR : {{irr_downside}}%\n\n' +
          'Sensitivity : Multiple vs Croissance',
        notes: 'Analyse des scénarios',
      },
      {
        type: 'content',
        title: 'Analyse de Sensibilité',
        content: 'Impact de la variation du multiple de sortie :\n\n' + '{{sensitivity_analysis}}',
        notes: 'Sensibilité aux paramètres clés',
      },
      {
        type: 'content',
        title: "Returns pour l'Investisseur",
        content:
          'MOIC : {{moic}}x\n' +
          'IRR : {{irr}}%\n' +
          'Hold period : {{hold_period}} ans\n' +
          'Money multiple : {{money_multiple}}x',
        notes: 'Rendements attendus',
      },
      {
        type: 'content',
        title: 'Risques Principaux',
        content:
          '1. {{risk_1}}\n\n' +
          '2. {{risk_2}}\n\n' +
          '3. {{risk_3}}\n\n' +
          'Mitigants :\n{{risk_mitigants}}',
        notes: 'Identification et mitigation des risques',
      },
      {
        type: 'closing',
        title: 'Prochaines Étapes',
        content: '{{next_steps}}\n\n' + 'Contact : {{advisor_name}} | {{advisor_email}}',
        notes: 'Processus et contact',
      },
    ],
    isCustom: false,
  },

  // 4. Company Overview - acquisition_achats
  {
    name: 'Company Overview',
    description:
      "Présentation de l'entreprise cible pour acquéreurs potentiels. 6 slides pour une première approche.",
    category: 'acquisition_achats',
    slides: [
      {
        type: 'title',
        title: '{{client_name}}',
        content: '{{client_sector}} | Création {{year_founded}}\n{{headquarters}}',
        notes: 'Page de titre',
      },
      {
        type: 'content',
        title: 'À Propos',
        content:
          '{{client_name}} est un acteur majeur du secteur {{client_sector}}.\n\n' +
          '{{company_description}}',
        notes: 'Présentation générale',
      },
      {
        type: 'content',
        title: 'Chiffres Clés',
        content:
          'Collaborateurs : {{employees}}\n' +
          "Chiffre d'affaires : {{revenue}}\n" +
          'EBITDA : {{ebitda}}\n' +
          'Localisation : {{locations}}',
        notes: 'Métriques clés',
      },
      {
        type: 'content',
        title: 'Implantations',
        content: '{{locations_map}}\n\nImplantations : {{locations_list}}',
        notes: 'Présence géographique',
      },
      {
        type: 'content',
        title: 'Solutions & Services',
        content:
          '{{products_services}}\n\n' +
          'Part de marché : {{market_share}}%\n' +
          'Clients majeurs : {{key_clients}}',
        notes: 'Offre et marché',
      },
      {
        type: 'closing',
        title: 'Contact',
        content:
          '{{advisor_name}}\n' +
          '{{advisor_email}}\n' +
          '{{advisor_phone}}\n\n' +
          'Document confidentiel',
        notes: 'Contact et confidentialité',
      },
    ],
    isCustom: false,
  },

  // 5. Financial Projections - lbo_levee_fonds
  {
    name: 'Projections Financières',
    description:
      'Projections financières détaillées sur 5 ans. 8 slides pour présenter le plan de développement.',
    category: 'lbo_levee_fonds',
    slides: [
      {
        type: 'title',
        title: 'Projections Financières',
        content: '{{client_name}}\nHorizon {{projection_years}} ans | {{date}}',
        notes: 'Page de titre',
      },
      {
        type: 'content',
        title: 'Hypothèses',
        content:
          'Croissance annuelle CA : {{growth_rate}}%\n' +
          'Marge EBITDA cible : {{target_margin}}%\n' +
          'Capex annuel : {{capex}}\n' +
          'Evolution BFR : {{working_capital_change}}',
        notes: 'Hypothèses du scénario',
      },
      {
        type: 'content',
        title: 'Compte de Résultat',
        content: "En milliers d'euros :\n\n{{income_statement}}",
        notes: 'Prévisionnel P&L',
      },
      {
        type: 'content',
        title: 'Bilan Prévisionnel',
        content: '{{balance_sheet_projection}}',
        notes: 'Prévisionnel bilan',
      },
      {
        type: 'content',
        title: 'Flux de Trésorerie',
        content: '{{cashflow_projection}}',
        notes: 'Plan de trésorerie',
      },
      {
        type: 'content',
        title: 'BFR',
        content: 'Besoins en fonds de roulement :\n\n{{working_capital}}',
        notes: 'Evolution du BFR',
      },
      {
        type: 'content',
        title: 'Investissements',
        content: 'Capex planifiés :\n\n{{capex_schedule}}',
        notes: "Plan d'investissements",
      },
      {
        type: 'closing',
        title: 'Synthèse',
        content: '{{financial_summary}}\n\n' + 'Contact : {{advisor_name}}',
        notes: 'Conclusions financières',
      },
    ],
    isCustom: false,
  },

  // 6. Team Introduction - custom
  {
    name: "Présentation de l'Équipe",
    description: "Présentation de l'équipe dirigeante et des ключевых сотрудников. 4 slides.",
    category: 'custom',
    slides: [
      {
        type: 'title',
        title: 'Équipe Dirigeante',
        content: '{{client_name}}\n{{date}}',
        notes: 'Page de titre',
      },
      {
        type: 'content',
        title: 'Direction Générale',
        content: '{{ceo_name}}\n' + 'CEO depuis {{ceo_since}}\n\n' + '{{ceo_background}}',
        notes: 'Présentation du CEO',
      },
      {
        type: 'content',
        title: 'Direction Financière',
        content: '{{cfo_name}}\n' + 'CFO depuis {{cfo_since}}\n\n' + '{{cfo_background}}',
        notes: 'Présentation du CFO',
      },
      {
        type: 'closing',
        title: 'Équipe Complète',
        content: '{{full_team_list}}\n\n' + "Conseil d'administration :\n{{board_members}}",
        notes: 'Équipe et gouvernance',
      },
    ],
    isCustom: false,
  },

  // 7. Timeline/Process - custom
  {
    name: 'Chronologie du Processus',
    description: 'Chronologie du processus de transaction M&A. 5 slides.',
    category: 'custom',
    slides: [
      {
        type: 'title',
        title: 'Processus de Transaction',
        content: '{{client_name}}\n{{deal_type}} | {{date}}',
        notes: 'Page de titre',
      },
      {
        type: 'content',
        title: 'Phases du Processus',
        content:
          'Phase 1 : Préparation\n' +
          'Date : {{phase1_date}}\n\n' +
          'Phase 2 : First Round\n' +
          'Date : {{phase2_date}}\n\n' +
          'Phase 3 : Due Diligence\n' +
          'Date : {{phase3_date}}\n\n' +
          'Phase 4 : Final Round & Closing\n' +
          'Date : {{phase4_date}}',
        notes: 'Calendrier des étapes',
      },
      {
        type: 'content',
        title: 'Calendrier Détaillé',
        content: '{{timeline_details}}',
        notes: 'Planning précis',
      },
      {
        type: 'content',
        title: 'Contacts Process',
        content: '{{process_contacts}}',
        notes: 'Interlocuteurs pour le processus',
      },
      {
        type: 'content',
        title: 'Documents Disponibles',
        content: '{{process_documents}}',
        notes: 'Data room et documentation',
      },
      {
        type: 'closing',
        title: 'Prochaines Étapes',
        content: '{{next_steps}}\n\n' + 'Contact : {{advisor_name}} | {{advisor_email}}',
        notes: 'Actions à venir',
      },
    ],
    isCustom: false,
  },

  // 8. Comparison Analysis - custom
  {
    name: 'Analyse Comparative',
    description: 'Analyse comparative avec les pairs et concurrents. 6 slides.',
    category: 'custom',
    slides: [
      {
        type: 'title',
        title: 'Analyse Comparative',
        content: '{{client_name}} vs Marchés\n{{date}}',
        notes: 'Page de titre',
      },
      {
        type: 'content',
        title: 'Multiples de Référence',
        content: 'Comparaison des multiples sectoriels :\n\n' + '{{multiples_comparison}}',
        notes: 'Multiples EV/EBITDA, EV/Revenue, etc.',
      },
      {
        type: 'content',
        title: 'Performance',
        content: 'Indicateurs de performance comparés :\n\n' + '{{performance_metrics}}',
        notes: 'KPIs comparatifs',
      },
      {
        type: 'content',
        title: 'Positionnement',
        content: '{{market_positioning}}',
        notes: 'Carte positionnement',
      },
      {
        type: 'content',
        title: 'Benchmark',
        content: 'Analyse des pairs :\n\n' + '{{benchmark_analysis}}',
        notes: 'Concurrents et analogues',
      },
      {
        type: 'content',
        title: 'Avantages Différenciants',
        content: 'Points forts vs concurrence :\n\n' + '{{competitive_advantages}}',
        notes: 'Différenciateurs clés',
      },
      {
        type: 'closing',
        title: 'Conclusion',
        content: '{{comparison_conclusion}}\n\n' + 'Valorisation implicite : {{implied_valuation}}',
        notes: 'Synthèse comparative',
      },
    ],
    isCustom: false,
  },

  // 9. Risk Factors - custom
  {
    name: 'Facteurs de Risque',
    description: 'Identification et analyse des risques de la transaction. 4 slides.',
    category: 'custom',
    slides: [
      {
        type: 'title',
        title: 'Facteurs de Risque',
        content: '{{client_name}}\n{{date}}',
        notes: 'Page de titre',
      },
      {
        type: 'content',
        title: 'Risques Stratégiques',
        content:
          '1. {{strategic_risk_1}}\n\n' +
          'Impact : {{strategic_risk_1_impact}}\n' +
          'Probability : {{strategic_risk_1_probability}}\n\n' +
          '2. {{strategic_risk_2}}\n\n' +
          'Impact : {{strategic_risk_2_impact}}\n' +
          'Probability : {{strategic_risk_2_probability}}',
        notes: 'Risques stratégiques',
      },
      {
        type: 'content',
        title: 'Risques Opérationnels',
        content:
          '1. {{operational_risk_1}}\n\n' +
          'Impact : {{operational_risk_1_impact}}\n' +
          'Probability : {{operational_risk_1_probability}}\n\n' +
          '2. {{operational_risk_2}}\n\n' +
          'Impact : {{operational_risk_2_impact}}\n' +
          'Probability : {{operational_risk_2_probability}}',
        notes: 'Risques opérationnels',
      },
      {
        type: 'content',
        title: 'Risques Financiers',
        content:
          '1. {{financial_risk_1}}\n\n' +
          'Impact : {{financial_risk_1_impact}}\n' +
          'Probability : {{financial_risk_1_probability}}\n\n' +
          '2. {{financial_risk_2}}\n\n' +
          'Impact : {{financial_risk_2_impact}}\n' +
          'Probability : {{financial_risk_2_probability}}',
        notes: 'Risques financiers',
      },
      {
        type: 'closing',
        title: 'Synthèse & Mitigation',
        content: 'Plan de mitigation :\n\n' + '{{risk_mitigation}}',
        notes: 'Stratégies de mitigation',
      },
    ],
    isCustom: false,
  },

  // 10. Closing/CTA - custom
  {
    name: 'Page de Clôture',
    description: "Page de clôture et appel à l'action pour le deck M&A. 2 slides.",
    category: 'custom',
    slides: [
      {
        type: 'closing',
        title: 'Merci',
        content: '{{client_name}}\n\n' + '{{closing_message}}',
        notes: 'Slide de remerciement',
      },
      {
        type: 'closing',
        title: 'Contact',
        content:
          '{{advisor_name}}\n' +
          '{{advisor_email}}\n' +
          '{{advisor_phone}}\n\n' +
          '{{confidentiality_notice}}',
        notes: 'Contact et confidentialité',
      },
    ],
    isCustom: false,
  },
];

export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    for (const tmpl of MA_TEMPLATES) {
      const existing = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), tmpl.name))
        .first();

      if (!existing) {
        await ctx.db.insert('templates', {
          name: tmpl.name,
          description: tmpl.description,
          category: tmpl.category,
          slides: tmpl.slides,
          isCustom: tmpl.isCustom,
          createdAt: Date.now(),
        });
      }
    }
  },
});

export const resetAndSeedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing non-custom templates
    const existing = await ctx.db.query('templates').collect();
    for (const t of existing) {
      if (!t.isCustom) {
        await ctx.db.delete(t._id);
      }
    }
    // Re-insert all templates
    for (const tmpl of MA_TEMPLATES) {
      await ctx.db.insert('templates', {
        name: tmpl.name,
        description: tmpl.description,
        category: tmpl.category,
        slides: tmpl.slides,
        isCustom: tmpl.isCustom,
        createdAt: Date.now(),
      });
    }
  },
});

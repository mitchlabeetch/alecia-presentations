/**
 * Alecia Presentations - Database Seed
 * Seed des templates M&A français
 */

import { getDb } from './index.js';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const db = getDb();

console.log('Demarrage du seed de la base de donnees...');

// ============================================================================
// Templates M&A Francais
// ============================================================================

interface TemplateSlide {
  orderIndex: number;
  type: string;
  title: string;
  content: Record<string, unknown>;
  notes?: string;
}

interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  slides: TemplateSlide[];
}

const templates: TemplateData[] = [
  // ==========================================================================
  // CESSION / VENTE D'ENTREPRISE - 3 variants
  // ==========================================================================

  // Variant 1: Cession classique
  {
    id: uuidv4(),
    name: 'Cession d\'entreprise - Classique',
    description: 'Template complet pour une cession ou vente d\'entreprise avec analyse financiere et valorisation',
    category: 'cession_vente',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_entreprise}}',
        content: {
          subtitle: 'Operation de cession',
          targetCompany: '{{nom_entreprise}}',
          dealType: 'Cession',
          date: '{{date_operation}}',
        },
        notes: 'Document confidentiel destine aux acquereurs potentiels',
      },
      {
        orderIndex: 1,
        type: 'Section_Navigator',
        title: 'Sommaire',
        content: {
          sections: [
            '1. Presentation de {{nom_entreprise}}',
            '2. Historique et performances',
            '3. Analyse financiere',
            '4. Valorisation',
            '5. Motifs de la cession',
            '6. Processus de vente',
          ],
        },
      },
      {
        orderIndex: 2,
        type: 'Company_Overview',
        title: 'Presentation de {{nom_entreprise}}',
        content: {
          subtitle: 'Acteur de reference sur le marche',
          companyName: '{{nom_entreprise}}',
          sector: '{{secteur_activite}}',
          region: '{{region}}',
          founded: '{{annee_fondation}}',
          employees: '{{nombre_employes}}',
          description: '{{description_entreprise}}',
        },
      },
      {
        orderIndex: 3,
        type: 'Trackrecord_Block',
        title: 'Historique et performances',
        content: {
          milestones: [
            { date: '{{annee_1}}', title: 'Creation', description: 'Fondation de l\'entreprise' },
            { date: '{{annee_2}}', title: 'Expansion', description: 'Developpement sur de nouveaux marches' },
            { date: '{{annee_3}}', title: 'Croissance', description: 'Augmentation du CA de {{croissance}}%' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'KPI_Card',
        title: 'Indicateurs cles',
        content: {
          kpis: [
            { label: 'CA {{annee}}', value: '{{ca}} M EUR', change: '{{variation_ca}}' },
            { label: 'EBITDA', value: '{{ebitda}} M EUR', change: '{{marge_ebitda}}' },
            { label: 'Effectif', value: '{{nombre_employes}}', change: '+{{creation_emplois}}' },
          ],
        },
      },
      {
        orderIndex: 5,
        type: 'Financial_Summary',
        title: 'Analyse financiere',
        content: {
          title: 'Comptes de resultat previsionnels',
          rows: [
            ['(en MEUR)', '{{annee_n1}}', '{{annee_n}}', '{{annee_n1}}'],
            ['Chiffre d\'affaires', '{{ca_n1}}', '{{ca_n}}', '{{ca_n2}}'],
            ['EBITDA', '{{ebitda_n1}}', '{{ebitda_n}}', '{{ebitda_n2}}'],
            ['Marge EBITDA', '{{marge_n1}}', '{{marge_n}}', '{{marge_n2}}'],
            ['Resultat net', '{{rn_n1}}', '{{rn_n}}', '{{rn_n2}}'],
          ],
        },
      },
      {
        orderIndex: 6,
        type: 'Valuation_Methodology',
        title: 'Valorisation',
        content: {
          methods: [
            { name: 'DCF', value: '{{valorisation_dcf}}', weight: '50%' },
            { name: 'Comparables', value: '{{valorisation_comparables}}', weight: '30%' },
            { name: 'Transactions', value: '{{valorisation_transactions}}', weight: '20%' },
          ],
          valuationRange: {
            low: '{{prix_min}}',
            high: '{{prix_max}}',
            midpoint: '{{prix_central}}',
          },
        },
      },
      {
        orderIndex: 7,
        type: 'SWOT',
        title: 'Analyse SWOT',
        content: {
          swot: {
            strengths: [
              'Positionnement leader sur le marche',
              'Clientele diversifiee',
              'Equipes experimentees',
              'Base technologique solide',
            ],
            weaknesses: [
              'Dependance sectorielle',
              'Fonds propres limites',
              'Endettement structurel',
            ],
            opportunities: [
              'Expansion geographique',
              'Nouveaux produits',
              'Acquisitions strategiques',
            ],
            threats: [
              'Concurrence intensifiee',
              'Evolutions reglementaires',
              'Cycles economiques',
            ],
          },
        },
      },
      {
        orderIndex: 8,
        type: 'Deal_Rationale',
        title: 'Motifs de la cession',
        content: {
          subtitle: 'Pourquoi vendre maintenant?',
          reasons: [
            {
              title: 'Opportunite de marche',
              description: 'Conditions favorables pour une transaction au meilleur prix',
            },
            {
              title: 'Succession',
              description: 'Absence de repreneur familial ou interne',
            },
            {
              title: 'Optimisation du capital',
              description: 'Liberation de valeur pour les actionnaires',
            },
          ],
          sellerProfile: '{{profil_vendeur}}',
        },
      },
      {
        orderIndex: 9,
        type: 'Process_Timeline',
        title: 'Processus de vente',
        content: {
          phases: [
            { date: 'T0', title: 'Lancement', description: 'Signature du mandat, preparation du dossier' },
            { date: 'T0 + 4 sem', title: 'Teaser', description: 'Diffusion du resume non confidentiel' },
            { date: 'T0 + 6 sem', title: 'NDD', description: 'Acces au data room' },
            { date: 'T0 + 10 sem', title: 'Offres', description: 'Remise des offres indicatives' },
            { date: 'T0 + 14 sem', title: 'LOI', description: 'Lettre d\'intention exclusive' },
            { date: 'T0 + 20 sem', title: 'Due diligence', description: 'Verification et negociation' },
            { date: 'T0 + 24 sem', title: 'Closing', description: 'Signature et reglement' },
          ],
        },
      },
      {
        orderIndex: 10,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'Equipe alecia',
          company: 'alecia',
          role: 'Conseil en fusions et acquisitions',
          email: 'mna@alecia.fr',
          phone: '+33 1 XX XX XX XX',
        },
        notes: 'alecia - Cabinet de conseil financier independant',
      },
    ],
  },

  // Variant 2: Cession PME/TPE
  {
    id: uuidv4(),
    name: 'Cession d\'entreprise - PME/TPE',
    description: 'Template simplifie pour la cession de PME et TPE',
    category: 'cession_vente',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_entreprise}}',
        content: {
          subtitle: 'Cession de l\'entreprise',
          targetCompany: '{{nom_entreprise}}',
        },
      },
      {
        orderIndex: 1,
        type: 'Company_Overview',
        title: 'L\'entreprise',
        content: {
          companyName: '{{nom_entreprise}}',
          sector: '{{secteur_activite}}',
          employees: '{{nombre_employes}}',
          description: '{{description_entreprise}}',
        },
      },
      {
        orderIndex: 2,
        type: 'KPI_Card',
        title: 'Chiffres cles',
        content: {
          kpis: [
            { label: 'CA', value: '{{ca}} K EUR' },
            { label: 'Resultat', value: '{{resultat}} K EUR' },
            { label: 'EBE', value: '{{ebe}} K EUR' },
          ],
        },
      },
      {
        orderIndex: 3,
        type: 'Table_Block',
        title: 'Performances financieres',
        content: {
          rows: [
            ['Annee', '{{annee_n1}}', '{{annee_n}}'],
            ['CA HT', '{{ca_n1}}', '{{ca_n}}'],
            ['EBE', '{{ebe_n1}}', '{{ebe_n}}'],
            ['Resultat', '{{res_n1}}', '{{res_n}}'],
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'Timeline_Milestones',
        title: 'Calendrier de vente',
        content: {
          milestones: [
            { date: 'Mois 1', title: 'Preparation' },
            { date: 'Mois 2-3', title: 'Recherche acquereurs' },
            { date: 'Mois 4-5', title: 'Negociations' },
            { date: 'Mois 6', title: 'Signature' },
          ],
        },
      },
      {
        orderIndex: 5,
        type: 'Contact_Block',
        title: 'Nous contacter',
        content: {
          name: 'alecia',
          email: 'contact@alecia.fr',
          company: 'alecia',
        },
      },
    ],
  },

  // Variant 3: Cession avec LBO
  {
    id: uuidv4(),
    name: 'Cession avec LBO',
    description: 'Template pour cession avec montage LBO',
    category: 'cession_vente',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_entreprise}}',
        content: {
          subtitle: 'Operation de cession avec LBO',
        },
      },
      {
        orderIndex: 1,
        type: 'Company_Overview',
        title: 'L\'entreprise',
        content: {
          companyName: '{{nom_entreprise}}',
          sector: '{{secteur_activite}}',
          employees: '{{nombre_employes}}',
        },
      },
      {
        orderIndex: 2,
        type: 'Financial_Summary',
        title: 'Structure financiere',
        content: {
          rows: [
            ['Composante', 'Montant', '% Total'],
            ['Fonds propres', '{{fonds_propres}}', '{{pct_fonds_propres}}'],
            ['Dette senior', '{{dette_senior}}', '{{pct_dette_senior}}'],
            ['Dette mezzanine', '{{dette_mezz}}', '{{pct_dette_mezz}}'],
            ['Total', '{{total_levier}}', '100%'],
          ],
        },
      },
      {
        orderIndex: 3,
        type: 'KPI_Card',
        title: 'Metriques LBO',
        content: {
          kpis: [
            { label: 'Multiple veille', value: '{{multiple_veille}}x' },
            { label: 'Rendement IRR', value: '{{irr}}%' },
            { label: 'DEL', value: '{{del}} ans' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'Chart_Block',
        title: 'Evolution de l\'endettement',
        content: {
          chartType: 'line',
          data: {
            labels: ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'],
            values: [100, 85, 70, 55, 40, 25],
          },
        },
      },
      {
        orderIndex: 5,
        type: 'Process_Timeline',
        title: 'Processus LBO',
        content: {
          phases: [
            { date: 'Phase 1', title: 'Structuration' },
            { date: 'Phase 2', title: 'Financement' },
            { date: 'Phase 3', title: 'Closing' },
            { date: 'Phase 4', title: 'Holding' },
          ],
        },
      },
      {
        orderIndex: 6,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'alecia',
          email: 'lbo@alecia.fr',
        },
      },
    ],
  },

  // ==========================================================================
  // LEVEE DE FONDS / LBO - 3 variants
  // ==========================================================================

  // Variant 1: Levée de fonds growth
  {
    id: uuidv4(),
    name: 'Levee de fonds - Growth',
    description: 'Template pour une levee de fonds en phase de croissance',
    category: 'lbo_levee_fonds',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_entreprise}}',
        content: {
          subtitle: 'Levée de fonds - Serie {{serie}}',
          targetCompany: '{{nom_entreprise}}',
          amount: '{{montant_recherche}} EUR',
        },
        notes: 'Confidentiel - Ne pas diffuser',
      },
      {
        orderIndex: 1,
        type: 'Section_Navigator',
        title: 'Sommaire',
        content: {
          sections: [
            '1. L\'entreprise et son marche',
            '2. Le produit et la technologie',
            '3. Le modele economique',
            '4. Les performances',
            '5. La equipe',
            '6. La levee de fonds',
          ],
        },
      },
      {
        orderIndex: 2,
        type: 'Company_Overview',
        title: 'L\'entreprise',
        content: {
          companyName: '{{nom_entreprise}}',
          sector: '{{secteur_activite}}',
          founded: '{{annee_fondation}}',
          employees: '{{nombre_employes}}',
          description: '{{description_entreprise}}',
        },
      },
      {
        orderIndex: 3,
        type: 'Market_Analysis',
        title: 'Le marche',
        content: {
          tam: '{{tam}} M EUR',
          sam: '{{sam}} M EUR',
          som: '{{som}} M EUR',
          cagr: '{{cagr}}%',
          trends: [
            'Tendance majeure 1',
            'Tendance majeure 2',
            'Opportunite identifiee',
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'KPI_Card',
        title: 'Metriques de croissance',
        content: {
          kpis: [
            { label: 'CA {{annee}}', value: '{{ca}} K EUR', change: '+{{croissance_ca}}%' },
            { label: 'MRR', value: '{{mrr}} K EUR', change: '+{{croissance_mrr}}%' },
            { label: 'Clients', value: '{{nb_clients}}', change: '+{{new_clients}}' },
          ],
        },
      },
      {
        orderIndex: 5,
        type: 'Chart_Block',
        title: 'Trajectoire de croissance',
        content: {
          chartType: 'bar',
          data: {
            labels: ['{{annee_n3}}', '{{annee_n2}}', '{{annee_n1}}', '{{annee_n}}', '{{annee_n1_pred}}'],
            values: [{{ca_n3}}, {{ca_n2}}, {{ca_n1}}, {{ca_n}}, {{ca_pred}}],
          },
        },
      },
      {
        orderIndex: 6,
        type: 'Financial_Summary',
        title: 'Modele economique',
        content: {
          rows: [
            ['Metrique', 'Valeur', 'Benchmark'],
            ['CAC', '{{cac}} EUR', '{{cac_benchmark}} EUR'],
            ['LTV', '{{ltv}} EUR', '{{ltv_benchmark}} EUR'],
            ['LTV/CAC', '{{ltv_cac}}x', '{{ltv_cac_benchmark}}x'],
            ['Payback', '{{payback}} mois', '{{payback_benchmark}} mois'],
          ],
        },
      },
      {
        orderIndex: 7,
        type: 'SWOT',
        title: 'Analyse strategique',
        content: {
          swot: {
            strengths: ['Equipe experimentée', 'Technologie propriétaire', 'Base clients engagée'],
            weaknesses: ['Effectif limité', 'Couverture géographique'],
            opportunities: ['Expansion internationale', 'Nouveaux segments'],
            threats: ['Concurrence accrue', 'Evolutions technologiques'],
          },
        },
      },
      {
        orderIndex: 8,
        type: 'Timeline_Milestones',
        title: 'Objectifs et jalons',
        content: {
          milestones: [
            { date: 'Aujourd\'hui', title: 'Status quo', description: 'CA: {{ca}}, {{nb_clients}} clients' },
            { date: '+12 mois', title: 'Objectif S1', description: 'CA: {{ca_s1}}, {{nb_clients_s1}} clients' },
            { date: '+24 mois', title: 'Objectif S2', description: 'CA: {{ca_s2}}, International' },
          ],
        },
      },
      {
        orderIndex: 9,
        type: 'Table_Block',
        title: 'Utilisation des fonds',
        content: {
          rows: [
            ['Poste', 'Montant', '%'],
            ['R&D / Produit', '{{fund_rnd}}', '{{pct_rnd}}%'],
            ['Commercial', '{{fund_sales}}', '{{pct_sales}}%'],
            ['Operations', '{{fund_ops}}', '{{pct_ops}}%'],
            ['Admin', '{{fund_admin}}', '{{pct_admin}}%'],
          ],
        },
      },
      {
        orderIndex: 10,
        type: 'Contact_Block',
        title: 'L\'equipe',
        content: {
          team: [
            { name: '{{nom_ceo}}', role: 'CEO', background: '{{bg_ceo}}' },
            { name: '{{nom_cto}}', role: 'CTO', background: '{{bg_cto}}' },
            { name: '{{nom_cfo}}', role: 'CFO', background: '{{bg_cfo}}' },
          ],
        },
      },
      {
        orderIndex: 11,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: '{{nom_ceo}}',
          role: 'CEO - {{nom_entreprise}}',
          email: '{{email_ceo}}',
        },
      },
    ],
  },

  // Variant 2: Levée de fonds seed
  {
    id: uuidv4(),
    name: 'Levee de fonds - Seed',
    description: 'Template simplifie pour une levee seed',
    category: 'lbo_levee_fonds',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_entreprise}}',
        content: {
          subtitle: 'Levée de fonds Seed',
          amount: '{{montant}} EUR',
        },
      },
      {
        orderIndex: 1,
        type: 'Company_Overview',
        title: 'Le concept',
        content: {
          companyName: '{{nom_entreprise}}',
          description: '{{description_concept}}',
        },
      },
      {
        orderIndex: 2,
        type: 'KPI_Card',
        title: 'Premiers traction',
        content: {
          kpis: [
            { label: 'Utilisateurs', value: '{{nb_users}}' },
            { label: 'Revenus', value: '{{revenus}} EUR/mois' },
          ],
        },
      },
      {
        orderIndex: 3,
        type: 'Timeline_Milestones',
        title: 'Roadmap',
        content: {
          milestones: [
            { date: 'Maintenant', title: 'MVP valide' },
            { date: '+6 mois', title: 'Product-market fit' },
            { date: '+12 mois', title: 'Scale' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: '{{nom_founder}}',
          email: '{{email}}',
        },
      },
    ],
  },

  // Variant 3: LBO Buy & Build
  {
    id: uuidv4(),
    name: 'LBO - Buy & Build',
    description: 'Template pour une strategie LBO avec buy & build',
    category: 'lbo_levee_fonds',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: 'Strategie LBO',
        content: {
          subtitle: 'Plateforme Buy & Build - {{nom_secteur}}',
        },
      },
      {
        orderIndex: 1,
        type: 'Market_Analysis',
        title: 'Opportunite de marche',
        content: {
          tam: '{{tam}} M EUR',
          marketFragmentation: '{{fragmentation}}%',
          consolidationTrend: '{{tendance}}',
        },
      },
      {
        orderIndex: 2,
        type: 'Chart_Block',
        title: 'Strategie de consolidation',
        content: {
          chartType: 'bar',
          data: {
            labels: ['Annee 1', 'Annee 2', 'Annee 3', 'Annee 4', 'Annee 5'],
            values: [1, 2, 4, 6, 8],
          },
        },
      },
      {
        orderIndex: 3,
        type: 'KPI_Card',
        title: 'Business plan',
        content: {
          kpis: [
            { label: 'CA cible', value: '{{ca_cible}} M EUR' },
            { label: 'EBITDA cible', value: '{{ebitda_cible}} M EUR' },
            { label: 'Nb acquisitions', value: '{{nb_acq}}' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'Valuation_Methodology',
        title: 'Valorisation et returns',
        content: {
          methods: [
            { name: 'Entry multiple', value: '{{entry_mult}}x' },
            { name: 'Exit multiple', value: '{{exit_mult}}x' },
            { name: 'IRR vise', value: '{{irr_vise}}%' },
          ],
        },
      },
      {
        orderIndex: 5,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'Equipe alecia',
          email: 'lbo@alecia.fr',
        },
      },
    ],
  },

  // ==========================================================================
  // ACQUISITION / ACHAT - 3 variants
  // ==========================================================================

  // Variant 1: Acquisition strategique
  {
    id: uuidv4(),
    name: 'Acquisition strategique',
    description: 'Template pour une acquisition strategique',
    category: 'acquisition_achats',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_cible}}',
        content: {
          subtitle: 'Opportunity d\'acquisition strategique',
          targetCompany: '{{nom_cible}}',
        },
        notes: 'Confidentiel',
      },
      {
        orderIndex: 1,
        type: 'Company_Overview',
        title: 'La cible',
        content: {
          companyName: '{{nom_cible}}',
          sector: '{{secteur_cible}}',
          employees: '{{effectif_cible}}',
          description: '{{description_cible}}',
        },
      },
      {
        orderIndex: 2,
        type: 'Deal_Rationale',
        title: 'Logique strategique',
        content: {
          rationale: [
            {
              title: 'Synergies de revenus',
              description: '{{synergies_revenus}} EUR/an',
            },
            {
              title: 'Synergies de couts',
              description: '{{synergies_couts}} EUR/an',
            },
            {
              title: 'Positionnement',
              description: '{{positionnement}}',
            },
          ],
        },
      },
      {
        orderIndex: 3,
        type: 'KPI_Card',
        title: 'Profil financier',
        content: {
          kpis: [
            { label: 'CA', value: '{{ca_cible}} M EUR' },
            { label: 'EBITDA', value: '{{ebitda_cible}} M EUR' },
            { label: 'Marge', value: '{{marge_cible}}%' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'Financial_Summary',
        title: 'Analyse financiere',
        content: {
          rows: [
            ['(en MEUR)', '{{annee_n1}}', '{{annee_n}}', '{{annee_n1}}'],
            ['CA', '{{ca_n1}}', '{{ca_n}}', '{{ca_n2}}'],
            ['EBITDA', '{{ebitda_n1}}', '{{ebitda_n}}', '{{ebitda_n2}}'],
            ['Dette nette', '{{dette_n1}}', '{{dette_n}}', '{{dette_n2}}'],
          ],
        },
      },
      {
        orderIndex: 5,
        type: 'Valuation_Methodology',
        title: 'Valorisation',
        content: {
          methods: [
            { name: 'DCF', value: '{{val_dcf}}' },
            { name: 'Comparables', value: '{{val_comparables}}' },
            { name: 'ANR', value: '{{val_anr}}' },
          ],
          range: '{{prix_min}} - {{prix_max}}',
        },
      },
      {
        orderIndex: 6,
        type: 'SWOT',
        title: 'Analyse de la cible',
        content: {
          swot: {
            strengths: ['Force 1', 'Force 2', 'Force 3'],
            weaknesses: ['Faiblesse 1', 'Faiblesse 2'],
            opportunities: ['Opportunite 1', 'Opportunite 2'],
            threats: ['Menace 1', 'Menace 2'],
          },
        },
      },
      {
        orderIndex: 7,
        type: 'Process_Timeline',
        title: 'Processus d\'acquisition',
        content: {
          phases: [
            { date: 'Phase 1', title: 'Due diligence' },
            { date: 'Phase 2', title: 'Negociation' },
            { date: 'Phase 3', title: 'Signing' },
            { date: 'Phase 4', title: 'Closing' },
          ],
        },
      },
      {
        orderIndex: 8,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'Equipe alecia',
          email: 'mna@alecia.fr',
        },
      },
    ],
  },

  // Variant 2: Acquisition buy & build
  {
    id: uuidv4(),
    name: 'Acquisition - Add-on',
    description: 'Template pour acquisition de type add-on',
    category: 'acquisition_achats',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_addon}}',
        content: {
          subtitle: 'Acquisition add-on',
          acquirer: '{{nom_acquereur}}',
        },
      },
      {
        orderIndex: 1,
        type: 'Company_Overview',
        title: 'La cible add-on',
        content: {
          companyName: '{{nom_addon}}',
          strategicFit: '{{strategic_fit}}',
        },
      },
      {
        orderIndex: 2,
        type: 'Deal_Rationale',
        title: 'Fit strategique',
        content: {
          rationale: [
            { title: 'Complementarite', description: '{{complementarity}}' },
            { title: 'Cross-selling', description: '{{cross_selling}}' },
            { title: 'Economies d\'echelle', description: '{{economies}}' },
          ],
        },
      },
      {
        orderIndex: 3,
        type: 'KPI_Card',
        title: 'Chiffres cles',
        content: {
          kpis: [
            { label: 'CA', value: '{{ca_addon}}' },
            { label: 'EBITDA', value: '{{ebitda_addon}}' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'Valuation_Methodology',
        title: 'Conditions',
        content: {
          price: '{{prix}}',
          multiple: '{{multiple}}x',
          synergyCapture: '{{synergy_capture}}%',
        },
      },
      {
        orderIndex: 5,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'alecia',
          email: 'mna@alecia.fr',
        },
      },
    ],
  },

  // Variant 3: OPA / Offre publique
  {
    id: uuidv4(),
    name: 'Offre publique',
    description: 'Template pour une offre publique d\'achat',
    category: 'acquisition_achats',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: 'Offre sur {{nom_cible}}',
        content: {
          subtitle: 'Offre publique amicale',
          acquirer: '{{nom_acquereur}}',
          premium: '{{prime}}%',
        },
      },
      {
        orderIndex: 1,
        type: 'Company_Overview',
        title: 'La cible',
        content: {
          companyName: '{{nom_cible}}',
          isin: '{{isin}}',
          sector: '{{secteur}}',
          marketCap: '{{capitalisation}}',
        },
      },
      {
        orderIndex: 2,
        type: 'Table_Block',
        title: 'Termes de l\'offre',
        content: {
          rows: [
            ['Parametre', 'Avant offre', 'Apres offre'],
            ['Cours', '{{cours_avant}}', '{{cours_apres}}'],
            ['Prime', '-', '{{prime}}%'],
            ['Valorisation', '{{val_avant}}', '{{val_apres}}'],
          ],
        },
      },
      {
        orderIndex: 3,
        type: 'Valuation_Methodology',
        title: 'Valorisation et justice financiere',
        content: {
          methods: [
            { name: 'DCF', value: '{{val_dcf}}' },
            { name: 'ANR', value: '{{val_anr}}' },
            { name: 'Cmp 5 ans', value: '{{val_cmp}}' },
          ],
          conclusion: 'Offre equitable et justifiee',
        },
      },
      {
        orderIndex: 4,
        type: 'Deal_Rationale',
        title: 'Synergies et createur de valeur',
        content: {
          synergies: {
            revenues: '{{syn_rev}}',
            costs: '{{syn_cout}}',
            total: '{{syn_total}}',
          },
        },
      },
      {
        orderIndex: 5,
        type: 'Process_Timeline',
        title: 'Calendrier',
        content: {
          phases: [
            { date: 'J0', title: 'Annonce' },
            { date: 'J+30', title: 'Depot note AMF' },
            { date: 'J+45', title: 'Avis AMF' },
            { date: 'J+60', title: 'Ouverture' },
            { date: 'J+75', title: 'Cloture' },
          ],
        },
      },
      {
        orderIndex: 6,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'Equipe alecia',
          role: 'Conseil de l\'offreur',
          email: 'opa@alecia.fr',
        },
      },
    ],
  },

  // ==========================================================================
  // CUSTOM TEMPLATE
  // ==========================================================================

  {
    id: uuidv4(),
    name: 'Template personnalise',
    description: 'Template de base personnalisable pour tout type d\'operation M&A',
    category: 'custom',
    slides: [
      {
        orderIndex: 0,
        type: 'Cover',
        title: '{{nom_projet}}',
        content: {
          subtitle: '{{type_operation}}',
          targetCompany: '{{nom_entreprise}}',
          date: '{{date}}',
        },
      },
      {
        orderIndex: 1,
        type: 'Section_Navigator',
        title: 'Sommaire',
        content: {
          sections: [
            '1. Presentation',
            '2. Analyse',
            '3. Strategie',
            '4. Conclusion',
          ],
        },
      },
      {
        orderIndex: 2,
        type: 'Company_Overview',
        title: 'Presentation',
        content: {
          companyName: '{{nom_entreprise}}',
          description: '{{description}}',
        },
      },
      {
        orderIndex: 3,
        type: 'KPI_Card',
        title: 'Indicateurs',
        content: {
          kpis: [
            { label: 'CA', value: '{{ca}}' },
            { label: 'EBITDA', value: '{{ebitda}}' },
            { label: 'Effectif', value: '{{effectif}}' },
          ],
        },
      },
      {
        orderIndex: 4,
        type: 'SWOT',
        title: 'Analyse SWOT',
        content: {
          swot: {
            strengths: ['Point fort 1', 'Point fort 2'],
            weaknesses: ['Point faible 1'],
            opportunities: ['Opportunite 1', 'Opportunite 2'],
            threats: ['Menace 1'],
          },
        },
      },
      {
        orderIndex: 5,
        type: 'Contact_Block',
        title: 'Contact',
        content: {
          name: 'alecia',
          company: 'alecia',
          email: 'contact@alecia.fr',
        },
      },
    ],
  },
];

// ============================================================================
// Insertion des templates
// ============================================================================

const insertTemplate = db.prepare(`
  INSERT OR IGNORE INTO templates (id, name, description, category, slides, is_custom, created_at)
  VALUES (?, ?, ?, ?, ?, 0, ?)
`);

const insertSlide = db.prepare(`
  INSERT INTO slides (id, project_id, order_index, type, title, content, created_at, updated_at)
  VALUES (?, NULL, ?, ?, ?, ?, ?, ?)
`);

let templateCount = 0;
const now = Date.now();

for (const template of templates) {
  try {
    insertTemplate.run(
      template.id,
      template.name,
      template.description,
      template.category,
      JSON.stringify(template.slides),
      now
    );
    templateCount++;

    console.log(`  - Template cree: ${template.name} (${template.slides.length} slides)`);
  } catch (error) {
    console.error(`  - Erreur lors de la creation du template ${template.name}:`, error);
  }
}

console.log(`${templateCount} templates M&A français inseres`);

// ============================================================================
// Seed des presets de variables par defaut
// ============================================================================

console.log('Insertion des presets de variables par defaut...');

const defaultPresets = [
  {
    id: uuidv4(),
    name: 'Variables entreprise generic',
    variables: [
      { key: 'nom_entreprise', value: 'Entreprise exemple' },
      { key: 'secteur_activite', value: 'Services' },
      { key: 'region', value: 'Ile-de-France' },
      { key: 'ca', value: '10' },
      { key: 'ebitda', value: '2' },
      { key: 'nombre_employes', value: '50' },
      { key: 'date', value: new Date().toLocaleDateString('fr-FR') },
    ],
    is_default: 1,
  },
];

const insertPreset = db.prepare(`
  INSERT OR IGNORE INTO variable_presets (id, project_id, name, variables, is_default, created_at)
  VALUES (?, NULL, ?, ?, ?, ?)
`);

for (const preset of defaultPresets) {
  try {
    insertPreset.run(
      preset.id,
      preset.name,
      JSON.stringify(preset.variables),
      preset.is_default,
      now
    );
    console.log(`  - Preset cree: ${preset.name}`);
  } catch (error) {
    console.error(`  - Erreur preset:`, error);
  }
}

// ============================================================================
// Seed deals from CSV (if exists)
// ============================================================================

try {
  const csvPath = join(process.cwd(), 'server', 'db', 'seeds', 'deals.csv');
  
  if (existsSync(csvPath)) {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(1); // Skip header

    const insertDeal = db.prepare(`
      INSERT OR IGNORE INTO deals (
        id, deal_id, company, annee_deal, type_deal, responsable_deal,
        equipier_deal, is_client_ou_contrepartie, description_deal, region_deal,
        sector_deal, taille_operation_m_euro, ca_cible_m_euro, afficher_site,
        afficher_pitchdeck, is_company, is_alecia, logo_filename
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let dealCount = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const cols = line.split(',');
      if (cols.length < 10) continue;

      try {
        insertDeal.run(
          uuidv4(),
          parseInt(cols[0]) || 0,
          cols[1] || '',
          parseInt(cols[2]) || null,
          cols[3] || '',
          cols[4] || '',
          cols[5] || null,
          cols[6] || '',
          cols[7] || '',
          cols[8] || '',
          cols[9] || '',
          parseFloat(cols[10]) || null,
          parseFloat(cols[11]) || null,
          parseInt(cols[12]) || 0,
          parseInt(cols[13]) || 0,
          parseInt(cols[14]) || 1,
          parseInt(cols[15]) || 0,
          cols[16] || ''
        );
        dealCount++;
      } catch (dealError) {
        console.error(`  - Erreur deal:`, dealError);
      }
    }

    console.log(`${dealCount} deals importes depuis CSV`);
  } else {
    console.log('Pas de fichier deals.csv trouve');
  }
} catch (error) {
  console.log('Repertoire seeds non trouve, skipping');
}

// ============================================================================
// Creation repertoire exports
// ============================================================================

const exportsDir = join(process.cwd(), 'exports');
if (!existsSync(exportsDir)) {
  mkdirSync(exportsDir, { recursive: true });
  console.log('Repertoire exports/ cree');
}

const uploadsImportsDir = join(process.cwd(), 'uploads', 'imports');
if (!existsSync(uploadsImportsDir)) {
  mkdirSync(uploadsImportsDir, { recursive: true });
  console.log('Repertoire uploads/imports/ cree');
}

console.log('');
console.log('=== Seed termine avec succes ===');
console.log('');
console.log('Resume:');
console.log(`  - ${templateCount} templates M&A inseres`);
console.log(`  - ${defaultPresets.length} presets de variables`);
console.log('');

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { PITCHFORGE_LOGO_SVG } from "./Logo";

interface Props {
  projectId: Id<"projects">;
  currentSlideCount: number;
  onInserted?: () => void;
  theme?: { primaryColor: string; accentColor: string };
}

const ELEMENT_CATEGORIES = [
  {
    id: "logo",
    label: "Logo & Marque",
    icon: "🏷",
    elements: [
      {
        name: "Logo PitchForge",
        type: "custom",
        title: "PitchForge",
        content: `[LOGO_PITCHFORGE]\nPlateforme M&A propulsée par l'IA\nwww.pitchforge.io`,
        preview: "logo_pf",
        isLogo: true,
      },
      {
        name: "Page de garde confidentielle",
        type: "cover",
        title: "CONFIDENTIEL — Usage Restreint",
        content: "Ce document est strictement confidentiel\nRéservé aux destinataires autorisés\nToute reproduction est interdite\nPitchForge M&A Advisory",
        preview: "confidential",
      },
      {
        name: "Disclaimer légal",
        type: "appendix",
        title: "Avertissement Légal",
        content: "Ce document est fourni à titre informatif uniquement\nLes informations contenues ne constituent pas un conseil en investissement\nLes performances passées ne préjugent pas des performances futures\nCe document est soumis à la réglementation AMF\nPitchForge M&A Advisory — Tous droits réservés",
        preview: "disclaimer",
      },
    ],
  },
  {
    id: "cover",
    label: "Couvertures",
    icon: "🏛",
    elements: [
      {
        name: "Couverture Standard Cession",
        type: "cover",
        title: "Mémorandum d'Information Confidentiel",
        content: "Opération de cession\nSociété cible — Secteur d'activité\nDate — Strictement confidentiel",
        preview: "cover_standard",
      },
      {
        name: "Couverture LBO",
        type: "cover",
        title: "Opportunité d'Investissement LBO",
        content: "Dossier de présentation\nConfidentiel — Réservé aux investisseurs qualifiés\nDate de présentation",
        preview: "cover_lbo",
      },
      {
        name: "Couverture Levée de Fonds",
        type: "cover",
        title: "Levée de Fonds — Série A",
        content: "Présentation aux investisseurs\nMontant recherché : X M€\nConfidentiel",
        preview: "cover_levee",
      },
      {
        name: "Couverture Acquisition Stratégique",
        type: "cover",
        title: "Acquisition Stratégique — Dossier Confidentiel",
        content: "Présentation de l'opportunité d'acquisition\nRéservé à la direction générale\nDate — Version 1.0",
        preview: "cover_acq",
      },
      {
        name: "Couverture Fusion",
        type: "cover",
        title: "Projet de Fusion — Mémorandum Confidentiel",
        content: "Étude de faisabilité et synergies\nConfidentiel — Comité de direction\nDate de présentation",
        preview: "cover_fusion",
      },
    ],
  },
  {
    id: "executive",
    label: "Résumés Exécutifs",
    icon: "📋",
    elements: [
      {
        name: "Résumé Exécutif Cession",
        type: "executive_summary",
        title: "Résumé Exécutif",
        content: "Société leader dans son secteur avec 20+ ans d'historique\nCA de X M€ avec une croissance de X% par an\nEBITDA de X M€ (marge de X%)\nÉquipe dirigeante expérimentée et stable\nOpportunité de croissance externe identifiée\nProcessus de cession structuré — Closing visé T4 2025",
        preview: "exec_cession",
      },
      {
        name: "Points Clés de l'Opération",
        type: "executive_summary",
        title: "Points Clés de l'Opération",
        content: "Rationale stratégique : consolidation sectorielle\nValorisation indicative : X-Y fois l'EBITDA\nStructure : cession de 100% du capital\nFinancement : fonds propres + dette senior\nConditions suspensives : autorisation concurrence\nCalendrier : signing T3 — closing T4 2025",
        preview: "exec_points",
      },
      {
        name: "Résumé Exécutif LBO",
        type: "executive_summary",
        title: "Résumé Exécutif — Opportunité LBO",
        content: "Cible : leader de niche avec position défensive\nEV indicative : X-Y M€ (X,X-Y,Yx EV/EBITDA)\nDette senior : X M€ (X,Xx EBITDA)\nTRI cible : X%+ sur 4-6 ans\nManagement aligné avec plan d'intéressement\nSorties multiples : cession industrielle ou IPO",
        preview: "exec_lbo",
      },
      {
        name: "Résumé Exécutif Levée de Fonds",
        type: "executive_summary",
        title: "Résumé Exécutif — Levée de Fonds",
        content: "Montant recherché : X M€ (Série A)\nValorisation pre-money : X M€\nUtilisation des fonds : croissance commerciale (50%), R&D (30%), international (20%)\nTraction : X clients, X M€ ARR, croissance X%/an\nÉquipe : X personnes, fondateurs expérimentés\nInvestisseurs existants : X, Y, Z",
        preview: "exec_levee",
      },
    ],
  },
  {
    id: "thesis",
    label: "Thèses d'Investissement",
    icon: "💡",
    elements: [
      {
        name: "Thèse Stratégique",
        type: "thesis",
        title: "Thèse d'Investissement",
        content: "Leader de niche avec position défensive sur son marché\nBarrières à l'entrée élevées (brevets, savoir-faire, relations clients)\nVisibilité des revenus grâce aux contrats long terme\nLevier de croissance organique et externe identifié\nManagement aligné et prêt à accompagner la transition\nMultiples de valorisation attractifs vs. comparables cotés",
        preview: "thesis_strat",
      },
      {
        name: "Drivers de Valeur",
        type: "thesis",
        title: "Principaux Drivers de Valeur",
        content: "Croissance organique : expansion géographique et nouveaux segments\nCroissance externe : pipeline d'acquisitions bolt-on identifié\nAmélioration des marges : optimisation opérationnelle\nDigitalisation : transformation des processus métier\nFidélisation client : taux de rétention >90%\nDiversification : réduction de la dépendance aux top clients",
        preview: "thesis_drivers",
      },
      {
        name: "Plan de Création de Valeur LBO",
        type: "thesis",
        title: "Plan de Création de Valeur",
        content: "Levier financier : optimisation de la structure du capital\nLevier opérationnel : amélioration des marges de X à Y%\nLevier de croissance : acquisitions bolt-on ciblées\nLevier de gouvernance : professionnalisation du management\nLevier de sortie : multiples d'expansion attendus\nTRI cible : X%+ sur horizon 4-6 ans",
        preview: "thesis_lbo",
      },
      {
        name: "Proposition de Valeur Startup",
        type: "thesis",
        title: "Proposition de Valeur",
        content: "Problème : X coûte X M€/an aux entreprises du secteur\nSolution : notre plateforme réduit ce coût de X%\nMarché : X Md€ adressable, croissance X%/an\nModèle : SaaS récurrent, NRR >120%\nDifférenciation : technologie propriétaire brevetée\nTraction : X clients, X M€ ARR, croissance X%/mois",
        preview: "thesis_startup",
      },
    ],
  },
  {
    id: "financials",
    label: "Financiers",
    icon: "📊",
    elements: [
      {
        name: "KPIs Financiers",
        type: "financials",
        title: "Performances Financières Clés",
        content: "CA 2024 : X M€ (+X% vs. 2023)\nEBITDA 2024 : X M€ (marge X%)\nRésultat net 2024 : X M€\nDette nette : X M€ (levier X,Xx)\nBFR : X jours de CA\nCapex : X% du CA",
        preview: "fin_kpis",
      },
      {
        name: "Projections Financières 3 ans",
        type: "financials",
        title: "Plan d'Affaires 2025-2027",
        content: "CA 2025E : X M€ (+X%)\nCA 2026E : X M€ (+X%)\nCA 2027E : X M€ (+X%)\nEBITDA 2027E : X M€ (marge X%)\nTaux de croissance annuel composé : X%\nHypothèses : croissance organique + 1 acquisition bolt-on",
        preview: "fin_proj",
      },
      {
        name: "Structure du Capital & Valorisation",
        type: "financials",
        title: "Structure Financière & Valorisation",
        content: "Valorisation indicative : X-Y M€ (X,X-Y,Yx EV/EBITDA)\nDette senior : X M€ (X,Xx EBITDA)\nFonds propres : X M€\nMultiples de sortie comparables : X,X-Y,Yx EV/EBITDA\nTRI cible : X%+\nDurée d'investissement : 4-6 ans",
        preview: "fin_capital",
      },
      {
        name: "Métriques SaaS",
        type: "financials",
        title: "Métriques SaaS Clés",
        content: "ARR : X M€ (+X% YoY)\nMRR : X k€ (croissance X%/mois)\nNRR (Net Revenue Retention) : X%\nCAC (Coût d'Acquisition Client) : X k€\nLTV (Lifetime Value) : X k€ (ratio LTV/CAC : X)\nChurn mensuel : X%",
        preview: "fin_saas",
      },
      {
        name: "Analyse de Sensibilité",
        type: "financials",
        title: "Analyse de Sensibilité — Valorisation",
        content: "Scénario bas : X M€ (hypothèses conservatrices)\nScénario central : X M€ (hypothèses de base)\nScénario haut : X M€ (hypothèses optimistes)\nSensibilité au taux d'actualisation : ±X M€ par 1%\nSensibilité à la croissance : ±X M€ par 1%\nSensibilité aux marges : ±X M€ par 1 point",
        preview: "fin_sensitivity",
      },
    ],
  },
  {
    id: "market",
    label: "Analyses de Marché",
    icon: "🌍",
    elements: [
      {
        name: "TAM/SAM/SOM",
        type: "market",
        title: "Opportunité de Marché",
        content: "TAM (Marché Total Adressable) : X Md€ — croissance X%/an\nSAM (Marché Adressable Servi) : X M€ — France + Benelux\nSOM (Part de Marché Obtainable) : X M€ — cible 3 ans\nCroissance du secteur portée par la digitalisation\nConsolidation en cours : X transactions en 2024\nRéglementation favorable aux acteurs établis",
        preview: "market_tam",
      },
      {
        name: "Tendances Sectorielles",
        type: "market",
        title: "Dynamiques & Tendances du Secteur",
        content: "Consolidation accélérée : X acquisitions en 2023-2024\nDigitalisation des processus métier (IA, automatisation)\nPression réglementaire favorable aux leaders\nDemande croissante des grands comptes\nPénurie de main-d'œuvre qualifiée (barrière à l'entrée)\nTransition ESG comme vecteur de différenciation",
        preview: "market_trends",
      },
      {
        name: "Analyse PESTEL",
        type: "market",
        title: "Analyse PESTEL du Secteur",
        content: "Politique : stabilité réglementaire, soutien à la consolidation\nÉconomique : croissance du PIB X%, taux d'intérêt en baisse\nSocial : évolution des comportements consommateurs\nTechnologique : IA et automatisation comme disruption\nEnvironnemental : contraintes ESG croissantes\nLégal : RGPD, réglementation sectorielle spécifique",
        preview: "market_pestel",
      },
      {
        name: "Cartographie des Acquéreurs",
        type: "market",
        title: "Univers des Acquéreurs Potentiels",
        content: "Acquéreurs stratégiques : X groupes industriels identifiés\nFonds de PE : X fonds actifs sur le segment\nFamilles industrielles : X family offices ciblés\nActeurs internationaux : X groupes européens et américains\nCritères de sélection : taille, synergies, capacité financière\nProcessus : approche discrète et structurée",
        preview: "market_buyers",
      },
    ],
  },
  {
    id: "competition",
    label: "Concurrence",
    icon: "⚔️",
    elements: [
      {
        name: "Positionnement Concurrentiel",
        type: "competition",
        title: "Paysage Concurrentiel",
        content: "Société cible : leader de niche, X% de part de marché\nConcurrent A : acteur national, moins spécialisé\nConcurrent B : filiale d'un groupe international\nConcurrent C : acteur régional, taille plus modeste\nAvantages différenciants : expertise technique, proximité client, réactivité\nMenaces : entrée de nouveaux acteurs digitaux",
        preview: "comp_landscape",
      },
      {
        name: "Avantages Compétitifs Durables",
        type: "competition",
        title: "Avantages Compétitifs Durables",
        content: "Expertise technique propriétaire (20+ ans de R&D)\nBase clients fidèle : X clients, taux de rétention >90%\nCertifications et agréments difficiles à obtenir\nRéseau de distribution exclusif sur X régions\nMarque reconnue et réputation établie\nÉquipe technique rare et difficile à recruter",
        preview: "comp_advantages",
      },
      {
        name: "Matrice SWOT",
        type: "competition",
        title: "Analyse SWOT",
        content: "Forces : leadership marché, marges élevées, équipe expérimentée\nFaiblesses : dépendance géographique, concentration clients\nOpportunités : expansion internationale, acquisitions bolt-on\nMenaces : nouveaux entrants digitaux, pression tarifaire",
        preview: "comp_swot",
      },
    ],
  },
  {
    id: "team",
    label: "Équipes",
    icon: "👥",
    elements: [
      {
        name: "Équipe Dirigeante",
        type: "team",
        title: "Équipe Dirigeante",
        content: "Prénom Nom — PDG, 20 ans d'expérience sectorielle\nPrénom Nom — DAF, ex-Banque d'affaires, 15 ans\nPrénom Nom — DG Commercial, X M€ de CA géré\nPrénom Nom — DG Opérations, expert lean management\nPrénom Nom — DRH, spécialiste transformation RH\nConseil d'administration : X membres indépendants",
        preview: "team_mgmt",
      },
      {
        name: "Gouvernance Post-Acquisition",
        type: "team",
        title: "Gouvernance & Management Post-Acquisition",
        content: "Maintien du management en place — continuité opérationnelle\nPlan d'intéressement management : X% du capital\nConseil de surveillance : X membres dont X indépendants\nComités spécialisés : audit, rémunération, stratégie\nReporting mensuel : KPIs opérationnels et financiers\nBudget annuel validé par le conseil",
        preview: "team_gov",
      },
      {
        name: "Équipe Fondatrice Startup",
        type: "team",
        title: "Équipe Fondatrice",
        content: "Prénom Nom — CEO & Co-fondateur, ex-McKinsey, MBA HEC\nPrénom Nom — CTO & Co-fondateur, ex-Google, PhD IA\nPrénom Nom — CPO, ex-Salesforce, 10 ans produit SaaS\nAdvisors : X (ex-DG secteur), Y (Partner VC), Z (expert réglementaire)\nRecrutements clés prévus : VP Sales, VP Marketing\nCulture : X ingénieurs, X commerciaux, X pays",
        preview: "team_startup",
      },
    ],
  },
  {
    id: "timeline",
    label: "Calendriers",
    icon: "📅",
    elements: [
      {
        name: "Processus de Cession",
        type: "timeline",
        title: "Calendrier du Processus de Cession",
        content: "Phase 1 — Préparation : documentation et data room (4 sem.)\nPhase 2 — Marketing : approche des acquéreurs (6 sem.)\nPhase 3 — Offres indicatives : réception et analyse (2 sem.)\nPhase 4 — Due diligence : accès data room (6 sem.)\nPhase 5 — Offres fermes : négociation (3 sem.)\nPhase 6 — Signing & Closing : finalisation (4 sem.)",
        preview: "timeline_cession",
      },
      {
        name: "Plan d'Intégration Post-Acquisition",
        type: "timeline",
        title: "Plan d'Intégration Post-Acquisition",
        content: "J+0 à J+30 : communication interne et externe\nJ+30 à J+90 : audit opérationnel et identification synergies\nJ+90 à J+180 : mise en œuvre des quick wins\nJ+180 à J+365 : intégration des systèmes IT\nAn 2 : réalisation des synergies opérationnelles\nAn 3 : optimisation complète et croissance externe",
        preview: "timeline_integration",
      },
      {
        name: "Roadmap Produit Startup",
        type: "timeline",
        title: "Roadmap Produit & Milestones",
        content: "T1 2025 — MVP v2 : nouvelles fonctionnalités core\nT2 2025 — Expansion : lancement marché DACH\nT3 2025 — Partenariats : 3 intégrations stratégiques\nT4 2025 — Série B : levée de X M€\nT1 2026 — US : ouverture bureau New York\nT2 2026 — Profitabilité : breakeven opérationnel",
        preview: "timeline_roadmap",
      },
      {
        name: "Calendrier Due Diligence",
        type: "timeline",
        title: "Calendrier Due Diligence",
        content: "Semaine 1-2 — Financière : audit des comptes et projections\nSemaine 2-3 — Juridique : revue des contrats et litiges\nSemaine 3-4 — Fiscale : analyse de la structure fiscale\nSemaine 4-5 — Opérationnelle : visite des sites et entretiens\nSemaine 5-6 — Commerciale : analyse clients et contrats\nSemaine 6 — Synthèse : rapport final et ajustements prix",
        preview: "timeline_dd",
      },
    ],
  },
  {
    id: "appendix",
    label: "Annexes",
    icon: "📎",
    elements: [
      {
        name: "Comparables Boursiers & Transactions",
        type: "appendix",
        title: "Comparables Boursiers & Transactions",
        content: "Comparable A : EV/EBITDA X,Xx — EV/CA X,Xx\nComparable B : EV/EBITDA X,Xx — EV/CA X,Xx\nComparable C : EV/EBITDA X,Xx — EV/CA X,Xx\nTransaction 1 (2024) : EV/EBITDA X,Xx\nTransaction 2 (2023) : EV/EBITDA X,Xx\nMédiane sectorielle : EV/EBITDA X,X-Y,Yx",
        preview: "appendix_comps",
      },
      {
        name: "États Financiers Détaillés",
        type: "appendix",
        title: "États Financiers — Détail",
        content: "Compte de résultat : CA, EBITDA, EBIT, résultat net\nBilan : actifs, passifs, capitaux propres\nFlux de trésorerie : opérationnel, investissement, financement\nDette : structure, maturité, covenants\nCapex : historique et prévisionnel\nBFR : évolution et optimisation",
        preview: "appendix_financials",
      },
      {
        name: "Structure Juridique",
        type: "appendix",
        title: "Structure Juridique & Actionnariat",
        content: "Organigramme juridique du groupe\nActionnariat actuel : X% famille, Y% management, Z% financier\nFiliales et participations : liste et pourcentages\nContrats significatifs : durée et conditions\nLitiges en cours : nature et provisions\nPropriété intellectuelle : brevets, marques, licences",
        preview: "appendix_legal",
      },
      {
        name: "Glossaire M&A",
        type: "appendix",
        title: "Glossaire des Termes M&A",
        content: "EV (Enterprise Value) : valeur d'entreprise totale\nEBITDA : résultat avant intérêts, impôts, amortissements\nLBO : Leveraged Buy-Out — acquisition par effet de levier\nDD (Due Diligence) : audit d'acquisition\nSPA (Share Purchase Agreement) : contrat de cession\nTRI : Taux de Rendement Interne de l'investissement",
        preview: "appendix_glossary",
      },
    ],
  },
  {
    id: "esg",
    label: "ESG & RSE",
    icon: "🌱",
    elements: [
      {
        name: "Profil ESG",
        type: "thesis",
        title: "Profil ESG & Responsabilité",
        content: "Environnemental : réduction CO2 de X%, certification ISO 14001\nSocial : taux de satisfaction employés X%, parité H/F X%\nGouvernance : conseil indépendant, audit externe annuel\nObjectifs 2030 : neutralité carbone, X% énergie renouvelable\nRapport RSE annuel publié depuis X ans\nLabels et certifications : B Corp, ISO 26000",
        preview: "esg_profile",
      },
      {
        name: "Stratégie ESG Post-Acquisition",
        type: "thesis",
        title: "Feuille de Route ESG",
        content: "An 1 : audit ESG complet et définition des KPIs\nAn 2 : mise en œuvre des quick wins environnementaux\nAn 3 : certification et reporting extra-financier\nInvestissement ESG prévu : X M€ sur 3 ans\nImpact attendu : réduction empreinte carbone de X%\nValeur créée : prime de valorisation ESG estimée à X%",
        preview: "esg_roadmap",
      },
    ],
  },
  {
    id: "synergies",
    label: "Synergies",
    icon: "🔗",
    elements: [
      {
        name: "Analyse des Synergies",
        type: "executive_summary",
        title: "Synergies Identifiées",
        content: "Synergies de revenus : X M€/an (cross-selling, nouveaux marchés)\nSynergies de coûts : X M€/an (achats, fonctions support)\nSynergies financières : X M€ (optimisation fiscale, refinancement)\nTotal synergies : X M€/an à horizon 3 ans\nCoût d'intégration : X M€ (one-off)\nVAN des synergies : X M€ (taux d'actualisation X%)",
        preview: "synergies_analysis",
      },
      {
        name: "Plan d'Intégration des Synergies",
        type: "timeline",
        title: "Réalisation des Synergies",
        content: "An 1 — Quick wins : X M€ (fonctions support, achats)\nAn 2 — Opérationnel : X M€ (optimisation processus)\nAn 3 — Stratégique : X M€ (cross-selling, nouveaux marchés)\nRisques d'intégration : rétention talents, systèmes IT\nPlan de mitigation : équipe dédiée, budget contingence\nKPIs de suivi : reporting mensuel au conseil",
        preview: "synergies_plan",
      },
    ],
  },
];

export function SlideElementLibrary({ projectId, currentSlideCount, onInserted, theme }: Props) {
  const bulkInsert = useMutation(api.slides.bulkInsert);
  const [activeCategory, setActiveCategory] = useState("logo");
  const [inserting, setInserting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customizing, setCustomizing] = useState<null | { name: string; type: string; title: string; content: string }>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customContent, setCustomContent] = useState("");

  const primary = theme?.primaryColor ?? "#1a3a5c";
  const accent = theme?.accentColor ?? "#c9a84c";

  async function handleInsert(element: { name: string; type: string; title: string; content: string }) {
    setInserting(element.name);
    try {
      await bulkInsert({
        projectId,
        slides: [{ type: element.type, title: element.title, content: element.content, order: currentSlideCount }],
      });
      toast.success(`"${element.name}" ajouté au deck`);
      onInserted?.();
    } catch {
      toast.error("Erreur lors de l'insertion");
    } finally {
      setInserting(null);
    }
  }

  async function handleInsertCustomized() {
    if (!customizing) return;
    setInserting(customizing.name);
    try {
      await bulkInsert({
        projectId,
        slides: [{ type: customizing.type, title: customTitle, content: customContent, order: currentSlideCount }],
      });
      toast.success(`"${customizing.name}" personnalisé et ajouté`);
      setCustomizing(null);
      onInserted?.();
    } catch {
      toast.error("Erreur lors de l'insertion");
    } finally {
      setInserting(null);
    }
  }

  function openCustomize(el: { name: string; type: string; title: string; content: string }) {
    setCustomizing(el);
    setCustomTitle(el.title);
    setCustomContent(el.content);
  }

  const activeElements = ELEMENT_CATEGORIES.find(c => c.id === activeCategory)?.elements ?? [];
  const filteredElements = search
    ? ELEMENT_CATEGORIES.flatMap(c => c.elements).filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase()) ||
        e.title.toLowerCase().includes(search.toLowerCase())
      )
    : activeElements;

  // Customization modal
  if (customizing) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <button onClick={() => setCustomizing(null)} className="text-gray-400 hover:text-gray-600 text-sm">←</button>
          <div>
            <p className="text-xs font-semibold text-[#1a3a5c]">✏️ Personnaliser l'élément</p>
            <p className="text-xs text-gray-400">{customizing.name}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Titre de la diapositive</label>
            <input
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contenu <span className="text-gray-400 font-normal">(une ligne par point)</span></label>
            <textarea
              value={customContent}
              onChange={e => setCustomContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] resize-none font-mono transition-colors"
            />
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
            💡 Remplacez les "X" par vos données réelles. Chaque ligne devient un point de la diapositive.
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button onClick={() => setCustomizing(null)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button
            onClick={handleInsertCustomized}
            disabled={inserting !== null || !customTitle.trim()}
            className="flex-1 px-3 py-2 rounded-lg bg-[#1a3a5c] text-white text-xs font-semibold hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors"
          >
            {inserting ? "Insertion..." : "✅ Insérer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <p className="text-xs font-semibold text-[#1a3a5c]">🧩 Éléments M&A Prêts à l'Emploi</p>
        <p className="text-xs text-gray-400 mt-0.5">{ELEMENT_CATEGORIES.reduce((a, c) => a + c.elements.length, 0)} éléments · Cliquez pour insérer ou personnaliser</p>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un élément..."
          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c] transition-colors"
        />
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex overflow-x-auto border-b border-gray-100 flex-shrink-0 scrollbar-hide">
          {ELEMENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 text-[10px] font-medium transition-colors border-b-2 ${activeCategory === cat.id ? "border-[#1a3a5c] text-[#1a3a5c]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:block">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Elements list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredElements.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs">Aucun élément trouvé</p>
          </div>
        )}
        {filteredElements.map(el => (
          <div
            key={el.name}
            className="rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-sm transition-all overflow-hidden group"
          >
            {/* Mini preview */}
            <div
              className="w-full h-14 flex items-center justify-center relative overflow-hidden"
              style={{ background: el.type === "cover" ? primary : `${primary}08` }}
            >
              <div className="absolute inset-0 flex flex-col">
                {el.type === "cover" ? (
                  <div className="flex-1 flex flex-col items-center justify-center px-3">
                    <div className="w-8 h-0.5 rounded mb-1" style={{ background: accent }} />
                    <p className="text-white text-[7px] font-bold text-center leading-tight line-clamp-1">{el.title}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: accent }} />
                  </div>
                ) : (
                  <>
                    <div className="h-4 flex items-center px-3" style={{ background: primary }}>
                      <p className="text-white text-[6px] font-bold truncate">{el.title}</p>
                    </div>
                    <div className="flex-1 px-3 py-1 space-y-0.5">
                      {el.content.split("\n").slice(0, 2).map((line, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent }} />
                          <p className="text-[5px] text-gray-500 truncate">{line}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-0.5" style={{ background: accent }} />
                  </>
                )}
              </div>
            </div>

            {/* Info + actions */}
            <div className="px-3 py-2 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-700 truncate">{el.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{el.content.split("\n")[0]}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => openCustomize(el)}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[10px] font-medium hover:bg-gray-50 transition-colors"
                  title="Personnaliser avant d'insérer"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleInsert(el)}
                  disabled={inserting === el.name}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1a3a5c] text-white text-[10px] font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  {inserting === el.name ? (
                    <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>+ Insérer</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

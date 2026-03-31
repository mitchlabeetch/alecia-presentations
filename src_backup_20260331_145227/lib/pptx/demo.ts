/**
 * Demo - Exemple d'utilisation du générateur PPTX Alecia
 */

import {
  AleciaPptxGenerator,
  createPresentation,
  savePresentation,
  createDemoChartData,
  createDemoTableData,
} from './index';

/**
 * Crée une présentation de démonstration complète
 */
export async function createDemoPresentation(): Promise<void> {
  const presentationData = {
    title: 'Présentation de Démonstration Alecia',
    subject: 'Gestion de patrimoine',
    author: 'Alecia',
    company: 'Alecia - Conseil en gestion de patrimoine',
    slides: [
      // Slide 1: Titre
      {
        type: 'title' as const,
        title: 'Alecia',
        subtitle: 'Conseil en Gestion de Patrimoine',
        date: new Date().toLocaleDateString('fr-FR'),
      },

      // Slide 2: Introduction
      {
        type: 'content' as const,
        title: 'Qui sommes-nous ?',
        content: [
          { text: 'Expertise en gestion de patrimoine depuis 2005', level: 0 },
          { text: 'Équipe de 15 conseillers certifiés', level: 0 },
          { text: 'Plus de 500 familles accompagnées', level: 0 },
          { text: 'Approche personnalisée et indépendante', level: 0 },
        ],
      },

      // Slide 3: Services
      {
        type: 'twoColumn' as const,
        title: 'Nos Services',
        leftColumn: [
          { text: 'Gestion de patrimoine', level: 0 },
          { text: 'Conseil en investissement', level: 0 },
          { text: 'Planification successorale', level: 0 },
        ],
        rightColumn: [
          { text: 'Optimisation fiscale', level: 0 },
          { text: 'Retraite et prévoyance', level: 0 },
          { text: 'Protection familiale', level: 0 },
        ],
      },

      // Slide 4: Performance (Graphique)
      {
        type: 'chart' as const,
        title: 'Performance du Portefeuille',
        chartType: 'line' as const,
        data: createDemoChartData().lineChart,
        options: {
          showLegend: true,
          showValue: false,
        },
      },

      // Slide 5: Répartition (Graphique circulaire)
      {
        type: 'chart' as const,
        title: 'Répartition du Portefeuille',
        chartType: 'doughnut' as const,
        data: createDemoChartData().pieChart,
        options: {
          showLegend: true,
          showPercent: true,
        },
      },

      // Slide 6: Tableau de performance
      {
        type: 'table' as const,
        title: 'Performance Historique',
        tableType: 'performance' as const,
        data: createDemoTableData().performanceTable,
      },

      // Slide 7: Équipe
      {
        type: 'team' as const,
        title: 'Notre Équipe',
        members: [
          {
            name: 'Marie Martin',
            role: 'Directrice Générale',
            description: '20 ans d\'expérience en gestion de patrimoine',
          },
          {
            name: 'Pierre Dubois',
            role: 'Conseiller Senior',
            description: 'Spécialiste en investissements',
          },
          {
            name: 'Sophie Bernard',
            role: 'Conseillère',
            description: 'Experte en planification successorale',
          },
        ],
      },

      // Slide 8: Clients
      {
        type: 'clients' as const,
        title: 'Ils nous font confiance',
        logos: [
          { name: 'Client 1', imagePath: '/assets/clients/client1.png' },
          { name: 'Client 2', imagePath: '/assets/clients/client2.png' },
          { name: 'Client 3', imagePath: '/assets/clients/client3.png' },
          { name: 'Client 4', imagePath: '/assets/clients/client4.png' },
          { name: 'Client 5', imagePath: '/assets/clients/client5.png' },
          { name: 'Client 6', imagePath: '/assets/clients/client6.png' },
        ],
      },

      // Slide 9: Séparateur
      {
        type: 'sectionDivider' as const,
        title: 'Notre Méthodologie',
        subtitle: 'Une approche structurée et personnalisée',
      },

      // Slide 10: Tableau de répartition
      {
        type: 'table' as const,
        title: 'Allocation Stratégique',
        tableType: 'portfolio' as const,
        data: createDemoTableData().portfolioTable,
      },

      // Slide 11: Fermeture
      {
        type: 'closing' as const,
        thankYouText: 'Merci de votre attention',
        contactInfo: {
          company: 'Alecia',
          address: '25 Avenue des Champs-Élysées\n75008 Paris',
          phone: '01 42 00 00 00',
          email: 'contact@alecia.fr',
          website: 'www.alecia.fr',
        },
      },
    ],
  };

  // Créer et sauvegarder la présentation
  const generator = new AleciaPptxGenerator({
    includeWatermark: true,
    includeLogo: true,
    includeFooter: true,
    includeDate: true,
    language: 'fr',
  });

  generator.generatePresentation(presentationData);
  await generator.save('demo-presentation-alecia.pptx');

  console.log('Présentation de démonstration créée avec succès !');
}

/**
 * Exemple avec variables de substitution
 */
export async function createPersonalizedPresentation(
  clientName: string,
  meetingDate: string
): Promise<void> {
  const presentationData = {
    title: `Présentation - ${clientName}`,
    slides: [
      {
        type: 'title' as const,
        title: `Bienvenue {{clientName}}`,
        subtitle: 'Votre rendez-vous de gestion de patrimoine',
        date: '{{meetingDate}}',
      },
      {
        type: 'content' as const,
        title: 'Objet de notre rendez-vous',
        content: [
          { text: 'Bilan patrimonial personnalisé', level: 0 },
          { text: 'Analyse de vos objectifs', level: 0 },
          { text: 'Recommandations sur mesure', level: 0 },
        ],
      },
    ],
    variables: {
      clientName,
      meetingDate,
    },
  };

  await savePresentation(presentationData, `presentation-${clientName}.pptx`, {
    includeWatermark: true,
    includeFooter: true,
  });
}

/**
 * Exemple de création rapide
 */
export async function createQuickPresentation(): Promise<void> {
  const pptx = await createPresentation({
    title: 'Présentation Rapide',
    slides: [
      {
        type: 'title',
        title: 'Ma Présentation',
        subtitle: 'Sous-titre',
      },
      {
        type: 'content',
        title: 'Points Clés',
        content: ['Point 1', 'Point 2', 'Point 3'],
      },
      {
        type: 'closing',
        thankYouText: 'Merci',
      },
    ],
  });

  await pptx.writeFile({ fileName: 'quick-presentation.pptx' });
}

// Exécution si appelé directement
if (require.main === module) {
  createDemoPresentation().catch(console.error);
}

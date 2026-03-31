/**
 * Seed database with initial data
 */

import { getDb, generateId } from './database.js';
import bcrypt from 'bcryptjs';

const db = getDb();

/**
 * Seed users
 */
function seedUsers() {
  const users = [
    {
      id: generateId(),
      email: 'jean.dupont@alecia.fr',
      first_name: 'Jean',
      last_name: 'Dupont',
      password: 'password123',
      role: 'admin'
    },
    {
      id: generateId(),
      email: 'marie.martin@alecia.fr',
      first_name: 'Marie',
      last_name: 'Martin',
      password: 'password123',
      role: 'editor'
    },
    {
      id: generateId(),
      email: 'pierre.bernard@alecia.fr',
      first_name: 'Pierre',
      last_name: 'Bernard',
      password: 'password123',
      role: 'viewer'
    }
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, first_name, last_name, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const user of users) {
    const passwordHash = bcrypt.hashSync(user.password, 10);
    stmt.run(user.id, user.email, user.first_name, user.last_name, passwordHash, user.role);
  }

  console.log('✅ Users seeded');
  return users;
}

/**
 * Seed templates
 */
function seedTemplates(userId) {
  const templates = [
    {
      id: generateId(),
      name: 'Pitch Deck Standard',
      description: 'Template générique pour pitch clients',
      category: 'pitch',
      slides: JSON.stringify([
        { type: 'title', title: '{{client}}', subtitle: 'Présentation' },
        { type: 'content', title: 'Sommaire', bullets: ['Introduction', 'Proposition', 'Équipe', 'Prochaines étapes'] },
        { type: 'content', title: 'Notre équipe', content: 'Présentation de l\'équipe Alecia' },
        { type: 'clients', title: 'Nos références' },
        { type: 'closing', title: 'Merci de votre attention' }
      ]),
      variables: JSON.stringify({
        client: 'Nom du client',
        date: 'Date de la présentation'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Levée de Fonds',
      description: 'Template pour accompagner les levées de fonds',
      category: 'fundraising',
      slides: JSON.stringify([
        { type: 'title', title: '{{client}}', subtitle: 'Levée de fonds {{montant}}' },
        { type: 'content', title: 'Sommaire exécutif', content: 'Vue d\'ensemble de l\'opération' },
        { type: 'content', title: 'Notre approche', bullets: ['Diagnostic', 'Structuration', 'Exécution'] },
        { type: 'team', title: 'L\'équipe dédiée' },
        { type: 'table', title: 'Phases et jalons' },
        { type: 'closing', title: 'Prochaines étapes' }
      ]),
      variables: JSON.stringify({
        client: 'Nom de la société',
        montant: 'Montant de la levée'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Cession d\'entreprise',
      description: 'Template pour les opérations de cession',
      category: 'cession',
      slides: JSON.stringify([
        { type: 'title', title: 'Projet de cession', subtitle: '{{client}}' },
        { type: 'content', title: 'Processus de cession', content: 'Les étapes clés' },
        { type: 'content', title: 'Valorisation', bullets: ['Méthodes', 'Benchmarks', 'Hypothèses'] },
        { type: 'chart', title: 'Évolution du CA' },
        { type: 'closing', title: 'Contact' }
      ]),
      variables: JSON.stringify({
        client: 'Nom de la société à céder'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Acquisition',
      description: 'Template pour les opérations d\'acquisition',
      category: 'acquisition',
      slides: JSON.stringify([
        { type: 'title', title: 'Projet d\'acquisition', subtitle: '{{client}}' },
        { type: 'content', title: 'Stratégie d\'acquisition', content: 'Objectifs et critères' },
        { type: 'content', title: 'Cible idéale', bullets: ['Secteur', 'Taille', 'Localisation'] },
        { type: 'table', title: 'Critères de sélection' },
        { type: 'closing', title: 'Prochaines étapes' }
      ]),
      variables: JSON.stringify({
        client: 'Nom de l\'acquéreur'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Financements Structurés',
      description: 'Template pour les financements structurés',
      category: 'financing',
      slides: JSON.stringify([
        { type: 'title', title: 'Structuration du financement', subtitle: '{{client}}' },
        { type: 'content', title: 'Besoins de financement', content: 'Montant: {{montant}}' },
        { type: 'content', title: 'Structure optimale', bullets: ['Dette senior', 'Mezzanine', 'Equity'] },
        { type: 'chart', title: 'Structure du financement' },
        { type: 'closing', title: 'Calendrier' }
      ]),
      variables: JSON.stringify({
        client: 'Nom du client',
        montant: 'Montant du financement'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Rapport',
      description: 'Template générique pour rapports',
      category: 'report',
      slides: JSON.stringify([
        { type: 'title', title: '{{titre}}', subtitle: '{{sous_titre}}' },
        { type: 'content', title: 'Introduction', content: 'Contexte et objectifs' },
        { type: 'content', title: 'Analyse', bullets: ['Point 1', 'Point 2', 'Point 3'] },
        { type: 'content', title: 'Recommandations', content: 'Nos préconisations' },
        { type: 'closing', title: 'Conclusion' }
      ]),
      variables: JSON.stringify({
        titre: 'Titre du rapport',
        sous_titre: 'Sous-titre'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Équipe',
      description: 'Template pour présentation d\'équipe',
      category: 'team',
      slides: JSON.stringify([
        { type: 'title', title: 'Notre équipe', subtitle: 'Alecia' },
        { type: 'team', title: 'Les partners' },
        { type: 'team', title: 'Les directors' },
        { type: 'content', title: 'Notre expertise', bullets: ['M&A', 'Levées', 'Financements'] },
        { type: 'closing', title: 'Contactez-nous' }
      ]),
      variables: JSON.stringify({}),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Références Clients',
      description: 'Template pour présentation des références',
      category: 'references',
      slides: JSON.stringify([
        { type: 'title', title: 'Nos références', subtitle: '{{secteur}}' },
        { type: 'clients', title: 'Transactions récentes' },
        { type: 'content', title: 'Notre track record', content: '{{nombre}} transactions réalisées' },
        { type: 'closing', title: 'Merci' }
      ]),
      variables: JSON.stringify({
        secteur: 'Secteur d\'activité',
        nombre: 'Nombre de transactions'
      }),
      is_default: true
    }
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO templates 
    (id, name, description, category, slides_json, variables_json, is_default, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const template of templates) {
    stmt.run(
      template.id,
      template.name,
      template.description,
      template.category,
      template.slides,
      template.variables,
      template.is_default ? 1 : 0,
      userId
    );
  }

  console.log('✅ Templates seeded');
}

/**
 * Seed variable presets
 */
function seedVariablePresets(userId) {
  const presets = [
    {
      id: generateId(),
      name: 'Standard Client',
      description: 'Variables standard pour présentation client',
      variables: JSON.stringify({
        client: 'Nom du Client',
        adresse_client: 'Adresse du client',
        contact_nom: 'Nom du contact',
        contact_fonction: 'Fonction du contact',
        date: new Date().toLocaleDateString('fr-FR'),
        date_longue: new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        nom_projet: 'Nom du projet',
        montant: 'Montant',
        secteur: 'Secteur d\'activité',
        region: 'Région'
      }),
      is_default: true
    },
    {
      id: generateId(),
      name: 'Levée de Fonds',
      description: 'Variables pour levée de fonds',
      variables: JSON.stringify({
        client: 'Nom de la société',
        montant: '5M€',
        serie: 'Série A',
        secteur: 'Tech / SaaS',
        date: new Date().toLocaleDateString('fr-FR'),
        valorisation: '20M€',
        investisseurs: 'VC, BA'
      }),
      is_default: false
    }
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO variable_presets (id, name, description, variables_json, is_default, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const preset of presets) {
    stmt.run(preset.id, preset.name, preset.description, preset.variables, preset.is_default ? 1 : 0, userId);
  }

  console.log('✅ Variable presets seeded');
}

/**
 * Main seed function
 */
export function seedDatabase() {
  console.log('🌱 Seeding database...');
  
  const users = seedUsers();
  if (users.length > 0) {
    seedTemplates(users[0].id);
    seedVariablePresets(users[0].id);
  }
  
  console.log('✅ Database seeded successfully');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

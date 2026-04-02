import { Router } from 'express';
import { execQuery, getOne } from '../db/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { pitchdeckOnly = 'true', sector, region, year, type } = req.query;
    
    let query = `
      SELECT 
        id, deal_id as dealId, company, annee_deal as anneeDeal,
        type_deal as typeDeal, responsable_deal as responsableDeal,
        equipier_deal as equipierDeal, is_client_ou_contrepartie as isClientOuContrepartie,
        description_deal as descriptionDeal, region_deal as regionDeal,
        sector_deal as sectorDeal, taille_operation_m_euro as tailleOperationMEuro,
        ca_cible_m_euro as caCibleMEuro, afficher_site as afficherSite,
        afficher_pitchdeck as afficherPitchdeck, is_company as isCompany,
        is_alecia as isAlecia, logo_filename as logoFilename
      FROM deals
      WHERE 1=1
    `;
    
    const params: unknown[] = [];
    
    if (pitchdeckOnly === 'true') {
      query += ' AND afficher_pitchdeck = 1';
    }
    
    if (sector) {
      query += ' AND sector_deal = ?';
      params.push(sector);
    }
    
    if (region) {
      query += ' AND region_deal = ?';
      params.push(region);
    }
    
    if (year) {
      query += ' AND annee_deal = ?';
      params.push(year);
    }
    
    if (type) {
      query += ' AND type_deal = ?';
      params.push(type);
    }
    
    query += ' ORDER BY annee_deal DESC, deal_id ASC';
    
    const deals = execQuery(query, params);
    res.json(deals);
  } catch (error) {
    next(error);
  }
});

router.get('/trackrecord', async (_req, res, next) => {
  try {
    const deals = execQuery(`
      SELECT 
        id, deal_id as dealId, company, annee_deal as anneeDeal,
        type_deal as typeDeal, description_deal as descriptionDeal,
        region_deal as regionDeal, sector_deal as sectorDeal,
        taille_operation_m_euro as tailleOperationMEuro,
        ca_cible_m_euro as caCibleMEuro, logo_filename as logoFilename
      FROM deals
      WHERE afficher_pitchdeck = 1
      ORDER BY annee_deal DESC, deal_id ASC
    `);
    
    res.json(deals);
  } catch (error) {
    next(error);
  }
});

router.get('/sectors', async (_req, res, next) => {
  try {
    const sectors = execQuery(`
      SELECT DISTINCT sector_deal as sector
      FROM deals
      WHERE sector_deal IS NOT NULL AND sector_deal != ''
      ORDER BY sector_deal ASC
    `);
    
    res.json(sectors.map((s: { sector: string }) => s.sector));
  } catch (error) {
    next(error);
  }
});

router.get('/regions', async (_req, res, next) => {
  try {
    const regions = execQuery(`
      SELECT DISTINCT region_deal as region
      FROM deals
      WHERE region_deal IS NOT NULL AND region_deal != ''
      ORDER BY region_deal ASC
    `);
    
    res.json(regions.map((r: { region: string }) => r.region));
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = getOne(`
      SELECT 
        COUNT(*) as totalDeals,
        COUNT(DISTINCT annee_deal) as years,
        COUNT(DISTINCT sector_deal) as sectors,
        COUNT(DISTINCT responsable_deal) as partners,
        SUM(CASE WHEN type_deal = 'Cession' THEN 1 ELSE 0 END) as cessions,
        SUM(CASE WHEN type_deal = 'Levée de fonds' THEN 1 ELSE 0 END) as levees,
        SUM(CASE WHEN type_deal = 'Acquisition' THEN 1 ELSE 0 END) as acquisitions
      FROM deals
      WHERE afficher_pitchdeck = 1
    `);
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;

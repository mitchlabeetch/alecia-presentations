import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Help() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-alecia-silver/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-alecia-navy" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-alecia-navy">Aide</h1>
          <p className="text-alecia-silver mt-1">
            Guide d'utilisation d'Alecia Presentations
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-alecia-navy mb-4">Premiers pas</h2>
          <div className="space-y-4 text-alecia-silver">
            <p>
              <strong className="text-alecia-navy">1. Créez un projet</strong><br />
              Cliquez sur "Nouveau projet" depuis la galerie pour commencer une nouvelle présentation.
            </p>
            <p>
              <strong className="text-alecia-navy">2. Utilisez un modèle</strong><br />
              Accédez à la section "Modèles" pour démarrer avec un modèle prédéfini.
            </p>
            <p>
              <strong className="text-alecia-navy">3. Modifiez vos slides</strong><br />
              Sélectionnez une slide dans la liste de gauche et modifiez son contenu.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-alecia-navy mb-4">Navigation</h2>
          <ul className="space-y-2 text-alecia-silver">
            <li>• <strong>Galerie</strong> - Vos présentations</li>
            <li>• <strong>Modèles</strong> - Templates prédéfinis</li>
            <li>• <strong>Éditeur</strong> - Créez et modifiez vos slides</li>
            <li>• <strong>Mode présentation</strong> - Affichez votre deck en plein écran</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-alecia-navy mb-4">Raccourcis clavier</h2>
          <div className="grid grid-cols-2 gap-4 text-alecia-silver">
            <div>
              <kbd className="px-2 py-1 bg-alecia-silver/10 rounded text-sm">+</kbd> Zoom avant
            </div>
            <div>
              <kbd className="px-2 py-1 bg-alecia-silver/10 rounded text-sm">-</kbd> Zoom arrière
            </div>
            <div>
              <kbd className="px-2 py-1 bg-alecia-silver/10 rounded text-sm">0</kbd> Réinitialiser zoom
            </div>
            <div>
              <kbd className="px-2 py-1 bg-alecia-silver/10 rounded text-sm">Alt + Clic</kbd> Pan
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-alecia-navy mb-4">Contact</h2>
          <p className="text-alecia-silver">
            Besoin d'aide ? Contactez-nous à <strong>support@alecia.fr</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

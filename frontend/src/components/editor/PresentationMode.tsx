import { useParams } from 'react-router-dom';

export function PresentationMode() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold">Mode Présentation</h1>
        <p className="mt-4 text-alecia-silver">Projet: {projectId}</p>
        <p className="mt-8 text-sm text-alecia-silver">
          Appuyez sur Échap pour quitter
        </p>
      </div>
    </div>
  );
}

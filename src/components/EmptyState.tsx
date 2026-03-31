import React from "react";
import { motion } from "framer-motion";
import { FolderOpen, FileText, MessageSquare, Activity, Search } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-alecia-navy-lighter/50 flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-8 h-8 text-alecia-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-alecia-gray-400 text-sm max-w-sm mb-6">{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {secondaryAction && <Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
          {action && <Button variant="primary" size="sm" onClick={action.onClick}>{action.label}</Button>}
        </div>
      )}
    </motion.div>
  );
}

export function NoProjects({ onCreateProject }: { onCreateProject?: () => void }) {
  return <EmptyState icon={<FolderOpen className="w-8 h-8 text-alecia-pink" />} title="Aucun projet" description="Commencez par créer votre premier projet de présentation M&A." action={onCreateProject ? { label: "Créer un projet", onClick: onCreateProject } : undefined} />;
}

export function NoBlocks({ onAddBlock }: { onAddBlock?: () => void }) {
  return <EmptyState icon={<FileText className="w-8 h-8 text-alecia-gold" />} title="Aucun bloc" description="Ajoutez des blocs pour construire votre diapositive." action={onAddBlock ? { label: "Ajouter un bloc", onClick: onAddBlock } : undefined} />;
}

export function NoComments({ onAddComment }: { onAddComment?: () => void }) {
  return <EmptyState icon={<MessageSquare className="w-8 h-8 text-alecia-gray-400" />} title="Aucun commentaire" description="Soyez le premier à ajouter un commentaire." action={onAddComment ? { label: "Ajouter un commentaire", onClick: onAddComment } : undefined} />;
}

export function NoActivity() {
  return <EmptyState icon={<Activity className="w-8 h-8 text-alecia-gray-400" />} title="Aucune activité récente" description="Votre activité apparaîtra ici." />;
}

export function NoSearchResults({ query }: { query: string }) {
  const desc = "Aucun résultat pour \"" + query + "\". Essayez autres termes.";
  return <EmptyState icon={<Search className="w-8 h-8 text-alecia-gray-400" />} title="Aucun résultat" description={desc} />;
}

export function NoTemplates({ onCreateTemplate }: { onCreateTemplate?: () => void }) {
  return <EmptyState icon={<FileText className="w-8 h-8 text-alecia-pink" />} title="Aucun modèle" description="Créez votre premier modèle personnalisé." action={onCreateTemplate ? { label: "Créer un modèle", onClick: onCreateTemplate } : undefined} />;
}

export default EmptyState;

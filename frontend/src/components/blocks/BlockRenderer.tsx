import type { Slide, BlockType, BlockContent } from '@/types';
import type { ReactNode } from 'react';

// Block components
import { Titre } from './blocks/Titre';
import { SousTitre } from './blocks/SousTitre';
import { Paragraphe } from './blocks/Paragraphe';
import { Liste } from './blocks/Liste';
import { Citation } from './blocks/Citation';
import { TwoColumn } from './blocks/TwoColumn';
import { SectionNavigator } from './blocks/SectionNavigator';
import { Cover } from './blocks/Cover';
import { KPI_Card } from './blocks/KPI_Card';
import { Table_Block } from './blocks/Table_Block';
import { Chart_Block } from './blocks/Chart_Block';
import { Timeline_Block } from './blocks/Timeline_Block';
import { Company_Overview } from './blocks/Company_Overview';
import { Deal_Rationale } from './blocks/Deal_Rationale';
import { SWOTBlock } from './blocks/SWOTBlock';
import { Key_Metrics } from './blocks/Key_Metrics';
import { Process_Timeline } from './blocks/Process_Timeline';
import { Team_Grid } from './blocks/Team_Grid';
import { Team_Row } from './blocks/Team_Row';
import { Advisor_List } from './blocks/Advisor_List';
import { ImageBlock } from './blocks/Image';
import { Logo_Grid } from './blocks/Logo_Grid';
import { Icon_Text } from './blocks/Icon_Text';
import { Trackrecord_Block } from './blocks/Trackrecord_Block';
import { SectionDivider } from './blocks/Section_Divider';
import { Disclaimer_Block } from './blocks/Disclaimer_Block';

interface BlockRendererProps {
  slide: Slide;
  isEditing?: boolean;
  onBlockSelect?: (blockId: string | null) => void;
  selectedBlockId?: string | null;
  onContentChange?: (content: BlockContent) => void;
}

export function BlockRenderer({
  slide,
  isEditing = false,
  onBlockSelect,
  selectedBlockId,
  onContentChange,
}: BlockRendererProps): ReactNode {
  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditing && onBlockSelect) {
      onBlockSelect(slide.id);
    }
  };

  const renderBlock = () => {
    switch (slide.type as BlockType) {
      // Text blocks
      case 'Titre':
        return (
          <Titre
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Sous-titre':
        return (
          <SousTitre
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Paragraphe':
        return (
          <Paragraphe
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Liste':
        return (
          <Liste
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Citation':
        return (
          <Citation
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      // Layout blocks
      case 'Two_Column':
      case 'TwoColumn':
        return (
          <TwoColumn
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Section_Navigator':
      case 'SectionNavigator':
        return (
          <SectionNavigator
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Cover':
      case 'Couverture':
        return (
          <Cover
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Section_Divider':
      case 'SectionDivider':
        return (
          <SectionDivider
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      // Financial blocks
      case 'KPI_Card':
        return (
          <KPI_Card
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Table_Block':
        return (
          <Table_Block
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Chart_Block':
        return (
          <Chart_Block
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Timeline_Block':
        return (
          <Timeline_Block
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      // M&A blocks
      case 'Company_Overview':
        return (
          <Company_Overview
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Deal_Rationale':
        return (
          <Deal_Rationale
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'SWOT':
        return (
          <SWOTBlock
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Key_Metrics':
        return (
          <Key_Metrics
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Process_Timeline':
        return (
          <Process_Timeline
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      // Team blocks
      case 'Team_Grid':
        return (
          <Team_Grid
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Team_Row':
        return (
          <Team_Row
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Advisor_List':
        return (
          <Advisor_List
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      // Visual blocks
      case 'Image':
        return (
          <ImageBlock
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Logo_Grid':
        return (
          <Logo_Grid
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Icon_Text':
        return (
          <Icon_Text
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );
      case 'Trackrecord_Block':
        return (
          <Trackrecord_Block
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      case 'Disclaimer':
        return (
          <Disclaimer_Block
            content={slide.content}
            isEditing={isEditing}
            onChange={onContentChange}
          />
        );

      // Default
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-alecia-silver">
              Bloc non reconnu : {slide.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`w-full h-full ${isEditing ? 'cursor-pointer' : ''} ${
        selectedBlockId === slide.id
          ? 'ring-2 ring-alecia-red ring-offset-2'
          : ''
      }`}
      onClick={handleBlockClick}
    >
      {renderBlock()}
    </div>
  );
}

// Export block components for easier imports
export * from './blocks/Titre';
export * from './blocks/SousTitre';
export * from './blocks/Paragraphe';
export * from './blocks/Liste';
export * from './blocks/Citation';
export * from './blocks/TwoColumn';
export * from './blocks/SectionNavigator';
export * from './blocks/Cover';
export * from './blocks/KPI_Card';
export * from './blocks/Table_Block';
export * from './blocks/Chart_Block';
export * from './blocks/Timeline_Block';
export * from './blocks/Company_Overview';
export * from './blocks/Deal_Rationale';
export * from './blocks/SWOTBlock';
export * from './blocks/Key_Metrics';
export * from './blocks/Process_Timeline';
export * from './blocks/Team_Grid';
export * from './blocks/Team_Row';
export * from './blocks/Advisor_List';
export * from './blocks/Image';
export * from './blocks/Logo_Grid';
export * from './blocks/Icon_Text';
export * from './blocks/Trackrecord_Block';
export * from './blocks/Section_Divider';
export * from './blocks/Disclaimer_Block';

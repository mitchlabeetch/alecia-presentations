import React, { useState, useCallback } from 'react';
import { UploadedFile } from './useFileUpload';
import FileUploader from './FileUploader';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'logo' | 'icon';
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  tags: string[];
  createdAt: Date;
  category?: string;
}

interface AssetLibraryProps {
  assets?: Asset[];
  onAssetsChange?: (assets: Asset[]) => void;
  onAssetSelect?: (asset: Asset) => void;
  selectedAssetIds?: string[];
  allowUpload?: boolean;
  allowDelete?: boolean;
  allowTagging?: boolean;
  categories?: string[];
  className?: string;
  emptyMessage?: string;
  title?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'Ko', 'Mo'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets: externalAssets,
  onAssetsChange,
  onAssetSelect,
  selectedAssetIds = [],
  allowUpload = true,
  allowDelete = true,
  allowTagging = true,
  categories = ['Général', 'Logos', 'Icônes', 'Arrière-plans'],
  className = '',
  emptyMessage = 'Aucun média dans la bibliothèque',
  title = 'Bibliothèque de médias',
}) => {
  const [internalAssets, setInternalAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [newTag, setNewTag] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  const assets = externalAssets ?? internalAssets;
  const setAssets = onAssetsChange ?? setInternalAssets;

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUploaded = useCallback(
    (file: UploadedFile) => {
      const newAsset: Asset = {
        id: file.id,
        name: file.name,
        type: file.name.toLowerCase().includes('logo')
          ? 'logo'
          : file.name.toLowerCase().includes('icon')
          ? 'icon'
          : 'image',
        url: file.url || '',
        thumbnail: file.thumbnail,
        size: file.size,
        tags: [],
        createdAt: new Date(),
        category: 'Général',
      };
      setAssets([...assets, newAsset]);
    },
    [assets, setAssets]
  );

  const handleDeleteAsset = useCallback(
    (assetId: string) => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
        setAssets(assets.filter((a) => a.id !== assetId));
      }
    },
    [assets, setAssets]
  );

  const handleAddTag = useCallback(
    (assetId: string, tag: string) => {
      if (!tag.trim()) return;
      setAssets(
        assets.map((a) =>
          a.id === assetId && !a.tags.includes(tag.trim())
            ? { ...a, tags: [...a.tags, tag.trim()] }
            : a
        )
      );
      setNewTag('');
    },
    [assets, setAssets]
  );

  const handleRemoveTag = useCallback(
    (assetId: string, tagToRemove: string) => {
      setAssets(
        assets.map((a) =>
          a.id === assetId
            ? { ...a, tags: a.tags.filter((t) => t !== tagToRemove) }
            : a
        )
      );
    },
    [assets, setAssets]
  );

  const handleUpdateCategory = useCallback(
    (assetId: string, category: string) => {
      setAssets(
        assets.map((a) => (a.id === assetId ? { ...a, category } : a))
      );
    },
    [assets, setAssets]
  );

  const handleRenameAsset = useCallback(
    (assetId: string, newName: string) => {
      setAssets(
        assets.map((a) => (a.id === assetId ? { ...a, name: newName } : a))
      );
      setEditingAsset(null);
    },
    [assets, setAssets]
  );

  const isSelected = (assetId: string) => selectedAssetIds.includes(assetId);

  return (
    <div className={`asset-library ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.headerActions}>
          <button
            type="button"
            style={{
              ...styles.viewModeButton,
              ...(viewMode === 'grid' ? styles.viewModeActive : {}),
            }}
            onClick={() => setViewMode('grid')}
            title="Vue grille"
          >
            ⊞
          </button>
          <button
            type="button"
            style={{
              ...styles.viewModeButton,
              ...(viewMode === 'list' ? styles.viewModeActive : {}),
            }}
            onClick={() => setViewMode('list')}
            title="Vue liste"
          >
            ☰
          </button>
          {allowUpload && (
            <button
              type="button"
              style={styles.uploadButton}
              onClick={() => setShowUploader(!showUploader)}
            >
              {showUploader ? 'Fermer' : 'Importer'}
            </button>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {showUploader && allowUpload && (
        <div style={styles.uploadSection}>
          <FileUploader
            onFileUploaded={handleFileUploaded}
            acceptedFormats={[
              'image/png',
              'image/jpeg',
              'image/jpg',
              'image/svg+xml',
              'image/webp',
            ]}
            dropzoneText="Glisser-déposer vos images ici"
            uploadButtonText="Parcourir"
            supportedFormatsText="Formats supportés"
          />
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.categorySelect}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <span>{filteredAssets.length} média(s)</span>
        {searchQuery && (
          <button
            type="button"
            style={styles.clearFilter}
            onClick={() => setSearchQuery('')}
          >
            Effacer la recherche
          </button>
        )}
      </div>

      {/* Asset Grid/List */}
      {filteredAssets.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🖼️</span>
          <p style={styles.emptyText}>{emptyMessage}</p>
          {allowUpload && (
            <button
              type="button"
              style={styles.emptyUploadButton}
              onClick={() => setShowUploader(true)}
            >
              Importer des médias
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.grid}>
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              style={{
                ...styles.gridItem,
                ...(isSelected(asset.id) ? styles.gridItemSelected : {}),
              }}
              onClick={() => onAssetSelect?.(asset)}
            >
              <div style={styles.gridImageContainer}>
                {asset.thumbnail || asset.url ? (
                  <img
                    src={asset.thumbnail || asset.url}
                    alt={asset.name}
                    style={styles.gridImage}
                  />
                ) : (
                  <div style={styles.gridPlaceholder}>🖼️</div>
                )}
                {isSelected(asset.id) && (
                  <div style={styles.selectedOverlay}>✓</div>
                )}
                {allowDelete && (
                  <button
                    type="button"
                    style={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAsset(asset.id);
                    }}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <div style={styles.gridInfo}>
                {editingAsset?.id === asset.id ? (
                  <input
                    type="text"
                    defaultValue={asset.name}
                    autoFocus
                    onBlur={(e) => handleRenameAsset(asset.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameAsset(asset.id, e.currentTarget.value);
                      }
                    }}
                    style={styles.renameInput}
                  />
                ) : (
                  <span
                    style={styles.gridName}
                    onDoubleClick={() => allowTagging && setEditingAsset(asset)}
                    title="Double-cliquer pour renommer"
                  >
                    {asset.name}
                  </span>
                )}
                <span style={styles.gridSize}>{formatFileSize(asset.size)}</span>
                {asset.category && (
                  <select
                    value={asset.category}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleUpdateCategory(asset.id, e.target.value);
                    }}
                    style={styles.assetCategorySelect}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
                {allowTagging && (
                  <div style={styles.tags}>
                    {asset.tags.map((tag) => (
                      <span key={tag} style={styles.tag}>
                        {tag}
                        <button
                          type="button"
                          style={styles.removeTag}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(asset.id, tag);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          handleAddTag(asset.id, newTag);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={styles.addTagInput}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.list}>
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              style={{
                ...styles.listItem,
                ...(isSelected(asset.id) ? styles.listItemSelected : {}),
              }}
              onClick={() => onAssetSelect?.(asset)}
            >
              <div style={styles.listThumbnail}>
                {asset.thumbnail || asset.url ? (
                  <img
                    src={asset.thumbnail || asset.url}
                    alt={asset.name}
                    style={styles.listThumbnailImage}
                  />
                ) : (
                  <span>🖼️</span>
                )}
              </div>
              <div style={styles.listInfo}>
                <span style={styles.listName}>{asset.name}</span>
                <span style={styles.listMeta}>
                  {formatFileSize(asset.size)} • {asset.category}
                </span>
                <div style={styles.listTags}>
                  {asset.tags.map((tag) => (
                    <span key={tag} style={styles.listTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.listActions}>
                {allowDelete && (
                  <button
                    type="button"
                    style={styles.listDeleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAsset(asset.id);
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0a1628',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  viewModeButton: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  },
  viewModeActive: {
    backgroundColor: '#0a1628',
    color: '#ffffff',
    borderColor: '#0a1628',
  },
  uploadButton: {
    padding: '8px 16px',
    backgroundColor: '#e91e63',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  uploadSection: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  categorySelect: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    minWidth: '180px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#64748b',
  },
  clearFilter: {
    padding: '4px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0 0 20px 0',
  },
  emptyUploadButton: {
    padding: '12px 24px',
    backgroundColor: '#e91e63',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
  },
  gridItem: {
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  gridItemSelected: {
    borderColor: '#e91e63',
  },
  gridImageContainer: {
    position: 'relative',
    aspectRatio: '1',
    backgroundColor: '#e2e8f0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
  },
  selectedOverlay: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: '24px',
    height: '24px',
    backgroundColor: '#e91e63',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  gridInfo: {
    padding: '12px',
  },
  gridName: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#0a1628',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '4px',
  },
  gridSize: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
  },
  assetCategorySelect: {
    width: '100%',
    marginTop: '8px',
    padding: '4px 8px',
    fontSize: '11px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '8px',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#e91e63',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '10px',
  },
  removeTag: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    padding: 0,
    lineHeight: 1,
  },
  addTagInput: {
    width: '60px',
    padding: '2px 8px',
    border: '1px dashed #cbd5e1',
    borderRadius: '12px',
    fontSize: '10px',
    outline: 'none',
  },
  renameInput: {
    width: '100%',
    padding: '4px 8px',
    border: '1px solid #e91e63',
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  listItemSelected: {
    borderColor: '#e91e63',
    backgroundColor: '#fdf2f8',
  },
  listThumbnail: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  listThumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  listInfo: {
    flex: 1,
    minWidth: 0,
  },
  listName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#0a1628',
    marginBottom: '4px',
  },
  listMeta: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '4px',
  },
  listTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  listTag: {
    padding: '2px 8px',
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    borderRadius: '4px',
    fontSize: '10px',
  },
  listActions: {
    display: 'flex',
    gap: '8px',
  },
  listDeleteButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  },
};

export default AssetLibrary;

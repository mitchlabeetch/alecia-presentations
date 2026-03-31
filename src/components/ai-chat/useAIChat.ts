import { useState, useCallback, useRef, useEffect } from 'react';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface SuggestionChip {
  id: string;
  label: string;
  action: string;
}

export interface TemplateRecommendation {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface SlideGenerationRequest {
  type: 'title' | 'team' | 'financial' | 'timeline' | 'market' | 'custom';
  title?: string;
  content?: string;
}

// Suggestions rapides contextuelles
export const quickSuggestions: SuggestionChip[] = [
  { id: '1', label: 'Créer une présentation', action: 'Créer une présentation pour un nouveau client' },
  { id: '2', label: 'Ajouter une slide titre', action: 'Ajouter une slide de titre' },
  { id: '3', label: 'Générer slide équipe', action: 'Générer une slide équipe' },
  { id: '4', label: 'Modèle levée de fonds', action: 'Quel modèle pour une levée de fonds?' },
  { id: '5', label: 'Slide financière', action: 'Créer une slide avec les données financières' },
  { id: '6', label: 'Timeline projet', action: 'Ajouter une timeline du projet' },
];

// Réponses simulées de l'IA
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  // Créer une présentation
  if (lowerMessage.includes('créer') && lowerMessage.includes('présentation')) {
    return `Je vais créer une nouvelle présentation pour vous ! 

**Que souhaitez-y inclure ?**

- Une slide de titre avec le nom du client
- Une slide de présentation de l'équipe
- Des slides financières
- Une analyse de marché
- Une timeline du projet

Dites-moi quel type de présentation vous souhaitez créer, et je vous recommanderai le meilleur modèle. Par exemple : présentation de levée de fonds, rapport annuel, ou proposition commerciale.`;
  }

  // Slide de titre
  if (lowerMessage.includes('slide') && lowerMessage.includes('titre')) {
    return `**Slide de titre créée !**

J'ai ajouté une slide de titre avec les éléments suivants :
- Titre principal avec le nom du client
- Sous-titre personnalisable
- Logo Alecia
- Date et informations de contact

**Variables disponibles :**
- \{\{client\}\} - Nom du client
- \{\{date\}\} - Date actuelle
- \{\{conseiller\}\} - Nom du conseiller

Souhaitez-vous personnaliser le titre ou ajouter d'autres éléments ?`;
  }

  // Slide équipe
  if (lowerMessage.includes('équipe') || lowerMessage.includes('team')) {
    return `**Slide équipe générée !**

J'ai créé une slide présentant l'équipe avec :
- Photos des membres de l'équipe
- Noms et titres
- Courtes biographies professionnelles
- Liens LinkedIn (optionnel)

**Format :** Grille 2x2 ou 3x2 selon le nombre de membres

Souhaitez-vous ajouter des membres spécifiques ou modifier la mise en page ?`;
  }

  // Modèle levée de fonds
  if (lowerMessage.includes('levée') || lowerMessage.includes('fonds')) {
    return `**Modèle recommandé : Levée de Fonds Série A**

Ce modèle comprend :

1. **Slide Titre** - Nom de la startup et montant recherché
2. **Problème** - Le pain point que vous résolvez
3. **Solution** - Votre produit/service
4. **Marché** - TAM, SAM, SOM
5. **Business Model** - Comment vous gagnez de l'argent
6. **Traction** - Métriques clés et croissance
7. **Équipe** - Fondateurs et membres clés
8. **Financier** - Projections et utilisation des fonds
9. **Closing** - Appel à l'action

**Variables suggérées :**
- \{\{montant_levee\}\} - Montant de la levée
- \{\{valuation\}\} - Valorisation
- \{\{startup_nom\}\} - Nom de la startup

Voulez-vous que je crée cette présentation avec ce modèle ?`;
  }

  // Variables
  if (lowerMessage.includes('remplacer') || lowerMessage.includes('{{')) {
    return `**Variables disponibles dans vos présentations :**

| Variable | Description | Exemple |
|----------|-------------|---------|
| \{\{client\}\} | Nom du client | "Société ABC" |
| \{\{client_adresse\}\} | Adresse du client | "123 rue de Paris" |
| \{\{conseiller\}\} | Votre nom | "Jean Dupont" |
| \{\{conseiller_email\}\} | Votre email | "jean@alecia.fr" |
| \{\{date\}\} | Date du jour | "15 janvier 2025" |
| \{\{date_long\}\} | Date complète | "15 janvier 2025" |
| \{\{montant\}\} | Montant | "1 000 000 €" |
| \{\{taux\}\} | Taux d'intérêt | "3,5%" |

**Comment utiliser :**
Tapez simplement \{\{variable\}\} dans votre texte, et elle sera remplacée automatiquement.

Souhaitez-vous ajouter une variable personnalisée ?`;
  }

  // Slide financière
  if (lowerMessage.includes('financier') || lowerMessage.includes('financière')) {
    return `**Slide financière créée !**

J'ai généré une slide avec :
- Tableau des données financières clés
- Graphiques de tendances
- Indicateurs de performance (KPIs)
- Projections sur 3 ans

**Éléments inclus :**
- Chiffre d'affaires
- EBITDA
- Marge nette
- Trésorerie
- Ratio de dette

**Variables utilisées :**
- \{\{ca_actuel\}\} - CA actuel
- \{\{ca_previsionnel\}\} - CA prévisionnel
- \{\{ebitda\}\} - EBITDA

Voulez-vous modifier les données ou ajouter d'autres indicateurs ?`;
  }

  // Timeline
  if (lowerMessage.includes('timeline') || lowerMessage.includes('chronologie')) {
    return `**Timeline du projet créée !**

J'ai créé une timeline visuelle avec :
- Jalons clés du projet
- Dates importantes
- Responsables par étape
- Indicateurs de progression

**Format :** Ligne temporelle horizontale avec points clés

**Étapes suggérées :**
1. Phase de diagnostic
2. Analyse approfondie
3. Élaboration de la stratégie
4. Mise en œuvre
5. Suivi et ajustements

Souhaitez-vous personnaliser les étapes ou le format ?`;
  }

  // Réponse par défaut
  return `Je comprends votre demande. Comment puis-je vous aider davantage avec votre présentation ?

**Voici ce que je peux faire :**

- Créer une nouvelle présentation complète
- Ajouter des slides spécifiques (titre, équipe, financier, etc.)
- Recommander un modèle adapté à votre besoin
- Générer du contenu pour vos slides
- Suggérer des variables à utiliser
- Modifier le style et la mise en page

N'hésitez pas à me donner plus de détails sur ce que vous souhaitez accomplir !`;
};

// Simuler un streaming de réponse
const simulateStreaming = (
  content: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): (() => void) => {
  let index = 0;
  const chunkSize = 3; // Caractères par chunk
  const delay = 15; // ms entre chaque chunk

  const interval = setInterval(() => {
    if (index < content.length) {
      const chunk = content.slice(index, index + chunkSize);
      onChunk(chunk);
      index += chunkSize;
    } else {
      clearInterval(interval);
      onComplete();
    }
  }, delay);

  return () => clearInterval(interval);
};

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  input: string;
  setInput: (value: string) => void;
  sendMessage: (content: string) => Promise<void>;
  handleSuggestionClick: (suggestion: SuggestionChip) => void;
  clearChat: () => void;
  copyMessage: (messageId: string) => Promise<boolean>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const useAIChat = (): UseAIChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'Assistant Alecia. Comment puis-je vous aider avec votre présentation aujourd\'hui ?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<(() => void) | null>(null);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return;

    // Annuler tout streaming en cours
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }

    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simuler un délai de réflexion
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsLoading(false);
    setIsStreaming(true);

    // Générer la réponse de l'IA
    const aiResponse = generateAIResponse(content);

    // Créer le message de l'assistant
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Simuler le streaming
    let streamedContent = '';
    abortRef.current = simulateStreaming(
      aiResponse,
      (chunk) => {
        streamedContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedContent }
              : msg
          )
        );
      },
      () => {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        abortRef.current = null;
      }
    );
  }, [isLoading, isStreaming]);

  const handleSuggestionClick = useCallback((suggestion: SuggestionChip) => {
    sendMessage(suggestion.action);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    // Annuler tout streaming en cours
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Conversation réinitialisée. Comment puis-je vous aider ?',
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
    setIsStreaming(false);
    setInput('');
  }, []);

  const copyMessage = useCallback(async (messageId: string): Promise<boolean> => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return false;

    try {
      await navigator.clipboard.writeText(message.content);
      return true;
    } catch {
      return false;
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    isStreaming,
    input,
    setInput,
    sendMessage,
    handleSuggestionClick,
    clearChat,
    copyMessage,
    messagesEndRef,
  };
};

export default useAIChat;

/Users/utilisateur/Desktop/Alecia Presentations/FRENCH_AUDIT.md
```

```markdown
# French Localization Audit - Alecia Presentations

**Date:** June 2025
**Project:** Alecia Presentations (PitchForge - M&A Presentation Generator)
**Scope:** React Components, Convex Backend, Templates, Error Messages

---

## ❌ English Strings Found (Need Translation)

### SignInForm.tsx (src/components/)

| Line | English Text | Suggested French |
|------|--------------|------------------|
| 23 | "Invalid password. Please try again." | "Mot de passe incorrect. Veuillez réessayer." |
| 27 | "Could not sign in, did you mean to sign up?" | "Connexion impossible. Voulez-vous créer un compte ?" |
| 28 | "Could not sign up, did you mean to sign in?" | "Inscription impossible. Voulez-vous vous connecter ?" |
| 37 | `placeholder="Email"` | `placeholder="Email"` (keep as-is, technical field) |
| 44 | `placeholder="Password"` | `placeholder="Mot de passe"` |
| 48 | "Sign in" / "Sign up" | "Se connecter" / "S'inscrire" |
| 54 | "Don't have an account? " | "Vous n'avez pas de compte ? " |
| 56 | "Already have an account? " | "Vous avez déjà un compte ? " |
| 62 | "Sign up instead" | "S'inscrire" |
| 62 | "Sign in instead" | "Se connecter" |
| 68 | "or" | "ou" |
| 74 | "Sign in anonymously" | "Se connecter anonymement" |

### ExportButton.tsx (src/components/)

| Line | English Text | Suggested French |
|------|--------------|------------------|
| 89 | "Export..." | "Exportation..." |

---

## ✅ Already French (No Action Needed)

### React Components - Fully French
| File | Status |
|------|--------|
| `src/components/Dashboard.tsx` | ✅ All French |
| `src/components/NewProjectWizard.tsx` | ✅ All French |
| `src/components/ChatPanel.tsx` | ✅ All French |
| `src/components/AIChatPanel.tsx` | ✅ All French |
| `src/components/ProjectEditor.tsx` | ✅ All French |
| `src/components/SlideEditor.tsx` | ✅ All French |
| `src/components/CommentsPanel.tsx` | ✅ All French |
| `src/components/TemplateGallery.tsx` | ✅ All French |
| `src/components/ProjectSettings.tsx` | ✅ All French |
| `src/components/SaveTemplateModal.tsx` | ✅ All French |
| `src/components/AISettingsPanel.tsx` | ✅ All French |
| `src/components/VariableEditor.tsx` | ✅ All French |
| `src/components/BlockLibrary.tsx` | ✅ All French |
| `src/components/Toolbar.tsx` | ✅ All French (tooltips) |
| `src/components/Modal.tsx` | ✅ All French |
| `src/components/CollaborationIndicator.tsx` | ✅ All French |
| `src/components/SearchPanel.tsx` | ✅ All French |
| `src/components/SlidePanel.tsx` | ✅ All French |
| `src/components/SlideElementLibrary.tsx` | ✅ All French |
| `src/components/Input.tsx` | ✅ All French |
| `src/components/Button.tsx` | ✅ No visible text strings |
| `src/components/Header.tsx` | ✅ All French |
| `src/components/Sidebar.tsx` | ✅ All French |

### Convex Backend - French Error Messages
| File | Status |
|------|--------|
| `convex/chat.ts` | ✅ Uses "Non authentifié" |
| `convex/projects.ts` | ✅ Uses "Non authentifié", "Accès refusé" |
| `convex/slides.ts` | ✅ Uses "Non authentifié", "Accès refusé", "Diapositive introuvable" |
| `convex/comments.ts` | ✅ Uses "Non authentifié", "Accès refusé", "Commentaire introuvable" |
| `convex/templates.ts` | ✅ Uses "Non authentifié" |
| `convex/aiSettings.ts` | ✅ Uses "Non authentifié" |

### Templates - Built-in French Templates
| File | Status |
|------|--------|
| `TemplateGallery.tsx` BUILTIN_TEMPLATES | ✅ All French content |

---

## Summary

| Category | Count |
|----------|-------|
| **English strings needing translation** | 13 |
| **Components/files fully in French** | 25+ |
| **Convex backend files using French** | 6 |

---

## Missing French Translations Needed

1. "Invalid password. Please try again."
2. "Could not sign in, did you mean to sign up?"
3. "Could not sign up, did you mean to sign in?"
4. "Password" (placeholder)
5. "Sign in" / "Sign up" (buttons)
6. "Don't have an account?"
7. "Already have an account?"
8. "Sign up instead" / "Sign in instead"
9. "or" (divider text)
10. "Sign in anonymously"
11. "Export..." (loading state)

---

## Priority

**Medium Priority** - These strings appear in the authentication flow which is a critical user touchpoint. All other UI elements are properly localized in French.

**Estimated Effort:** ~30 minutes to fix all 11 translation items.
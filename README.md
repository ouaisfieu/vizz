# vizz — la visionneuse

Portail de six sites consacrés au gouvernement belge De Wever (coalition « Arizona »), faits arrêtés
au 30 septembre 2026. Pas toujours faciles à trouver avec un moteur de recherche : les voici réunis.

| Site | Chemin | Ton |
|---|---|---|
| L'état des lieux | `../opus/` | Descriptif |
| La version Gemini | `../opus/gemini/` | Interactif (produite avec Gemini) |
| Le contre-rapport | `../greco/` | Critique, interactif |
| L'Observatoire | `../bisous/` | Synthèse en quatre entrées |
| Le rire jaune | `../haha/` | Satirique |
| 33 % | `../33pc/` | Récit interactif, anonyme |

## Ce que fait la page

- Cartes avec captures bureau et mobile, filtres par ton, aperçus en direct (option).
- Visionneuse plein écran : onglets, flèches ← →, largeurs bureau / tablette / mobile, `C` pour comparer
  deux sites côte à côte, ouverture dans un nouvel onglet.
- Liens directs : `#voir/greco`, `#comparer/opus/greco`.
- La saga, dans l'ordre, et un tableau comparatif.

Les chemins sont relatifs : la visionneuse doit être publiée au même endroit que les autres sites
(même compte GitHub Pages). Ouverte depuis un fichier local, elle affiche les captures mais pas les
aperçus en direct. Aucun cookie, aucun traceur, aucune ressource externe ; aucune signature.

Fichiers : `index.html`, `assets/` (CSS, JS, données `sites.js`, favicon), `thumbs/` (captures),
`404.html`. HTML/CSS/JS sans dépendance ni étape de build.

Rédigé avec l'assistance d'une IA (Claude, Anthropic). Textes CC BY-NC-SA 4.0 · code MIT.

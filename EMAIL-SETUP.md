# Configuration Email Gratuite

## Option 1: Mode Démo (Actuel)
- Les codes s'affichent dans les logs Render
- Gratuit et fonctionnel immédiatement
- Parfait pour les tests

## Option 2: Resend (2000 emails/mois gratuits)

### Étapes:
1. Créer un compte sur **resend.com**
2. Obtenir votre clé API
3. Dans Render → Web Service → Environment:
   - Ajouter: `RESEND_API_KEY` = votre_clé_api
4. Redéployer

### Avantages:
- Vrais emails envoyés
- 2000 emails/mois gratuits
- Interface professionnelle

## Option 3: EmailJS (Frontend)
- Envoi direct depuis le navigateur
- 200 emails/mois gratuits
- Configuration plus simple

## Recommandation
Commencez avec le **Mode Démo** (logs), puis passez à **Resend** si besoin de vrais emails.

Les codes de vérification sont visibles dans:
**Render Dashboard → Web Service → Logs**
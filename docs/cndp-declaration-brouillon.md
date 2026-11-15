# CNDP : brouillon de déclaration (loi 09-08)

Statut : brouillon préparé le 15 novembre 2026. Rien n'a été déposé. Le dépôt se fait en ligne sur cndp.ma par le responsable du traitement, avec son identité. Ce document n'est pas un avis juridique.

## Contenu attendu d'une déclaration

D'après les guides consultés : finalité du traitement, catégories de données, destinataires, durée de conservation. Formulaires connus d'après la procédure de notification de la CNDP (juillet 2025) :

- F-112 : demande d'autorisation préalable. Pièces demandées : copie du document de collecte du consentement, copie de la mention d'information, tout document utilisé pour la collecte.
- F-113 et F-214 : formulaires pour un traitement couvert par une délibération type de la CNDP (autorisation ou déclaration normale conformément à une décision).

Je n'ai trouvé aucune délibération type pour un site éducatif tenu par un enseignant. Le cas général serait donc une déclaration ou une autorisation hors modèle. La CNDP indique un numéro de contact, le 3020, et un « Guide conformité sites web » sur cndp.ma. Les consulter avant de choisir le formulaire.

## Réponses prêtes à copier, d'après le fonctionnement réel du site

| Rubrique | Contenu |
| --- | --- |
| Responsable du traitement | À compléter : nom de l'enseignant, établissement, adresse, courriel |
| Finalité | Suivi pédagogique de la progression des élèves sur un site de cours complémentaire |
| Personnes concernées | Élèves du collège, donc mineurs |
| Données | Prénom ou pseudo, code de classe facultatif, type d'appareil, ville approximative, chapitre, niveau, scores |
| Données non conservées | Adresse IP (jamais gardée dans la base) |
| Données sensibles | Aucune |
| Base du traitement | Case de consentement cochée par l'élève. À confirmer pour les mineurs : accord du parent ou du tuteur |
| Destinataire | L'enseignant seul, après connexion au tableau de bord |
| Durée | 180 jours, puis suppression automatique |
| Droits | Accès, correction, suppression : bouton « Supprimer » du tableau de bord, sur demande du parent ou de l'élève |
| Sécurité | Accès au tableau de bord par clé secrète, blocage après 10 échecs en 10 minutes, aucun suivi publicitaire |
| Page d'information | https://taalim.men/confidentialite |

## Transferts hors du Maroc à déclarer

| Service | Rôle | Remarque |
| --- | --- | --- |
| Cloudflare Pages et Workers | Hébergement du site et du relais | Serveurs répartis dans le monde |
| Cloudflare D1, base `taalim` | Stockage des résultats | Région indiquée par Cloudflare : Europe de l'Ouest (WEUR) |
| Telegram | Alertes à l'enseignant, avec accord de l'élève | Nom, appareil, ville, chapitre, niveau, score |
| ipwho.is, ipapi.co, api.ipify.org | Ville approximative, appelés par le navigateur de l'élève | Seulement si la case de consentement est cochée |

## Points à trancher avant le dépôt

1. Qui est le responsable du traitement : l'enseignant ou l'établissement ? Demander la position de la direction.
2. Consentement des mineurs : la page actuelle donne la case à l'élève seul. Demander à la CNDP si l'accord du parent est requis et sous quelle forme.
3. Transferts vers Cloudflare et Telegram : demander à la CNDP si une autorisation est nécessaire ou si une notification suffit.
4. Après le dépôt : ajouter le numéro du récépissé et l'identité du responsable sur la page de confidentialité.

# oKanban le retour

## Pré-requis

<details><summary>
Pré-requis
</summary>

- Vérifier la version de Node

  - Version supérieure à 20 à vérifier avec `node -v`
  - [Sinon à installer avec NVM](https://gist.github.com/enzoclock/4699778e26a7a0990ef00e42c8a3f87b)

- Installer [`pnpm`](https://pnpm.io/)

  - par exemple via un `npm install -g pnpm`
  - et vérifier sa bonne installation avec `pnpm --version`

- Installer les extensions recommandées (VSCode va les proposer)

</details>


## Installation

<details><summary>
Installation
</summary>


```bash
# Installer les dépendances frontend (React) et backend (API)
pnpm install
```

### Mise en place de la base de données

#### Option 1 : Postgres

```bash
# Se connecter à Postgres via psql en tant que super admin
sudo -i -u postgres psql # ou équivalent
```

```sql
-- Créer l'utilisateur
CREATE USER okanbanv2 WITH LOGIN PASSWORD 'okanbanv2';

-- Créer la base de données
CREATE DATABASE okanbanv2 WITH OWNER okanbanv2;
```

```bash
# Créer un fichier d'environnement et le remplir (les valeurs sont à adapter pour la prod)
cp packages/backend/.env.example packages/backend/.env
```


```bash
# Lancer les migrations
pnpm back:db:migrate
# et l'échantillonnage
pnpm back:db:seed
```


### Lancement

Dans **deux terminaux distincts** :

```bash
# Lancer le serveur http pour l'API
# Port par défaut : 3000
pnpm back:dev
```

```bash
# Lancer le serveur Vite pour React
# Port par défaut : 5173
pnpm front:dev
```

</details>


## Documentation

<details><summary>
Documentation
</summary>

Il s'agit d'un mono-dépôt, géré par `pnpm`, une surcouche à NPM.

- le code `React` se trouve dans `packages/frontend`
- le code `Node` se trouve dans `packages/backend`

Si besoin d'installer un package, voici la commande à fournir :

- côté `frontend` :
  - `pnpm --filter frontend add <nom_du_package>`
- côté `backend` :
  - `pnpm --filter backend add <nom_du_package>`

La documentation de l'API est disponible à l'adresse suivante : [http://localhost:3000/docs](http://localhost:3000/docs)

Il s'agit d'un Kanban avec une notion d'utilisateur, de board, de liste, de carte et de label.

L'utilisateur connecter verras ses boards, pourra en créer, les modifier, les supprimer, les partager, etc.

</details>

## Exercices

### Exercice 1

<details><summary>
Prise en main du code
</summary>

Lancer le projet en suivant les étapes d'**installation** plus haut.

Lire la brève **documentation** de ce document plus haut.

Faire un tour de l'architecture `React` fournie, sans entrer dans les détails.
TailwindCSS est déjà configuré, vous pouvez l'utiliser pour styliser vos composants. [Documentation](https://tailwindcss.com/docs/styling-with-utility-classes)
Ou utiliser des classes CSS classiques.

En cas de question, n'hésitez pas à les poser en créant des issues GitHub !

</details>

### Exercice 2

<details><summary>
Connexion
</summary>

React Router est déjà installé et configuré avec une page de connexion.

Un formulaire de connexion est déjà présent, mais il n'est pas encore fonctionnel.

Il vous est demandé :
- d'appeler l'API pour l'authentification ([voir la documentation de l'API pour plus d'informations](http://localhost:3000/docs#tag/default/POST/api/v1/auth/signin))
  - utiliser l'instance Axios déjà configurée dans `packages/frontend/src/utils/axios.ts`
- utiliser le compte utilisateur de test créer lors du seeding de la base de données
  - email : `test@test.io`
  - mot de passe : `password`
- en cas d'erreur, afficher un message d'erreur
- en cas de succès, rediriger l'utilisateur vers la page `/boards` qui sera à créer dans l'exercice suivant.
  - utiliser le hook [useNavigate](https://reactrouter.com/start/library/navigating#usenavigate) de React Router pour cela

</details>

### Exercice 3

<details><summary>
Page liste des boards
</summary>

Créer une page `/boards` qui affiche la liste des boards de l'utilisateur connecté.

Pour cela, il vous est demandé :
- configurer une route `/boards` dans `packages/frontend/src/Router.tsx`
- afficher le composant `BoardsPage` sur cette route. (le composant est déjà créé dans le dossier `packages/frontend/src/pages/BoardsPage/BoardsPage.tsx`)

</details>

### Exercice 4

<details><summary>
Récupération des boards
</summary>

Appeler l'API pour récupérer les boards de l'utilisateur connecté.

Pour cela, il vous est demandé :
- d'appeler l'API pour récupérer les boards de l'utilisateur connecté ([voir la documentation de l'API pour plus d'informations](http://localhost:3000/docs#tag/default/GET/api/v1/boards))
- stocker les boards dans une variable d'état (`useState`)
- afficher les boards dans le composant `BoardsPage`

</details>

### Exercice 5

<details><summary>
Filtrer les boards
</summary>

Ajouter un champ de recherche pour filtrer les boards par leur nom.

Pour cela, il vous est demandé :
- d'ajouter un champ de recherche dans le composant `BoardsPage`
- de filtrer les boards en fonction de la valeur du champ de recherche

</details>

### Exercice 6

<details><summary>
Création d'un board
</summary>

Créer une page `/boards/new` qui permet de créer un nouveau board.

Pour cela, il vous est demandé :
- configurer une route `/boards/new` dans `packages/frontend/src/Router.tsx`
- afficher le composant `NewBoardPage` sur cette route. (le composant est à créer dans le dossier `packages/frontend/src/pages/NewBoardPage/NewBoardPage.tsx`)
- créer un formulaire pour créer un nouveau board
- appeler l'API pour créer un nouveau board ([voir la documentation de l'API pour plus d'informations](http://localhost:3000/docs#tag/default/POST/api/v1/boards))
- rediriger l'utilisateur vers la page `/boards` en cas de succès

</details>

### Exercice 7

<details><summary>
Suppression d'un board
</summary>

Ajouter un bouton pour supprimer un board.

Pour cela, il vous est demandé :
- d'ajouter un bouton pour supprimer un board dans le composant `BoardsPage`
- au clic sur le bouton, appeler l'API pour supprimer le board ([voir la documentation de l'API pour plus d'informations](http://localhost:3000/docs#tag/default/DELETE/api/v1/boards/{id}))
- en cas de succès, mettre à jour la liste des boards après la suppression

</details>

### Exercice 8

<details><summary>
Création de compte
</summary>

Créer une page `/signup` qui permet de créer un nouveau compte.

Pour cela, il vous est demandé :
- configurer une route `/signup` dans `packages/frontend/src/Router.tsx`
- afficher le composant `CreateAccountPage` sur cette route. (le composant est à créer dans le dossier `packages/frontend/src/pages/CreateAccountPage/CreateAccountPage.tsx`)
- créer un formulaire pour créer un nouveau compte
- appeler l'API pour créer un nouveau compte ([voir la documentation de l'API pour plus d'informations](http://localhost:3000/docs#tag/default/POST/api/v1/auth/signup))
- rediriger l'utilisateur vers la page `/boards` en cas de succès

</details>

### Exercice 9

<details><summary>
Stocker les informations de l'utilisateur de manière globale
</summary>

Pour cela, il vous est demandé :
- installer un outil de gestion de l'état global au choix (Jotai, Zustand, Redux, Context API, etc.)
- configurer cet outil (store / provider)
- lors de la connexion ou de la création de compte, stocker les informations de l'utilisateur récupérer depuis l'API dans cet outil
- utiliser ces informations pour afficher le nom de l'utilisateur connecté dans le header
- masquer les boutons de connexion et de création de compte si l'utilisateur est connecté dans le header

</details>

### Exercice 10

<details><summary>
Déconnexion
</summary>

Ajouter un bouton pour se déconnecter.

Pour cela, il vous est demandé :
- d'ajouter un bouton pour se déconnecter dans le header si l'utilisateur est connecté
- au clic sur le bouton, supprimer les informations de l'utilisateur stockées dans l'état global
- rediriger l'utilisateur vers la page de connexion (`/`)

</details>

### Toujours plus

<details><summary>
Encore du temps ?
</summary>

- Ajouter des fonctionnalités à votre application
  - Page de modification d'un board
  - Page pour ajouter des membres à un board
  - Page pour voir les boards sur lesquels on est invité
    - Pouvoir accepter ou refuser l'invitation
  
  - Page de détail d'un board
    - Afficher les listes, les cartes et les labels
    - Drag & Drop des listes et des cartes
  - ...

Rappel: toutes les routes d'API sont documentées [ici](http://localhost:3000/docs)

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
# Créer un fichier d'environnement et le remplir (déjà fait pour vous en mode dev)
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
# Lancer le serveur Express pour l'API
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
- le code `Express` se trouve dans `packages/backend`

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

En cas de question, n'hésitez pas à les poser en créant des issues GitHub !

</details>

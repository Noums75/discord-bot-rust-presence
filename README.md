# Discord Bot - Rust Server Player Presence

Un bot Discord qui surveille la présence de joueurs sur un serveur Rust et affiche leur statut dans un embed qui se met à jour automatiquement.

## 📋 Fonctionnalités

- 🔍 Vérifie si des joueurs spécifiques (par Steam ID) sont connectés au serveur Rust
- 💬 Affiche les mentions Discord avec le statut (Connecté/Déconnecté) et des émojis
- 📊 Affiche les informations du serveur (nom, nombre de joueurs, map)
- 🔄 Mise à jour automatique toutes les 5 minutes
- 📱 Interface sous forme d'embed Discord élégant

## 🚀 Installation

### Prérequis

- Node.js (version 16.9.0 ou supérieure)
- Un bot Discord créé sur le [Discord Developer Portal](https://discord.com/developers/applications)
- Les permissions de bot nécessaires : Send Messages, Embed Links, Read Messages/View Channels

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Noums75/discord-bot-rust-presence.git
   cd discord-bot-rust-presence
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Copier le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```
   
   Éditer `.env` et remplir vos informations :
   ```env
   DISCORD_TOKEN=votre_token_de_bot
   CHANNEL_ID=id_du_channel_discord
   ```

4. **Configurer les joueurs à surveiller**
   
   Copier le fichier `config.example.json` vers `config.json` :
   ```bash
   cp config.example.json config.json
   ```
   
   Éditer `config.json` :
   ```json
   {
     "serverIP": "IP_de_votre_serveur_rust",
     "serverPort": 28015,
     "players": [
       {
         "steamID": "76561198000000000",
         "discordMention": "<@123456789012345678>"
       }
     ],
     "updateInterval": 300000
   }
   ```

### 📝 Comment obtenir les informations nécessaires

#### Token Discord
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application ou sélectionnez-en une existante
3. Allez dans l'onglet "Bot"
4. Cliquez sur "Reset Token" et copiez le token

#### Channel ID Discord
1. Activez le mode développeur dans Discord (Paramètres utilisateur > Avancé > Mode développeur)
2. Faites un clic droit sur le channel souhaité
3. Cliquez sur "Copier l'identifiant"

#### User ID Discord (pour les mentions)
1. Avec le mode développeur activé
2. Faites un clic droit sur l'utilisateur
3. Cliquez sur "Copier l'identifiant"
4. Utilisez le format `<@USER_ID>` dans la configuration

#### Steam ID
1. Allez sur [SteamID.io](https://steamid.io/)
2. Entrez le profil Steam du joueur
3. Utilisez le "steamID64"

#### IP et Port du serveur Rust
- L'IP est l'adresse de votre serveur Rust
- Le port par défaut pour les requêtes est **28015** (port de requête, pas le port de connexion)

## 🎮 Utilisation

### Démarrer le bot

```bash
npm start
```

Le bot va :
1. Se connecter à Discord
2. Créer un message embed dans le channel configuré
3. Mettre à jour ce message toutes les 5 minutes avec le statut actuel

### Sur Windows

Pour héberger le bot sur un serveur Windows, vous pouvez :

**Option 1 : Exécuter directement**
```cmd
node index.js
```

**Option 2 : Utiliser PM2 (recommandé pour la production)**
```cmd
npm install -g pm2
pm2 start index.js --name rust-presence-bot
pm2 save
pm2 startup
```

**Option 3 : Créer un service Windows**
Utilisez [node-windows](https://www.npmjs.com/package/node-windows) pour créer un service Windows natif.

## 🔧 Configuration

### config.json

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `serverIP` | Adresse IP du serveur Rust | `"192.168.1.100"` |
| `serverPort` | Port de requête du serveur (généralement 28015) | `28015` |
| `players` | Liste des joueurs à surveiller | Voir ci-dessous |
| `updateInterval` | Intervalle de mise à jour en millisecondes | `300000` (5 min) |

### Format des joueurs

```json
{
  "steamID": "76561198000000000",
  "discordMention": "<@123456789012345678>"
}
```

- `steamID` : Steam ID 64 du joueur
- `discordMention` : Mention Discord au format `<@USER_ID>`

## 🛠️ Dépannage

### Le bot ne se connecte pas
- Vérifiez que le token Discord est correct
- Assurez-vous que le bot a été ajouté au serveur Discord

### Le serveur Rust n'est pas détecté
- Vérifiez l'IP et le port (le port de requête est généralement différent du port de connexion)
- Assurez-vous que le port de requête est ouvert sur le firewall
- Le port par défaut pour les requêtes Rust est 28015

### Les joueurs ne sont pas détectés
- Vérifiez que les Steam IDs sont corrects (format Steam ID 64)
- Assurez-vous que les joueurs sont bien connectés au serveur

### Le message ne se met pas à jour
- Vérifiez les permissions du bot dans le channel
- Consultez les logs du bot pour voir les erreurs

## 📦 Dépendances

- [discord.js](https://discord.js.org/) v14 - Librairie Discord
- [gamedig](https://www.npmjs.com/package/gamedig) - Pour interroger les serveurs de jeu
- [dotenv](https://www.npmjs.com/package/dotenv) - Gestion des variables d'environnement

## 📄 Licence

ISC

## 👤 Auteur

Noums75

## 🤝 Contribution

Les contributions, issues et demandes de fonctionnalités sont les bienvenues !
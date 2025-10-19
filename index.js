const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Gamedig = require('gamedig');
const fs = require('fs');
require('dotenv').config();

// Load configuration
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Store the message ID to update
let statusMessageId = null;

/**
 * Query the Rust server for player information
 */
async function queryRustServer() {
    try {
        const state = await Gamedig.query({
            type: 'rust',
            host: config.serverIP,
            port: config.serverPort
        });
        
        return state;
    } catch (error) {
        console.error('Error querying Rust server:', error.message);
        return null;
    }
}

/**
 * Create an embed with player status
 */
async function createStatusEmbed() {
    const serverState = await queryRustServer();
    
    const embed = new EmbedBuilder()
        .setTitle('🎮 Statut des Joueurs Rust')
        .setColor(serverState ? 0x00FF00 : 0xFF0000)
        .setTimestamp()
        .setFooter({ text: 'Mise à jour automatique toutes les 5 minutes' });
    
    if (!serverState) {
        embed.setDescription('❌ Impossible de se connecter au serveur Rust');
        return embed;
    }
    
    // Add server info
    embed.addFields({
        name: '📊 Informations du Serveur',
        value: `**Nom:** ${serverState.name}\n**Joueurs:** ${serverState.players.length}/${serverState.maxplayers}\n**Map:** ${serverState.map || 'N/A'}`,
        inline: false
    });
    
    // Check each configured player
    let statusText = '';
    for (const player of config.players) {
        const isConnected = serverState.players.some(p => p.raw && p.raw.steamid === player.steamID);
        
        const emoji = isConnected ? '🟢' : '🔴';
        const status = isConnected ? 'Connecté' : 'Déconnecté';
        
        statusText += `${emoji} ${player.discordMention} - **${status}**\n`;
    }
    
    embed.addFields({
        name: '👥 Statut des Joueurs',
        value: statusText || 'Aucun joueur configuré',
        inline: false
    });
    
    return embed;
}

/**
 * Update the status message
 */
async function updateStatusMessage() {
    try {
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);
        if (!channel) {
            console.error('Channel not found');
            return;
        }
        
        const embed = await createStatusEmbed();
        
        if (statusMessageId) {
            // Update existing message
            try {
                const message = await channel.messages.fetch(statusMessageId);
                await message.edit({ embeds: [embed] });
                console.log(`[${new Date().toLocaleString()}] Status updated`);
            } catch (error) {
                console.error('Error updating message, creating new one:', error.message);
                statusMessageId = null;
            }
        }
        
        if (!statusMessageId) {
            // Create new message
            const message = await channel.send({ embeds: [embed] });
            statusMessageId = message.id;
            console.log(`[${new Date().toLocaleString()}] Status message created`);
        }
    } catch (error) {
        console.error('Error in updateStatusMessage:', error);
    }
}

// Bot ready event
client.once('ready', async () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`📡 Surveillance du serveur: ${config.serverIP}:${config.serverPort}`);
    console.log(`⏱️  Mise à jour toutes les ${config.updateInterval / 1000} secondes`);
    
    // Initial update
    await updateStatusMessage();
    
    // Set up periodic updates
    setInterval(updateStatusMessage, config.updateInterval);
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to login:', error);
    process.exit(1);
});

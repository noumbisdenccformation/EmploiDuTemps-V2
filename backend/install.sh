#!/bin/bash
# Script d'installation pour le backend

echo "Installation de Node.js et npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Installation des dépendances npm..."
npm install

echo "Installation terminée. Vous pouvez maintenant lancer:"
echo "npm run dev"
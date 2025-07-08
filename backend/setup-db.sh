#!/bin/bash
# Script de configuration PostgreSQL

echo "Configuration de PostgreSQL..."

# Démarrer le service PostgreSQL
sudo service postgresql start

# Créer la base de données et configurer l'utilisateur
sudo -u postgres psql << EOF
CREATE DATABASE emploi_temps_db;
ALTER USER postgres PASSWORD 'password';
\q
EOF

echo "Base de données 'emploi_temps_db' créée avec succès"
echo "Utilisateur postgres configuré avec le mot de passe 'password'"
-- V2__seed_core.sql
SET NAMES utf8mb4;
START TRANSACTION;

-- 1) Country: Belgium
INSERT INTO countries (code, name, created_at, updated_at)
VALUES ('BE','Belgique', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), name=VALUES(name);
SET @country_be_id := LAST_INSERT_ID();

-- 2) Cities (échantillon pour dev/démo rapide)
-- ARRONDISSEMENT DE BRUXELLES-CAPITALE (19 communes)
INSERT INTO cities (country_id, name, postal_code, created_at, updated_at) VALUES
                                                                               (@country_be_id,'Bruxelles',           '1000', NOW(), NOW()),
                                                                               (@country_be_id,'Anderlecht',          '1070', NOW(), NOW()),
                                                                               (@country_be_id,'Auderghem',           '1160', NOW(), NOW()),
                                                                               (@country_be_id,'Berchem-Sainte-Agathe','1082', NOW(), NOW()),
                                                                               (@country_be_id,'Etterbeek',           '1040', NOW(), NOW()),
                                                                               (@country_be_id,'Evere',               '1140', NOW(), NOW()),
                                                                               (@country_be_id,'Forest',              '1190', NOW(), NOW()),
                                                                               (@country_be_id,'Ganshoren',           '1083', NOW(), NOW()),
                                                                               (@country_be_id,'Ixelles',             '1050', NOW(), NOW()),
                                                                               (@country_be_id,'Jette',               '1090', NOW(), NOW()),
                                                                               (@country_be_id,'Koekelberg',          '1081', NOW(), NOW()),
                                                                               (@country_be_id,'Molenbeek-Saint-Jean','1080', NOW(), NOW()),
                                                                               (@country_be_id,'Saint-Gilles',        '1060', NOW(), NOW()),
                                                                               (@country_be_id,'Saint-Josse-ten-Noode','1210', NOW(), NOW()),
                                                                               (@country_be_id,'Schaerbeek',          '1030', NOW(), NOW()),
                                                                               (@country_be_id,'Uccle',               '1180', NOW(), NOW()),
                                                                               (@country_be_id,'Watermael-Boitsfort', '1170', NOW(), NOW()),
                                                                               (@country_be_id,'Woluwe-Saint-Lambert','1200', NOW(), NOW()),
                                                                               (@country_be_id,'Woluwe-Saint-Pierre', '1150', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), postal_code=VALUES(postal_code);

-- ARRONDISSEMENT DE CHARLEROI
INSERT INTO cities (country_id, name, postal_code, created_at, updated_at) VALUES
                                                                               (@country_be_id,'Aiseau-Presles',      '6250', NOW(), NOW()),
                                                                               (@country_be_id,'Chapelle-lez-Herlaimont','7160', NOW(), NOW()),
                                                                               (@country_be_id,'Charleroi',           '6000', NOW(), NOW()),
                                                                               (@country_be_id,'Châtelet',            '6200', NOW(), NOW()),
                                                                               (@country_be_id,'Courcelles',          '6180', NOW(), NOW()),
                                                                               (@country_be_id,'Farciennes',          '6240', NOW(), NOW()),
                                                                               (@country_be_id,'Fleurus',             '6220', NOW(), NOW()),
                                                                               (@country_be_id,'Fontaine-l\'Évêque',  '6140', NOW(), NOW()),
                                                                               (@country_be_id,'Gerpinnes',           '6280', NOW(), NOW()),
                                                                               (@country_be_id,'Les Bons Villers',    '6210', NOW(), NOW()),
                                                                               (@country_be_id,'Montigny-le-Tilleul', '6110', NOW(), NOW()),
                                                                               (@country_be_id,'Pont-à-Celles',       '6230', NOW(), NOW()),
                                                                               (@country_be_id, 'Marcinelle', '6001', NOW(), NOW()),
                                                                               (@country_be_id, 'Mont-sur-Marchienne', '6032', NOW(), NOW()),
                                                                               (@country_be_id, 'Couillet', '6010', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), postal_code=VALUES(postal_code);

-- ARRONDISSEMENT DE MONS
INSERT INTO cities (country_id, name, postal_code, created_at, updated_at) VALUES
                                                                               (@country_be_id,'Boussu',              '7300', NOW(), NOW()),
                                                                               (@country_be_id,'Colfontaine',         '7340', NOW(), NOW()),
                                                                               (@country_be_id,'Dour',                '7370', NOW(), NOW()),
                                                                               (@country_be_id,'Frameries',           '7080', NOW(), NOW()),
                                                                               (@country_be_id,'Hensies',             '7350', NOW(), NOW()),
                                                                               (@country_be_id,'Honnelles',           '7387', NOW(), NOW()),
                                                                               (@country_be_id,'Jurbise',             '7050', NOW(), NOW()),
                                                                               (@country_be_id,'Mons',                '7000', NOW(), NOW()),
                                                                               (@country_be_id,'Quaregnon',           '7390', NOW(), NOW()),
                                                                               (@country_be_id,'Quévy',               '7040', NOW(), NOW()),
                                                                               (@country_be_id,'Quiévrain',           '7380', NOW(), NOW()),
                                                                               (@country_be_id,'Saint-Ghislain',      '7330', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), postal_code=VALUES(postal_code);

-- ARRONDISSEMENT DE NAMUR
INSERT INTO cities (country_id, name, postal_code, created_at, updated_at) VALUES
                                                                               (@country_be_id,'Andenne',             '5300', NOW(), NOW()),
                                                                               (@country_be_id,'Assesse',             '5330', NOW(), NOW()),
                                                                               (@country_be_id,'Eghezée',             '5310', NOW(), NOW()),
                                                                               (@country_be_id,'Fernelmont',          '5380', NOW(), NOW()),
                                                                               (@country_be_id,'Floreffe',            '5150', NOW(), NOW()),
                                                                               (@country_be_id,'Fosses-la-Ville',     '5070', NOW(), NOW()),
                                                                               (@country_be_id,'Gembloux',            '5030', NOW(), NOW()),
                                                                               (@country_be_id,'Gesves',              '5340', NOW(), NOW()),
                                                                               (@country_be_id,'Jemeppe-sur-Sambre',  '5190', NOW(), NOW()),
                                                                               (@country_be_id,'La Bruyère',          '5080', NOW(), NOW()),
                                                                               (@country_be_id,'Mettet',              '5640', NOW(), NOW()),
                                                                               (@country_be_id,'Namur',               '5000', NOW(), NOW()),
                                                                               (@country_be_id,'Ohey',                '5350', NOW(), NOW()),
                                                                               (@country_be_id,'Profondeville',       '5170', NOW(), NOW()),
                                                                               (@country_be_id,'Sambreville',         '5060', NOW(), NOW()),
                                                                               (@country_be_id,'Sombreffe',           '5140', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), postal_code=VALUES(postal_code);

-- 3) Roles
INSERT INTO roles (name, description, created_at, updated_at)
VALUES
    ('ADMIN','Accès complet', NOW(), NOW()),
    ('OWNER','Propriétaire du bien', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), description=VALUES(description);

SET @role_admin_id := (SELECT id FROM roles WHERE name='ADMIN');
SET @role_owner_id := (SELECT id FROM roles WHERE name='OWNER');

-- 4) Permissions (noyau MVP)
INSERT INTO permissions (name, description, created_at, updated_at)
VALUES
    ('PROPERTY_READ','Voir les biens',NOW(),NOW()),
    ('PROPERTY_WRITE','Créer/éditer/supprimer un bien',NOW(),NOW()),
    ('TENANT_READ','Voir les locataires',NOW(),NOW()),
    ('TENANT_WRITE','Créer/éditer/supprimer un locataire',NOW(),NOW()),
    ('LEASE_READ','Voir les baux',NOW(),NOW()),
    ('LEASE_WRITE','Créer/éditer/supprimer un bail',NOW(),NOW()),
    ('COST_READ','Voir les dépenses/recettes',NOW(),NOW()),
    ('COST_WRITE','Créer/éditer/supprimer une dépense/recette',NOW(),NOW()),
    ('DOCUMENT_UPLOAD','Uploader des documents',NOW(),NOW()),
    ('ADMIN_PANEL','Accès aux fonctions administrateur',NOW(),NOW()),
    ('ADMIN_ALL_PERMISSIONS', 'Accès total à tous', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), description=VALUES(description);

-- Grant permissions to roles (idempotent)
-- ADMIN: toutes
INSERT IGNORE INTO role_permissions (role_id, permission_id, granted_at, created_at, updated_at)
SELECT @role_admin_id, p.id, NOW(), NOW(), NOW() FROM permissions p;

-- OWNER: sous-ensemble
INSERT IGNORE INTO role_permissions (role_id, permission_id, granted_at, created_at, updated_at)
SELECT @role_owner_id, p.id, NOW(), NOW(), NOW()
FROM permissions p
WHERE p.name IN ('PROPERTY_READ','PROPERTY_WRITE',
                 'TENANT_READ','TENANT_WRITE',
                 'LEASE_READ','LEASE_WRITE',
                 'COST_READ','COST_WRITE',
                 'DOCUMENT_UPLOAD');

-- 5) Users (admin + owner)
-- (ex: "admin123" et "owner123")
INSERT INTO users (email, password_hash, firstname, lastname, phone, address_id, user_type, status, created_at, updated_at)
VALUES ('admin@immoapp.local', '$2a$12$o5lePpOsNHAeEAbXYD9jE.a1QPo9L5jTpMxOS3xYukpFStA1vh5Ta', 'Admin', 'ImmoApp', NULL, NULL, 'ADMIN', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), firstname=VALUES(firstname), lastname=VALUES(lastname);
SET @admin_id := LAST_INSERT_ID();

INSERT INTO users (email, password_hash, firstname, lastname, phone, address_id, user_type, status, created_at, updated_at)
VALUES ('owner@immoapp.local', '$2a$12$0Tz1qh6QPh7ZGx1cxGN32OqnzgODH790wFpysGmZyZHDzlxzf/iRK', 'Jean', 'Owner', NULL, NULL, 'OWNER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), firstname=VALUES(firstname), lastname=VALUES(lastname);
SET @owner_id := LAST_INSERT_ID();

-- Liaison rôles
INSERT IGNORE INTO user_roles (user_id, role_id, assigned_at, created_at, updated_at) VALUES
                                                                                          (@admin_id, @role_admin_id, NOW(), NOW(), NOW()),
                                                                                          (@owner_id, @role_owner_id, NOW(), NOW(), NOW());

-- 6) Providers (principaux en Belgique)
-- ENERGY (électricité/gaz): Engie, Luminus, Eneco, Mega, Octa+, TotalEnergies, Ecopower, Watz, Bolt, Trevion
INSERT INTO providers (name, provider_type, website, created_at, updated_at) VALUES
                                                                                 ('ENGIE','ENERGY','https://www.engie.be',NOW(),NOW()),
                                                                                 ('Luminus','ENERGY','https://www.luminus.be',NOW(),NOW()),
                                                                                 ('Eneco','ENERGY','https://www.eneco.be',NOW(),NOW()),
                                                                                 ('Mega','ENERGY','https://www.mega.be',NOW(),NOW()),
                                                                                 ('OCTA+','ENERGY','https://www.octaplus.be',NOW(),NOW()),
                                                                                 ('TotalEnergies','ENERGY','https://www.totalenergies.be',NOW(),NOW()),
                                                                                 ('Ecopower','ENERGY','https://www.ecopower.be',NOW(),NOW()),
                                                                                 ('Watz','ENERGY','https://www.watz.be',NOW(),NOW()),
                                                                                 ('Bolt Energie','ENERGY','https://www.boltenergie.be',NOW(),NOW()),
                                                                                 ('Trevion','ENERGY','https://www.trevion.be',NOW(),NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), website=VALUES(website);

-- WATER (opérateurs régionaux)
INSERT INTO providers (name, provider_type, website, created_at, updated_at) VALUES
                                                                                 ('Vivaqua','WATER','https://www.vivaqua.be',NOW(),NOW()),
                                                                                 ('SWDE','WATER','https://www.swde.be',NOW(),NOW()),
                                                                                 ('De Watergroep','WATER','https://www.dewatergroep.be',NOW(),NOW()),
                                                                                 ('Farys','WATER','https://www.farys.be',NOW(),NOW()),
                                                                                 ('PIDPA','WATER','https://www.pidpa.be',NOW(),NOW()),
                                                                                 ('CILE','WATER','https://www.cile.be',NOW(),NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), website=VALUES(website);

-- INTERNET
INSERT INTO providers (name, provider_type, website, created_at, updated_at) VALUES
                                                                                 ('Proximus','INTERNET','https://www.proximus.be',NOW(),NOW()),
                                                                                 ('Telenet','INTERNET','https://www.telenet.be',NOW(),NOW()),
                                                                                 ('Orange Belgium','INTERNET','https://www.orange.be',NOW(),NOW()),
                                                                                 ('VOO','INTERNET','https://www.voo.be',NOW(),NOW()),
                                                                                 ('Scarlet','INTERNET','https://www.scarlet.be',NOW(),NOW()),
                                                                                 ('edpnet','INTERNET','https://www.edpnet.be',NOW(),NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), website=VALUES(website);

-- INSURANCE (exemples)
INSERT INTO providers (name, provider_type, website, created_at, updated_at) VALUES
                                                                                 ('Ethias','INSURANCE','https://www.ethias.be',NOW(),NOW()),
                                                                                 ('AG Insurance','INSURANCE','https://www.aginsurance.be',NOW(),NOW()),
                                                                                 ('AXA Belgium','INSURANCE','https://www.axa.be',NOW(),NOW()),
                                                                                 ('P&V','INSURANCE','https://www.pv.be',NOW(),NOW()),
                                                                                 ('Belfius','INSURANCE','https://www.belfius.be',NOW(),NOW())
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), website=VALUES(website);

COMMIT;

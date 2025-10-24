-- V4__denormalize_tenants_into_leases.sql

-- 1) Ajouter les colonnes de locataire (nullables pour permettre le backfill)
ALTER TABLE leases
    ADD COLUMN tenant_full_name VARCHAR(120) NULL AFTER tenant_id,
    ADD COLUMN tenant_email     VARCHAR(255) NULL AFTER tenant_full_name,
    ADD COLUMN tenant_phone     VARCHAR(30)  NULL AFTER tenant_email,
    ADD COLUMN tenant_notes     TEXT         NULL AFTER tenant_phone;

-- 2) Backfill depuis tenants -> leases
UPDATE leases l
    JOIN tenants t ON t.id = l.tenant_id
SET  l.tenant_full_name = t.full_name,
     l.tenant_email     = t.email,
     l.tenant_phone     = t.phone,
     l.tenant_notes     = t.notes;

-- 3) Rendre tenant_full_name obligatoire
ALTER TABLE leases
    MODIFY COLUMN tenant_full_name VARCHAR(120) NOT NULL;

-- 4) Supprimer la contrainte FK et l'index liés à tenant_id
ALTER TABLE leases DROP FOREIGN KEY `fk_leases_tenant`;
ALTER TABLE leases DROP INDEX idx_leases_tenant;

-- 5) Supprimer la colonne tenant_id (devenue inutile)
ALTER TABLE leases DROP COLUMN tenant_id;

-- 6) Supprimer aussi la colonne currency comme demandé
ALTER TABLE leases DROP COLUMN currency;

-- 7) Supprimer la table tenants
DROP TABLE tenants;
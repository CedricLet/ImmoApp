-- V1__init.sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) LOOKUPS
CREATE TABLE countries (
                           id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                           code          CHAR(2)        NOT NULL,
                           name          VARCHAR(100)   NOT NULL,
                           created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           UNIQUE KEY uk_countries_code (code),
                           UNIQUE KEY uk_countries_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cities (
                        id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                        country_id    BIGINT        NOT NULL,
                        name          VARCHAR(120)  NOT NULL,
                        postal_code   VARCHAR(16)   NOT NULL,
                        created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        CONSTRAINT uq_cities_country_name_postal UNIQUE (country_id, name, postal_code),
                        CONSTRAINT fk_cities_country FOREIGN KEY (country_id) REFERENCES countries(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE addresses (
                           id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                           line1         VARCHAR(150)  NOT NULL,
                           line2         VARCHAR(150)  NULL,
                           city_id       BIGINT        NOT NULL,
                           created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           KEY idx_addresses_city (city_id),
                           CONSTRAINT fk_addresses_city FOREIGN KEY (city_id) REFERENCES cities(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) CORE SECURITY
CREATE TABLE users (
                       id             BIGINT PRIMARY KEY AUTO_INCREMENT,
                       email          VARCHAR(255)  NOT NULL,
                       password_hash  VARCHAR(255)  NOT NULL,
                       firstname      VARCHAR(120)  NOT NULL,
                       lastname       VARCHAR(120) NOT NULL,
                       phone          VARCHAR(30)   NULL,
                       address_id     BIGINT        NULL,
                       user_type      ENUM('OWNER','AGENT','ADMIN', 'EMPLOYEE', 'SYNDIC', 'TENANT', 'INTERNSHIP') NOT NULL,
                       status         ENUM('ACTIVE','SUSPENDED')     NOT NULL,
                       last_login_at  TIMESTAMP     NULL,
                       created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_users_email (email),
                       KEY idx_users_address (address_id),
                       CONSTRAINT fk_users_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE roles (
                       id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                       name         VARCHAR(64)   NOT NULL,
                       description  VARCHAR(255)  NULL,
                       created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permissions (
                             id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                             name         VARCHAR(64)   NOT NULL,
                             description  VARCHAR(255)  NULL,
                             created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             UNIQUE KEY uk_permissions_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
                            user_id      BIGINT NOT NULL,
                            role_id      BIGINT NOT NULL,
                            assigned_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (user_id, role_id),
                            KEY idx_user_roles_role (role_id),
                            CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
                            CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_permissions (
                                  role_id      BIGINT NOT NULL,
                                  permission_id BIGINT NOT NULL,
                                  granted_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  PRIMARY KEY (role_id, permission_id),
                                  KEY idx_role_permissions_permission (permission_id),
                                  CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) PROVIDERS / OFFERS
CREATE TABLE providers (
                           id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                           name         VARCHAR(120)  NOT NULL,
                           provider_type         ENUM('ENERGY','WATER','INTERNET','INSURANCE','OTHER', 'ELECTRICITY', 'GAS', 'FUEL', 'PELLET', 'WOOD', 'COAL') NOT NULL,
                           website      VARCHAR(255)  NULL,
                           created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           UNIQUE KEY uq_providers_name_type (name, provider_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE energy_offers (
                               id                         BIGINT PRIMARY KEY AUTO_INCREMENT,
                               provider_id                BIGINT        NOT NULL,
                               plan_name                  VARCHAR(120)  NOT NULL,
                               utility_type               ENUM('ELECTRICITY','GAS','WATER','FUEL','PELLET','WOOD','COAL') NOT NULL,
                               fixed_fee_year             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                               variable_price_per_kwh     DECIMAL(10,4) NULL,
                               currency                   CHAR(3)       NOT NULL,
                               last_updated               DATE          NOT NULL,
                               created_at                 TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at                 TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               UNIQUE KEY uq_energy_offers_provider_plan_util (provider_id, plan_name, utility_type),
                               KEY idx_energy_offers_provider (provider_id),
                               CONSTRAINT fk_energy_offers_provider FOREIGN KEY (provider_id) REFERENCES providers(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) SYNDICS & PROPERTIES
CREATE TABLE syndics (
                         id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                         name         VARCHAR(120)  NOT NULL,
                         email        VARCHAR(255)  NULL,
                         phone        VARCHAR(30)   NULL,
                         address_id   BIGINT        NULL,
                         vat_no       VARCHAR(32)   NULL,
                         company_no   VARCHAR(32)   NULL,
                         created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         KEY idx_syndics_address (address_id),
                         CONSTRAINT fk_syndics_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE properties (
                            id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                            address_id   BIGINT        NOT NULL,
                            syndic_id    BIGINT        NULL,
                            label        VARCHAR(120)  NOT NULL,
                            unit_label   VARCHAR(50)   NULL,
                            property_type         ENUM('HOUSE','APARTMENT','STUDIO','PARKING','CELLAR','LAND','BUILDING_PART','OTHER') NOT NULL,
                            year_built   SMALLINT      NULL,
                            surface   DECIMAL(8,2)  NULL,
                            property_status       ENUM('OWNER_OCCUPIED','RENTED','FOR_RENT','FOR_SALE','WORKS','DISABLED') NOT NULL,
                            peb_score    VARCHAR(5)    NULL,
                            image_path   VARCHAR(500)  NULL,
                            notes        TEXT          NULL,
                            created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            UNIQUE KEY uq_properties_address_unit (address_id, unit_label),
                            KEY idx_properties_address (address_id),
                            KEY idx_properties_syndic (syndic_id),
                            CONSTRAINT fk_properties_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                            CONSTRAINT fk_properties_syndic FOREIGN KEY (syndic_id) REFERENCES syndics(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_properties (
                                 user_id      BIGINT  NOT NULL,
                                 property_id  BIGINT  NOT NULL,
                                 context_role ENUM('OWNER','AGENT_GESTIONNAIRE','TENANT','SYNDIC_READER') NOT NULL,
                                 active       BOOL    NOT NULL DEFAULT TRUE,
                                 assigned_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (user_id, property_id, context_role),
                                 KEY idx_user_properties_property (property_id),
                                 CONSTRAINT fk_user_properties_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                 CONSTRAINT fk_user_properties_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) TENANTS & LEASES
CREATE TABLE tenants (
                         id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                         full_name    VARCHAR(120) NOT NULL,
                         email        VARCHAR(255) NULL,
                         phone        VARCHAR(30)  NULL,
                         address_id   BIGINT       NULL,
                         birth_date   DATE         NULL,
                         notes        TEXT         NULL,
                         created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         KEY idx_tenants_address (address_id),
                         CONSTRAINT fk_tenants_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE leases (
                        id             BIGINT PRIMARY KEY AUTO_INCREMENT,
                        property_id    BIGINT   NOT NULL,
                        tenant_id      BIGINT   NOT NULL,
                        start_date     DATE     NOT NULL,
                        end_date       DATE     NULL,
                        payment_day    SMALLINT NOT NULL,
                        rent_amount    DECIMAL(10,2) NOT NULL,
                        currency       CHAR(3)  NOT NULL,
                        deposit_amount DECIMAL(10,2) NULL,
                        lease_status         ENUM('ACTIVE','ENDED','SUSPENDED') NOT NULL,
                        created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        KEY idx_leases_property (property_id),
                        KEY idx_leases_tenant (tenant_id),
                        CONSTRAINT fk_leases_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                        CONSTRAINT fk_leases_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE rent_invoices (
                               id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                               lease_id     BIGINT     NOT NULL,
                               period_month SMALLINT   NOT NULL,
                               period_year  SMALLINT   NOT NULL,
                               due_date     DATE       NOT NULL,
                               amount       DECIMAL(10,2) NOT NULL,
                               rent_invoice_status       ENUM('DUE','PARTIAL','PAID','OVERDUE') NOT NULL,
                               created_at   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               UNIQUE KEY uq_rent_invoices_lease_period (lease_id, period_year, period_month),
                               KEY idx_rent_invoices_lease (lease_id),
                               KEY idx_rent_invoices_status (rent_invoice_status),
                               CONSTRAINT fk_rent_invoices_lease FOREIGN KEY (lease_id) REFERENCES leases(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE rent_payments (
                               id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                               rent_invoice_id BIGINT       NOT NULL,
                               paid_at      DATE            NOT NULL,
                               amount       DECIMAL(10,2)   NOT NULL,
                               method       ENUM('BANK','CASH','OTHER') NOT NULL,
                               reference    VARCHAR(80)     NULL,
                               created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               KEY idx_rent_payments_invoice (rent_invoice_id),
                               KEY idx_rent_payments_paid_at (paid_at),
                               CONSTRAINT fk_rent_payments_invoice FOREIGN KEY (rent_invoice_id) REFERENCES rent_invoices(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE rent_checklist_items (
                                      id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                                      lease_id     BIGINT         NOT NULL,
                                      label        VARCHAR(120)   NOT NULL,
                                      done         BOOL           NOT NULL DEFAULT FALSE,
                                      due_date     DATE           NULL,
                                      completed_at TIMESTAMP      NULL,
                                      notes        TEXT           NULL,
                                      order_index  SMALLINT       NULL,
                                      created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      KEY idx_rent_checklist_lease (lease_id),
                                      CONSTRAINT fk_rent_checklist_lease FOREIGN KEY (lease_id) REFERENCES leases(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) COSTS
CREATE TABLE costs (
                       id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                       property_id  BIGINT         NOT NULL,
                       invoice_date DATE           NOT NULL,
                       label        VARCHAR(120)   NOT NULL,
                       cost_category     ENUM('ELECTRICITY','GAS','WATER','INTERNET','INSURANCE','TAX','MAINTENANCE','WORK','PHOTOVOLTAIC', 'FUEL', 'OTHER_EXPENSES', 'RENT', 'RENT_PARKING', 'RENT_STORAGE', 'SERVICE_CHARGE', 'UTILITY_REBILL_ELECTRICITY',
                                        'UTILITY_REBILL_GAS', 'UTILITY_REBILL_WATER', 'LATE_FEE', 'DEPOSIT_WITHHELD', 'INSURANCE_PAYOUT', 'ENERGY_FEED_IN', 'SUBSIDY', 'OTHER_EARNINGS', 'WASTE', 'INSURANCE_HOME', 'INSURANCE_LANDLORD', 'TAX_PROPERTY',
                                        'TAX_CITY', 'CONDO_FEES', 'REPAIRS', 'RENOVATION', 'GARDENING', 'CLEANING', 'ELEVATOR_SERVICE', 'BOILER_SERVICE', 'PEST_CONTROL', 'SECURITY', 'LEGAL_FEES', 'INTEREST', 'SUPPLIES') NOT NULL,
                       cost_type    ENUM('EXPENSES','EARNINGS') NOT NULL,
                       amount       DECIMAL(12,2)  NOT NULL,
                       currency     CHAR(3)        NOT NULL,
                       notes        TEXT           NULL,
                       created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       KEY idx_costs_property (property_id),
                       KEY idx_costs_invoice_date (invoice_date),
                       KEY idx_costs_category (cost_category),
                       KEY idx_costs_cost_type (cost_type),
                       CONSTRAINT fk_costs_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) SYNDIC REPORTS
CREATE TABLE syndic_reports (
                                id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                                property_id   BIGINT         NOT NULL,
                                syndic_id     BIGINT         NOT NULL,
                                period_start  DATE           NOT NULL,
                                period_end    DATE           NOT NULL,
                                title         VARCHAR(160)   NULL,
                                summary       TEXT           NULL,
                                created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                KEY idx_syndic_reports_property (property_id),
                                KEY idx_syndic_reports_syndic (syndic_id),
                                CONSTRAINT fk_syndic_reports_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                CONSTRAINT fk_syndic_reports_syndic FOREIGN KEY (syndic_id) REFERENCES syndics(id) ON UPDATE CASCADE ON DELETE RESTRICT
    -- Option d'unicité:
    -- , UNIQUE KEY uq_syndic_report_period (property_id, period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8) DOCUMENTS / TAGS / ARCHIVES
CREATE TABLE documents (
                           id             BIGINT PRIMARY KEY AUTO_INCREMENT,
                           file_name      VARCHAR(255)  NOT NULL,
                           mime_type      VARCHAR(100)  NOT NULL,
                           size_bytes     BIGINT        NOT NULL,
                           checksum       VARCHAR(64)   NULL,
                           storage_path   VARCHAR(500)  NOT NULL,
                           document_category       ENUM('CONTRACT','PEB','INVOICE','TAX','WORK','INSURANCE','PHOTO','OTHER') NOT NULL,
                           uploaded_by    BIGINT        NOT NULL,
                           uploaded_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           property_id    BIGINT        NULL,
                           lease_id       BIGINT        NULL,
                           syndic_report_id BIGINT      NULL,
                           cost_id        BIGINT        NULL,
                           user_id        BIGINT        NULL,
                           created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           KEY idx_documents_category (document_category),
                           KEY idx_documents_uploaded_by (uploaded_by),
                           KEY idx_documents_property (property_id),
                           KEY idx_documents_lease (lease_id),
                           KEY idx_documents_syndic_report (syndic_report_id),
                           KEY idx_documents_cost (cost_id),
                           CONSTRAINT fk_documents_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                           CONSTRAINT fk_documents_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE SET NULL,
                           CONSTRAINT fk_documents_lease FOREIGN KEY (lease_id) REFERENCES leases(id) ON UPDATE CASCADE ON DELETE SET NULL,
                           CONSTRAINT fk_documents_syndic_report FOREIGN KEY (syndic_report_id) REFERENCES syndic_reports(id) ON UPDATE CASCADE ON DELETE SET NULL,
                           CONSTRAINT fk_documents_cost FOREIGN KEY (cost_id) REFERENCES costs(id) ON UPDATE CASCADE ON DELETE SET NULL,
                           CONSTRAINT fk_documents_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
    -- Option anti-doublon: UNIQUE KEY uq_documents_checksum (checksum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE document_tags (
                               id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                               name         VARCHAR(50)   NOT NULL,
                               created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               UNIQUE KEY uk_document_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE document_has_tags (
                                   document_id  BIGINT NOT NULL,
                                   document_tag_id BIGINT NOT NULL,
                                   created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   PRIMARY KEY (document_id, document_tag_id),
                                   CONSTRAINT fk_doc_has_tags_document FOREIGN KEY (document_id) REFERENCES documents(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                   CONSTRAINT fk_doc_has_tags_tag FOREIGN KEY (document_tag_id) REFERENCES document_tags(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE archives (
                          id             BIGINT PRIMARY KEY AUTO_INCREMENT,
                          document_id    BIGINT       NOT NULL,
                          archived       BOOL         NOT NULL DEFAULT FALSE,
                          keep_after_sale BOOL        NOT NULL DEFAULT FALSE,
                          archived_at    TIMESTAMP    NULL,
                          created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          UNIQUE KEY uq_archives_document (document_id),
                          CONSTRAINT fk_archives_document FOREIGN KEY (document_id) REFERENCES documents(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE archive_users (
                               document_id  BIGINT NOT NULL,
                               user_id      BIGINT NOT NULL,
                               access_role  ENUM('OWNER','EDITOR','VIEWER') NOT NULL,
                               active       BOOL   NOT NULL DEFAULT TRUE,
                               created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               PRIMARY KEY (document_id, user_id),
                               CONSTRAINT fk_archive_users_document FOREIGN KEY (document_id) REFERENCES archives(id) ON UPDATE CASCADE ON DELETE CASCADE,
                               CONSTRAINT fk_archive_users_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9) NOTIFICATIONS
CREATE TABLE notifications (
                               id               BIGINT PRIMARY KEY AUTO_INCREMENT,
                               user_id          BIGINT        NOT NULL,
                               notification_type ENUM('DOC_EXPIRY','RENT_DUE','RENT_OVERDUE','SYSTEM') NOT NULL,
                               notification_title   VARCHAR(140) NULL,
                               message          TEXT        NULL,
                               is_read          BOOL        NOT NULL DEFAULT FALSE,
                               read_at          TIMESTAMP   NULL,
                               created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               KEY idx_notifications_user (user_id, is_read),
                               CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10) 2FA
CREATE TABLE sessions_2fa (
                              id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id      BIGINT       NOT NULL,
                              otp          VARCHAR(10)  NOT NULL,
                              expires_at   TIMESTAMP    NOT NULL,
                              consumed     BOOL         NOT NULL DEFAULT FALSE,
                              attempts     SMALLINT     NOT NULL DEFAULT 0,
                              created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              KEY idx_sessions_2fa_user (user_id),
                              KEY idx_sessions_2fa_expires (expires_at),
                              CONSTRAINT fk_sessions_2fa_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11) AUDIT LOGS
CREATE TABLE audit_logs (
                            id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
                            user_id            BIGINT        NOT NULL,
                            entity_type        VARCHAR(64) NOT NULL,
                            entity_id          BIGINT       NULL,
                            action   ENUM('CREATE','UPDATE','DELETE','READ','UPLOAD','LOGIN','LOGOUT','STATUS_CHANGE') NOT NULL,
                            details  TEXT          NULL,
                            ip       VARCHAR(64)   NULL,
                            audit_log_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            KEY idx_audit_logs_user (user_id),
                            KEY idx_audit_logs_entity (entity_type, entity_id),
                            KEY idx_audit_logs_action (action),
                            CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12) ENERGY
CREATE TABLE energy_contracts (
                                  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  property_id   BIGINT         NOT NULL,
                                  provider_id   BIGINT         NOT NULL,
                                  utility_type  ENUM('ELECTRICITY','GAS','WATER','FUEL','PELLET','WOOD','COAL') NOT NULL,
                                  contract_no   VARCHAR(80)    NOT NULL,
                                  plan_name     VARCHAR(120)   NULL,
                                  start_date    DATE           NOT NULL,
                                  end_date      DATE           NULL,
                                  auto_renew    BOOL           NOT NULL DEFAULT FALSE,
                                  currency      CHAR(3)        NOT NULL,
                                  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  UNIQUE KEY uq_energy_contracts_ref (property_id, utility_type, contract_no),
                                  KEY idx_energy_contracts_property (property_id),
                                  KEY idx_energy_contracts_provider (provider_id),
                                  CONSTRAINT fk_energy_contracts_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                  CONSTRAINT fk_energy_contracts_provider FOREIGN KEY (provider_id) REFERENCES providers(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE energy_consumptions (
                                     id            BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     property_id   BIGINT         NOT NULL,
                                     utility_type  ENUM('ELECTRICITY','GAS','WATER','FUEL','PELLET','WOOD','COAL') NOT NULL,
                                     period_start  DATE           NOT NULL,
                                     period_end    DATE           NOT NULL,
                                     index_start   DECIMAL(12,3)  NOT NULL,
                                     index_end     DECIMAL(12,3)  NOT NULL,
                                     unit          VARCHAR(10)    NOT NULL,
                                     unit_price    DECIMAL(10,4)  NULL,
                                     computed_cost DECIMAL(12,2)  NULL,
                                     created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     KEY idx_energy_cons_property (property_id),
                                     KEY idx_energy_cons_type_period (utility_type, period_start, period_end),
                                     CONSTRAINT fk_energy_consumptions_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13) USER PREFERENCES (1:1 via unique FK)
CREATE TABLE user_preferences (
                                  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  user_id      BIGINT       NOT NULL,
                                  locale       VARCHAR(10)  NOT NULL DEFAULT 'fr-BE',
                                  notif_email  BOOL         NOT NULL DEFAULT FALSE,
                                  notif_push   BOOL         NOT NULL DEFAULT FALSE,
                                  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  UNIQUE KEY uq_user_preferences_user (user_id),
                                  CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

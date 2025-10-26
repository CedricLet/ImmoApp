ALTER TABLE documents
    ADD COLUMN utility_type ENUM(
        'ELECTRICITY','GAS','WATER','FUEL_OIL','PELLETS', 'WOOD', 'COAL','SOLAR_PV'
        ) NULL AFTER document_category;

-- Index utile pour les filtres UI
CREATE INDEX idx_documents_utility_type ON documents (utility_type);

INSERT INTO document_tags (name, created_at, updated_at)
SELECT s.name, NOW(), NOW()
FROM (
         -- Workflow / état
         SELECT 'TO_REVIEW'      AS name UNION ALL
         SELECT 'TO_COMPLETE'            UNION ALL
         SELECT 'TO_PAY'                 UNION ALL
         SELECT 'PAID'                   UNION ALL
         SELECT 'IMPORTANT'              UNION ALL
         SELECT 'ARCHIVED'               UNION ALL
         SELECT 'URGENT'                 UNION ALL
         SELECT 'FOLLOW_UP'              UNION ALL
         SELECT 'MISSING_PAGES'          UNION ALL
         SELECT 'NEEDS_SIGNATURE'        UNION ALL
         SELECT 'SIGNED'                 UNION ALL
         SELECT 'TO_SEND'                UNION ALL
         SELECT 'SENT'                   UNION ALL
         SELECT 'RECEIVED'               UNION ALL
         SELECT 'DRAFT'                  UNION ALL
         SELECT 'FINAL'                  UNION ALL
         SELECT 'DUPLICATE'              UNION ALL
         SELECT 'OUTDATED'               UNION ALL

         -- Finance / compta
         SELECT 'EXPENSE'                UNION ALL
         SELECT 'RECURRING'              UNION ALL
         SELECT 'ONE_OFF'                UNION ALL
         SELECT 'REFUND'                 UNION ALL
         SELECT 'ADVANCE'                UNION ALL
         SELECT 'DEPOSIT'                UNION ALL
         SELECT 'GUARANTEE'              UNION ALL
         SELECT 'LATE_FEE'               UNION ALL
         SELECT 'TAX_DEDUCTIBLE'         UNION ALL
         SELECT 'NON_DEDUCTIBLE'         UNION ALL
         SELECT 'VAT_INCLUDED'           UNION ALL
         SELECT 'VAT_EXCLUDED'           UNION ALL
         SELECT 'VAT_6'                  UNION ALL
         SELECT 'VAT_12'                 UNION ALL
         SELECT 'VAT_21'                 UNION ALL

         -- Intervenants / rôles
         SELECT 'LANDLORD'               UNION ALL
         SELECT 'TENANT'                 UNION ALL
         SELECT 'SYNDIC'                 UNION ALL
         SELECT 'PROVIDER'               UNION ALL
         SELECT 'CONTRACTOR'             UNION ALL
         SELECT 'INSURER'                UNION ALL
         SELECT 'BROKER'                 UNION ALL

         -- Zones du bien / équipements
         SELECT 'KITCHEN'                UNION ALL
         SELECT 'BATHROOM'               UNION ALL
         SELECT 'ROOF'                   UNION ALL
         SELECT 'FACADE'                 UNION ALL
         SELECT 'GARDEN'                 UNION ALL
         SELECT 'GARAGE'                 UNION ALL
         SELECT 'BOILER_ROOM'            UNION ALL
         SELECT 'ELECTRICAL'             UNION ALL
         SELECT 'PLUMBING'               UNION ALL
         SELECT 'WINDOWS'                UNION ALL
         SELECT 'INSULATION'             UNION ALL

         -- Types de travaux
         SELECT 'MAINTENANCE'            UNION ALL
         SELECT 'REPAIR'                 UNION ALL
         SELECT 'RENOVATION'             UNION ALL
         SELECT 'INSTALLATION'           UNION ALL
         SELECT 'INSPECTION'             UNION ALL
         SELECT 'EMERGENCY'              UNION ALL

         -- Utilitaires (incl. énergies)
         SELECT 'ELECTRICITY'            UNION ALL
         SELECT 'GAS'                    UNION ALL
         SELECT 'WATER'                  UNION ALL
         SELECT 'DISTRICT_HEATING'       UNION ALL
         SELECT 'FUEL_OIL'               UNION ALL
         SELECT 'WOOD_PELLETS'           UNION ALL
         SELECT 'SOLAR_PV'               UNION ALL
         SELECT 'INTERNET'               UNION ALL
         SELECT 'TELECOM'                UNION ALL
         SELECT 'WASTE'                  UNION ALL
         SELECT 'SEWAGE'                 UNION ALL

         -- Conformité / contrôles périodiques
         SELECT 'SAFETY_CHECK'           UNION ALL
         SELECT 'GAS_CHECK'              UNION ALL
         SELECT 'ELECTRICAL_CHECK'       UNION ALL
         SELECT 'BOILER_SERVICE'         UNION ALL
         SELECT 'CHIMNEY_SWEEP'          UNION ALL
         SELECT 'PEB_CERTIFICATE'        UNION ALL

         -- Légal / contrats / bail
         SELECT 'LEASE'                  UNION ALL
         SELECT 'TERMINATION'            UNION ALL
         SELECT 'AMENDMENT'              UNION ALL
         SELECT 'ANNEX'                  UNION ALL
         SELECT 'INSPECTION_REPORT'      UNION ALL
         SELECT 'ENTRY_INVENTORY'        UNION ALL
         SELECT 'EXIT_INVENTORY'         UNION ALL
         SELECT 'GUARANTEE_BOND'         UNION ALL

         -- Type documentaire (doublon volontaire avec category pour faciliter la recherche)
         SELECT 'INVOICE'                UNION ALL
         SELECT 'CONTRACT'               UNION ALL
         SELECT 'RECEIPT'                UNION ALL
         SELECT 'QUOTE'                  UNION ALL
         SELECT 'QUOTE_APPROVED'         UNION ALL
         SELECT 'QUOTE_REJECTED'         UNION ALL
         SELECT 'WARRANTY'               UNION ALL
         SELECT 'CLAIM'                  UNION ALL
         SELECT 'INSURANCE_POLICY'       UNION ALL
         SELECT 'SYNDIC_REPORT'          UNION ALL
         SELECT 'TAX'
     ) AS s
         LEFT JOIN document_tags d ON d.name = s.name
WHERE d.name IS NULL;

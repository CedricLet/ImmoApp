DROP TABLE user_properties;

CREATE TABLE user_properties (
                  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
                                 user_id      BIGINT  NOT NULL,
                                 property_id  BIGINT  NOT NULL,
                                 context_role ENUM('OWNER','AGENT_GESTIONNAIRE','TENANT','SYNDIC_READER') NOT NULL,
                                 active       BOOL    NOT NULL DEFAULT TRUE,
                                 assigned_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  KEY idx_user_properties_user (user_id),
                                 KEY idx_user_properties_property (property_id),
                                 CONSTRAINT fk_user_properties_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                 CONSTRAINT fk_user_properties_property FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE menu (
    menu_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_menu_id BIGINT NULL REFERENCES menu (menu_id),
    menu_name      VARCHAR(100) NOT NULL,
    menu_path      VARCHAR(200) NULL,
    sort_order     INT NOT NULL,
    use_yn         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu (menu_name, menu_path, sort_order)
VALUES ('가계부', '/budget', 1);

INSERT INTO menu (menu_name, menu_path, sort_order)
VALUES ('투자', '/invest', 2);

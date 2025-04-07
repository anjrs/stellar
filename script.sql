-- Supposons que les données importées soient dans des tables spécifiques, par exemple :
-- llx_product, llx_societe, llx_facture, etc.

-- 1. Supprimer les produits importés récemment (exemple : ajoutés aujourd'hui)
DELETE FROM llx_product WHERE date_creation >= NOW() - INTERVAL 1 DAY;

-- 2. Supprimer les clients importés récemment
DELETE FROM llx_societe WHERE date_creation >= NOW() - INTERVAL 1 DAY;

-- 3. Supprimer les factures importées récemment
DELETE FROM llx_facture WHERE date_creation >= NOW() - INTERVAL 1 DAY;

-- 4. Supprimer d'autres données selon les modules utilisés
DELETE FROM llx_commande WHERE date_creation >= NOW() - INTERVAL 1 DAY;
DELETE FROM llx_propal WHERE date_creation >= NOW() - INTERVAL 1 DAY;
DELETE FROM llx_actioncomm WHERE date_creation >= NOW() - INTERVAL 1 DAY;


curl -X GET "http://localhost:7979/dolibarr/htdocs/api/index.php/categories" -H "DOLAPIKEY: 8a8MsnQGo371to4oVLWk552rIhNUFIt8" -H "Accept: application/json"

curl -X POST http://localhost:7979/dolibarr/htdocs/api/index.php/orders/2/lines -H "DOLAPIKEY: 8a8MsnQGo371to4oVLWk552rIhNUFIt8" -H "Content-Type: application/json" -d '{"fk_product": 1, "qty": 1, "subprice": 1000}'

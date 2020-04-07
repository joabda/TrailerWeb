SET search_path = netflixpoly;

-- On considère que new.shippingfee contient la distance calculée. On la modifie pour introduire le coût
CREATE OR REPLACE FUNCTION calculateFees() RETURNS TRIGGER AS $fees$ 
   BEGIN
      new.shippingFee = (new.shippingFee * 0.25);
	  return new;
   END;
$fees$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculateShippingFees ON OrderDVD;
CREATE TRIGGER calculateShippingFees
	BEFORE INSERT ON OrderDVD
	FOR EACH ROW 
	EXECUTE PROCEDURE calculateFees();


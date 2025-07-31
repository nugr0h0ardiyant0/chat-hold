-- Enable realtime for Order table
ALTER TABLE "Order" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
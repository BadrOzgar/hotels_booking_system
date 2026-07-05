-- AddForeignKey
ALTER TABLE "room_units" ADD CONSTRAINT "room_units_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

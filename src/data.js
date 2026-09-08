export const supplier = {
  id: 'sup_maluda', name: 'Maluda Car Rental', country: 'Tanzania', destination: 'Zanzibar',
  bookingMode: 'REQUEST_TO_BOOK', insuranceStatus: 'PENDING_SUPPLIER_CONFIRMATION',
  excessStatus: 'PENDING_SUPPLIER_CONFIRMATION'
};

export const vehicles = [
  ['veh_escudo','Suzuki Escudo',2500], ['veh_rav4','Toyota RAV4',3000],
  ['veh_juke','Nissan Juke',3000], ['veh_rav4_miss','Toyota RAV4 (Miss Tanzania edition)',3500],
  ['veh_harrier','Toyota Harrier',4000], ['veh_alphard','Toyota Alphard',4000],
  ['veh_prado','Toyota Prado',8000]
].map(([id,name,dailyRateCents]) => ({ id, name, dailyRateCents, currency: 'USD' }));

export const policies = {
  includedPickup: ['Stone Town','Zanzibar Airport','Zanzibar Seaport'],
  outsideStoneTownFeeCents: 1000, outsideStoneTownFeeType: 'ONE_WAY', depositRequired: false,
  cancellation: 'Free cancellation up to 48 hours before pickup.',
  supplierCancellationFeeNote: 'Supplier supplied information indicates a 3.5% payment-provider fee applies to cancellations. Pending review; not reinterpreted.'
};

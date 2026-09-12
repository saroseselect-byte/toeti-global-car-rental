export const supplier = {
  id: 'sup_maluda', slug: 'maluda-car-rental', name: 'Maluda Car Rental', country: 'Tanzania',
  publicName: 'Maluda Car Rental', publicStatus: 'APPROVED_FOR_LIVE_ACTIVATION',
  destination: 'Zanzibar', confirmationMethod: 'MANUAL', bookingMode: 'REQUEST_TO_BOOK'
};

export const vehicles = [
  ['veh_escudo','Suzuki Escudo',2500,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1785964842/maluda-car-rental/cars/n4lw7ex11f75etw3eh3a.webp'],
  ['veh_rav4','Toyota RAV4',3000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1785964008/maluda-car-rental/cars/t9mydoeslzap1kqbuodc.webp'],
  ['veh_juke','Nissan Juke',3000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1785964428/maluda-car-rental/cars/kbznoabd38gerhtc86cy.webp'],
  ['veh_rav4_miss','Toyota RAV4 (Miss Tanzania edition)',3500,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1787640453/maluda-car-rental/cars/vl2h8eeo9nj2v5draf5e.webp'],
  ['veh_harrier','Toyota Harrier',4000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1786017088/maluda-car-rental/cars/prmh5tflv0qpafqrzk4p.webp'],
  ['veh_alphard','Toyota Alphard',4000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1786015621/maluda-car-rental/cars/erggeocmkcjm5hettsuk.webp'],
  ['veh_prado','Toyota Prado',8000,null]
].map(([id,title,dailyRateCents,imageUrl]) => ({
  id, supplierId: supplier.id, type: 'CAR_RENTAL', title,
  imageUrl, imageSource: imageUrl ? 'Maluda supplied/official fleet image' : 'Safe placeholder pending verified Maluda vehicle photo',
  description: 'Maluda Zanzibar rental vehicle approved by the supplier for TOETI activation. Real availability is confirmed by Maluda before customer confirmation.',
  location: 'Zanzibar, Tanzania', currency: 'USD', dailyRateCents,
  status: 'SUPPLIER_APPROVED', isDemo: false, availabilityMethod: 'MANUAL',
  terms: {
    deposit: 'No deposit required.',
    insurance: 'Insurance cover depends on the vehicle. For vehicles with comprehensive insurance, the insurer covers the remaining assessed damage after the renter excess.',
    excess: 'TZS 350,000 excess/deductible for vehicles with comprehensive insurance; paid by the driver/renter for damage assessed by the transport authority.',
    thirdParty: 'For vehicles with third-party-only insurance, minor scratches/small damages are the customer’s responsibility.',
    pickup: 'Free pickup/drop-off in Stone Town, Zanzibar Airport and Zanzibar Seaport. Outside Stone Town: USD 10 one-way.',
    cancellation: 'Free cancellation up to 48 hours before pickup. Cancellations are subject to a 3.5% payment-provider fee.',
    driverRequirements: 'A Zanzibar local driving permit is required for self-drive. Maluda states that customers must provide a valid driving licence and passport. The permit costs USD 25. Permit processing/collection details are confirmed with Maluda during the request-to-book process before customer confirmation.',
    drivingPermit: 'Required for self-drive in Zanzibar. Valid driving licence + passport required. USD 25 permit fee per driver. TOETI discloses this separately from the vehicle daily rate so there is no hidden fee.',
    mileage: 'To be confirmed for the selected vehicle.',
    fuelPolicy: 'To be confirmed for the selected vehicle.'
  }
}));

export const experience = {
  id: 'exp_zanzibar_spice_demo', supplierId: 'sup_zanzibar_experience_demo', type: 'EXPERIENCE',
  title: 'Zanzibar cultural experience',
  description: 'A clearly labelled example used to demonstrate TOETI’s experience request flow.',
  location: 'Zanzibar, Tanzania', currency: 'USD', pricePerAdultCents: 4500, pricePerChildCents: 2500,
  status: 'DEMO_APPROVED', availabilityMethod: 'EMAIL',
  terms: { duration: '3 hours', meetingPoint: 'Confirmed after supplier approval', timeslots: ['09:00','14:00'],
    capacity: 8, bookingCutoff: '24 hours', inclusions: 'Example only — supplier confirmation required.',
    exclusions: 'Example only — supplier confirmation required.', cancellation: 'Example only — supplier confirmation required.' }
};

export const offers = [...vehicles, experience];
export const policies = {
  includedPickup: ['Stone Town','Zanzibar Airport','Zanzibar Seaport'],
  outsideStoneTownFeeCents: 1000,
  outsideStoneTownFeeType: 'ONE_WAY',
  depositRequired: false,
  cancellation: 'Free cancellation up to 48 hours before pickup; 3.5% payment-provider fee applies to cancellations.',
  drivingPermit: 'Zanzibar local driving permit required for self-drive; valid driving licence and passport required; USD 25 per driver.'
};

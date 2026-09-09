export const supplier = {
  id: 'sup_maluda', slug: 'maluda-car-rental', name: 'Maluda Car Rental', country: 'Tanzania',
  publicName: 'Demo Zanzibar car supplier', publicStatus: 'AWAITING_REAL_SUPPLIER_APPROVAL',
  destination: 'Zanzibar', confirmationMethod: 'MANUAL', bookingMode: 'REQUEST_TO_BOOK'
};

export const vehicles = [
  ['veh_escudo','Suzuki Escudo',2500,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1785964842/maluda-car-rental/cars/n4lw7ex11f75etw3eh3a.webp'],
  ['veh_rav4','Toyota RAV4',3000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1785964008/maluda-car-rental/cars/t9mydoeslzap1kqbuodc.webp'],
  ['veh_juke','Nissan Juke',3000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1785964428/maluda-car-rental/cars/kbznoabd38gerhtc86cy.webp'],
  ['veh_rav4_miss','Toyota RAV4 (Miss Tanzania edition)',3500,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1787640453/maluda-car-rental/cars/vl2h8eeo9nj2v5draf5e.webp'],
  ['veh_harrier','Toyota Harrier',4000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1786017088/maluda-car-rental/cars/prmh5tflv0qpafqrzk4p.webp'],
  ['veh_alphard','Toyota Alphard',4000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1786015621/maluda-car-rental/cars/erggeocmkcjm5hettsuk.webp'],
  ['veh_prado','Toyota Prado',8000,'https://res.cloudinary.com/cpp8vjzo/image/upload/v1786015986/maluda-car-rental/cars/yvbdca8pakpu5jpobhoj.webp']
].map(([id,title,dailyRateCents,imageUrl]) => ({
  id, supplierId: supplier.id, type: 'CAR_RENTAL', title,
  imageUrl, imageSource: 'Maluda official fleet website',
  description: 'Demo Zanzibar rental vehicle. Real availability is confirmed only after supplier activation.',
  location: 'Zanzibar, Tanzania', currency: 'USD', dailyRateCents,
  status: 'DEMO_APPROVED', isDemo: true, availabilityMethod: 'MANUAL',
  terms: {
    deposit: 'No deposit required.', insurance: 'Comprehensive insurance available.',
    excess: 'TZS 350,000 excess/deductible for comprehensive insurance.',
    thirdParty: 'With third-party-only cover, minor scratches or damage are charged to the customer.',
    pickup: 'Free at Zanzibar Airport, Zanzibar Seaport and in Stone Town. Outside Stone Town: USD 10 one-way.',
    cancellation: 'Free cancellation up to 48 hours before pickup.',
    driverRequirements: 'To be confirmed for the selected vehicle.', mileage: 'To be confirmed for the selected vehicle.',
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
export const policies = { includedPickup: ['Stone Town','Zanzibar Airport','Zanzibar Seaport'], outsideStoneTownFeeCents: 1000,
  outsideStoneTownFeeType: 'ONE_WAY', depositRequired: false, cancellation: 'Free cancellation up to 48 hours before pickup.' };

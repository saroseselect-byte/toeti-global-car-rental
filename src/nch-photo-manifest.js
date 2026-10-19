// Original supplier attachments recovered from TOETI Gmail, 2026-09-13.
// These are NOT published URLs. Never map to group A-F without supplier evidence.
export const NCH_ORIGINAL_PHOTOS = Object.freeze([
  {file:'Screenshot 2026-09-13 at 11.49.17 AM.png',subject:'blue Mazda hatchback',group:null,publicUrl:null},
  {file:'Screenshot 2026-09-13 at 11.49.37 AM.png',subject:'red Toyota compact vehicle',group:null,publicUrl:null},
  {file:'Screenshot 2026-09-13 at 11.49.57 AM.png',subject:'white minivan',group:null,publicUrl:null},
  {file:'Screenshot 2026-09-13 at 11.50.38 AM.png',subject:'white crossover SUV',group:null,publicUrl:null},
  {file:'Screenshot 2026-09-13 at 11.50.55 AM.png',subject:'white Nissan X-Trail side view',group:null,publicUrl:null},
  {file:'Screenshot 2026-09-13 at 11.51.12 AM.png',subject:'white Nissan X-Trail rear view',group:null,publicUrl:null}
]);
export function approvedNchPhotoForGroup(group) {
  const matching=NCH_ORIGINAL_PHOTOS.filter(photo=>photo.group===group&&photo.publicUrl);
  return matching.length===1?matching[0].publicUrl:null;
}

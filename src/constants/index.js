const LOCATION_TYPES = ['area', 'ward', 'zone', 'location', 'street_name'];
const BUILDING_TYPE = ['Apartment', 'Individual House', 'Hospital', 'Others'];
const HEALTH_STATUS = ['quarantined'];
const PERSON_STATUS = { CLOSED: 'closed', OPEN: 'open'};
const CALL_TYPE = { IN: 'incoming', OUT: 'outgoing'};
const PLACE_TYPE = ['Mall', 'Theater', 'Place of worship', 'Market', 'Others'];
const MODE_OF_TRAVEL = ['Car', 'Bike', 'Public Transport', 'Others'];
const ANSWERED_BY =['Self', 'Family', 'Friends', 'Others'];


module.exports = {
  ANSWERED_BY,
  BUILDING_TYPE,
  CALL_TYPE,
  HEALTH_STATUS,
  LOCATION_TYPES,
  MODE_OF_TRAVEL,
  PERSON_STATUS,
  PLACE_TYPE
};

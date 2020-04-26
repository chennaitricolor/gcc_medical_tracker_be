create sequence address_id_seq
   owned by ADDRESS.address_key 
   
   alter table ADDRESS
   alter column address_key set default nextval('address_id_seq');
  
  SELECT setval('address_id_seq', (SELECT MAX(address_key) FROM address)+1)
   
  commit
  
  create sequence person_id_seq
   owned by person_details.person_identifier 
   
   alter table person_details
   alter column person_identifier set default nextval('person_id_seq');
  
  SELECT setval('person_id_seq', (SELECT MAX(person_identifier) FROM person_details)+1)
   
  commit
  
  create sequence call_id_seq
   owned by call_transaction.call_id 
   
   alter table call_transaction
   alter column call_id set default nextval('call_id_seq');
  
  SELECT setval('call_id_seq', (SELECT MAX(call_id) FROM call_transaction)+1)
   
  commit
  
  
  SELECT MAX(address_key) FROM address
  SELECT person_identifier) FROM person_details
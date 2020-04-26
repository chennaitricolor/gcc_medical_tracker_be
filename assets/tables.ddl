-- public.medical_officer definition

-- Drop table

-- DROP TABLE public.medical_officer;

CREATE TABLE public.medical_officer (
	officer_id int8 NOT NULL,
	officer_name varchar(200) NULL,
	"date" bpchar(5) NULL,
	officer_role varchar(100) NULL,
	phone_numbers_alloted int4 NULL,
	phone_numbers_called int4 NULL,
	first_login_indicator bool NULL,
	"password" varchar(200) NULL,
	CONSTRAINT medical_officer_pkey PRIMARY KEY (officer_id)
);


-- public.zones definition

-- Drop table

-- DROP TABLE public.zones;

CREATE TABLE public.zones (
	location_id int8 NOT NULL,
	street_name varchar(200) NULL,
	"location" varchar(50) NULL,
	area varchar(50) NULL,
	ward int4 NULL,
	"zone" int4 NULL,
	latitude numeric(12,9) NULL,
	longitude numeric(12,9) NULL,
	CONSTRAINT zones_pkey PRIMARY KEY (location_id)
);


-- public.address definition

-- Drop table

-- DROP TABLE public.address;

CREATE TABLE public.address (
	address_key bigserial NOT NULL,
	building_type varchar(50) NULL,
	flat_building_no_and_floor bpchar(50) NULL,
	street_name varchar(200) NULL,
	address_line_2 varchar(200) NULL,
	area varchar(100) NULL,
	city_or_district varchar(50) NULL,
	state varchar(50) NULL,
	pin_code int8 NULL,
	location_id int8 NOT NULL,
	CONSTRAINT address_pkey PRIMARY KEY (address_key),
	CONSTRAINT addr_zone_fk FOREIGN KEY (location_id) REFERENCES zones(location_id)
);


-- public.hospitals definition

-- Drop table

-- DROP TABLE public.hospitals;

CREATE TABLE public.hospitals (
	hospital_id int8 NOT NULL,
	hospital_name varchar(100) NULL,
	phone_number int8 NULL,
	address_key int8 NULL,
	number_of_quarantine int4 NULL,
	total_number_of_beds_ int4 NULL,
	number_of_beds_available int4 NULL,
	number_of_ventilators int4 NULL,
	covid_testing_facility bpchar(1) NULL,
	covid_treatment bpchar(1) NULL,
	icu_facility bpchar(1) NULL,
	ambulance_facility bpchar(1) NULL,
	CONSTRAINT hospitals_pkey PRIMARY KEY (hospital_id),
	CONSTRAINT hosp_addr_fk FOREIGN KEY (address_key) REFERENCES address(address_key)
);


-- public.person_details definition

-- Drop table

-- DROP TABLE public.person_details;

CREATE TABLE public.person_details (
	person_identifier bigserial NOT NULL,
	"name" varchar(200) NULL,
	age int4 NULL,
	permanent_address_key int8 NULL,
	gender bpchar(1) NULL,
	passport_no varchar(15) NULL,
	phone_number varchar(10) NULL,
	secondary_phone_number varchar(20) NULL,
	phone_number_valid bpchar(1) NULL,
	travel_history_indicator bpchar(1) NULL,
	country_visited varchar(100) NULL,
	date_of_arrival date NULL,
	remarks varchar(500) NULL,
	number_of_family_members int4 NULL,
	diabetes_indicator bpchar(1) NULL,
	hypertension_indicator bpchar(1) NULL,
	other_illness varchar(500) NULL,
	person_status varchar(50) NULL,
	contractedby int8 NULL,
	createdby int8 NULL,
	updatedby int8 NULL,
	current_address_key int8 NULL,
	"createdAt" timestamp NULL,
	CONSTRAINT person_details_pkey PRIMARY KEY (person_identifier),
	CONSTRAINT pers_addr_fk FOREIGN KEY (permanent_address_key) REFERENCES address(address_key),
	CONSTRAINT person_details_fk FOREIGN KEY (createdby) REFERENCES medical_officer(officer_id),
	CONSTRAINT person_details_fk_1 FOREIGN KEY (updatedby) REFERENCES medical_officer(officer_id),
	CONSTRAINT person_details_fk_2 FOREIGN KEY (contractedby) REFERENCES person_details(person_identifier),
	CONSTRAINT person_details_fk_3 FOREIGN KEY (current_address_key) REFERENCES address(address_key)
);


-- public.person_travel_details definition

-- Drop table

-- DROP TABLE public.person_travel_details;

CREATE TABLE public.person_travel_details (
	place_of_visit varchar(200) NULL,
	place_type varchar(50) NULL,
	address_key int8 NULL,
	person_identifier int8 NOT NULL,
	date_and_time_of_travel timestamp NOT NULL,
	mode_of_travel varchar(50) NULL,
	CONSTRAINT person_travel_details_pk PRIMARY KEY (person_identifier, date_and_time_of_travel),
	CONSTRAINT pers_pers_fk FOREIGN KEY (person_identifier) REFERENCES person_details(person_identifier)
);


-- public.call_transaction definition

-- Drop table

-- DROP TABLE public.call_transaction;

CREATE TABLE public.call_transaction (
	call_id bigserial NOT NULL,
	call_date timestamp NOT NULL,
	person_id int8 NOT NULL,
	phone_number_dialed int8 NULL,
	doctor_or_medical_officer_id int8 NOT NULL,
	call_successful_indicator bpchar(1) NULL,
	wrong_number_indicator bpchar(1) NULL,
	call_not_responding_indicator bpchar(1) NULL,
	incorrect_phone_number bpchar(1) NULL,
	answered_by varchar(50) NULL,
	suspected_flag bpchar(1) NULL,
	inbound_or_outbound bpchar(10) NULL,
	CONSTRAINT call_transaction_pkey PRIMARY KEY (call_id, call_date),
	CONSTRAINT call_medi_fk FOREIGN KEY (doctor_or_medical_officer_id) REFERENCES medical_officer(officer_id),
	CONSTRAINT call_transaction_fk FOREIGN KEY (person_id) REFERENCES person_details(person_identifier)
);


-- public.person_call_transaction definition

-- Drop table

-- DROP TABLE public.person_call_transaction;

CREATE TABLE public.person_call_transaction (
	person_identifier int8 NOT NULL,
	call_id int8 NOT NULL,
	call_date timestamp NOT NULL,
	current_address_key int8 NOT NULL,
	person_status varchar(100) NULL,
	attender_name varchar(100) NULL,
	attender_phone_number int8 NULL,
	symptoms varchar(500) NULL,
	date_of_first_symptom date NULL,
	date_admitted_in_hospital date NULL,
	hospital_id int8 NULL,
	tested_positive date NULL,
	tested_negative date NULL,
	date_of_discharge date NULL,
	CONSTRAINT person_call_transaction_pk PRIMARY KEY (person_identifier, call_date),
	CONSTRAINT pers_addr_fk FOREIGN KEY (current_address_key) REFERENCES address(address_key),
	CONSTRAINT pers_call_fk FOREIGN KEY (call_id, call_date) REFERENCES call_transaction(call_id, call_date),
	CONSTRAINT pers_hosp_fk FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
	CONSTRAINT pers_pers_fk FOREIGN KEY (person_identifier) REFERENCES person_details(person_identifier)
);
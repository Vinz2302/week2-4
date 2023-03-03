-- Table: public.customer

-- DROP TABLE IF EXISTS public.customer;

CREATE TABLE IF NOT EXISTS public.customer
(
    id integer NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    nik bigint,
    phone_number bigint,
    CONSTRAINT customer_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customer
    OWNER to postgres;
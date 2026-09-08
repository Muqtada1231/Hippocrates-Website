-- REVIEW ONLY. Run ONLY after finance rows, all six website-ID mappings,
-- seven components and three 100% Sajad allocations have been verified.
-- Deploy the reviewed storefront and finance Edge Function before activation.
-- This SQL cannot verify Google Sheets; the approval gate is external.
begin;
do $$
begin
  if (select count(*) from public.courses
      where lecturer_key = 'sajad' and stage = 1 and stages = '{1}'::smallint[]
      and (key, price) in (('anatomy-upper',35000),('anatomy-lower',30000),('anatomy-thorax',25000))) <> 3
  or (select count(*) from public.packages where stage = 1 and purchasable
      and (key, price) in (('anatomy-ul-ll',60000),('anatomy-ll-thorax',50000),('anatomy-complete',80000))) <> 3
  or (select count(*) from public.package_courses where package_id in
      ('anatomy-ul-ll','anatomy-ll-thorax','anatomy-complete')) <> 7
  or (select count(*) from public.package_courses where allocation is null and (package_id, course_id) in
      (('anatomy-ul-ll','anatomy-upper'),('anatomy-ul-ll','anatomy-lower'),
       ('anatomy-ll-thorax','anatomy-lower'),('anatomy-ll-thorax','anatomy-thorax'),
       ('anatomy-complete','anatomy-upper'),('anatomy-complete','anatomy-lower'),('anatomy-complete','anatomy-thorax'))) <> 7
  then raise exception 'Anatomy catalog verification failed. Nothing activated.';
  end if;
end $$;
update public.courses set enabled = true
  where key in ('anatomy-upper','anatomy-lower','anatomy-thorax') and enabled = false;
update public.packages set enabled = true
  where key in ('anatomy-ul-ll','anatomy-ll-thorax','anatomy-complete') and enabled = false;
commit;

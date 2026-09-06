begin;

alter table public.orders
  drop constraint if exists orders_finance_sync_status_check;

alter table public.orders
  add constraint orders_finance_sync_status_check
  check (finance_sync_status in
    ('not_synced', 'syncing', 'synced', 'sync_error', 'sync_unknown'));

commit;

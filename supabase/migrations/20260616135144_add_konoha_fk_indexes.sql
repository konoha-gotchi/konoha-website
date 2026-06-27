create index plant_health_snapshots_source_reading_id_idx
  on public.plant_health_snapshots (source_reading_id);

create index care_advice_source_reading_id_idx
  on public.care_advice (source_reading_id);

create index ai_reports_source_reading_id_idx
  on public.ai_reports (source_reading_id);

create index activity_events_source_reading_id_idx
  on public.activity_events (source_reading_id);

create index sensor_readings_plant_device_idx
  on public.sensor_readings (plant_id, device_id);

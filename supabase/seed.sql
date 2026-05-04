insert into service_categories (name, slug, icon_name, sort_order) values
  ('Marketing & PR',              'marketing-pr',        'Megaphone',      1),
  ('Web & App Development',       'web-app-dev',         'Code2',          2),
  ('Design & Branding',           'design-branding',     'Palette',        3),
  ('Finance & Accounting',        'finance-accounting',  'Calculator',     4),
  ('Legal & Compliance',          'legal-compliance',    'Scale',          5),
  ('HR & Recruiting',             'hr-recruiting',       'Users',          6),
  ('IT & Cybersecurity',          'it-cybersecurity',    'Shield',         7),
  ('Sales & Business Development','sales-bizdev',        'TrendingUp',     8),
  ('Operations & Logistics',      'operations-logistics','Package',        9),
  ('Photography & Video',         'photo-video',         'Camera',         10),
  ('Consulting & Strategy',       'consulting-strategy', 'Lightbulb',      11),
  ('Translation & Copywriting',   'translation-copy',    'PenLine',        12),
  ('Training & Coaching',         'training-coaching',   'GraduationCap',  13)
on conflict (slug) do nothing;

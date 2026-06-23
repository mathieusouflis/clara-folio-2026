import * as migration_20260623_add_footer from './20260623_add_footer'
import * as migration_20260623_simplify_footer_sitemap from './20260623_simplify_footer_sitemap'
import * as migration_20260623_drop_footer_sitemap_links from './20260623_drop_footer_sitemap_links'
import * as migration_20260405_205118 from './20260405_205118'
import * as migration_20260622_add_slugs from './20260622_add_slugs'
import * as migration_20260405_220000 from './20260405_220000'
import * as migration_20260622_164150 from './20260622_164150'
import * as migration_20260622_172215 from './20260622_172215'
import * as migration_20260622_200000 from './20260622_200000'
import * as migration_20260622_210000 from './20260622_210000'
import * as migration_20260622_220000 from './20260622_220000'
import * as migration_20260623_localize_category_name from './20260623_localize_category_name'

export const migrations = [
  {
    up: migration_20260405_205118.up,
    down: migration_20260405_205118.down,
    name: '20260405_205118',
  },
  {
    up: migration_20260405_220000.up,
    down: migration_20260405_220000.down,
    name: '20260405_220000',
  },
  {
    up: migration_20260622_164150.up,
    down: migration_20260622_164150.down,
    name: '20260622_164150',
  },
  {
    up: migration_20260622_172215.up,
    down: migration_20260622_172215.down,
    name: '20260622_172215',
  },
  {
    up: migration_20260622_200000.up,
    down: migration_20260622_200000.down,
    name: '20260622_200000',
  },
  {
    up: migration_20260622_210000.up,
    down: migration_20260622_210000.down,
    name: '20260622_210000',
  },
  {
    up: migration_20260622_220000.up,
    down: migration_20260622_220000.down,
    name: '20260622_220000',
  },
  {
    up: migration_20260622_add_slugs.up,
    down: migration_20260622_add_slugs.down,
    name: '20260622_add_slugs',
  },
  {
    up: migration_20260623_add_footer.up,
    down: migration_20260623_add_footer.down,
    name: '20260623_add_footer',
  },
  {
    up: migration_20260623_simplify_footer_sitemap.up,
    down: migration_20260623_simplify_footer_sitemap.down,
    name: '20260623_simplify_footer_sitemap',
  },
  {
    up: migration_20260623_drop_footer_sitemap_links.up,
    down: migration_20260623_drop_footer_sitemap_links.down,
    name: '20260623_drop_footer_sitemap_links',
  },
  {
    up: migration_20260623_localize_category_name.up,
    down: migration_20260623_localize_category_name.down,
    name: '20260623_localize_category_name',
  },
]

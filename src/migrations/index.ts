import * as migration_20260405_205118 from './20260405_205118'
import * as migration_20260405_220000 from './20260405_220000'
import * as migration_20260622_164150 from './20260622_164150'
import * as migration_20260622_172215 from './20260622_172215'
import * as migration_20260622_200000 from './20260622_200000'

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
]

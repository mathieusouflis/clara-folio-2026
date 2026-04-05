import * as migration_20260405_205118 from './20260405_205118'
import * as migration_20260405_220000 from './20260405_220000'

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
]

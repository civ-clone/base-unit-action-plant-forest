import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import PlantingForest from './Rules/PlantingForest';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import MovementCost from '@civ-clone/core-unit/Rules/MovementCost';
import Forest from '@civ-clone/base-terrain-forest/Forest';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import registerDelayedAction from '@civ-clone/core-unit/registerDelayedAction';
import Feature from '@civ-clone/core-terrain-feature/Rules/Feature';
import Horse from '@civ-clone/base-terrain-feature-horse/Horse';

export const COMPLETE = 'base-unit-action-plant-forest:complete';

// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
export class PlantForest extends DelayedAction {
  private _terrainFeatureRegistry: TerrainFeatureRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
    turn: Turn = turnInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this._terrainFeatureRegistry = terrainFeatureRegistry;
  }

  perform(): void {
    const [moveCost]: number[] = this.ruleRegistry()
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost, COMPLETE, PlantingForest);

    this.ruleRegistry().process(Moved, this.unit(), this);
  }
}

// Registered here rather than passed to `perform` as a closure: a closure
// cannot be written to a file, which is why a unit part-way through this could
// not be saved. `this.from()` becomes `unit.tile()` — the same tile, since
// `isCurrentTile` is one of this action's criteria — and the registries come
// from their singletons rather than the action instance.
registerDelayedAction({
  BusyRule: PlantingForest,
  handler: COMPLETE,
  action: (unit: Unit) => new PlantForest(unit.tile(), unit.tile(), unit),
  complete: (unit: Unit) => {
    const terrain = new Forest(),
      features = terrainFeatureRegistryInstance.getByTerrain(
        unit.tile().terrain()
      );

    ruleRegistryInstance.process(Feature, Horse, terrain);

    terrainFeatureRegistryInstance.unregister(...features);

    unit.tile().setTerrain(terrain);
  },
});

export default PlantForest;

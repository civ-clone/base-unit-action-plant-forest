import {
  Feature,
  IFeatureRegistry,
} from '@civ-clone/core-terrain-feature/Rules/Feature';
import { Moved, IMovedRegistry } from '@civ-clone/core-unit/Rules/Moved';
import {
  MovementCost,
  IMovementCostRegistry,
} from '@civ-clone/core-unit/Rules/MovementCost';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import { Forest } from '@civ-clone/base-terrain-forest/Forest';
import { Horse } from '@civ-clone/base-terrain-feature-horse/Horse';
import { instance as terrainFeatureRegistryInstance } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';

// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
export class PlantForest extends DelayedAction {
  perform() {
    const [
      moveCost,
    ]: number[] = (this.ruleRegistry() as IMovementCostRegistry)
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost, (): void => {
      const terrain = new Forest(),
        features = terrainFeatureRegistryInstance.getByTerrain(
          this.from().terrain()
        );

      (this.ruleRegistry() as IFeatureRegistry).process(
        Feature,
        Horse,
        terrain
      );

      terrainFeatureRegistryInstance.unregister(...features);

      this.from().setTerrain(terrain);
    });

    (this.ruleRegistry() as IMovedRegistry).process(Moved, this.unit(), this);
  }
}

export default PlantForest;

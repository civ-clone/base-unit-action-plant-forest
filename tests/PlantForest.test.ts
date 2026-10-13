import Forest from '@civ-clone/base-terrain-forest/Forest';
import Game from '@civ-clone/base-terrain-feature-game/Game';
import Grassland from '@civ-clone/base-terrain-grassland/Grassland';
import Oil from '@civ-clone/base-terrain-feature-oil/Oil';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import PlantForest from '../PlantForest';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Shield from '@civ-clone/base-terrain-feature-shield/Shield';
import Swamp from '@civ-clone/base-terrain-swamp/Swamp';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';

describe('PlantForest', (): void => {
  // A special resource stays with the square (civ-clone/web-renderer#281); Grassland's Shield isn't one.
  (
    [
      [Swamp, Oil, Game],
      [Grassland, Shield, null],
      [Plains, null, null],
    ] as [
      typeof Terrain,
      typeof TerrainFeature | null,
      typeof TerrainFeature | null
    ][]
  ).forEach(([TerrainType, FeatureType, ExpectedFeature]): void => {
    it(`should turn ${TerrainType.name}${
      FeatureType ? ` with ${FeatureType.name}` : ''
    } into Forest with ${
      ExpectedFeature ? ExpectedFeature.name : 'no special'
    }`, (): void => {
      const ruleRegistry = new RuleRegistry(),
        terrainFeatureRegistry = new TerrainFeatureRegistry(),
        tile = new Tile(
          0,
          0,
          new TerrainType(),
          null as unknown as World,
          ruleRegistry
        );

      if (FeatureType !== null) {
        terrainFeatureRegistry.register(new FeatureType(tile.terrain()));
      }

      PlantForest.complete(
        new PlantForest(
          tile,
          tile,
          null as unknown as Unit,
          ruleRegistry,
          terrainFeatureRegistry
        )
      );

      expect(tile.terrain()).to.instanceof(Forest);
      expect(
        terrainFeatureRegistry
          .getByTerrain(tile.terrain())
          .map((feature: TerrainFeature) => feature.constructor)
      ).to.deep.equal(ExpectedFeature === null ? [] : [ExpectedFeature]);
    });
  });
});

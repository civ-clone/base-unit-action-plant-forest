"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantForest = void 0;
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Forest_1 = require("@civ-clone/base-terrain-forest/Forest");
const Horse_1 = require("@civ-clone/base-terrain-feature-horse/Horse");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
class PlantForest extends DelayedAction_1.default {
    perform() {
        const [moveCost,] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            const terrain = new Forest_1.Forest(), features = TerrainFeatureRegistry_1.instance.getByTerrain(this.from().terrain());
            this.ruleRegistry().process(Feature_1.Feature, Horse_1.Horse, terrain);
            TerrainFeatureRegistry_1.instance.unregister(...features);
            this.from().setTerrain(terrain);
        });
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.PlantForest = PlantForest;
exports.default = PlantForest;
//# sourceMappingURL=PlantForest.js.map
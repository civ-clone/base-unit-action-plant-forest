"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantForest = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const Forest_1 = require("@civ-clone/base-terrain-forest/Forest");
const Horse_1 = require("@civ-clone/base-terrain-feature-horse/Horse");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const PlantingForest_1 = require("./Rules/PlantingForest");
// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
class PlantForest extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, turn = Turn_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        this._terrainFeatureRegistry = terrainFeatureRegistry;
    }
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, () => {
            const terrain = new Forest_1.default(), features = this._terrainFeatureRegistry.getByTerrain(this.from().terrain());
            this.ruleRegistry().process(Feature_1.default, Horse_1.default, terrain);
            this._terrainFeatureRegistry.unregister(...features);
            this.from().setTerrain(terrain);
        }, PlantingForest_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.PlantForest = PlantForest;
exports.default = PlantForest;
//# sourceMappingURL=PlantForest.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantForest = exports.COMPLETE = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const PlantingForest_1 = require("./Rules/PlantingForest");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const Forest_1 = require("@civ-clone/base-terrain-forest/Forest");
const registerDelayedAction_1 = require("@civ-clone/core-unit/registerDelayedAction");
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const Horse_1 = require("@civ-clone/base-terrain-feature-horse/Horse");
exports.COMPLETE = 'base-unit-action-plant-forest:complete';
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
        super.perform(moveCost, exports.COMPLETE, PlantingForest_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.PlantForest = PlantForest;
// Registered here rather than passed to `perform` as a closure: a closure
// cannot be written to a file, which is why a unit part-way through this could
// not be saved. `this.from()` becomes `unit.tile()` — the same tile, since
// `isCurrentTile` is one of this action's criteria — and the registries come
// from their singletons rather than the action instance.
(0, registerDelayedAction_1.default)({
    BusyRule: PlantingForest_1.default,
    handler: exports.COMPLETE,
    action: (unit) => new PlantForest(unit.tile(), unit.tile(), unit),
    complete: (unit) => {
        const terrain = new Forest_1.default(), features = TerrainFeatureRegistry_1.instance.getByTerrain(unit.tile().terrain());
        RuleRegistry_1.instance.process(Feature_1.default, Horse_1.default, terrain);
        TerrainFeatureRegistry_1.instance.unregister(...features);
        unit.tile().setTerrain(terrain);
    },
});
exports.default = PlantForest;
//# sourceMappingURL=PlantForest.js.map
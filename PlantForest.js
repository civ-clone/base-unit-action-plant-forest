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
exports.COMPLETE = 'base-unit-action-plant-forest:complete';
// TODO: This is specific to the original Civilization and might need to be labelled as `-civ1` as other games have
//  forests as a feature
class PlantForest extends DelayedAction_1.default {
    /**
     * `terrainFeatureRegistry` is no longer used: the rule set's `TerrainChanged`
     * rules move the square's features. It stays so the signature doesn't change.
     */
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, turn = Turn_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
    }
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost, exports.COMPLETE, PlantingForest_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
    /**
     * What finishing does: the square takes `result`, and its tile's rules
     * (`TerrainChanged`) decide what follows it onto the new terrain.
     *
     * This was the closure passed to `perform`, bound to `this`. Converting it
     * to a `PendingEffect` handler first moved it to module scope, where `this`
     * is gone, and the registries became `…Instance` singletons — invisible in
     * the game, which uses the singletons, and wrong everywhere else. A method
     * keeps the original body — `this` read as `action` — and
     * `registerDelayedAction` hands the handler the action that was performed,
     * so this runs on that one.
     *
     * Static, because an instance method would not compile: a new public member
     * makes this class unassignable to `Action` (`DataObject._keys:
     * (keyof this)[]`), and it is passed as one to `MovementCost` and `Moved`.
     * A static method does not change `keyof this`.
     */
    static complete(action) {
        // What follows the square onto its new terrain (its features, for one) is the rule set's `TerrainChanged` rules'
        //  to decide.
        action.from().setTerrain(new PlantForest.result());
    }
}
exports.PlantForest = PlantForest;
// The terrain finishing leaves behind, used by `complete` and read by the UI to show what the action will do. Static
//  because a public instance member would make the class unassignable to `Action` (see `complete`).
PlantForest.result = Forest_1.default;
// Registered here rather than passed to `perform` as a closure: a closure
// cannot be written to a file, which is why a unit part-way through this could
// not be saved. The behaviour itself stays on the action, in `complete()`.
(0, registerDelayedAction_1.default)({
    BusyRule: PlantingForest_1.default,
    handler: exports.COMPLETE,
    action: (unit) => new PlantForest(unit.tile(), unit.tile(), unit),
    complete: (unit, pendingEffect, action) => PlantForest.complete(action),
});
exports.default = PlantForest;
//# sourceMappingURL=PlantForest.js.map